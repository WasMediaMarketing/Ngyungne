// src/app/api/pages/slug/[slug]/route.ts

import type { NextRequest } from "next/server";
import { createPageController } from "@/lib/factories/pageFactory";

/**
 * @swagger
 * /api/pages/slug/{slug}:
 *   get:
 *     summary: Get a page by slug
 *     description: Retrieves a specific published page by its slug
 *     tags:
 *       - Pages
 *     parameters:
 *       - in: path
 *         name: slug
 *         required: true
 *         schema:
 *           type: string
 *         description: The slug of the page to retrieve
 *     responses:
 *       200:
 *         description: Page retrieved successfully
 *       404:
 *         description: Page not found
 *       500:
 *         description: Internal server error
 */

export async function GET(
  req: NextRequest,
  { params }: { params: { slug: string } }
) {
  console.log("GET /api/pages/slug/[slug] - Request received");

  const pageController = createPageController();
  return pageController.getPageBySlug(req);
}
