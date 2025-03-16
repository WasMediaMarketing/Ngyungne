import { NextRequest } from "next/server";
import { createFaqController } from "@/lib/factories/faqFactory";
import { isAuthenticated, validateFaqUpdate } from "@/lib/middlewares";

/**
 * @openapi
 * paths:
 *   /api/faq/{faqId}:
 *     patch:
 *       summary: Update an FAQ
 *       description: Update the question or answer of an existing FAQ.
 *       tags:
 *         - FAQ
 *       parameters:
 *         - in: path
 *           name: faqId
 *           required: true
 *           description: The ID of the FAQ to update.
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
 *                 question:
 *                   type: string
 *                   description: Updated question for the FAQ.
 *                   example: "What is the refund policy?"
 *                 answer:
 *                   type: string
 *                   description: Updated answer for the FAQ.
 *                   example: "We offer refunds within 30 days of purchase."
 *       responses:
 *         200:
 *           description: Successfully updated the FAQ.
 *         400:
 *           description: Invalid input data.
 *         401:
 *           description: Unauthorized access.
 *         404:
 *           description: FAQ not found.
 *         500:
 *           description: Internal server error.
 *     delete:
 *       summary: Delete an FAQ
 *       description: Remove a specific FAQ entry from the system.
 *       tags:
 *         - FAQ
 *       parameters:
 *         - in: path
 *           name: faqId
 *           required: true
 *           description: The ID of the FAQ to delete.
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
 *           description: Successfully deleted the FAQ.
 *         401:
 *           description: Unauthorized access.
 *         404:
 *           description: FAQ not found.
 *         500:
 *           description: Internal server error.
 */

export async function PATCH(req: NextRequest) {
  const authResult = await isAuthenticated(req);
  if (authResult) return authResult;

  const validateFaqBody = await validateFaqUpdate(req);
  if (validateFaqBody) return validateFaqBody;

  const faqController = createFaqController();
  return faqController.updateFaq(req);
}

export async function DELETE(req: NextRequest) {
  const authResult = await isAuthenticated(req);
  if (authResult) return authResult;

  const faqController = createFaqController();
  return faqController.deleteFaq(req);
}
