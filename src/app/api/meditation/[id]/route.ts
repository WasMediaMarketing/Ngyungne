import { type NextRequest, NextResponse } from "next/server";
import { createMeditationController } from "@/lib/factories/meditationFactory";
import { isAuthenticated, validateMeditationUpdate } from "@/lib/middlewares";
import { handleMultipartRequest } from "@/lib/utils/multipartHandler";

/**
 * @openapi
 * /api/meditation/{meditationId}:
 *   get:
 *     summary: Get meditation by ID
 *     tags:
 *       - Meditation
 *     parameters:
 *       - in: path
 *         name: meditationId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Meditation retrieved successfully
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Meditation not found
 *       500:
 *         description: Internal server error
 */
export async function GET(req: NextRequest) {
  const meditationController = createMeditationController();
  return meditationController.getMeditationById(req);
}

/**
 * @openapi
 * /api/meditation/{meditationId}:
 *   patch:
 *     summary: Update meditation by ID (supports file uploads)
 *     tags:
 *       - Meditation
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *               longDescription:
 *                 type: string
 *               duration:
 *                 type: integer
 *               category:
 *                 type: string
 *               difficulty:
 *                 type: string
 *                 enum: [Beginner, Intermediate, Advanced]
 *               instructor:
 *                 type: object
 *               image:
 *                 type: string
 *                 format: binary
 *               audioFile:
 *                 type: string
 *                 format: binary
 *               instructorImage:
 *                 type: string
 *                 format: binary
 *               steps:
 *                 type: array
 *                 items:
 *                   type: string
 *               benefits:
 *                 type: array
 *                 items:
 *                   type: string
 *               tags:
 *                 type: array
 *                 items:
 *                   type: string
 *               views:
 *                 type: integer
 *               favorites:
 *                 type: integer
 *               sessions:
 *                 type: integer
 *               isVisible:
 *                 type: boolean
 *     responses:
 *       200:
 *         description: Meditation updated
 *       400:
 *         description: Invalid input
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Not found
 *       500:
 *         description: Server error
 */
export async function PATCH(req: NextRequest) {
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

  const validationResponse = await validateMeditationUpdate(processedRequest);
  if (validationResponse) return validationResponse;

  const meditationController = createMeditationController();
  return meditationController.updateMeditation(processedRequest);
}

/**
 * @openapi
 * /api/meditation/{meditationId}:
 *   put:
 *     summary: Update meditation by ID (JSON only, e.g. `isVisible`)
 *     tags:
 *       - Meditation
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *               longDescription:
 *                 type: string
 *               duration:
 *                 type: integer
 *               category:
 *                 type: string
 *               difficulty:
 *                 type: string
 *                 enum: [Beginner, Intermediate, Advanced]
 *               instructor:
 *                 type: object
 *               image:
 *                 type: string
 *               audioFile:
 *                 type: string
 *               steps:
 *                 type: array
 *                 items:
 *                   type: string
 *               benefits:
 *                 type: array
 *                 items:
 *                   type: string
 *               tags:
 *                 type: array
 *                 items:
 *                   type: string
 *               views:
 *                 type: integer
 *               favorites:
 *                 type: integer
 *               sessions:
 *                 type: integer
 *               isVisible:
 *                 type: boolean
 *     responses:
 *       200:
 *         description: Meditation updated successfully
 *       400:
 *         description: Invalid input
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Server error
 */
export async function PUT(req: NextRequest) {
  const authResult = await isAuthenticated(req);
  if (authResult) return authResult;

  const validationResponse = await validateMeditationUpdate(req);
  if (validationResponse) return validationResponse;

  const meditationController = createMeditationController();
  return meditationController.updateMeditation(req);
}

/**
 * @openapi
 * /api/meditation/{meditationId}:
 *   delete:
 *     summary: Delete a meditation by ID
 *     tags:
 *       - Meditation
 *     parameters:
 *       - in: path
 *         name: meditationId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Meditation deleted successfully
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Meditation not found
 *       500:
 *         description: Server error
 */
export async function DELETE(req: NextRequest) {
  const authResult = await isAuthenticated(req);
  if (authResult) return authResult;

  const meditationController = createMeditationController();
  return meditationController.deleteMeditation(req);
}

export const config = {
  api: {
    bodyParser: {
      sizeLimit: "25mb", // or whatever limit you want
    },
  },
};
