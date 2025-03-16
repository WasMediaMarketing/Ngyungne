import { createCourseController } from "@/lib/factories/courseFactory";
import { validateCourseInput, isAuthenticated } from "@/lib/middlewares";
import { handleMultipartRequest } from "@/lib/utils/multipartHandler";
import { NextRequest, NextResponse } from "next/server";

/**
 * @openapi
 * /api/course:
 *   post:
 *     summary: Create a new course
 *     description: This endpoint creates a new course with images, instructor data, modules, and other required information.
 *     operationId: createCourse
 *     tags:
 *       - Course
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               image:
 *                 type: string
 *                 format: binary
 *                 description: Course image (optional, processed later)
 *               instructorImage:
 *                 type: string
 *                 format: binary
 *                 description: Instructor's image (optional, processed later)
 *               title:
 *                 type: string
 *                 description: Title of the course
 *                 example: "Advanced JavaScript"
 *                 required: true
 *               description:
 *                 type: string
 *                 description: Detailed description of the course
 *                 example: "This course covers advanced topics in JavaScript."
 *                 required: true
 *               overView:
 *                 type: string
 *                 description: Overview of the course
 *                 example: "Learn advanced JavaScript concepts."
 *                 required: true
 *               outcomes:
 *                 type: array
 *                 items:
 *                   type: string
 *                 description: Learning outcomes from the course
 *                 example: ["Understand closures", "Master asynchronous JavaScript"]
 *                 required: true
 *               prerequisites:
 *                 type: string
 *                 description: Prerequisites for the course
 *                 example: "Basic knowledge of JavaScript"
 *                 required: true
 *               targetAudience:
 *                 type: string
 *                 description: Who the course is intended for
 *                 example: "Intermediate developers"
 *                 required: true
 *               duration:
 *                 type: string
 *                 description: Duration of the course
 *                 example: "3 hours"
 *                 required: true
 *               lessons:
 *                 type: integer
 *                 description: Number of lessons in the course
 *                 example: 15
 *                 required: true
 *               level:
 *                 type: string
 *                 description: Difficulty level of the course (e.g., Beginner, Intermediate, Advanced)
 *                 example: "Advanced"
 *                 required: true
 *               featured:
 *                 type: boolean
 *                 description: Whether the course is featured
 *                 example: true
 *                 required: true
 *               students:
 *                 type: integer
 *                 description: Number of students enrolled
 *                 example: 200
 *               modules:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     title:
 *                       type: string
 *                       description: Module title
 *                       example: "Module 1: JavaScript Basics"
 *                     lessons:
 *                       type: array
 *                       items:
 *                         type: string
 *                       description: List of lessons in the module
 *                       example: ["Lesson 1: Introduction to JS", "Lesson 2: Functions"]
 *                 required: true
 *               instructor:
 *                 type: object
 *                 properties:
 *                   name:
 *                     type: string
 *                     description: Instructor's name
 *                     example: "John Doe"
 *                     required: true
 *                   position:
 *                     type: string
 *                     description: Instructor's job title
 *                     example: "Senior JavaScript Developer"
 *                     required: true
 *                   description:
 *                     type: string
 *                     description: Short description about the instructor
 *                     example: "John has 10 years of experience in JavaScript."
 *                     required: true
 *               isVisible:
 *                 type: boolean
 *                 description: Whether the course is visible to students
 *                 example: true
 *     responses:
 *       200:
 *         description: Course created successfully
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
  const authResult = await isAuthenticated(req);
  if (authResult) return authResult;

  const uploadFields = [
    { fileField: "image", bodyField: "image" },
    { fileField: "instructorImage", bodyField: "instructor.image" },
  ];
  const jsonFields = ["modules", "instructor", "outcomes"];
  const numericFields = ["students", "lessons"];
  const booleanFields = ["featured", "isVisible"];
  const processedRequest = await handleMultipartRequest(
    req,
    uploadFields,
    jsonFields,
    numericFields,
    booleanFields
  );

  if (processedRequest instanceof NextResponse) return processedRequest;

  const validationResponse = await validateCourseInput(processedRequest);

  if (validationResponse) return validationResponse;

  const courseController = createCourseController();
  return courseController.createCourse(processedRequest);
}

/**
 * @openapi
 * /api/course:
 *   get:
 *     summary: Retrieve all courses or published courses
 *     description: Fetches all courses for authenticated users, or only published courses for unauthenticated users.
 *     operationId: getCourses
 *     tags:
 *       - Course
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: List of courses (all courses for authenticated users, only published courses for unauthenticated)
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                   title:
 *                     type: string
 *                   description:
 *                     type: string
 *                   duration:
 *                     type: string
 *                     example: "3 hours"
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal server error
 */
export async function GET(req: NextRequest) {
  const authResult = await isAuthenticated(req);
  const courseController = createCourseController();
  if (authResult) {
    return courseController.getPublishedCourses();
  }
  return courseController.getCourses();
}

/**
 * @openapi
 * /api/course:
 *   delete:
 *     summary: Delete multiple courses
 *     description: This endpoint deletes multiple courses by their IDs, which are passed in the query parameters.
 *     operationId: deleteCourses
 *     tags:
 *       - Course
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: query
 *         name: courseIds
 *         required: true
 *         description: Comma-separated list of course IDs to be deleted.
 *         schema:
 *           type: string
 *           example: "1,2,3"
 *     responses:
 *       200:
 *         description: Courses deleted successfully
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
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *       400:
 *         description: Invalid input or missing courseIds
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
  const authResult = await isAuthenticated(req);
  if (authResult) return authResult;

  const courseController = createCourseController();
  return courseController.deleteCourses(req);
}
