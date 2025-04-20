import type { NextRequest } from "next/server";
import { createPhilosophyTopicController } from "@/lib/factories/philosophyTopicFactory";
import { isAuthenticated } from "@/lib/middlewares";
import { validatePhilosophyTopicInput } from "@/lib/middlewares/validatePhilosophyTopicInput";

/**
 * @openapi
 * /api/philosophy:
 *   post:
 *     summary: Create a new philosophy topic
 *     description: This endpoint creates a new philosophy topic with necessary details like title, content, quotes, and practices.
 *     operationId: createPhilosophyTopic
 *     tags:
 *       - PhilosophyTopic
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 description: Title of the philosophy topic
 *               icon:
 *                 type: string
 *                 description: Icon URL for the philosophy topic
 *               description:
 *                 type: string
 *                 description: Description of the philosophy topic
 *               content:
 *                 type: string
 *                 description: Content or details of the philosophy topic
 *               quotes:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     text:
 *                       type: string
 *                       description: Quote text
 *                     author:
 *                       type: string
 *                       description: Author of the quote
 *               practices:
 *                 type: array
 *                 items:
 *                   type: string
 *                 description: List of practices related to the philosophy topic
 *               isVisible:
 *                 type: boolean
 *                 description: Flag to determine if the topic is visible to the public (defaults to true)
 *     responses:
 *       200:
 *         description: Philosophy topic created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Success message
 *       400:
 *         description: Invalid input or validation error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *       401:
 *         description: Unauthorized or invalid token
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 */
export async function POST(req: NextRequest) {
  console.log("POST /api/philosophy - Request received");

  // Check authentication
  const authResult = await isAuthenticated(req);
  if (authResult) {
    console.log("POST /api/philosophy - Authentication failed");
    return authResult;
  }

  // Validate input and get the parsed body
  const { error, body } = await validatePhilosophyTopicInput(req);
  if (error) {
    console.log("POST /api/philosophy - Validation failed");
    return error;
  }

  // Process request with the already parsed body
  const philosophyTopicController = createPhilosophyTopicController();
  console.log("POST /api/philosophy - Processing request");
  return philosophyTopicController.createPhilosophyTopic(body);
}

/**
 * @openapi
 * /api/philosophy:
 *   get:
 *     summary: Retrieve all philosophy topics or only visible ones
 *     description: Fetches all philosophy topics for authenticated users or only visible ones for unauthenticated users.
 *     operationId: getPhilosophyTopics
 *     tags:
 *       - PhilosophyTopic
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: List of philosophy topics (all topics for authenticated users, only visible ones for unauthenticated)
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: string
 *                   title:
 *                     type: string
 *                   description:
 *                     type: string
 *                   icon:
 *                     type: string
 *                   isVisible:
 *                     type: boolean
 *                   quotes:
 *                     type: array
 *                     items:
 *                       type: object
 *                       properties:
 *                         text:
 *                           type: string
 *                         author:
 *                           type: string
 *                   practices:
 *                     type: array
 *                     items:
 *                       type: string
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 */
export async function GET(req: NextRequest) {
  console.log("GET /api/philosophy - Request received");

  // Check authentication
  const authResult = await isAuthenticated(req);
  const philosophyTopicController = createPhilosophyTopicController();

  if (authResult) {
    console.log(
      "GET /api/philosophy - Returning visible philosophy topics only"
    );
    return philosophyTopicController.getVisiblePhilosophyTopics();
  }

  console.log("GET /api/philosophy - Returning all philosophy topics");
  return philosophyTopicController.getPhilosophyTopics();
}

/**
 * @openapi
 * /api/philosophy:
 *   delete:
 *     summary: Delete multiple philosophy topics
 *     description: This endpoint deletes multiple philosophy topics by their IDs, which are passed in the query parameters.
 *     operationId: deletePhilosophyTopics
 *     tags:
 *       - PhilosophyTopic
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: query
 *         name: philosophyTopicIds
 *         required: true
 *         description: Comma-separated list of philosophy topic IDs to be deleted.
 *         schema:
 *           type: string
 *           example: "1,2,3"
 *     responses:
 *       200:
 *         description: Philosophy topics deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Success message indicating the deletion
 *       401:
 *         description: Unauthorized
 *       400:
 *         description: Invalid input or missing philosophyTopicIds
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 */
export async function DELETE(req: NextRequest) {
  console.log("DELETE /api/philosophy - Request received");

  // Check authentication
  const authResult = await isAuthenticated(req);
  if (authResult) {
    console.log("DELETE /api/philosophy - Authentication failed");
    return authResult;
  }

  // Process request
  const philosophyTopicController = createPhilosophyTopicController();
  console.log("DELETE /api/philosophy - Processing request");
  return philosophyTopicController.deletePhilosophyTopics(req);
}

export const config = {
  api: {
    bodyParser: {
      sizeLimit: "25mb", // or whatever limit you want
    },
  },
};
