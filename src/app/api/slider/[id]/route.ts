import { type NextRequest, NextResponse } from "next/server";
import { createSliderController } from "@/lib/factories/sliderFactory";
import { isAuthenticated, validateSliderUpdate } from "@/lib/middlewares";
import { handleMultipartRequest } from "@/lib/utils/multipartHandler";

/**
 * @openapi
 * /api/slider/{sliderId}:
 *   get:
 *     summary: Get slider by ID
 *     tags:
 *       - Slider
 *     parameters:
 *       - in: path
 *         name: sliderId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Slider retrieved successfully
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Slider not found
 *       500:
 *         description: Internal server error
 */
export async function GET(req: NextRequest) {
  const sliderController = createSliderController();
  return sliderController.getSliderById(req);
}

/**
 * @openapi
 * /api/slider/{sliderId}:
 *   patch:
 *     summary: Update slider by ID (supports file uploads)
 *     tags:
 *       - Slider
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *               image:
 *                 type: string
 *                 format: binary
 *               video:
 *                 type: string
 *                 format: binary
 *               buttonText:
 *                 type: string
 *               buttonUrl:
 *                 type: string
 *               order:
 *                 type: integer
 *               isVisible:
 *                 type: boolean
 *     responses:
 *       200:
 *         description: Slider updated
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

  const validationResponse = await validateSliderUpdate(processedRequest);
  if (validationResponse) return validationResponse;

  const sliderController = createSliderController();
  return sliderController.updateSlider(processedRequest);
}

/**
 * @openapi
 * /api/slider/{sliderId}:
 *   put:
 *     summary: Update slider by ID (JSON only, e.g. `isVisible`)
 *     tags:
 *       - Slider
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *               media:
 *                 type: object
 *               buttonText:
 *                 type: string
 *               buttonUrl:
 *                 type: string
 *               order:
 *                 type: integer
 *               isVisible:
 *                 type: boolean
 *     responses:
 *       200:
 *         description: Slider updated successfully
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

  const validationResponse = await validateSliderUpdate(req);
  if (validationResponse) return validationResponse;

  const sliderController = createSliderController();
  return sliderController.updateSlider(req);
}

/**
 * @openapi
 * /api/slider/{sliderId}:
 *   delete:
 *     summary: Delete a slider by ID
 *     tags:
 *       - Slider
 *     parameters:
 *       - in: path
 *         name: sliderId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Slider deleted successfully
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Slider not found
 *       500:
 *         description: Server error
 */
export async function DELETE(req: NextRequest) {
  const authResult = await isAuthenticated(req);
  if (authResult) return authResult;

  const sliderController = createSliderController();
  return sliderController.deleteSlider(req);
}

export const config = {
  api: {
    bodyParser: {
      sizeLimit: "25mb", // or whatever limit you want
    },
  },
};
