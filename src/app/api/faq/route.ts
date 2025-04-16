<<<<<<< HEAD
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
=======
import type { NextRequest } from "next/server";
import { createFaqController } from "@/lib/factories/faqFactory";
import { isAuthenticated } from "@/lib/middlewares";
import { validateFaqData } from "@/lib/middlewares/validateFaq";

/**
 * @swagger
 * /api/faq:
 *   post:
 *     summary: Create a new FAQ
 *     description: Creates a new FAQ entry in the system
 *     tags:
 *       - FAQ
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - question
 *               - answer
 *             properties:
 *               question:
 *                 type: string
 *                 description: The question for the FAQ
 *                 example: "What is Buddhism?"
 *               answer:
 *                 type: string
 *                 description: The answer to the FAQ question
 *                 example: "Buddhism is a path of practice and spiritual development leading to Insight into the true nature of reality."
 *               category:
 *                 type: string
 *                 description: The category of the FAQ
 *                 example: "General"
 *               isVisible:
 *                 type: boolean
 *                 description: Whether the FAQ is visible to users
 *                 default: true
 *                 example: true
 *     responses:
 *       201:
 *         description: FAQ successfully created
 *       400:
 *         description: Bad request - Invalid input data
 *       401:
 *         description: Unauthorized - Authentication required
 *       500:
 *         description: Internal server error
 *
 *   get:
 *     summary: Get all FAQs
 *     description: Retrieves all FAQs in the system, with an option to filter visible ones based on the user's authentication
 *     tags:
 *       - FAQ
 *     responses:
 *       200:
 *         description: List of FAQs retrieved successfully
 *       500:
 *         description: Internal server error
 *
 *   delete:
 *     summary: Delete multiple FAQs
 *     description: Deletes multiple FAQs based on their IDs
 *     tags:
 *       - FAQ
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: query
 *         name: faqIds
 *         required: true
 *         schema:
 *           type: string
 *         description: Comma-separated list of FAQ IDs to delete
 *         example: "64a1b2c3d4e5f6a7b8c9d0e1,64a1b2c3d4e5f6a7b8c9d0e2"
 *     responses:
 *       200:
 *         description: FAQs successfully deleted
 *       400:
 *         description: Bad request - Invalid input data
 *       401:
 *         description: Unauthorized - Authentication required
 *       404:
 *         description: Not found - No FAQs found with the provided IDs
 *       500:
 *         description: Internal server error
 */

export async function POST(req: NextRequest) {
  console.log("POST /api/faq - Request received");

  // Check authentication
  const authResult = await isAuthenticated(req);
  if (authResult) {
    console.log("POST /api/faq - Authentication failed");
    return authResult;
  }

  // Parse the request body
  let body;
  try {
    body = await req.json();
  } catch (error) {
    console.error("POST /api/faq - Invalid JSON body", error);
    return Response.json(
      { success: false, message: "Invalid request body" },
      { status: 400 }
    );
  }

  // Validate the body
  const validationError = validateFaqData(body);
  if (validationError) {
    console.log("POST /api/faq - Validation failed");
    return validationError;
  }

  // Process request with the parsed body
  const faqController = createFaqController();
  console.log("POST /api/faq - Processing request");
  return faqController.createFaq(body);
}

export async function GET(req: NextRequest) {
  console.log("GET /api/faq - Request received");

  // No authentication required for GET
  const faqController = createFaqController();

  // Check if we should return only published FAQs
  const authResult = await isAuthenticated(req);
  if (authResult) {
    console.log("GET /api/faq - Returning published FAQs only");
    return faqController.getPublishedFaqs();
  }

  console.log("GET /api/faq - Returning all FAQs");
>>>>>>> cdf7210311f106bb71ab85355b61204cebcb36da
  return faqController.getFaqs();
}

export async function DELETE(req: NextRequest) {
<<<<<<< HEAD
  const authResult = await isAuthenticated(req);
  if (authResult) return authResult;

  const faqController = createFaqController();
=======
  console.log("DELETE /api/faq - Request received");

  // Check authentication
  const authResult = await isAuthenticated(req);
  if (authResult) {
    console.log("DELETE /api/faq - Authentication failed");
    return authResult;
  }

  // Process request
  const faqController = createFaqController();
  console.log("DELETE /api/faq - Processing request");
>>>>>>> cdf7210311f106bb71ab85355b61204cebcb36da
  return faqController.deleteFaqs(req);
}
