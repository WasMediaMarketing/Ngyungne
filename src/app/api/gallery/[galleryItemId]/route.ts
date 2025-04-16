import type { NextRequest } from "next/server";
import { createGalleryController } from "@/lib/factories/galleryFactory";
import { isAuthenticated } from "@/lib/middlewares";
import { handleMultipartRequest } from "@/lib/utils/multipartHandler";
import { validateGalleryItemUpdateData } from "@/lib/middlewares/validateGalleryItem";
import { ExtendedNextRequest } from "@/lib/utils/requestHelpers";
import { Types } from "mongoose";

/**
 * @openapi
 * /api/gallery/{galleryItemId}:
 *   get:
 *     summary: Get a gallery item by ID
 *     description: Retrieves a specific gallery item by its ID
 *     tags:
 *       - Gallery
 *     parameters:
 *       - in: path
 *         name: galleryItemId
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the gallery item to retrieve
 *         example: "64a1b2c3d4e5f6a7b8c9d0e1"
 *     responses:
 *       200:
 *         description: Gallery item retrieved successfully
 *       404:
 *         description: Gallery item not found
 *       500:
 *         description: Internal server error
 */
export async function GET(req: NextRequest) {
  console.log("GET /api/gallery/[galleryItemId] - Request received");

  const pathSegments = req.nextUrl.pathname.split("/");
  const galleryItemId = pathSegments[pathSegments.length - 1];

  console.log("Gallery Item ID from path:", galleryItemId);

  // Validate galleryItemId
  if (!galleryItemId || galleryItemId === "undefined") {
    return Response.json(
      { success: false, message: "Gallery item ID is missing or invalid" },
      { status: 400 }
    );
  }

  if (!Types.ObjectId.isValid(galleryItemId)) {
    return Response.json(
      { success: false, message: "Invalid gallery item ID format" },
      { status: 400 }
    );
  }

  const galleryController = createGalleryController();
  return galleryController.getGalleryItemById(galleryItemId);
}

/**
 * @openapi
 * /api/gallery/{galleryItemId}:
 *   patch:
 *     summary: Update a gallery item
 *     description: Updates a gallery item with the provided data
 *     tags:
 *       - Gallery
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: galleryItemId
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the gallery item to update
 *         example: "64a1b2c3d4e5f6a7b8c9d0e1"
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
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
 *                 description: URL for videos
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
 *       200:
 *         description: Gallery item updated successfully
 *       400:
 *         description: Bad request - Invalid input data
 *       401:
 *         description: Unauthorized - Authentication required
 *       404:
 *         description: Gallery item not found
 *       500:
 *         description: Internal server error
 */
export async function PATCH(
  req: NextRequest,
  { params }: { params: { galleryItemId: string } }
) {
  console.log("PATCH /api/gallery/[galleryItemId] - Request received");
  console.log("Gallery Item ID:", params.galleryItemId);

  // Validate galleryItemId
  if (!params.galleryItemId || params.galleryItemId === "undefined") {
    console.error("Invalid gallery item ID:", params.galleryItemId);
    return Response.json(
      { success: false, message: "Gallery item ID is missing or invalid" },
      { status: 400 }
    );
  }

  // Check if it's a valid MongoDB ObjectId
  if (!Types.ObjectId.isValid(params.galleryItemId)) {
    console.error("Invalid ObjectId format:", params.galleryItemId);
    return Response.json(
      { success: false, message: "Invalid gallery item ID format" },
      { status: 400 }
    );
  }

  // Check authentication
  const authResult = await isAuthenticated(req);
  if (authResult) {
    console.log("PATCH /api/gallery/[galleryItemId] - Authentication failed");
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
    const jsonFields = ["tags", "existingAdditionalImages"];
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
    const validationError = validateGalleryItemUpdateData(body);
    if (validationError) {
      console.log("PATCH /api/gallery/[galleryItemId] - Validation failed");
      return validationError;
    }

    // Process request with the parsed body
    const galleryController = createGalleryController();
    console.log("PATCH /api/gallery/[galleryItemId] - Processing request");
    return galleryController.updateGalleryItem(params.galleryItemId, body);
  } catch (error) {
    console.error("PATCH /api/gallery/[galleryItemId] - Error:", error);
    return Response.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}

/**
 * @openapi
 * /api/gallery/{galleryItemId}:
 *   delete:
 *     summary: Delete a gallery item
 *     description: Deletes a gallery item by its ID
 *     tags:
 *       - Gallery
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: galleryItemId
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the gallery item to delete
 *         example: "64a1b2c3d4e5f6a7b8c9d0e1"
 *     responses:
 *       200:
 *         description: Gallery item deleted successfully
 *       401:
 *         description: Unauthorized - Authentication required
 *       404:
 *         description: Gallery item not found
 *       500:
 *         description: Internal server error
 */
export async function DELETE(
  req: NextRequest,
  { params }: { params: { galleryItemId: string } }
) {
  console.log("DELETE /api/gallery/[galleryItemId] - Request received");
  console.log("Gallery Item ID:", params.galleryItemId);

  // Validate galleryItemId
  if (!params.galleryItemId || params.galleryItemId === "undefined") {
    console.error("Invalid gallery item ID:", params.galleryItemId);
    return Response.json(
      { success: false, message: "Gallery item ID is missing or invalid" },
      { status: 400 }
    );
  }

  // Check if it's a valid MongoDB ObjectId
  if (!Types.ObjectId.isValid(params.galleryItemId)) {
    console.error("Invalid ObjectId format:", params.galleryItemId);
    return Response.json(
      { success: false, message: "Invalid gallery item ID format" },
      { status: 400 }
    );
  }

  // Check authentication
  const authResult = await isAuthenticated(req);
  if (authResult) {
    console.log("DELETE /api/gallery/[galleryItemId] - Authentication failed");
    return authResult;
  }

  // Process request
  const galleryController = createGalleryController();
  console.log("DELETE /api/gallery/[galleryItemId] - Processing request");
  return galleryController.deleteGalleryItem(params.galleryItemId);
}

/**
 * @openapi
 * /api/gallery/{galleryItemId}/visibility:
 *   put:
 *     summary: Update gallery item visibility
 *     description: Updates the visibility status of a gallery item
 *     tags:
 *       - Gallery
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: galleryItemId
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the gallery item to update
 *         example: "64a1b2c3d4e5f6a7b8c9d0e1"
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - isVisible
 *             properties:
 *               isVisible:
 *                 type: boolean
 *                 description: The visibility status to set
 *     responses:
 *       200:
 *         description: Gallery item visibility updated successfully
 *       400:
 *         description: Bad request - Invalid input data
 *       401:
 *         description: Unauthorized - Authentication required
 *       404:
 *         description: Gallery item not found
 *       500:
 *         description: Internal server error
 */
export async function PUT(
  req: NextRequest,
  { params }: { params: { galleryItemId: string } }
) {
  console.log("PUT /api/gallery/[galleryItemId] - Request received");
  console.log("Gallery Item ID:", params.galleryItemId);

  // Validate galleryItemId
  if (!params.galleryItemId || params.galleryItemId === "undefined") {
    console.error("Invalid gallery item ID:", params.galleryItemId);
    return Response.json(
      { success: false, message: "Gallery item ID is missing or invalid" },
      { status: 400 }
    );
  }

  // Check if it's a valid MongoDB ObjectId
  if (!Types.ObjectId.isValid(params.galleryItemId)) {
    console.error("Invalid ObjectId format:", params.galleryItemId);
    return Response.json(
      { success: false, message: "Invalid gallery item ID format" },
      { status: 400 }
    );
  }

  // Check authentication
  const authResult = await isAuthenticated(req);
  if (authResult) {
    console.log("PUT /api/gallery/[galleryItemId] - Authentication failed");
    return authResult;
  }

  try {
    // Clone the request and read the body once
    const clonedReq = req.clone();
    const body = await clonedReq.json();

    // Process request
    const galleryController = createGalleryController();
    console.log("PUT /api/gallery/[galleryItemId] - Processing request");
    return galleryController.updateGalleryItemVisibility(
      params.galleryItemId,
      body
    );
  } catch (error) {
    console.error("PUT /api/gallery/[galleryItemId] - Error:", error);
    return Response.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}
