import { createScriptureController } from "@/lib/factories/scriptureFactory";
import { validateScriptureInput } from "@/lib/middlewares/validateScripture";
import { isAuthenticated } from "@/lib/middlewares";
import { handleMultipartRequest } from "@/lib/utils/multipartHandler";
import { type NextRequest, NextResponse } from "next/server";
import { httpMessages } from "@/lib/utils/HttpMessage";
import { ExtendedNextRequest } from "@/lib/utils/requestHelpers";

/**
 * @openapi
 * /api/scripture:
 *   post:
 *     summary: Create a new scripture
 *     description: Creates a scripture with optional image and structured data like verses, period, etc.
 *     operationId: createScripture
 *     tags:
 *       - Scripture
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               image:
 *                 type: string
 *                 format: binary
 *                 description: Optional image for the scripture
 *               title:
 *                 type: string
 *               tradition:
 *                 type: string
 *               period:
 *                 type: string
 *               language:
 *                 type: string
 *               description:
 *                 type: string
 *               overview:
 *                 type: string
 *               verses:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     number:
 *                       type: integer
 *                     chapter:
 *                       type: string
 *                     text:
 *                       type: string
 *                     commentary:
 *                       type: string
 *               significance:
 *                 type: string
 *               historicalContext:
 *                 type: string
 *               views:
 *                 type: integer
 *               isVisible:
 *                 type: boolean
 *     responses:
 *       200:
 *         description: Scripture created successfully
 *       400:
 *         description: Invalid input or validation error
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal server error
 */
export async function POST(req: NextRequest) {
  const authCheck = await isAuthenticated(req);
  if (authCheck) return authCheck;

  // Check content type to determine how to process the request
  const contentType = req.headers.get("content-type") || "";

  // If multipart/form-data, process it with the multipart handler
  if (contentType.includes("multipart/form-data")) {
    // Handle file and field parsing
    const uploadFields = [{ fileField: "image", bodyField: "image" }];
    const jsonFields = ["verses"];
    const numericFields = ["views"];
    const booleanFields = ["isVisible"];

    const processedRequest = await handleMultipartRequest(
      req,
      uploadFields,
      jsonFields,
      numericFields,
      booleanFields
    );

    if (processedRequest instanceof NextResponse) return processedRequest;

    // Validation
    const validationError = await validateScriptureInput(
      processedRequest as ExtendedNextRequest
    );
    if (validationError) return validationError;

    // Controller Logic
    const scriptureController = createScriptureController();
    return scriptureController.createScripture(
      processedRequest as ExtendedNextRequest
    );
  }
  // If application/json, process it directly
  else if (contentType.includes("application/json")) {
    try {
      const body = await req.json();

      // Create an ExtendedNextRequest manually for JSON requests
      const processedRequest = new ExtendedNextRequest(
        req.url,
        {
          method: req.method,
          headers: req.headers,
          body: JSON.stringify(body),
        },
        {} // Empty object for fileUrls
      );

      // Validation
      const validationError = await validateScriptureInput(processedRequest);
      if (validationError) return validationError;

      // Controller Logic
      const scriptureController = createScriptureController();
      return scriptureController.createScripture(processedRequest);
    } catch (error) {
      return NextResponse.json(
        httpMessages.BAD_REQUEST("Invalid JSON format"),
        { status: 400 }
      );
    }
  }
  // Neither multipart nor JSON
  else {
    return NextResponse.json(
      httpMessages.BAD_REQUEST(
        "Content-Type must be 'multipart/form-data' or 'application/json'"
      ),
      { status: 400 }
    );
  }
}

/**
 * @openapi
 * /api/scripture:
 *   get:
 *     summary: Get scriptures
 *     description: Authenticated users get all scriptures; others get only published ones.
 *     operationId: getScriptures
 *     tags:
 *       - Scripture
 *     responses:
 *       200:
 *         description: List of scriptures
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal server error
 */
export async function GET(req: NextRequest) {
  const authCheck = await isAuthenticated(req);
  const scriptureController = createScriptureController();

  if (authCheck) {
    return scriptureController.getPublishedScriptures();
  }

  return scriptureController.getScriptures();
}

/**
 * @openapi
 * /api/scripture:
 *   delete:
 *     summary: Delete multiple scriptures
 *     description: Accepts comma-separated scripture IDs in query to delete.
 *     operationId: deleteScriptures
 *     tags:
 *       - Scripture
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: query
 *         name: scriptureIds
 *         required: true
 *         schema:
 *           type: string
 *           example: "1,2,3"
 *     responses:
 *       200:
 *         description: Successfully deleted
 *       400:
 *         description: Invalid or missing scriptureIds
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Server error
 */
export async function DELETE(req: NextRequest) {
  const authCheck = await isAuthenticated(req);
  if (authCheck) return authCheck;

  const scriptureController = createScriptureController();
  return scriptureController.deleteScriptures(req);
}

// Optional: Limit request body size to handle larger images safely
export const config = {
  api: {
    bodyParser: {
      sizeLimit: "25mb",
    },
  },
};
