import type { NextRequest } from "next/server";
import { createFaqController } from "@/lib/factories/faqFactory";
import { isAuthenticated } from "@/lib/middlewares";
import { Types } from "mongoose";
import { handleError } from "@/lib/utils/errorHandler";
import { httpMessages } from "@/lib/utils/HttpMessage";

/**
 * @swagger
 * /api/faq/{faqId}:
 *   get:
 *     summary: Get a FAQ by ID
 *     description: Retrieves a specific FAQ by its ID
 *     tags:
 *       - FAQ
 *     parameters:
 *       - in: path
 *         name: faqId
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the FAQ to retrieve
 *         example: "64a1b2c3d4e5f6a7b8c9d0e1"
 *     responses:
 *       200:
 *         description: FAQ retrieved successfully
 *       404:
 *         description: FAQ not found
 *       500:
 *         description: Internal server error
 *
 *   patch:
 *     summary: Update a FAQ
 *     description: Updates a specific FAQ by its ID
 *     tags:
 *       - FAQ
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: faqId
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the FAQ to update
 *         example: "64a1b2c3d4e5f6a7b8c9d0e1"
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
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
 *                 example: true
 *     responses:
 *       200:
 *         description: FAQ successfully updated
 *       400:
 *         description: Bad request - Invalid input data
 *       401:
 *         description: Unauthorized - Authentication required
 *       404:
 *         description: Not found - FAQ not found
 *       500:
 *         description: Internal server error
 *
 *   delete:
 *     summary: Delete a FAQ
 *     description: Deletes a specific FAQ by its ID
 *     tags:
 *       - FAQ
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: faqId
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the FAQ to delete
 *         example: "64a1b2c3d4e5f6a7b8c9d0e1"
 *     responses:
 *       200:
 *         description: FAQ successfully deleted
 *       401:
 *         description: Unauthorized - Authentication required
 *       404:
 *         description: Not found - FAQ not found
 *       500:
 *         description: Internal server error
 */

export async function GET(req: NextRequest) {
  console.log("GET /api/faq/[faqId] - Request received");

  const faqController = createFaqController();
  console.log("GET /api/faq/[faqId] - Processing request");
  return faqController.getFaqById(req);
}

export async function PATCH(req: NextRequest) {
  console.log("PATCH /api/faq/[faqId] - Request received");

  // Check authentication
  const authResult = await isAuthenticated(req);
  if (authResult) {
    console.log("PATCH /api/faq/[faqId] - Authentication failed");
    return authResult;
  }

  // Get the body
  let body;
  try {
    body = await req.json();
  } catch (error) {
    console.error("PATCH /api/faq/[faqId] - Invalid JSON body", error);
    return handleError(httpMessages.BAD_REQUEST("Invalid request body"));
  }

  // Get the faqId from the URL
  const faqId = req.nextUrl.pathname.split("/").pop();
  if (!faqId || !Types.ObjectId.isValid(faqId)) {
    return handleError(
      httpMessages.BAD_REQUEST("FAQ ID is either missing or invalid")
    );
  }

  // Process request
  const faqController = createFaqController();
  console.log("PATCH /api/faq/[faqId] - Processing request");
  return faqController.updateFaq(new Types.ObjectId(faqId), body);
}

export async function DELETE(req: NextRequest) {
  console.log("DELETE /api/faq/[faqId] - Request received");

  // Check authentication
  const authResult = await isAuthenticated(req);
  if (authResult) {
    console.log("DELETE /api/faq/[faqId] - Authentication failed");
    return authResult;
  }

  // Process request
  const faqController = createFaqController();
  console.log("DELETE /api/faq/[faqId] - Processing request");
  return faqController.deleteFaq(req);
}
