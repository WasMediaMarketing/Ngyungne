import { NextRequest } from "next/server";
import { createRegisterRetreatController } from "@/lib/factories/registerRetreatFactory";
import {
  isAuthenticated,
  validateRegisterRetreatUpdate,
} from "@/lib/middlewares";

/**
 * @openapi
 * paths:
 *   /api/register-retreat/{registerRetreatId}:
 *     patch:
 *       summary: Update a retreat registration
 *       description: Update details of an existing retreat registration, such as accommodation type or dietary restrictions.
 *       tags:
 *         - Register Retreat
 *       parameters:
 *         - in: path
 *           name: registerRetreatId
 *           required: true
 *           description: The ID of the retreat registration to update.
 *           schema:
 *             type: string
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
 *                 MeditationExperience:
 *                   type: string
 *                   description: Updated meditation experience level.
 *                   example: "Intermediate"
 *                 dietaryRestriction:
 *                   type: string
 *                   description: Any updated dietary restrictions.
 *                   example: "Gluten-free"
 *                 specialRequest:
 *                   type: string
 *                   description: Special requests or accommodations.
 *                   example: "Need a ground-floor room"
 *                 AccomodationType:
 *                   type: string
 *                   description: Updated accommodation type.
 *                   example: "Shared Dormitory"
 *                 emergencyContactName:
 *                   type: string
 *                   description: Updated emergency contact name.
 *                   example: "Mary Smith"
 *                 emergencyContactNumber:
 *                   type: string
 *                   description: Updated emergency contact number.
 *                   example: "+1122334455"
 *       responses:
 *         200:
 *           description: Successfully updated the retreat registration.
 *         400:
 *           description: Invalid input data.
 *         401:
 *           description: Unauthorized access.
 *         404:
 *           description: Retreat registration not found.
 *         500:
 *           description: Internal server error.
 *     get:
 *       summary: Get a specific retreat registration
 *       description: Retrieve details of a specific retreat registration.
 *       tags:
 *         - Register Retreat
 *       parameters:
 *         - in: path
 *           name: registerRetreatId
 *           required: true
 *           description: The ID of the retreat registration to retrieve.
 *           schema:
 *             type: string
 *         - in: header
 *           name: Authorization
 *           required: true
 *           schema:
 *             type: string
 *             example: Bearer <your_token_here>
 *           description: Authorization token required to access this endpoint.
 *       responses:
 *         200:
 *           description: Successfully retrieved the retreat registration.
 *         401:
 *           description: Unauthorized access.
 *         404:
 *           description: Retreat registration not found.
 *         500:
 *           description: Internal server error.
 *     delete:
 *       summary: Delete a retreat registration
 *       description: Remove a specific retreat registration from the system.
 *       tags:
 *         - Register Retreat
 *       parameters:
 *         - in: path
 *           name: registerRetreatId
 *           required: true
 *           description: The ID of the retreat registration to delete.
 *           schema:
 *             type: string
 *         - in: header
 *           name: Authorization
 *           required: true
 *           schema:
 *             type: string
 *             example: Bearer <your_token_here>
 *           description: Authorization token required to access this endpoint.
 *       responses:
 *         200:
 *           description: Successfully deleted the retreat registration.
 *         401:
 *           description: Unauthorized access.
 *         404:
 *           description: Retreat registration not found.
 *         500:
 *           description: Internal server error.
 */

export async function GET(req: NextRequest) {
  const authResult = await isAuthenticated(req);
  if (authResult) return authResult;

  const registerRetreatController = createRegisterRetreatController();
  return registerRetreatController.getRegisterRetreatById(req);
}

export async function PATCH(req: NextRequest) {
  const authResult = await isAuthenticated(req);
  if (authResult) return authResult;

  const validateRegisterRetreatBody = await validateRegisterRetreatUpdate(req);
  if (validateRegisterRetreatBody) return validateRegisterRetreatBody;

  const registerRetreatController = createRegisterRetreatController();
  return registerRetreatController.updateRegisterRetreat(req);
}

export async function DELETE(req: NextRequest) {
  const authResult = await isAuthenticated(req);
  if (authResult) return authResult;

  const registerRetreatController = createRegisterRetreatController();
  return registerRetreatController.deleteRegisterRetreat(req);
}
