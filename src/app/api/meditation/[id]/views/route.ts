import type { NextRequest } from "next/server";
import { createMeditationController } from "@/lib/factories/meditationFactory";
import { Types } from "mongoose";
import { handleError } from "@/lib/utils/errorHandler";
import { handleResponse } from "@/lib/utils/responseHandler";

/**
 * @openapi
 * /api/meditation/{meditationId}/views:
 *   post:
 *     summary: Increment view count for a meditation
 *     description: This endpoint increments the view count for a specific meditation.
 *     operationId: incrementMeditationViews
 *     tags:
 *       - Meditation
 *     parameters:
 *       - in: path
 *         name: meditationId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: View count incremented successfully
 *       400:
 *         description: Invalid meditation ID
 *       404:
 *         description: Meditation not found
 *       500:
 *         description: Internal server error
 */
export async function POST(req: NextRequest) {
  try {
    const meditationId = req.url.split("/").slice(-2)[0]; // Extract ID from URL path

    if (!meditationId || !Types.ObjectId.isValid(meditationId)) {
      return handleError({
        message: "Meditation ID is either missing or invalid",
        statusCode: 400,
      });
    }

    const meditationController = createMeditationController();
    const meditationService = meditationController["meditationService"];

    const updatedMeditation = await meditationService.incrementViews(
      new Types.ObjectId(meditationId)
    );
    return handleResponse(updatedMeditation);
  } catch (error) {
    console.error("Error incrementing views:", error);
    return handleError();
  }
}
