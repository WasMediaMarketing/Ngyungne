import { NextRequest } from "next/server";
import { createJoinCourseController } from "@/lib/factories/joinCourseFactory";
import { isAuthenticated, validateJoinCourseInput } from "@/lib/middlewares";

/**
 * @openapi
 * paths:
 *   /api/join-course:
 *     post:
 *       summary: Register for a course
 *       description: This endpoint allows a user to register for a course.
 *       tags:
 *         - JoinCourse
 *       requestBody:
 *         required: true
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 name:
 *                   type: string
 *                   description: The name of the registrant.
 *                   example: "John Doe"
 *                 email:
 *                   type: string
 *                   description: The email of the registrant.
 *                   example: "john.doe@example.com"
 *                 phoneNumber:
 *                   type: string
 *                   description: The phone number of the registrant.
 *                   example: "+123456789"
 *                 page:
 *                   type: string
 *                   description: The page associated with the course (optional).
 *                   example: "course123"
 *                 pageTitle:
 *                   type: string
 *                   description: The title of the page associated with the course (optional).
 *                   example: "Advanced Coding Course"
 *                 address:
 *                   type: string
 *                   description: Address of the registrant.
 *                   example: "123 Main St, City, Country"
 *                 courseId:
 *                   type: string
 *                   description: The ID of the course to register for.
 *                   example: "60b8c6b0f1f1a51a6d5a7a6e"
 *                 educationalLevel:
 *                   type: string
 *                   description: educational level of the applicator.
 *                   example: "High school"
 *                 experience:
 *                   type: string
 *                   description: Relevant experience for the course (optional).
 *                   example: "Intermediate Level"
 *                 specialRequirement:
 *                   type: string
 *                   description: Special requests or accommodations (optional).
 *                   example: "Need a wheelchair-accessible room"
 *                 reason:
 *                   type: string
 *                   description: Reason for joining the course.
 *                   example: "To improve my programming skills"
 *       responses:
 *         200:
 *           description: Successfully registered for the course.
 *         400:
 *           description: Bad request if input is invalid.
 *         500:
 *           description: Internal server error.
 *     get:
 *       summary: Get all course registrations
 *       description: Retrieves all course registrations.
 *       tags:
 *         - JoinCourse
 *       responses:
 *         200:
 *           description: List of course registrations retrieved successfully.
 *         500:
 *           description: Internal server error.
 *     delete:
 *       summary: Delete course registrations by their IDs
 *       description: Delete multiple course registrations based on their IDs.
 *       tags:
 *         - JoinCourse
 *       parameters:
 *         - in: query
 *           name: joinCourseIds
 *           required: true
 *           schema:
 *             type: string
 *             example: "1,2,3,4"
 *           description: A comma-separated list of course registration IDs to delete.
 *         - in: header
 *           name: Authorization
 *           required: true
 *           schema:
 *             type: string
 *             example: Bearer <your_token_here>
 *           description: Authorization token required to access this endpoint.
 *       responses:
 *         200:
 *           description: Course registrations successfully deleted.
 *         401:
 *           description: Unauthorized - The request is not authenticated.
 *         404:
 *           description: No registrations found for the given IDs.
 *         500:
 *           description: Internal server error.
 */

export async function POST(req: NextRequest) {
  const validateJoinCourseBody = await validateJoinCourseInput(req);
  if (validateJoinCourseBody) return validateJoinCourseBody;

  const joinCourseController = createJoinCourseController();
  return joinCourseController.createJoinCourse(req);
}

export async function GET(req: NextRequest) {
  const authResult = await isAuthenticated(req);
  if (authResult) return authResult;

  const joinCourseController = createJoinCourseController();
  return joinCourseController.getJoinCourses();
}

export async function DELETE(req: NextRequest) {
  const authResult = await isAuthenticated(req);
  if (authResult) return authResult;

  const joinCourseController = createJoinCourseController();
  return joinCourseController.deleteJoinCourses(req);
}
