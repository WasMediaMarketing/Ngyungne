import { type NextRequest } from "next/server";
import { createSliderController } from "@/lib/factories/sliderFactory";
import { isAuthenticated } from "@/lib/middlewares";

/**
 * @openapi
 * /api/slider/{sliderId}/order:
 *   put:
 *     summary: Update slider order
 *     description: This endpoint updates the order of a specific slider.
 *     operationId: updateSliderOrder
 *     tags:
 *       - Slider
 *     parameters:
 *       - in: path
 *         name: sliderId
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               order:
 *                 type: integer
 *                 description: New order value
 *     responses:
 *       200:
 *         description: Order updated successfully
 *       400:
 *         description: Invalid slider ID or order value
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Slider not found
 *       500:
 *         description: Internal server error
 */
export async function PUT(req: NextRequest) {
  const authResult = await isAuthenticated(req);
  if (authResult) return authResult;

  const sliderController = createSliderController();
  return sliderController.updateSliderOrder(req);
}
