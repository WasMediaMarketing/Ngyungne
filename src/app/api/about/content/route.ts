import { createAboutController } from "@/lib/factories/aboutFactory";
import { validateAboutContentCreate, isAuthenticated } from "@/lib/middlewares";
import type { NextRequest } from "next/server";

/**
 * @openapi
 * /api/about/content:
 *   post:
 *     summary: Create new about content
 *     description: This endpoint creates new content for the about page
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
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *               contentType:
 *                 type: string
 *                 enum: [history, practice, benefit, statistic, cta]
 *               order:
 *                 type: integer
 *               isVisible:
 *                 type: boolean
 *               icon:
 *                 type: string
 *               data:
 *                 type: object
 *     responses:
 *       201:
 *         description: Content created successfully
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

  const validationResponse = await validateAboutContentCreate(req);
  if (validationResponse) return validationResponse;

  const aboutController = createAboutController();
  return aboutController.createContent(req);
}

/**
 * @openapi
 * /api/about/content:
 *   get:
 *     summary: Get about content
 *     description: Fetches all about content or filtered by type and visibility
 *     operationId: getAboutContent
 *     tags:
 *       - About
 *     parameters:
 *       - in: query
 *         name: contentType
 *         schema:
 *           type: string
 *           enum: [history, practice, benefit, statistic, cta]
 *         description: Filter by content type
 *       - in: query
 *         name: isVisible
 *         schema:
 *           type: boolean
 *         description: Filter by visibility
 *     responses:
 *       200:
 *         description: List of content
 *       500:
 *         description: Internal server error
 */
export async function GET(req: NextRequest) {
  const aboutController = createAboutController();
  return aboutController.getContent(req);
}
