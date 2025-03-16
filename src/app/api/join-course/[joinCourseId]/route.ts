import { NextRequest } from "next/server";
import { createJoinCourseController } from "@/lib/factories/joinCourseFactory";
import { isAuthenticated, validateJoinCourseUpdate } from "@/lib/middlewares";

/**
 * @openapi
 * paths:
 *   /api/join-course/{joinCourseId}:
 *     patch:
 *       summary: Update a course registration
 *       description: Update details of an existing course registration, such as experience level or special requirements.
 *       tags:
 *         - Join Course
 *       parameters:
 *         - in: path
 *           name: joinCourseId
 *           required: true
 *           description: The ID of the course registration to update.
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
 *                 experience:
 *                   type: string
 *                   description: Updated experience level related to the course.
 *                   example: "Advanced"
 *                 specialRequirement:
 *                   type: string
 *                   description: Any updated special requirements.
 *                   example: "Need a sign language interpreter"
 *                 reason:
 *                   type: string
 *                   description: Updated reason for joining the course.
 *                   example: "To gain expertise in data science"
 *       responses:
 *         200:
 *           description: Successfully updated the course registration.
 *         400:
 *           description: Invalid input data.
 *         401:
 *           description: Unauthorized access.
 *         404:
 *           description: Course registration not found.
 *         500:
 *           description: Internal server error.
 *     get:
 *       summary: Get a specific course registration
 *       description: Retrieve details of a specific course registration.
 *       tags:
 *         - Join Course
 *       parameters:
 *         - in: path
 *           name: joinCourseId
 *           required: true
 *           description: The ID of the course registration to retrieve.
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
 *           description: Successfully retrieved the course registration.
 *         401:
 *           description: Unauthorized access.
 *         404:
 *           description: Course registration not found.
 *         500:
 *           description: Internal server error.
 *     delete:
 *       summary: Delete a course registration
 *       description: Remove a specific course registration from the system.
 *       tags:
 *         - Join Course
 *       parameters:
 *         - in: path
 *           name: joinCourseId
 *           required: true
 *           description: The ID of the course registration to delete.
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
 *           description: Successfully deleted the course registration.
 *         401:
 *           description: Unauthorized access.
 *         404:
 *           description: Course registration not found.
 *         500:
 *           description: Internal server error.
 */

export async function GET(req: NextRequest) {
  const authResult = await isAuthenticated(req);
  if (authResult) return authResult;

  const joinCourseController = createJoinCourseController();
  return joinCourseController.getJoinCourseById(req);
}

export async function PATCH(req: NextRequest) {
  const authResult = await isAuthenticated(req);
  if (authResult) return authResult;

  const validateJoinCourseBody = await validateJoinCourseUpdate(req);
  if (validateJoinCourseBody) return validateJoinCourseBody;

  const joinCourseController = createJoinCourseController();
  return joinCourseController.updateJoinCourse(req);
}

export async function DELETE(req: NextRequest) {
  const authResult = await isAuthenticated(req);
  if (authResult) return authResult;

  const joinCourseController = createJoinCourseController();
  return joinCourseController.deleteJoinCourse(req);
}
