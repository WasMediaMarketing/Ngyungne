import { NextRequest } from "next/server";
import { createFaqController } from "@/lib/factories/faqFactory";
import { isAuthenticated, validateFaqInput } from "@/lib/middlewares";

/**
 * @openapi
 * paths:
 *   /api/faq:
 *     post:
 *       summary: Create a new FAQ
 *       description: This endpoint allows you to create a new FAQ entry.
 *       tags:
 *         - FAQ
 *       security:
 *          - BearerAuth: []
 *       requestBody:
 *         required: true
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 question:
 *                   type: string
 *                   description: The question in the FAQ.
 *                   example: "What is the return policy?"
 *                 answer:
 *                   type: string
 *                   description: The answer to the FAQ question.
 *                   example: "Our return policy lasts 30 days."
 *       responses:
 *         200:
 *           description: FAQ successfully created.
 *         400:
 *           description: Bad request if input is invalid.
 *         500:
 *           description: Internal server error.
 *     get:
 *       summary: Get all FAQs
 *       description: Retrieves all FAQs.
 *       tags:
 *         - FAQ
 *       responses:
 *         200:
 *           description: List of FAQs retrieved successfully.
 *         500:
 *           description: Internal server error.
 *     delete:
 *       summary: Delete FAQ by ID
 *       description: Deletes an FAQ based on its ID.
 *       tags:
 *         - FAQ
 *       parameters:
 *         - in: query
 *           name: faqIds
 *           required: true
 *           schema:
 *             type: string
 *             example: "1,2,3,4"
 *           description: A comma-separated list of faq IDs to delete.
 *         - in: header
 *           name: Authorization
 *           required: true
 *           schema:
 *             type: string
 *             example: Bearer <your_token_here>
 *           description: Authorization token required to access this endpoint.
 *       responses:
 *         200:
 *           description: FAQ successfully deleted.
 *         401:
 *           description: Unauthorized - The request is not authenticated.
 *         404:
 *           description: FAQ not found for the given ID.
 *         500:
 *           description: Internal server error.
 */

export async function POST(req: NextRequest) {
  const authResult = await isAuthenticated(req);
  if (authResult) return authResult;

  const validateFaqBody = await validateFaqInput(req);
  if (validateFaqBody) return validateFaqBody;

  const faqController = createFaqController();
  return faqController.createFaq(req);
}

export async function GET(req: NextRequest) {
  const authResult = await isAuthenticated(req);
  if (authResult) return authResult;

  const faqController = createFaqController();
  return faqController.getFaqs();
}

export async function DELETE(req: NextRequest) {
  const authResult = await isAuthenticated(req);
  if (authResult) return authResult;

  const faqController = createFaqController();
  return faqController.deleteFaqs(req);
}
