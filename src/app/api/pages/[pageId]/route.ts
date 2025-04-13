import type { NextRequest } from "next/server";
import { createPageController } from "@/lib/factories/pageFactory";
import { isAuthenticated } from "@/lib/middlewares";
import { validatePageUpdateInput } from "@/lib/middlewares/validatePage";

/**
 * @swagger
 * /api/pages/{pageId}:
 *   get:
 *     summary: Get a page by ID
 *     description: Retrieves a specific page by ID (requires authentication for draft pages)
 *     tags:
 *       - Pages
 *     parameters:
 *       - in: path
 *         name: pageId
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the page to retrieve
 *     responses:
 *       200:
 *         description: Page retrieved successfully
 *       404:
 *         description: Page not found
 *       500:
 *         description: Internal server error
 *
 *   patch:
 *     summary: Update a page
 *     description: Updates a specific page by ID (requires authentication)
 *     tags:
 *       - Pages
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: pageId
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the page to update
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               slug:
 *                 type: string
 *               location:
 *                 type: string
 *                 enum: [header, footer]
 *               parentPage:
 *                 type: string
 *               content:
 *                 type: string
 *               status:
 *                 type: string
 *                 enum: [draft, published]
 *               metaTitle:
 *                 type: string
 *               metaKeywords:
 *                 type: string
 *               metaDescription:
 *                 type: string
 *     responses:
 *       200:
 *         description: Page updated successfully
 *       400:
 *         description: Bad request - Invalid input data
 *       401:
 *         description: Unauthorized - Authentication required
 *       404:
 *         description: Page not found
 *       500:
 *         description: Internal server error
 *
 *   delete:
 *     summary: Delete a page
 *     description: Deletes a specific page by ID (requires authentication)
 *     tags:
 *       - Pages
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: pageId
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the page to delete
 *     responses:
 *       200:
 *         description: Page deleted successfully
 *       401:
 *         description: Unauthorized - Authentication required
 *       404:
 *         description: Page not found
 *       500:
 *         description: Internal server error
 */

export async function PATCH(
  req: NextRequest,
  { params }: { params: { pageId: string } }
) {
  console.log("PATCH /api/pages/[pageId] - Request received");
  console.log("Page ID from params:", params.pageId);

  // Check authentication
  const authResult = await isAuthenticated(req);
  if (authResult) {
    console.log("PATCH /api/pages/[pageId] - Authentication failed");
    return authResult;
  }

  // Parse the request body
  let body;
  try {
    // Clone the request before reading the body to avoid "Body has already been read" error
    const clonedReq = req.clone();
    body = await clonedReq.json();
    console.log("Received update body:", body); // Log the received body
  } catch (error) {
    console.error("PATCH /api/pages/[pageId] - Invalid JSON body", error);
    return Response.json(
      { success: false, message: "Invalid request body" },
      { status: 400 }
    );
  }

  // Validate the body
  const validationError = validatePageUpdateInput(body);
  if (validationError) {
    console.log("PATCH /api/pages/[pageId] - Validation failed");
    return validationError;
  }

  // Process request with the parsed body
  const pageController = createPageController();
  console.log("PATCH /api/pages/[pageId] - Processing request");

  // Use the pageId from the URL params
  const pageId = params.pageId;
  if (!pageId) {
    return Response.json(
      { success: false, message: "Page ID is required" },
      { status: 400 }
    );
  }

  return pageController.updatePage(pageId, body);
}

export async function DELETE(req: NextRequest) {
  console.log("DELETE /api/pages/[pageId] - Request received");

  // Check authentication
  const authResult = await isAuthenticated(req);
  if (authResult) {
    console.log("DELETE /api/pages/[pageId] - Authentication failed");
    return authResult;
  }

  // Process request
  const pageController = createPageController();
  console.log("DELETE /api/pages/[pageId] - Processing request");
  return pageController.deletePage(req);
}
