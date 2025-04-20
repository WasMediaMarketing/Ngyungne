import { createMeditationController } from "@/lib/factories/meditationFactory";
import { validateMeditationInput } from "@/lib/middlewares/validateMeditation";
import { isAuthenticated } from "@/lib/middlewares";
import { handleMultipartRequest } from "@/lib/utils/multipartHandler";
import { NextRequest, NextResponse } from "next/server";

/**
 * @openapi
 * /api/meditation:
 *   post:
 *     summary: Create a new meditation
 *     description: This endpoint creates a new meditation with title, description, duration, and other required information.
 *     operationId: createMeditation
 *     tags:
 *       - Meditation
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               image:
 *                 type: string
 *                 format: binary
 *                 description: Image for the meditation
 *               audioFile:
 *                 type: string
 *                 format: binary
 *                 description: Audio file for the meditation
 *               instructorImage:
 *                 type: string
 *                 format: binary
 *                 description: Image for the instructor
 *               title:
 *                 type: string
 *                 description: Title of the meditation
 *               description:
 *                 type: string
 *                 description: Short description of the meditation
 *               longDescription:
 *                 type: string
 *                 description: Detailed description of the meditation
 *               duration:
 *                 type: integer
 *                 description: Duration of the meditation in minutes
 *               category:
 *                 type: string
 *                 description: Category of the meditation
 *               difficulty:
 *                 type: string
 *                 enum: [Beginner, Intermediate, Advanced]
 *                 description: Difficulty level of the meditation
 *               instructor:
 *                 type: object
 *                 description: Instructor details
 *                 properties:
 *                   name:
 *                     type: string
 *                     description: Instructor's name
 *                   bio:
 *                     type: string
 *                     description: Instructor's bio
 *                   image:
 *                     type: string
 *                     description: Instructor's image URL
 *               steps:
 *                 type: array
 *                 items:
 *                   type: string
 *                 description: Steps for the meditation
 *               benefits:
 *                 type: array
 *                 items:
 *                   type: string
 *                 description: Benefits of the meditation
 *               tags:
 *                 type: array
 *                 items:
 *                   type: string
 *                 description: Tags related to the meditation
 *               isVisible:
 *                 type: boolean
 *                 description: Whether the meditation is visible or not
 *     responses:
 *       200:
 *         description: Meditation created successfully
 *       400:
 *         description: Invalid input or validation error
 *       401:
 *         description: Unauthorized or invalid token
 *       500:
 *         description: Internal server error
 */
export async function POST(req: NextRequest) {
  const authResult = await isAuthenticated(req);
  if (authResult) return authResult;

  const uploadFields = [
    { fileField: "image", bodyField: "image" },
    { fileField: "audioFile", bodyField: "audioFile" },
    { fileField: "instructorImage", bodyField: "instructor.image" },
  ];
  const jsonFields = [
    "steps",
    "benefits",
    "tags",
    "instructor",
    "relatedMeditations",
  ];
  const numericFields = ["duration", "views", "favorites", "sessions"];
  const booleanFields = ["isVisible"];

  const processedRequest = await handleMultipartRequest(
    req,
    uploadFields,
    jsonFields,
    numericFields,
    booleanFields
  );

  if (processedRequest instanceof NextResponse) return processedRequest;

  const validationResponse = await validateMeditationInput(processedRequest);

  if (validationResponse) return validationResponse;

  const meditationController = createMeditationController();
  return meditationController.createMeditation(processedRequest);
}

/**
 * @openapi
 * /api/meditation:
 *   get:
 *     summary: Retrieve all meditations or published meditations
 *     description: Fetches all meditations for authenticated users, or only published meditations for unauthenticated users.
 *     operationId: getMeditations
 *     tags:
 *       - Meditation
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: List of meditations
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal server error
 */
export async function GET(req: NextRequest) {
  const authResult = await isAuthenticated(req);
  const meditationController = createMeditationController();

  if (authResult) {
    return meditationController.getPublishedMeditations(); // Only published for unauthenticated
  }

  return meditationController.getMeditations(); // Get all for authenticated users
}

/**
 * @openapi
 * /api/meditation:
 *   delete:
 *     summary: Delete multiple meditations
 *     description: This endpoint deletes multiple meditations by their IDs, which are passed in the query parameters.
 *     operationId: deleteMeditations
 *     tags:
 *       - Meditation
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: query
 *         name: meditationIds
 *         required: true
 *         description: Comma-separated list of meditation IDs to be deleted.
 *         schema:
 *           type: string
 *           example: "1,2,3"
 *     responses:
 *       200:
 *         description: Meditations deleted successfully
 *       401:
 *         description: Unauthorized
 *       400:
 *         description: Invalid input or missing meditationIds
 *       500:
 *         description: Internal server error
 */
export async function DELETE(req: NextRequest) {
  const authResult = await isAuthenticated(req);
  if (authResult) return authResult;

  const meditationController = createMeditationController();
  return meditationController.deleteMeditations(req);
}

export const config = {
  api: {
    bodyParser: {
      sizeLimit: "25mb", // or whatever limit you want
    },
  },
};
