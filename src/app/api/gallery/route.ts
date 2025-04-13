import type { NextRequest } from "next/server";
import { createGalleryController } from "@/lib/factories/galleryFactory";
import { isAuthenticated } from "@/lib/middlewares";
import { handleMultipartRequest } from "@/lib/utils/multipartHandler";
import { validateGalleryItemData } from "@/lib/middlewares/validateGalleryItem";
import { ExtendedNextRequest } from "@/lib/utils/requestHelpers";

/**
 * @openapi
 * /api/gallery:
 *   post:
 *     summary: Create a new gallery item
 *     description: Creates a new gallery item (photo or video) with the provided data
 *     tags:
 *       - Gallery
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - description
 *               - type
 *               - image
 *             properties:
 *               title:
 *                 type: string
 *                 description: Title of the gallery item
 *               description:
 *                 type: string
 *                 description: Short description of the gallery item
 *               fullDescription:
 *                 type: string
 *                 description: Detailed description of the gallery item
 *               type:
 *                 type: string
 *                 enum: [photo, video]
 *                 description: Type of the gallery item
 *               image:
 *                 type: string
 *                 format: binary
 *                 description: Main image for photos or thumbnail for videos
 *               videoUrl:
 *                 type: string
 *                 description: URL for videos (required for video type)
 *               additionalImages:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: binary
 *                 description: Additional images for the gallery item
 *               tags:
 *                 type: array
 *                 items:
 *                   type: string
 *                 description: Tags for the gallery item
 *               date:
 *                 type: string
 *                 format: date
 *                 description: Date when the photo was taken or video was recorded
 *               location:
 *                 type: string
 *                 description: Location where the photo was taken or video was recorded
 *               photographer:
 *                 type: string
 *                 description: Name of the photographer (for photos)
 *               presenter:
 *                 type: string
 *                 description: Name of the presenter (for videos)
 *               event:
 *                 type: string
 *                 description: Event associated with the gallery item
 *               duration:
 *                 type: string
 *                 description: Duration of the video (for videos)
 *               isVisible:
 *                 type: boolean
 *                 description: Whether the gallery item is visible to the public
 *     responses:
 *       201:
 *         description: Gallery item created successfully
 *       400:
 *         description: Bad request - Invalid input data
 *       401:
 *         description: Unauthorized - Authentication required
 *       500:
 *         description: Internal server error
 */
export async function POST(req: NextRequest) {
  console.log("POST /api/gallery - Request received");

  // Check authentication
  const authResult = await isAuthenticated(req);
  if (authResult) {
    console.log("POST /api/gallery - Authentication failed");
    return authResult;
  }

  try {
    // Process the request (handles both JSON and multipart form data)
    const uploadFields = [
      { fileField: "image", bodyField: "image" },
      {
        fileField: "additionalImages",
        bodyField: "additionalImages",
        maxCount: 10,
      },
    ];
    const jsonFields = ["tags"];
    const booleanFields = ["isVisible"];

    // Now process the full request with file uploads
    const processedRequest = await handleMultipartRequest(
      req,
      uploadFields,
      jsonFields,
      [],
      booleanFields
    );

    if (!(processedRequest instanceof ExtendedNextRequest)) {
      return processedRequest; // Return early if handleMultipartRequest returned a NextResponse (error)
    }

    // Clone the request and read the body once
    const clonedReq = processedRequest.clone();
    const body = await clonedReq.json();

    // Validate the body
    const validationError = validateGalleryItemData(body);
    if (validationError) {
      console.log("POST /api/gallery - Validation failed");
      return validationError;
    }

    // Process request with the parsed body
    const galleryController = createGalleryController();
    console.log("POST /api/gallery - Processing request");
    return galleryController.createGalleryItem(body);
  } catch (error) {
    console.error("POST /api/gallery - Error:", error);
    return Response.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}

/**
 * @openapi
 * /api/gallery:
 *   get:
 *     summary: Get all gallery items
 *     description: Retrieves all gallery items. With authentication, it returns all items; without authentication, it returns only visible items.
 *     tags:
 *       - Gallery
 *     parameters:
 *       - in: header
 *         name: Authorization
 *         required: false
 *         schema:
 *           type: string
 *           example: Bearer <your_token_here>
 *         description: Authorization token to get all gallery items including non-visible ones
 *     responses:
 *       200:
 *         description: List of gallery items retrieved successfully
 *       500:
 *         description: Internal server error
 */
export async function GET(req: NextRequest) {
  console.log("GET /api/gallery - Request received");

  // Check authentication
  const authResult = await isAuthenticated(req);
  const galleryController = createGalleryController();

  // If authenticated (authResult is null), show all gallery items
  // If not authenticated (authResult is a NextResponse), show only visible ones
  if (authResult === null) {
    console.log("GET /api/gallery - Returning all gallery items");
    return galleryController.getGalleryItems();
  } else {
    console.log("GET /api/gallery - Returning visible gallery items only");
    return galleryController.getVisibleGalleryItems();
  }
}

/**
 * @openapi
 * /api/gallery:
 *   delete:
 *     summary: Delete multiple gallery items
 *     description: Deletes multiple gallery items based on their IDs
 *     tags:
 *       - Gallery
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: query
 *         name: galleryItemIds
 *         required: true
 *         schema:
 *           type: string
 *         description: Comma-separated list of gallery item IDs to delete
 *         example: "64a1b2c3d4e5f6a7b8c9d0e1,64a1b2c3d4e5f6a7b8c9d0e2"
 *     responses:
 *       200:
 *         description: Gallery items successfully deleted
 *       400:
 *         description: Bad request - Invalid input data
 *       401:
 *         description: Unauthorized - Authentication required
 *       404:
 *         description: Not found - No gallery items found with the provided IDs
 *       500:
 *         description: Internal server error
 */
export async function DELETE(req: NextRequest) {
  console.log("DELETE /api/gallery - Request received");

  // Check authentication
  const authResult = await isAuthenticated(req);
  if (authResult) {
    console.log("DELETE /api/gallery - Authentication failed");
    return authResult;
  }

  // Process request
  const galleryController = createGalleryController();
  console.log("DELETE /api/gallery - Processing request");
  return galleryController.deleteGalleryItems(req);
}
