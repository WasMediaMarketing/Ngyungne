import { NextRequest } from "next/server";
import { createAmbassadorController } from "@/lib/factories/ambassadorFactory";
import { isAuthenticated } from "@/lib/middlewares";
import { handleMultipartRequest } from "@/lib/utils/multipartHandler";
import { ExtendedNextRequest } from "@/lib/utils/requestHelpers";

/**
 * @openapi
 * paths:
 *   /api/ambassador/{id}:
 *     delete:
 *       summary: Delete an ambassador by ID
 *       description: This endpoint deletes an ambassador from the system based on the provided ID.
 *       tags:
 *         - Ambassador
 *       parameters:
 *         - in: path
 *           name: id
 *           required: true
 *           schema:
 *             type: string
 *           description: The unique ID of the ambassador to be deleted.
 *         - in: header
 *           name: Authorization
 *           required: true
 *           schema:
 *             type: string
 *             example: Bearer <your_token_here>
 *           description: Authorization token required to access this endpoint.
 *       responses:
 *         200:
 *           description: Ambassador successfully deleted
 *         401:
 *           description: Unauthorized - The request is not authenticated
 *         404:
 *           description: Ambassador not found for the given ID
 *         500:
 *           description: Internal server error
 *     patch:
 *       summary: Update an ambassador by ID
 *       description: This endpoint updates an ambassador's information based on the provided ID.
 *       tags:
 *         - Ambassador
 *       parameters:
 *         - in: path
 *           name: id
 *           required: true
 *           schema:
 *             type: string
 *           description: The unique ID of the ambassador to be updated.
 *         - in: header
 *           name: Authorization
 *           required: true
 *           schema:
 *             type: string
 *             example: Bearer <your_token_here>
 *           description: Authorization token required to access this endpoint.
 *       requestBody:
 *         required: true
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 isVisible:
 *                   type: boolean
 *                   description: Whether the ambassador should be visible to the public.
 *       responses:
 *         200:
 *           description: Ambassador successfully updated
 *         401:
 *           description: Unauthorized - The request is not authenticated
 *         404:
 *           description: Ambassador not found for the given ID
 *         500:
 *           description: Internal server error
 */

/**
 * PATCH endpoint to update an ambassador
 */
export async function PATCH(req: NextRequest) {
  // Check authentication first
  const authResult = await isAuthenticated(req);
  if (authResult) return authResult;

  try {
    // Process the request (handles both JSON and multipart form data)
    const uploadFields = [{ fileField: "image", bodyField: "image" }];
    const jsonFields = ["socialLinks", "achievements"];
    const numericFields: string[] = [];
    const booleanFields = ["isVisible"];

    // Now process the full request with file uploads
    const processedRequest = (await handleMultipartRequest(
      req,
      uploadFields,
      jsonFields,
      numericFields,
      booleanFields
    )) as ExtendedNextRequest;

    if (!(processedRequest instanceof ExtendedNextRequest)) {
      return processedRequest; // Return early if handleMultipartRequest returned a NextResponse (error)
    }

    // Update the ambassador using the controller
    const ambassadorController = createAmbassadorController();
    return ambassadorController.updateAmbassador(processedRequest);
  } catch (error) {
    console.error("Error in PATCH /api/ambassador/[id]:", error);
    return handleError();
  }
}

/**
 * DELETE endpoint to remove an ambassador
 */
export async function DELETE(req: NextRequest) {
  // Check authentication first
  const authResult = await isAuthenticated(req);
  if (authResult) return authResult;

  try {
    const ambassadorController = createAmbassadorController();
    return ambassadorController.deleteAmbassador(req);
  } catch (error) {
    console.error("Error in DELETE /api/ambassador/[id]:", error);
    return handleError();
  }
}

/**
 * PUT endpoint to update ambassador visibility
 */
export async function PUT(req: NextRequest) {
  // Check authentication first
  const authResult = await isAuthenticated(req);
  if (authResult) return authResult;

  try {
    const ambassadorController = createAmbassadorController();
    return ambassadorController.updateAmbassadorVisibility(
      req as ExtendedNextRequest
    );
  } catch (error) {
    console.error("Error in PUT /api/ambassador/[id]:", error);
    return handleError();
  }
}

/**
 * Helper function to handle errors
 */
function handleError() {
  return new Response(
    JSON.stringify({
      message: "Internal server error",
    }),
    {
      status: 500,
      headers: {
        "Content-Type": "application/json",
      },
    }
  );
}
