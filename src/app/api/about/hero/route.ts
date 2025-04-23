import { createAboutController } from "@/lib/factories/aboutFactory";
import { isAuthenticated, validateHeroSectionUpdate } from "@/lib/middlewares";
import type { NextRequest } from "next/server";

/**
 * @openapi
 * /api/about/hero:
 *   get:
 *     summary: Get hero section
 *     description: This endpoint retrieves the hero section for the about page.
 *     operationId: getAboutHero
 *     tags:
 *       - About
 *     responses:
 *       200:
 *         description: Hero section retrieved successfully
 *       500:
 *         description: Internal server error
 */
export async function GET() {
  const aboutController = createAboutController();
  return aboutController.getHeroSection();
}

/**
 * @openapi
 * /api/about/hero:
 *   put:
 *     summary: Update hero section
 *     description: This endpoint updates the hero section for the about page.
 *     operationId: updateAboutHero
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
 *               imageUrl:
 *                 type: string
 *     responses:
 *       200:
 *         description: Hero section updated successfully
 *       400:
 *         description: Invalid input
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal server error
 */
export async function PUT(req: NextRequest) {
  const authResult = await isAuthenticated(req);
  if (authResult) return authResult;

  const validationResult = await validateHeroSectionUpdate(req);
  if (validationResult) return validationResult;

  const aboutController = createAboutController();
  return aboutController.updateHeroSection(req);
}
