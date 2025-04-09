import type { NextRequest } from "next/server";
import { createNewsletterController } from "@/lib/factories/newsletterFactory";
import { isAuthenticated } from "@/lib/middlewares";

/**
 * @swagger
 * /api/newsletter/{subscriberId}:
 *   get:
 *     summary: Get a newsletter subscriber by ID
 *     description: Retrieves a specific newsletter subscriber by ID (requires authentication)
 *     tags:
 *       - Newsletter
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: subscriberId
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the subscriber to retrieve
 *         example: "64a1b2c3d4e5f6a7b8c9d0e1"
 *     responses:
 *       200:
 *         description: Subscriber retrieved successfully
 *       401:
 *         description: Unauthorized - Authentication required
 *       404:
 *         description: Subscriber not found
 *       500:
 *         description: Internal server error
 *
 *   delete:
 *     summary: Delete a newsletter subscriber
 *     description: Deletes a specific newsletter subscriber by ID (requires authentication)
 *     tags:
 *       - Newsletter
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: subscriberId
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the subscriber to delete
 *         example: "64a1b2c3d4e5f6a7b8c9d0e1"
 *     responses:
 *       200:
 *         description: Subscriber successfully deleted
 *       401:
 *         description: Unauthorized - Authentication required
 *       404:
 *         description: Subscriber not found
 *       500:
 *         description: Internal server error
 */

export async function GET(req: NextRequest) {
  console.log("GET /api/newsletter/[subscriberId] - Request received");

  // Check authentication
  const authResult = await isAuthenticated(req);
  if (authResult) {
    console.log("GET /api/newsletter/[subscriberId] - Authentication failed");
    return authResult;
  }

  // Process request
  const newsletterController = createNewsletterController();
  console.log("GET /api/newsletter/[subscriberId] - Processing request");
  return newsletterController.getSubscriptionById(req);
}

export async function DELETE(req: NextRequest) {
  console.log("DELETE /api/newsletter/[subscriberId] - Request received");

  // Check authentication
  const authResult = await isAuthenticated(req);
  if (authResult) {
    console.log(
      "DELETE /api/newsletter/[subscriberId] - Authentication failed"
    );
    return authResult;
  }

  // Process request
  const newsletterController = createNewsletterController();
  console.log("DELETE /api/newsletter/[subscriberId] - Processing request");
  return newsletterController.deleteSubscription(req);
}
