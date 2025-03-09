import { NextRequest } from "next/server";
import { createVolunteerController } from "@/lib/factories/volunteerFactory";
import { isAuthenticated } from "@/lib/middlewares";

/**
 * @openapi
 * paths:
 *   /api/volunteer/{id}:
 *     delete:
 *       summary: Delete a volunteer by its ID
 *       description: This endpoint deletes a volunteer from the system based on the provided volunteer ID.
 *       tags:
 *         - Volunteer
 *       parameters:
 *         - in: path
 *           name: id
 *           required: true
 *           schema:
 *             type: string
 *             example: "12345"
 *           description: The unique ID of the volunteer to be deleted.
 *         - in: header
 *           name: Authorization
 *           required: true
 *           schema:
 *             type: string
 *             example: Bearer <your_token_here>
 *           description: Authorization token required to access this endpoint.
 *       responses:
 *         200:
 *           description: Volunteer successfully deleted
 *         400:
 *           description: Bad request if the volunteer ID is invalid
 *         401:
 *           description: Unauthorized if the request is not authenticated
 *         404:
 *           description: Volunteer not found for the given ID
 *         500:
 *           description: Internal server error
 */
export async function DELETE(req: NextRequest) {
  const authResult = await isAuthenticated(req);
  if (authResult) return authResult;

  const volunteerController = createVolunteerController();
  return volunteerController.deleteVolunteer(req);
}
