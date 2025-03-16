import { NextRequest } from "next/server";
import { createRetreatController } from "@/lib/factories/retreatFactory";
import { isAuthenticated, validateRetreatInput } from "@/lib/middlewares";

/**
 * @openapi
 * paths:
 *   /api/retreat:
 *     post:
 *       summary: Create a new retreat
 *       description: This endpoint allows the user to create a new retreat.
 *       tags:
 *         - Retreat
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
 *                 duration:
 *                   type: string
 *                   description: The duration of the retreat.
 *                   example: "3 days"
 *                 location:
 *                   type: string
 *                   description: The location where the retreat will take place.
 *                   example: "Lake Tahoe, CA"
 *                 participants:
 *                   type: string
 *                   description: The number of participants for the retreat.
 *                   example: "20"
 *                 price:
 *                   type: string
 *                   description: The price per participant for the retreat.
 *                   example: "$500"
 *                 type:
 *                   type: string
 *                   description: The type/category of the retreat.
 *                   example: "Wellness"
 *                 schedule:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       time:
 *                         type: string
 *                         description: The time of a scheduled activity.
 *                         example: "9:00 AM"
 *                       activity:
 *                         type: string
 *                         description: The scheduled activity at the given time.
 *                         example: "Morning Yoga"
 *       responses:
 *         200:
 *           description: Retreat successfully created
 *           content:
 *             application/json:
 *               schema:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: string
 *                     description: The ID of the newly created retreat.
 *                     example: "60b8c6b0f1f1a51a6d5a7a6e"
 *         400:
 *           description: Bad request if the input is invalid
 *         500:
 *           description: Internal server error
 *     get:
 *       summary: Get all retreats
 *       description: This endpoint retrieves all retreats in the system, with an option to filter visible ones based on the user’s authentication.
 *       tags:
 *         - Retreat
 *       parameters:
 *         - in: header
 *           name: Authorization
 *           required: conditional
 *           schema:
 *             type: string
 *             example: Bearer <your_token_here>
 *           description: Authorization token required to retrieve non-visible retreats. If the retreats are visible, no authorization token is required.
 *       responses:
 *         200:
 *           description: List of retreats retrieved successfully
 *         500:
 *           description: Internal server error
 *     delete:
 *       summary: Delete retreats by their IDs
 *       description: Delete multiple retreats based on their retreat IDs.
 *       tags:
 *         - Retreat
 *       parameters:
 *         - in: query
 *           name: retreatIds
 *           required: true
 *           schema:
 *             type: string
 *             example: "1,2,3,4"
 *           description: A comma-separated list of retreat IDs to delete.
 *         - in: header
 *           name: Authorization
 *           required: true
 *           schema:
 *             type: string
 *             example: Bearer <your_token_here>
 *           description: Authorization token required to access this endpoint.
 *       responses:
 *         200:
 *           description: Retreats successfully deleted.
 *         401:
 *           description: Unauthorized - The request is not authenticated.
 *         404:
 *           description: No retreats found for the given IDs.
 *         500:
 *           description: Internal server error.
 */

export async function POST(req: NextRequest) {
  const validateRetreatBody = await validateRetreatInput(req);
  if (validateRetreatBody) return validateRetreatBody;

  const retreatController = createRetreatController();
  return retreatController.createRetreat(req);
}

export async function GET(req: NextRequest) {
  const authResult = await isAuthenticated(req);
  const retreatController = createRetreatController();
  if (authResult) {
    return retreatController.getPublishedRetreats();
  }
  return retreatController.getRetreats();
}

export async function DELETE(req: NextRequest) {
  const authResult = await isAuthenticated(req);
  if (authResult) return authResult;

  const retreatController = createRetreatController();
  return retreatController.deleteRetreats(req);
}
