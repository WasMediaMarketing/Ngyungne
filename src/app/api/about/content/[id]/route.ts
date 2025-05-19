import type { NextRequest } from "next/server";
import { createAboutController } from "@/lib/factories/aboutFactory";
import { isAuthenticated, validateAboutContentCreate } from "@/lib/middlewares";

/**
 * @openapi
 * /api/about/content/{contentId}:
 *   get:
 *     summary: Get content by ID
 *     tags:
 *       - About
 *     parameters:
 *       - in: path
 *         name: contentId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Content retrieved successfully
 *       404:
 *         description: Content not found
 *       500:
 *         description: Internal server error
 */
export async function GET(req: NextRequest) {
  const aboutController = createAboutController();
  return aboutController.getContentById(req);
}

/**
 * @openapi
 * /api/about/content/{contentId}:
 *   put:
 *     summary: Update content by ID
 *     tags:
 *       - About
 *     parameters:
 *       - in: path
 *         name: contentId
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *     responses:
 *       200:
 *         description: Content updated successfully
 *       400:
 *         description: Invalid input
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Content not found
 *       500:
 *         description: Server error
 */
export async function PUT(req: NextRequest) {
  const authResult = await isAuthenticated(req);
  if (authResult) return authResult;

  const validationResponse = await validateAboutContentCreate(req);
  if (validationResponse) return validationResponse;

  const aboutController = createAboutController();
  return aboutController.updateContent(req);
}

/**
 * @openapi
 * /api/about/content/{contentId}:
 *   delete:
 *     summary: Delete content by ID
 *     tags:
 *       - About
 *     parameters:
 *       - in: path
 *         name: contentId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Content deleted successfully
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Content not found
 *       500:
 *         description: Server error
 */
export async function DELETE(req: NextRequest) {
  const authResult = await isAuthenticated(req);
  if (authResult) return authResult;

  const aboutController = createAboutController();
  return aboutController.deleteContent(req);
}
