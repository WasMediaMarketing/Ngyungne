import { NextRequest } from "next/server";
import { createBookEventController } from "@/lib/factories/bookEventFactory";
import { isAuthenticated, validateBookEventInput } from "@/lib/middlewares";

/**
 * @openapi
 * paths:
 *   /api/bookEvent:
 *     post:
 *       summary: Create a new event booking
 *       description: This endpoint allows the bookEvent to create a new event booking.
 *       tags:
 *         - BookEvent
 *       requestBody:
 *         required: true
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 name:
 *                   type: string
 *                   description: The name of the person booking the event.
 *                   example: "John Doe"
 *                 email:
 *                   type: string
 *                   description: The email of the person booking the event.
 *                   example: "john.doe@example.com"
 *                 phoneNumber:
 *                   type: string
 *                   description: The phone number of the person booking the event.
 *                   example: "+123456789"
 *                 page:
 *                   type: string
 *                   description: The page associated with the event (optional).
 *                   example: "event123"
 *                 pageTitle:
 *                   type: string
 *                   description: The title of the page associated with the event (optional).
 *                   example: "Annual Charity Event"
 *                 TicketNumber:
 *                   type: integer
 *                   description: The ticket number for the event.
 *                   example: 1
 *                 dietaryRequirements:
 *                   type: string
 *                   description: Any dietary requirements for the attendee (optional).
 *                   example: "Vegetarian"
 *                 specialAccomodation:
 *                   type: string
 *                   description: Special accommodation needs for the attendee (optional).
 *                   example: "Wheelchair access"
 *       responses:
 *         200:
 *           description: Event booking successfully created
 *           content:
 *             application/json:
 *               schema:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: string
 *                     description: The ID of the newly created event booking.
 *                     example: "60b8c6b0f1f1a51a6d5a7a6e"
 *         400:
 *           description: Bad request if the input is invalid
 *         500:
 *           description: Internal server error
 *     get:
 *       summary: Get all event bookings
 *       description: This endpoint retrieves all event bookings in the system.
 *       tags:
 *         - BookEvent
 *       responses:
 *         200:
 *           description: List of event bookings retrieved successfully
 *         500:
 *           description: Internal server error
 *     delete:
 *       summary: Delete bookEvents by their IDs
 *       description: Delete multiple bookEvents based on their bookEvent IDs.
 *       tags:
 *         - User
 *       parameters:
 *         - in: query
 *           name: bookEventIds
 *           required: true
 *           schema:
 *             type: string
 *             example: "1,2,3,4"
 *           description: A comma-separated list of bookEvent IDs to delete.
 *         - in: header
 *           name: Authorization
 *           required: true
 *           schema:
 *             type: string
 *             example: Bearer <your_token_here>
 *           description: Authorization token required to access this endpoint.
 *       responses:
 *         200:
 *           description: Users successfully deleted.
 *         401:
 *           description: Unauthorized - The request is not authenticated.
 *         404:
 *           description: No bookEvents found for the given IDs.
 *         500:
 *           description: Internal server error.
 */
 
export async function POST(req: NextRequest) {
  const valdiatebookEventBody = await validateBookEventInput(req);
  if (valdiatebookEventBody) return valdiatebookEventBody;

  const bookEventController = createBookEventController();
  return bookEventController.createBookEvent;
}

export async function GET(req: NextRequest) {
  const authResult = await isAuthenticated(req);
  if (authResult) return authResult;

  const bookEventController = createBookEventController();
  return bookEventController.getBookEvents();
}

export async function DELETE(req: NextRequest) {
  const authResult = await isAuthenticated(req);
  if (authResult) return authResult;

  const bookEventController = createBookEventController();
  return bookEventController.deleteBookEvents(req);
}
