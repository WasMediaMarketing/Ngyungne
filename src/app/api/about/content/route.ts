import { createAboutController } from "@/lib/factories/aboutFactory";
import { isAuthenticated, validateContentInput } from "@/lib/middlewares";
import type { NextRequest } from "next/server";

/**
 * @openapi
 * /api/about/content:
 *   post:
 *     summary: Create new about content
 *     description: This endpoint creates new content for the about page.
 *     operationId: createAboutContent
 *     tags:
 *       - About
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               contentType:
 *                 type: string
 *                 enum: [HISTORY, PRACTICE, BENEFIT, STATISTIC]
 *               data:
 *                 type: object
 *               isVisible:
 *                 type: boolean
 *     responses:
 *       201:
 *         description: Content created successfully
 *       400:
 *         description: Invalid input
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal server error
 */
export async function POST(req: NextRequest) {
  const authResult = await isAuthenticated(req);
  if (authResult) return authResult;

  const validationResult = await validateContentInput(req);
  if (validationResult) return validationResult;

  const aboutController = createAboutController();
  return aboutController.createContent(req);
}

/**
 * @openapi
 * /api/about/content:
 *   get:
 *     summary: Get about content
 *     description: This endpoint retrieves content for the about page, optionally filtered by type and visibility.
 *     operationId: getAboutContent
 *     tags:
 *       - About
 *     parameters:
 *       - in: query
 *         name: contentType
 *         schema:
 *           type: string
 *           enum: [HISTORY, PRACTICE, BENEFIT, STATISTIC]
 *         description: Filter by content type
 *       - in: query
 *         name: isVisible
 *         schema:
 *           type: boolean
 *         description: Filter by visibility
 *     responses:
 *       200:
 *         description: Content retrieved successfully
 *       500:
 *         description: Internal server error
 */
export async function GET(req: NextRequest) {
  const aboutController = createAboutController();
  return aboutController.getContent(req);
}
