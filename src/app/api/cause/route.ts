import { createCauseController } from "@/lib/factories/causeFactory";
import { validateCauseInput, isAuthenticated } from "@/lib/middlewares";
import { handleMultipartRequest } from "@/lib/utils/multipartHandler";
import { NextRequest, NextResponse } from "next/server";

/**
 * @openapi
 * /api/cause:
 *   post:
 *     summary: Create a new cause
 *     description: This endpoint creates a new cause with images, updates, goals, and other required information.
 *     operationId: createCause
 *     tags:
 *       - Cause
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
 *                 description: Main image for the cause
 *               title:
 *                 type: string
 *                 description: Title of the cause
 *               subtitle:
 *                 type: string
 *                 description: Subtitle of the cause
 *               goal:
 *                 type: integer
 *                 description: Goal amount for the cause
 *               startDate:
 *                 type: string
 *                 format: date-time
 *                 description: Start date of the cause
 *               endDate:
 *                 type: string
 *                 format: date-time
 *                 description: End date of the cause
 *               location:
 *                 type: string
 *                 description: Location of the cause
 *               impact:
 *                 type: string
 *                 description: Expected impact of the cause
 *               isVisible:
 *                 type: boolean
 *                 description: Whether the cause is visible
 *               gallery:
 *                 type: array
 *                 items:
 *                   type: string
 *                 description: Array of image URLs for the cause gallery
 *               updates:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     date:
 *                       type: string
 *                       format: date-time
 *                       description: Update date
 *                     title:
 *                       type: string
 *                       description: Title of the update
 *                     content:
 *                       type: string
 *                       description: Content of the update
 *                     image:
 *                       type: string
 *                       format: binary
 *                       description: Image for the update (optional)
 *               faq:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     question:
 *                       type: string
 *                       description: The question for FAQ
 *                     answer:
 *                       type: string
 *                       description: The answer for FAQ
 *     responses:
 *       200:
 *         description: Cause created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *       400:
 *         description: Invalid input or validation error
 *       401:
 *         description: Unauthorized or invalid token
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 */
export async function POST(req: NextRequest) {
  const authResult = await isAuthenticated(req);
  if (authResult) return authResult;

  const uploadFields = [
    { fileField: "image", bodyField: "image" },
    { fileField: "gallery", bodyField: "gallery", maxCount: 10 },
  ];
  const jsonFields = ["tags", "faq", "gallery", "about"];
  const numericFields = ["goal", "raised", "volunteers", "totalDonors"];
  const booleanFields = ["isVisible"];
  const processedRequest = await handleMultipartRequest(
    req,
    uploadFields,
    jsonFields,
    numericFields,
    booleanFields
  );

  if (processedRequest instanceof NextResponse) return processedRequest;

  const validationResponse = await validateCauseInput(processedRequest);
  if (validationResponse) return validationResponse;

  const causeController = createCauseController();
  return causeController.createCause(processedRequest);
}

/**
 * @openapi
 * /api/cause:
 *   get:
 *     summary: Retrieve all causes or published causes
 *     description: Fetches all causes for authenticated users, or only published causes for unauthenticated users.
 *     operationId: getCauses
 *     tags:
 *       - Cause
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: List of causes (all causes for authenticated users, only published causes for unauthenticated)
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                   title:
 *                     type: string
 *                   goal:
 *                     type: integer
 *                   startDate:
 *                     type: string
 *                     format: date-time
 *                   endDate:
 *                     type: string
 *                     format: date-time
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal server error
 */
export async function GET(req: NextRequest) {
  const authResult = await isAuthenticated(req);
  const causeController = createCauseController();
  if (authResult) {
    return causeController.getvisibleCauses();
  }
  return causeController.getCauses();
}

/**
 * @openapi
 * /api/cause:
 *   delete:
 *     summary: Delete multiple causes
 *     description: This endpoint deletes multiple causes by their IDs, which are passed in the query parameters.
 *     operationId: deleteCauses
 *     tags:
 *       - Cause
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: query
 *         name: causeIds
 *         required: true
 *         description: Comma-separated list of cause IDs to be deleted.
 *         schema:
 *           type: string
 *           example: "1,2,3"
 *     responses:
 *       200:
 *         description: Causes deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Success message indicating the deletion
 *       401:
 *         description: Unauthorized
 *       400:
 *         description: Invalid input or missing causeIds
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 */
export async function DELETE(req: NextRequest) {
  const authResult = await isAuthenticated(req);
  if (authResult) return authResult;

  const causeController = createCauseController();
  return causeController.deleteCauses(req);
}
