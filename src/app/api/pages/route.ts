import type { NextRequest } from "next/server";
import { createPageController } from "@/lib/factories/pageFactory";
import { isAuthenticated } from "@/lib/middlewares";
import { validatePageInput } from "@/lib/middlewares/validatePage";

/**
 * @swagger
 * /api/pages:
 *   post:
 *     summary: Create a new page
 *     description: Creates a new page with the provided data (requires authentication)
 *     tags:
 *       - Pages
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - slug
 *               - location
 *               - content
 *               - status
 *             properties:
 *               title:
 *                 type: string
 *                 description: The title of the page
 *               slug:
 *                 type: string
 *                 description: URL-friendly identifier for the page (lowercase letters, numbers, and hyphens only)
 *               location:
 *                 type: string
 *                 enum: [header, footer]
 *                 description: Where the page should appear in navigation
 *               parentPage:
 *                 type: string
 *                 description: ID of the parent page (if any)
 *               content:
 *                 type: string
 *                 description: The HTML content of the page
 *               status:
 *                 type: string
 *                 enum: [draft, published]
 *                 description: Publication status of the page
 *               metaTitle:
 *                 type: string
 *                 description: SEO meta title
 *               metaKeywords:
 *                 type: string
 *                 description: SEO meta keywords
 *               metaDescription:
 *                 type: string
 *                 description: SEO meta description
 *     responses:
 *       201:
 *         description: Page created successfully
 *       400:
 *         description: Bad request - Invalid input data
 *       401:
 *         description: Unauthorized - Authentication required
 *       500:
 *         description: Internal server error
 *
 *   get:
 *     summary: Get all pages
 *     description: Retrieves all pages (requires authentication for draft pages)
 *     tags:
 *       - Pages
 *     parameters:
 *       - in: query
 *         name: published
 *         schema:
 *           type: boolean
 *         description: If true, returns only published pages (no authentication required)
 *     responses:
 *       200:
 *         description: List of pages retrieved successfully
 *       500:
 *         description: Internal server error
 *
 *   delete:
 *     summary: Delete multiple pages
 *     description: Deletes multiple pages based on their IDs (requires authentication)
 *     tags:
 *       - Pages
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: query
 *         name: pageIds
 *         required: true
 *         schema:
 *           type: string
 *         description: Comma-separated list of page IDs to delete
 *         example: "64a1b2c3d4e5f6a7b8c9d0e1,64a1b2c3d4e5f6a7b8c9d0e2"
 *     responses:
 *       200:
 *         description: Pages successfully deleted
 *       400:
 *         description: Bad request - Invalid input data
 *       401:
 *         description: Unauthorized - Authentication required
 *       404:
 *         description: Not found - No pages found with the provided IDs
 *       500:
 *         description: Internal server error
 */

export async function POST(req: NextRequest) {
  console.log("POST /api/pages - Request received");

  // Check authentication
  const authResult = await isAuthenticated(req);
  if (authResult) {
    console.log("POST /api/pages - Authentication failed");
    return authResult;
  }

  // Parse the request body
  let body;
  try {
    body = await req.json();
    console.log("Received body:", body); // Log the received body
  } catch (error) {
    console.error("POST /api/pages - Invalid JSON body", error);
    return Response.json(
      { success: false, message: "Invalid request body" },
      { status: 400 }
    );
  }

  // Validate the body
  const validationError = validatePageInput(body);
  if (validationError) {
    console.log("POST /api/pages - Validation failed");
    return validationError;
  }

  // Process request with the parsed body
  const pageController = createPageController();
  console.log("POST /api/pages - Processing request");
  return pageController.createPage(body);
}

export async function GET(req: NextRequest) {
  console.log("GET /api/pages - Request received");

  const url = new URL(req.url);
  const publishedOnly = url.searchParams.get("published") === "true";
  const pageController = createPageController();

  // Check if authentication is provided
  const authHeader = req.headers.get("authorization");
  const isAuthProvided =
    authHeader &&
    authHeader.startsWith("Bearer ") &&
    authHeader.split(" ")[1] !== "invalid";

  if (isAuthProvided) {
    // If authenticated, check if the token is valid
    const authResult = await isAuthenticated(req);
    if (!authResult) {
      // Valid authentication - return all pages
      console.log(
        "GET /api/pages - Authenticated request, returning all pages"
      );
      return pageController.getPages();
    }
  }

  // No valid authentication or publishedOnly parameter - return only published pages
  console.log(
    "GET /api/pages - Unauthenticated request, returning only published pages"
  );
  return pageController.getPublishedPages();
}

export async function DELETE(req: NextRequest) {
  console.log("DELETE /api/pages - Request received");

  // Check authentication
  const authResult = await isAuthenticated(req);
  if (authResult) {
    console.log("DELETE /api/pages - Authentication failed");
    return authResult;
  }

  // Process request
  const pageController = createPageController();
  console.log("DELETE /api/pages - Processing request for bulk delete");
  return pageController.deletePages(req);
}
