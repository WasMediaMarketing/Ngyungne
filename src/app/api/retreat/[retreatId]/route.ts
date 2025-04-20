import { NextRequest } from "next/server";
import { createRetreatController } from "@/lib/factories/retreatFactory";
import { isAuthenticated } from "@/lib/middlewares";

/**
 * @openapi
 * paths:
 *   /api/retreat/{retreatId}:
 *     delete:
 *       summary: Delete a retreat by its ID
 *       description: This endpoint deletes a retreat from the system based on the provided retreat ID.
 *       tags:
 *         - Retreat
 *       parameters:
 *         - in: path
 *           name: retreatId
 *           required: true
 *           schema:
 *             type: string
 *             example: "12345"
 *           description: The unique ID of the retreat to be deleted.
 *         - in: header
 *           name: Authorization
 *           required: true
 *           schema:
 *             type: string
 *             example: Bearer <your_token_here>
 *           description: Authorization token required to access this endpoint.
 *       responses:
 *         200:
 *           description: Retreat successfully deleted
 *         400:
 *           description: Bad request if the retreat ID is invalid
 *         401:
 *           description: Unauthorized if the request is not authenticated
 *         404:
 *           description: Retreat not found for the given ID
 *         500:
 *           description: Internal server error
 *     patch:
 *       summary: Update retreat information by its ID
 *       description: This endpoint updates the retreat details based on the provided retreat ID.
 *       tags:
 *         - Retreat
 *       parameters:
 *         - in: path
 *           name: retreatId
 *           required: true
 *           schema:
 *             type: string
 *             example: "12345"
 *           description: The unique ID of the retreat to be updated.
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
 *                 title:
 *                   type: string
 *                   description: The title of the retreat.
 *                   example: "Mountain Wellness Retreat"
 *                 description:
 *                   type: string
 *                   description: A brief description of the retreat.
 *                   example: "A weekend retreat focusing on wellness and mindfulness."
 *                 date:
 *                   type: string
 *                   description: The date of the retreat.
 *                   example: "2025-07-15"
 *                 location:
 *                   type: string
 *                   description: The location where the retreat will take place.
 *                   example: "Lake Tahoe, CA"
 *                 participants:
 *                   type: integer
 *                   description: The number of participants for the retreat.
 *                   example: 20
 *                 price:
 *                   type: string
 *                   description: The price per participant for the retreat.
 *                   example: "$500"
 *       responses:
 *         200:
 *           description: Retreat successfully updated
 *         400:
 *           description: Bad request if the retreat ID or input data is invalid
 *         401:
 *           description: Unauthorized if the request is not authenticated
 *         404:
 *           description: Retreat not found for the given ID
 *         500:
 *           description: Internal server error
 */

export async function DELETE(req: NextRequest) {
  const authResult = await isAuthenticated(req);
  if (authResult) return authResult;

  const retreatController = createRetreatController();
  return retreatController.deleteRetreat(req);
}

export async function PATCH(req: NextRequest) {
  const authResult = await isAuthenticated(req);
  if (authResult) return authResult;

  const retreatController = createRetreatController();
  return retreatController.updateRetreat(req);
}
