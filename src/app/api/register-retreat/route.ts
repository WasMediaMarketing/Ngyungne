import { NextRequest } from "next/server";
import { createRegisterRetreatController } from "@/lib/factories/registerRetreatFactory";
import {
  isAuthenticated,
  validateRegisterRetreatInput,
} from "@/lib/middlewares";

/**
 * @openapi
 * paths:
 *   /api/register-retreat:
 *     post:
 *       summary: Register for a retreat
 *       description: This endpoint allows a user to register for a retreat.
 *       tags:
 *         - RegisterRetreat
 *       requestBody:
 *         required: true
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 name:
 *                   type: string
 *                   description: The name of the registrant.
 *                   example: "John Doe"
 *                 email:
 *                   type: string
 *                   description: The email of the registrant.
 *                   example: "john.doe@example.com"
 *                 phoneNumber:
 *                   type: string
 *                   description: The phone number of the registrant.
 *                   example: "+123456789"
 *                 page:
 *                   type: string
 *                   description: The page associated with the retreat (optional).
 *                   example: "retreat123"
 *                 pageTitle:
 *                   type: string
 *                   description: The title of the page associated with the retreat (optional).
 *                   example: "Meditation Retreat"
 *                 retreatId:
 *                   type: string
 *                   description: The ID of the retreat to register for.
 *                   example: "60b8c6b0f1f1a51a6d5a7a6e"
 *                 MeditationExperience:
 *                   type: string
 *                   description: The level of meditation experience.
 *                   example: "Beginner"
 *                 dietaryRestriction:
 *                   type: string
 *                   description: Any dietary restrictions (optional).
 *                   example: "Vegan"
 *                 specialRequest:
 *                   type: string
 *                   description: Special requests or accommodations (optional).
 *                   example: "Need a quiet room"
 *                 AccomodationType:
 *                   type: string
 *                   description: Type of accommodation requested.
 *                   example: "Private room"
 *                 emergencyContactName:
 *                   type: string
 *                   description: Emergency contact name.
 *                   example: "Jane Doe"
 *                 emergencyContactNumber:
 *                   type: string
 *                   description: Emergency contact number.
 *                   example: "+987654321"
 *       responses:
 *         200:
 *           description: Successfully registered for the retreat.
 *         400:
 *           description: Bad request if input is invalid.
 *         500:
 *           description: Internal server error.
 *     get:
 *       summary: Get all retreat registrations
 *       description: Retrieves all retreat registrations.
 *       tags:
 *         - RegisterRetreat
 *       responses:
 *         200:
 *           description: List of retreat registrations retrieved successfully.
 *         500:
 *           description: Internal server error.
 *     delete:
 *       summary: Delete retreat registrations by their IDs
 *       description: Delete multiple retreat registrations based on their IDs.
 *       tags:
 *         - RegisterRetreat
 *       parameters:
 *         - in: query
 *           name: registerRetreatIds
 *           required: true
 *           schema:
 *             type: string
 *             example: "1,2,3,4"
 *           description: A comma-separated list of retreat registration IDs to delete.
 *         - in: header
 *           name: Authorization
 *           required: true
 *           schema:
 *             type: string
 *             example: Bearer <your_token_here>
 *           description: Authorization token required to access this endpoint.
 *       responses:
 *         200:
 *           description: Retreat registrations successfully deleted.
 *         401:
 *           description: Unauthorized - The request is not authenticated.
 *         404:
 *           description: No registrations found for the given IDs.
 *         500:
 *           description: Internal server error.
 */

export async function POST(req: NextRequest) {
  const validateRegisterRetreatBody = await validateRegisterRetreatInput(req);
  if (validateRegisterRetreatBody) return validateRegisterRetreatBody;

  const registerRetreatController = createRegisterRetreatController();
  return registerRetreatController.createRegisterRetreat(req);
}

export async function GET(req: NextRequest) {
  const authResult = await isAuthenticated(req);
  if (authResult) return authResult;

  const registerRetreatController = createRegisterRetreatController();
  return registerRetreatController.getRegisterRetreats();
}

export async function DELETE(req: NextRequest) {
  const authResult = await isAuthenticated(req);
  if (authResult) return authResult;

  const registerRetreatController = createRegisterRetreatController();
  return registerRetreatController.deleteRegisterRetreats(req);
}
