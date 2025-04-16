import { type NextRequest, NextResponse } from "next/server";
import { handleMultipartRequest } from "@/lib/utils/multipartHandler";
import { createAmbassadorController } from "@/lib/factories/ambassadorFactory";
import { isAuthenticated } from "@/lib/middlewares";
import { deleteFile } from "@/lib/utils/deleteFile";
/**
 * @openapi
 * paths:
 *   /api/ambassador:
 *     post:
 *       summary: Create a new ambassador
 *       description: This endpoint allows the user to create a new ambassador.
 *       tags:
 *         - Ambassador
 *       requestBody:
 *         required: true
 *         content:
 *           multipart/form-data:
 *             schema:
 *               type: object
 *               properties:
 *                 name:
 *                   type: string
 *                   description: Ambassador's name.
 *                 role:
 *                   type: string
 *                   enum: [Founder, Co-Founder, Executive Director, Ambassador, Program Coordinator, Community Liaison, Volunteer]
 *                   description: Ambassador's role.
 *                 bio:
 *                   type: string
 *                   description: Ambassador's bio.
 *                 image:
 *                   type: string
 *                   format: uri
 *                   description: A URL for the ambassador's image.
 *                 location:
 *                   type: string
 *                   description: Ambassador's location.
 *                 quote:
 *                   type: string
 *                   description: Ambassador's quote.
 *                 achievements:
 *                   type: array
 *                   items:
 *                     type: string
 *                   description: Ambassador's achievements.
 *                 socialLinks:
 *                   type: object
 *                   properties:
 *                     linkedin:
 *                       type: string
 *                     twitter:
 *                       type: string
 *                     instagram:
 *                       type: string
 *                     facebook:
 *                       type: string
 *                     website:
 *                       type: string
 *                     email:
 *                       type: string
 *                   description: Social media links of the ambassador.
 *                 isVisible:
 *                   type: boolean
 *                   description: Whether the ambassador should be visible to the public.
 *       responses:
 *         201:
 *           description: Ambassador successfully created
 *         400:
 *           description: Bad request if the input is invalid
 *         500:
 *           description: Internal server error
 *     get:
 *       summary: Get all ambassadors
 *       description: This endpoint retrieves all ambassadors in the system. With authentication, it returns all ambassadors; without authentication, it returns only visible ambassadors.
 *       tags:
 *         - Ambassador
 *       parameters:
 *         - in: header
 *           name: Authorization
 *           required: false
 *           schema:
 *             type: string
 *             example: Bearer <your_token_here>
 *           description: Authorization token to get all ambassadors including non-visible ones.
 *       responses:
 *         200:
 *           description: List of ambassadors retrieved successfully
 *         500:
 *           description: Internal server error
 *     delete:
 *       summary: Delete ambassadors by their IDs
 *       description: Delete ambassadors based on their IDs.
 *       tags:
 *         - Ambassador
 *       parameters:
 *         - in: query
 *           name: ambassadorIds
 *           required: true
 *           schema:
 *             type: string
 *             example: "1,2,3,4"
 *           description: A comma-separated list of ambassador IDs to delete.
 *         - in: header
 *           name: Authorization
 *           required: true
 *           schema:
 *             type: string
 *             example: Bearer <your_token_here>
 *           description: Authorization token required to access this endpoint.
 *       responses:
 *         200:
 *           description: Ambassadors successfully deleted
 *         401:
 *           description: Unauthorized - The request is not authenticated
 *         404:
 *           description: No ambassadors found for the given IDs
 *         500:
 *           description: Internal server error
 */
export async function POST(req: NextRequest) {
  // Check authentication first
  const authResult = await isAuthenticated(req);
  if (authResult) return authResult;

  try {
    // Clone the request to extract form data for validation
    const reqClone = req.clone();
    const formData = await reqClone.formData();

    // Check for required fields
    const requiredFields = ["name", "role", "bio"];
    const missingFields = [];

    for (const field of requiredFields) {
      if (!formData.has(field) || !formData.get(field)) {
        missingFields.push(`${field} is required`);
      }
    }

    if (!formData.has("image")) {
      missingFields.push("image is required");
    }

    if (missingFields.length > 0) {
      return NextResponse.json(
        {
          message: "Validation failed",
          errors: missingFields,
        },
        { status: 400 }
      );
    }

    // Process the request (handles both JSON and multipart form data)
    const uploadFields = [{ fileField: "image", bodyField: "image" }];
    const jsonFields = ["socialLinks", "achievements"];
    const numericFields: string[] = [];
    const booleanFields = ["isVisible"];

    // Now process the full request with file uploads
    const processedRequest = await handleMultipartRequest(
      req,
      uploadFields,
      jsonFields,
      numericFields,
      booleanFields
    );

    if (processedRequest instanceof NextResponse) return processedRequest;

    // Create the ambassador
    try {
      const ambassadorController = createAmbassadorController();
      return ambassadorController.createAmbassador(processedRequest);
    } catch (error) {
      // If ambassador creation fails, clean up the uploaded files
      if (processedRequest.uploadedFiles) {
        for (const [field, url] of Object.entries(
          processedRequest.uploadedFiles
        )) {
          if (typeof url === "string") {
            deleteFile(url);
          } else if (Array.isArray(url)) {
            url.forEach((fileUrl) => deleteFile(fileUrl));
          }
        }
      }
      throw error; // Re-throw to be caught by the outer try-catch
    }
  } catch (error) {
    console.error("Error in POST /api/ambassador:", error);
    return NextResponse.json(
      {
        message: "Internal server error",
        error: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}

export async function GET(req: NextRequest) {
  const authResult = await isAuthenticated(req);
  const ambassadorController = createAmbassadorController();

  // If authenticated (authResult is null), show all ambassadors
  // If not authenticated (authResult is a NextResponse), show only visible ones
  if (authResult === null) {
    return ambassadorController.getAmbassadors();
  } else {
    return ambassadorController.getAmbassadorsToDisplay();
  }
}

export async function DELETE(req: NextRequest) {
  // Check authentication first
  const authResult = await isAuthenticated(req);
  if (authResult) return authResult;

  const ambassadorController = createAmbassadorController();
  return ambassadorController.deleteAmbassadors(req);
}
