import { NextRequest } from "next/server";
import { createPhilosophyTopicController } from "@/lib/factories/philosophyTopicFactory";
import {
  isAuthenticated,
  validatePhilosophyTopicUpdate,
} from "@/lib/middlewares";

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
  const philosophyController = createPhilosophyTopicController();
  return philosophyController.getPhilosophyTopicById(req);
}

export async function PATCH(req: NextRequest) {
  const authResult = await isAuthenticated(req);
  if (authResult) return authResult;
  const validationResponse = await validatePhilosophyTopicUpdate(req);
  if (validationResponse) return validationResponse;

  const philosophyController = createPhilosophyTopicController();
  return philosophyController.updatePhilosophyTopic(req);
}

export async function DELETE(req: NextRequest) {
  const authResult = await isAuthenticated(req);
  if (authResult) return authResult;

  const philosophyController = createPhilosophyTopicController();
  return philosophyController.deletePhilosophyTopic(req);
}
