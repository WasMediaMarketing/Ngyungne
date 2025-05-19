import { createSliderController } from "@/lib/factories/sliderFactory";
import { validateSliderInput, isAuthenticated } from "@/lib/middlewares";
import { handleMultipartRequest } from "@/lib/utils/multipartHandler";
import { type NextRequest, NextResponse } from "next/server";

/**
 * @openapi
 * /api/slider:
 *   post:
 *     summary: Create a new slider
 *     description: This endpoint creates a new slider with title, description, media, and other optional information.
 *     operationId: createSlider
 *     tags:
 *       - Slider
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
 *                 description: Image for the slider
 *               video:
 *                 type: string
 *                 format: binary
 *                 description: Video for the slider
 *               title:
 *                 type: string
 *                 description: Title of the slider
 *               description:
 *                 type: string
 *                 description: Description of the slider
 *               buttonText:
 *                 type: string
 *                 description: Text for the button
 *               buttonUrl:
 *                 type: string
 *                 description: URL for the button
 *               order:
 *                 type: integer
 *                 description: Order of the slider
 *               isVisible:
 *                 type: boolean
 *                 description: Whether the slider is visible or not
 *     responses:
 *       200:
 *         description: Slider created successfully
 *       400:
 *         description: Invalid input or validation error
 *       401:
 *         description: Unauthorized or invalid token
 *       500:
 *         description: Internal server error
 */
export async function POST(req: NextRequest) {
  const authResult = await isAuthenticated(req);
  if (authResult) return authResult;

  const uploadFields = [
    { fileField: "image", bodyField: "media.file" },
    { fileField: "video", bodyField: "media.file" },
  ];
  const jsonFields = ["media"];
  const numericFields = ["order"];
  const booleanFields = ["isVisible"];

  const processedRequest = await handleMultipartRequest(
    req,
    uploadFields,
    jsonFields,
    numericFields,
    booleanFields
  );

  if (processedRequest instanceof NextResponse) return processedRequest;

  const validationResponse = await validateSliderInput(processedRequest);

  if (validationResponse) return validationResponse;

  const sliderController = createSliderController();
  return sliderController.createSlider(processedRequest);
}

/**
 * @openapi
 * /api/slider:
 *   get:
 *     summary: Retrieve all sliders or published sliders
 *     description: Fetches all sliders for authenticated users, or only published sliders for unauthenticated users.
 *     operationId: getSliders
 *     tags:
 *       - Slider
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: List of sliders
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal server error
 */
export async function GET(req: NextRequest) {
  const authResult = await isAuthenticated(req);
  const sliderController = createSliderController();

  if (authResult) {
    return sliderController.getPublishedSliders(); // Only published for unauthenticated
  }

  return sliderController.getSliders(); // Get all for authenticated users
}

/**
 * @openapi
 * /api/slider:
 *   delete:
 *     summary: Delete multiple sliders
 *     description: This endpoint deletes multiple sliders by their IDs, which are passed in the query parameters.
 *     operationId: deleteSliders
 *     tags:
 *       - Slider
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: query
 *         name: sliderIds
 *         required: true
 *         description: Comma-separated list of slider IDs to be deleted.
 *         schema:
 *           type: string
 *           example: "1,2,3"
 *     responses:
 *       200:
 *         description: Sliders deleted successfully
 *       401:
 *         description: Unauthorized
 *       400:
 *         description: Invalid input or missing sliderIds
 *       500:
 *         description: Internal server error
 */
export async function DELETE(req: NextRequest) {
  const authResult = await isAuthenticated(req);
  if (authResult) return authResult;

  const sliderController = createSliderController();
  return sliderController.deleteSliders(req);
}

export const config = {
  api: {
    bodyParser: {
      sizeLimit: "25mb", // or whatever limit you want
    },
  },
};
