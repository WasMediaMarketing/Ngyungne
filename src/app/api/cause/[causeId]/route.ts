import { NextRequest, NextResponse } from "next/server";
import { createCauseController } from "@/lib/factories/causeFactory";
import { isAuthenticated, validateCauseUpdate } from "@/lib/middlewares";
import { handleMultipartRequest } from "@/lib/utils/multipartHandler";

/**
 * @openapi
 * /api/cause/{causeId}:
 *   get:
 *     summary: Get cause by ID
 *     description: Fetch cause details by its cause ID.
 *     tags:
 *       - Cause
 *     parameters:
 *       - in: path
 *         name: causeId
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the cause to fetch.
 *     responses:
 *       200:
 *         description: Cause details retrieved successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                   description: The cause's ID.
 *                 title:
 *                   type: string
 *                   description: The cause's title.
 *                 description:
 *                   type: string
 *                   description: The cause's description.
 *                 goal:
 *                   type: integer
 *                   description: The financial goal of the cause.
 *                 raised:
 *                   type: integer
 *                   description: The amount raised for the cause.
 *                 volunteers:
 *                   type: integer
 *                   description: Number of volunteers for the cause.
 *                 totalDonors:
 *                   type: integer
 *                   description: Number of total donors.
 *                 isVisible:
 *                   type: boolean
 *                   description: Whether the cause is visible or not.
 *                 image:
 *                   type: string
 *                   description: The URL of the cause image.
 *                 tags:
 *                   type: array
 *                   items:
 *                     type: string
 *                 gallery:
 *                   type: array
 *                   items:
 *                     type: string
 *                 faq:
 *                   type: array
 *                   items:
 *                     type: string
 *                 about:
 *                   type: string
 *                   description: Additional information about the cause.
 *       401:
 *         description: Unauthorized - The request is not authenticated.
 *       404:
 *         description: Cause not found for the given ID.
 *       500:
 *         description: Internal server error.
 *
 *   patch:
 *     summary: Update cause by ID
 *     description: Update the cause's details based on its cause ID.
 *     tags:
 *       - Cause
 *     parameters:
 *       - in: path
 *         name: causeId
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the cause to update.
 *     requestBody:
 *       required: true
 *       content:
 *         multipart-form data:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 description: The updated title of the cause.
 *               description:
 *                 type: string
 *                 description: The updated description of the cause.
 *               goal:
 *                 type: integer
 *                 description: The updated goal for the cause.
 *               raised:
 *                 type: integer
 *                 description: The updated amount raised for the cause.
 *               volunteers:
 *                 type: integer
 *                 description: The updated number of volunteers for the cause.
 *               totalDonors:
 *                 type: integer
 *                 description: The updated number of total donors.
 *               isVisible:
 *                 type: boolean
 *                 description: Whether the cause is visible.
 *               image:
 *                 type: string
 *                 description: The updated image URL for the cause.
 *               tags:
 *                 type: array
 *                 items:
 *                   type: string
 *               gallery:
 *                 type: array
 *                 items:
 *                   type: string
 *               faq:
 *                 type: array
 *                 items:
 *                   type: string
 *               about:
 *                 type: string
 *                 description: Additional information about the cause.
 *     responses:
 *       200:
 *         description: Cause details updated successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                   description: The cause's ID.
 *                 title:
 *                   type: string
 *                   description: The updated title of the cause.
 *                 description:
 *                   type: string
 *                   description: The updated description of the cause.
 *       400:
 *         description: Bad request - Invalid or incomplete data.
 *       401:
 *         description: Unauthorized - The request is not authenticated.
 *       404:
 *         description: Cause not found for the given ID.
 *       500:
 *         description: Internal server error.
 *
 *   put:
 *     summary: Update cause by ID (non-file related updates)
 *     description: Update cause details (only handles non-file related updates).
 *     tags:
 *       - Cause
 *     parameters:
 *       - in: path
 *         name: causeId
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the cause to update.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 description: The updated title of the cause.
 *               description:
 *                 type: string
 *                 description: The updated description of the cause.
 *               goal:
 *                 type: integer
 *                 description: The updated goal for the cause.
 *               raised:
 *                 type: integer
 *                 description: The updated amount raised for the cause.
 *               volunteers:
 *                 type: integer
 *                 description: The updated number of volunteers for the cause.
 *               totalDonors:
 *                 type: integer
 *                 description: The updated number of total donors.
 *               isVisible:
 *                 type: boolean
 *                 description: Whether the cause is visible.
 *     responses:
 *       200:
 *         description: Cause details updated successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                   description: The cause's ID.
 *                 title:
 *                   type: string
 *                   description: The updated title of the cause.
 *                 description:
 *                   type: string
 *                   description: The updated description of the cause.
 *       400:
 *         description: Bad request - Invalid or incomplete data.
 *       401:
 *         description: Unauthorized - The request is not authenticated.
 *       404:
 *         description: Cause not found for the given ID.
 *       500:
 *         description: Internal server error.
 *
 *   delete:
 *     summary: Delete cause by ID
 *     description: Delete a cause based on its cause ID.
 *     tags:
 *       - Cause
 *     parameters:
 *       - in: path
 *         name: causeId
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the cause to delete.
 *     responses:
 *       200:
 *         description: Cause successfully deleted.
 *       401:
 *         description: Unauthorized - The request is not authenticated.
 *       404:
 *         description: Cause not found for the given ID.
 *       500:
 *         description: Internal server error.
 */

export async function GET(req: NextRequest) {
  const causeController = createCauseController();
  return causeController.getCauseById(req);
}

export async function PATCH(req: NextRequest) {
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

  const validationResponse = await validateCauseUpdate(processedRequest);
  if (validationResponse) return validationResponse;

  const causeController = createCauseController();
  return causeController.updateCause(processedRequest);
}

export async function PUT(req: NextRequest) {
  const authResult = await isAuthenticated(req);
  if (authResult) return authResult;

  const validationResponse = await validateCauseUpdate(req);
  if (validationResponse) return validationResponse;

  const causeController = createCauseController();
  return causeController.updateCause(req);
}

export async function DELETE(req: NextRequest) {
  const authResult = await isAuthenticated(req);
  if (authResult) return authResult;

  const causeController = createCauseController();
  return causeController.deleteCause(req);
}
