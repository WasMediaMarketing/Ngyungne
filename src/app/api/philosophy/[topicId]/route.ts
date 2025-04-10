import type { NextRequest } from "next/server";
import { createPhilosophyTopicController } from "@/lib/factories/philosophyTopicFactory";
import { isAuthenticated } from "@/lib/middlewares";
import { validatePhilosophyTopicUpdate } from "@/lib/middlewares/validatePhilosophyTopicUpdate";
import { Types } from "mongoose";

/**
 * @openapi
 * /api/philosophy/{topicId}:
 *   get:
 *     summary: Get philosophy topic by ID
 *     description: Fetch philosophy topic details by its ID.
 *     tags:
 *       - Philosophy
 *     parameters:
 *       - in: path
 *         name: topicId
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the philosophy topic to fetch.
 *     responses:
 *       200:
 *         description: Philosophy topic details retrieved successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                   description: The topic's ID.
 *                 title:
 *                   type: string
 *                   description: The title of the philosophy topic.
 *                 icon:
 *                   type: string
 *                   description: The icon of the philosophy topic.
 *                 description:
 *                   type: string
 *                   description: A brief description of the philosophy topic.
 *                 content:
 *                   type: string
 *                   description: The full content of the philosophy topic.
 *                 quotes:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       text:
 *                         type: string
 *                       author:
 *                         type: string
 *                 practices:
 *                   type: array
 *                   items:
 *                     type: string
 *                 isVisible:
 *                   type: boolean
 *                   description: Whether the topic is visible or not.
 *       401:
 *         description: Unauthorized - The request is not authenticated.
 *       404:
 *         description: Topic not found for the given ID.
 *       500:
 *         description: Internal server error.
 *
 *   patch:
 *     summary: Update philosophy topic by ID
 *     description: Update the philosophy topic's details based on its ID.
 *     tags:
 *       - Philosophy
 *     parameters:
 *       - in: path
 *         name: topicId
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the philosophy topic to update.
 *     requestBody:
 *       required: true
 *       content:
 *         multipart-form-data:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 description: The updated title of the topic.
 *               icon:
 *                 type: string
 *                 description: The updated icon of the topic.
 *               description:
 *                 type: string
 *                 description: The updated description of the topic.
 *               content:
 *                 type: string
 *                 description: The updated content of the topic.
 *               quotes:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     text:
 *                       type: string
 *                     author:
 *                       type: string
 *               practices:
 *                 type: array
 *                 items:
 *                   type: string
 *               isVisible:
 *                 type: boolean
 *                 description: Whether the topic should be visible.
 *     responses:
 *       200:
 *         description: Philosophy topic details updated successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                   description: The topic's ID.
 *                 title:
 *                   type: string
 *                   description: The updated title of the topic.
 *                 description:
 *                   type: string
 *                   description: The updated description of the topic.
 *       400:
 *         description: Bad request - Invalid or incomplete data.
 *       401:
 *         description: Unauthorized - The request is not authenticated.
 *       404:
 *         description: Topic not found for the given ID.
 *       500:
 *         description: Internal server error.
 *
 *   delete:
 *     summary: Delete philosophy topic by ID
 *     description: Delete a philosophy topic based on its ID.
 *     tags:
 *       - Philosophy
 *     parameters:
 *       - in: path
 *         name: topicId
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the philosophy topic to delete.
 *     responses:
 *       200:
 *         description: Philosophy topic successfully deleted.
 *       401:
 *         description: Unauthorized - The request is not authenticated.
 *       404:
 *         description: Topic not found for the given ID.
 *       500:
 *         description: Internal server error.
 */
export async function GET(req: NextRequest) {
  console.log("GET /api/philosophy/[topicId] - Request received");

  const philosophyController = createPhilosophyTopicController();
  console.log("GET /api/philosophy/[topicId] - Processing request");
  return philosophyController.getPhilosophyTopicById(req);
}

export async function PATCH(req: NextRequest) {
  console.log("PATCH /api/philosophy/[topicId] - Request received");

  // Check authentication
  const authResult = await isAuthenticated(req);
  if (authResult) {
    console.log("PATCH /api/philosophy/[topicId] - Authentication failed");
    return authResult;
  }

  // Get the topicId from the URL
  const topicId = req.nextUrl.pathname.split("/").pop();
  if (!topicId || !Types.ObjectId.isValid(topicId)) {
    console.log("PATCH /api/philosophy/[topicId] - Invalid topic ID");
    return Response.json(
      {
        success: false,
        message: "Philosophy Topic ID is either missing or invalid",
      },
      { status: 400 }
    );
  }

  // Validate input and get the parsed body
  const { error, body } = await validatePhilosophyTopicUpdate(req);
  if (error) {
    console.log("PATCH /api/philosophy/[topicId] - Validation failed");
    return error;
  }

  // Process request with the topicId and body directly
  const philosophyController = createPhilosophyTopicController();
  console.log("PATCH /api/philosophy/[topicId] - Processing request");
  return philosophyController.updatePhilosophyTopic(topicId, body);
}

export async function DELETE(req: NextRequest) {
  console.log("DELETE /api/philosophy/[topicId] - Request received");

  // Check authentication
  const authResult = await isAuthenticated(req);
  if (authResult) {
    console.log("DELETE /api/philosophy/[topicId] - Authentication failed");
    return authResult;
  }

  // Process request
  const philosophyController = createPhilosophyTopicController();
  console.log("DELETE /api/philosophy/[topicId] - Processing request");
  return philosophyController.deletePhilosophyTopic(req);
}
