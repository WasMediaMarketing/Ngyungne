import { NextRequest } from "next/server";
import { validateContactInput } from "@/lib/middlewares";
import { createContactController } from "@/lib/factories/contactFactory";
import { isAuthenticated } from "@/lib/middlewares";

/**
 * @openapi
 * paths:
 *   /api/contact:
 *     delete:
 *       summary: Delete multiple contacts by their IDs
 *       description: This endpoint deletes multiple contact entries based on the provided comma-separated list of contact IDs.
 *       tags:
 *         - Contact
 *       parameters:
 *         - in: query
 *           name: contactIds
 *           required: true
 *           schema:
 *             type: string
 *             example: "123,456,789"
 *           description: A comma-separated list of contact IDs to delete.
 *         - in: header
 *           name: Authorization
 *           required: true
 *           schema:
 *             type: string
 *             example: Bearer <your_token_here>
 *           description: Authorization token required to access this endpoint.
 *       responses:
 *         200:
 *           description: Contacts successfully deleted.
 *         400:
 *           description: Bad request if the IDs are invalid or improperly formatted.
 *         401:
 *           description: Unauthorized - The request is not authenticated or the token is invalid.
 *         404:
 *           description: No contacts found for the provided IDs.
 *         500:
 *           description: Internal server error
 */
/**
 * @openapi
 * paths:
 *   /api/contact:
 *     get:
 *       summary: Get all contacts
 *       description: This endpoint retrieves all the contact entries in the system.
 *       tags:
 *         - Contact
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
 *           description: List of contacts retrieved successfully
 *         401:
 *           description: Unauthorized if token is invalid or missing
 *         500:
 *           description: Internal server error
 */
/**
 * @openapi
 * paths:
 *   /api/contact:
 *     post:
 *       summary: Create a new contact
 *       description: This endpoint allows you to create a new contact entry in the system.
 *       tags:
 *         - Contact
 *       requestBody:
 *         required: true
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 name:
 *                   type: string
 *                   description: The name of the contact.
 *                 email:
 *                   type: string
 *                   description: The email of the contact.
 *                 phoneNumber:
 *                   type: string
 *                   description: The phone number of the contact.
 *                 page:
 *                   type: string
 *                   description: (Optional) The page associated with the contact.
 *                 pageTitle:
 *                   type: string
 *                   description: (Optional) The page title associated with the contact.
 *                 subject:
 *                   type: string
 *                   description: The subject of the contact message.
 *                 message:
 *                   type: string
 *                   description: The content of the contact message.
 *       responses:
 *         201:
 *           description: Contact created successfully
 *         400:
 *           description: Bad request if input validation fails
 *         500:
 *           description: Internal server error
 */

export async function POST(req: NextRequest) {
  const validationResponse = await validateContactInput(req);
  if (validationResponse) return validationResponse;

  const contactController = createContactController();
  return contactController.createContact(req);
}

export async function GET(req: NextRequest) {
  const authResult = await isAuthenticated(req);
  if (authResult) return authResult;

  const contactController = createContactController();
  return contactController.getContacts();
}

export async function DELETE(req: NextRequest) {
  const authResult = await isAuthenticated(req);
  if (authResult) return authResult;

  const contactController = createContactController();
  return contactController.deleteContacts(req);
}

