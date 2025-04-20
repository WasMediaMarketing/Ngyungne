import { NextRequest } from "next/server";
import { createBookEventController } from "@/lib/factories/bookEventFactory";
import { isAuthenticated, validateBookEventUpdate } from "@/lib/middlewares";

/**
 * @openapi
 * paths:
 *   /api/book-event/{bookEventId}:
 *     patch:
 *       summary: Update a booked event
 *       description: This endpoint allows you to update an existing booked event, including ticket number and accommodation details.
 *       tags:
 *         - Book Event
 *       parameters:
 *         - in: path
 *           name: bookEventId
 *           required: true
 *           description: The ID of the booked event to update
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
 *                 TicketNumber:
 *                   type: integer
 *                   description: The number of tickets to update
 *                   example: 5
 *                 dietaryRequirements:
 *                   type: string
 *                   description: Special dietary requirements for the booking
 *                   example: "Vegetarian"
 *                 specialAccomodation:
 *                   type: string
 *                   description: Special accommodation needs
 *                   example: "Wheelchair access"
 *       responses:
 *         200:
 *           description: Successfully updated the booking event
 *         400:
 *           description: Invalid input data, such as invalid ticket number
 *         401:
 *           description: Unauthorized access, authentication token missing or invalid
 *         404:
 *           description: Booking event not found
 *         500:
 *           description: Internal server error
 *     get:
 *       summary: Get all booked events
 *       description: Retrieve all booked events.
 *       tags:
 *         - Book Event
 *       parameters:
 *         - in: header
 *           name: Authorization
 *           required: true
 *           schema:
 *             type: string
 *             example: Bearer <your_token_here>
 *           description: Authorization token required to access this endpoint.
 *       responses:
 *         200:
 *           description: Successfully retrieved all booked events
 *         401:
 *           description: Unauthorized access
 *         500:
 *           description: Internal server error
 *     delete:
 *       summary: Delete a booked event
 *       description: Delete a booked event based on its ID.
 *       tags:
 *         - Book Event
 *       parameters:
 *         - in: path
 *           name: bookEventId
 *           required: true
 *           description: The ID of the booked event to delete
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
 *           description: Successfully deleted the booked event
 *         401:
 *           description: Unauthorized access
 *         404:
 *           description: Booking event not found
 *         500:
 *           description: Internal server error
 */

export async function GET(req: NextRequest) {
  const authResult = await isAuthenticated(req);
  if (authResult) return authResult;

  const bookEventController = createBookEventController();
  return bookEventController.getBookEventById(req);
}

export async function PATCH(req: NextRequest) {
  const authResult = await isAuthenticated(req);
  if (authResult) return authResult;

  const validateBookEventBody = await validateBookEventUpdate(req);
  if (validateBookEventBody) return validateBookEventBody;

  const bookEventController = createBookEventController();
  return bookEventController.updateBookEvent(req);
}

export async function DELETE(req: NextRequest) {
  const authResult = await isAuthenticated(req);
  if (authResult) return authResult;

  const bookEventController = createBookEventController();
  return bookEventController.deleteBookEvent(req);
}
