import { NextRequest } from "next/server";
import { createDonationController } from "@/lib/factories/donationFactory";
import { isAuthenticated } from "@/lib/middlewares";

/**
 * @openapi
 * paths:
 *   /api/donation/{id}:
 *     delete:
 *       summary: Delete a donation by its ID
 *       description: This endpoint deletes a donation from the system based on the provided donation ID.
 *       tags:
 *         - Donation
 *       parameters:
 *         - in: path
 *           name: id
 *           required: true
 *           schema:
 *             type: string
 *             example: "12345"
 *           description: The unique ID of the donation to be deleted.
 *         - in: header
 *           name: Authorization
 *           required: true
 *           schema:
 *             type: string
 *             example: Bearer <your_token_here>
 *           description: Authorization token required to access this endpoint.
 *       responses:
 *         200:
 *           description: Donation successfully deleted
 *         400:
 *           description: Bad request if the donation ID is invalid
 *         401:
 *           description: Unauthorized if the request is not authenticated
 *         404:
 *           description: Donation not found for the given ID
 *         500:
 *           description: Internal server error
 */
export async function DELETE(req: NextRequest) {
  const authResult = await isAuthenticated(req);
  if (authResult) return authResult;

  const userController = createDonationController();
  return userController.deleteDonation(req);
}
