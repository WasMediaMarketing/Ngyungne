import { type NextRequest, NextResponse } from "next/server";
import { createScriptureController } from "@/lib/factories/scriptureFactory";
import { isAuthenticated, validateScriptureUpdate } from "@/lib/middlewares";
import { handleMultipartRequest } from "@/lib/utils/multipartHandler";
import { httpMessages } from "@/lib/utils/HttpMessage";
import { ExtendedNextRequest } from "@/lib/utils/requestHelpers";

/**
 * @openapi
 * /api/scripture/{scriptureId}:
 *   get:
 *     summary: Get scripture by ID
 *     tags:
 *       - Scripture
 *     parameters:
 *       - in: path
 *         name: scriptureId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Scripture retrieved successfully
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Scripture not found
 *       500:
 *         description: Internal server error
 */
export async function GET(req: NextRequest) {
  const scriptureController = createScriptureController();
  return scriptureController.getScriptureById(req);
}

/**
 * @openapi
 * /api/scripture/{scriptureId}:
 *   patch:
 *     summary: Update scripture by ID (supports file uploads)
 *     tags:
 *       - Scripture
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
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
 *               significance:
 *                 type: string
 *               historicalContext:
 *                 type: string
 *               image:
 *                 type: string
 *                 format: binary
 *               views:
 *                 type: integer
 *               isVisible:
 *                 type: boolean
 *     responses:
 *       200:
 *         description: Scripture updated
 *       400:
 *         description: Invalid input
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Not found
 *       500:
 *         description: Server error
 */
export async function PATCH(req: NextRequest) {
  const authResult = await isAuthenticated(req);
  if (authResult) return authResult;

  // Check content type to determine how to process the request
  const contentType = req.headers.get("content-type") || "";

  // If multipart/form-data, process it with the multipart handler
  if (contentType.includes("multipart/form-data")) {
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

    const validationResponse = await validateScriptureUpdate(
      processedRequest as ExtendedNextRequest
    );
    if (validationResponse) return validationResponse;

    const scriptureController = createScriptureController();
    return scriptureController.updateScripture(
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

      const validationResponse = await validateScriptureUpdate(
        processedRequest
      );
      if (validationResponse) return validationResponse;

      const scriptureController = createScriptureController();
      return scriptureController.updateScripture(processedRequest);
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
 * /api/scripture/{scriptureId}:
 *   put:
 *     summary: Update scripture by ID (JSON only, e.g. `isVisible`)
 *     tags:
 *       - Scripture
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
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
 *               significance:
 *                 type: string
 *               historicalContext:
 *                 type: string
 *               image:
 *                 type: string
 *               views:
 *                 type: integer
 *               isVisible:
 *                 type: boolean
 *     responses:
 *       200:
 *         description: Scripture updated successfully
 *       400:
 *         description: Invalid input
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Server error
 */
export async function PUT(req: NextRequest) {
  const authResult = await isAuthenticated(req);
  if (authResult) return authResult;

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

    const validationResponse = await validateScriptureUpdate(processedRequest);
    if (validationResponse) return validationResponse;

    const scriptureController = createScriptureController();
    return scriptureController.updateScripture(processedRequest);
  } catch (error) {
    return NextResponse.json(httpMessages.BAD_REQUEST("Invalid JSON format"), {
      status: 400,
    });
  }
}

/**
 * @openapi
 * /api/scripture/{scriptureId}:
 *   delete:
 *     summary: Delete a scripture by ID
 *     tags:
 *       - Scripture
 *     parameters:
 *       - in: path
 *         name: scriptureId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Scripture deleted successfully
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Scripture not found
 *       500:
 *         description: Server error
 */
export async function DELETE(req: NextRequest) {
  const authResult = await isAuthenticated(req);
  if (authResult) return authResult;

  const scriptureController = createScriptureController();
  return scriptureController.deleteScripture(req);
}

export const config = {
  api: {
    bodyParser: {
      sizeLimit: "25mb",
    },
  },
};
