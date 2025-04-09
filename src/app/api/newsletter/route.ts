import type { NextRequest } from "next/server";
import { createNewsletterController } from "@/lib/factories/newsletterFactory";
import { isAuthenticated } from "@/lib/middlewares";
import { validateNewsletterData } from "@/lib/middlewares/validateNewsletter";

/**
 * @swagger
 * /api/newsletter:
 *   post:
 *     summary: Subscribe to newsletter
 *     description: Allows users to subscribe to the newsletter with their email
 *     tags:
 *       - Newsletter
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 description: Email address for newsletter subscription
 *                 example: "user@example.com"
 *     responses:
 *       201:
 *         description: Successfully subscribed to newsletter
 *       400:
 *         description: Bad request - Invalid input data
 *       409:
 *         description: Conflict - Email already subscribed
 *       500:
 *         description: Internal server error
 *
 *   get:
 *     summary: Get all newsletter subscribers
 *     description: Retrieves all newsletter subscribers (requires authentication)
 *     tags:
 *       - Newsletter
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: List of subscribers retrieved successfully
 *       401:
 *         description: Unauthorized - Authentication required
 *       500:
 *         description: Internal server error
 *
 *   delete:
 *     summary: Delete multiple newsletter subscribers
 *     description: Deletes multiple newsletter subscribers based on their IDs (requires authentication)
 *     tags:
 *       - Newsletter
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: query
 *         name: subscriberIds
 *         required: true
 *         schema:
 *           type: string
 *         description: Comma-separated list of subscriber IDs to delete
 *         example: "64a1b2c3d4e5f6a7b8c9d0e1,64a1b2c3d4e5f6a7b8c9d0e2"
 *     responses:
 *       200:
 *         description: Subscribers successfully deleted
 *       400:
 *         description: Bad request - Invalid input data
 *       401:
 *         description: Unauthorized - Authentication required
 *       404:
 *         description: Not found - No subscribers found with the provided IDs
 *       500:
 *         description: Internal server error
 */

export async function POST(req: NextRequest) {
  console.log("POST /api/newsletter - Request received");

  // No authentication required for subscription

  // Parse the request body
  let body;
  try {
    body = await req.json();
  } catch (error) {
    console.error("POST /api/newsletter - Invalid JSON body", error);
    return Response.json(
      { success: false, message: "Invalid request body" },
      { status: 400 }
    );
  }

  // Validate the body
  const validationError = validateNewsletterData(body);
  if (validationError) {
    console.log("POST /api/newsletter - Validation failed");
    return validationError;
  }

  // Process request with the parsed body
  const newsletterController = createNewsletterController();
  console.log("POST /api/newsletter - Processing request");
  return newsletterController.createSubscription(body);
}

export async function GET(req: NextRequest) {
  console.log("GET /api/newsletter - Request received");

  // Check authentication
  const authResult = await isAuthenticated(req);
  if (authResult) {
    console.log("GET /api/newsletter - Authentication failed");
    return authResult;
  }

  // Process request
  const newsletterController = createNewsletterController();
  console.log("GET /api/newsletter - Processing request");
  return newsletterController.getSubscriptions();
}

export async function DELETE(req: NextRequest) {
  console.log("DELETE /api/newsletter - Request received");

  // Check authentication
  const authResult = await isAuthenticated(req);
  if (authResult) {
    console.log("DELETE /api/newsletter - Authentication failed");
    return authResult;
  }

  // Process request
  const newsletterController = createNewsletterController();
  console.log("DELETE /api/newsletter - Processing request");
  return newsletterController.deleteSubscriptions(req);
}
