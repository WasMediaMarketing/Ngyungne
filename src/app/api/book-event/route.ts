/**
 * @openapi
 * paths:
 *   /api/bookEvent:
 *     post:
 *       summary: Create a new event booking
 *       description: This endpoint allows the user to create a new event booking.
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
 *       summary: Delete event booking by its ID
 *       description: This endpoint deletes an event booking from the system based on the provided booking ID.
 *       tags:
 *         - BookEvent
 *       parameters:
 *         - in: path
 *           name: id
 *           required: true
 *           schema:
 *             type: string
 *             example: "12345"
 *           description: The unique ID of the booking to be deleted.
 *       responses:
 *         200:
 *           description: Booking successfully deleted
 *         400:
 *           description: Bad request if the booking ID is invalid
 *         404:
 *           description: Booking not found for the given ID
 *         500:
 *           description: Internal server error
 */
 