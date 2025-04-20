import { NextRequest, NextResponse } from "next/server";
import { createCourseController } from "@/lib/factories/courseFactory";
import { isAuthenticated, validateCourseUpdate } from "@/lib/middlewares";
import { handleMultipartRequest } from "@/lib/utils/multipartHandler";

/**
 * @openapi
 * /api/course/{courseId}:
 *   get:
 *     summary: Get course by ID
 *     description: Fetch course details by its course ID.
 *     tags:
 *       - Course
 *     parameters:
 *       - in: path
 *         name: courseId
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the course to fetch.
 *     responses:
 *       200:
 *         description: Course details retrieved successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                   description: The course's ID.
 *                 title:
 *                   type: string
 *                   description: The course's title.
 *                 description:
 *                   type: string
 *                   description: The course's description.
 *                 level:
 *                   type: string
 *                   description: The course's difficulty level (e.g., Beginner, Intermediate).
 *                 duration:
 *                   type: string
 *                   description: The course's duration.
 *                 lessons:
 *                   type: integer
 *                   description: The total number of lessons in the course.
 *                 instructor:
 *                   type: object
 *                   description: Instructor information for the course.
 *                   properties:
 *                     name:
 *                       type: string
 *                     image:
 *                       type: string
 *                     position:
 *                       type: string
 *                     description:
 *                       type: string
 *                 image:
 *                   type: string
 *                   description: The course's image URL.
 *                 featured:
 *                   type: boolean
 *                   description: Whether the course is featured.
 *                 students:
 *                   type: integer
 *                   description: Number of students enrolled in the course.
 *                 modules:
 *                   type: array
 *                   items:
 *                     type: object
 *                   description: List of course modules.
 *       401:
 *         description: Unauthorized - The request is not authenticated.
 *       404:
 *         description: Course not found for the given ID.
 *       500:
 *         description: Internal server error.
 *
 *   patch:
 *     summary: Update course by ID
 *     description: Update the course's details based on its course ID.
 *     tags:
 *       - Course
 *     parameters:
 *       - in: path
 *         name: courseId
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the course to update.
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
 *                 description: Course image (optional, processed later, required only if you want to change the image, otherwise send the string itself or not)
 *               instructorImage:
 *                 type: string
 *                 format: binary
 *                 description: Instructor's image (optional, processed later, required only if you want to change the image,otherwise send the string itself or not)
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *               overView:
 *                 type: string
 *               outcomes:
 *                 type: array
 *                 items:
 *                   type: string
 *               prerequisites:
 *                 type: string
 *               targetAudience:
 *                 type: string
 *               duration:
 *                 type: string
 *               lessons:
 *                 type: integer
 *               level:
 *                 type: string
 *               featured:
 *                 type: boolean
 *               students:
 *                 type: integer
 *               modules:
 *                 type: array
 *                 items:
 *                   type: object
 *               instructor:
 *                 type: object
 *                 properties:
 *                   name:
 *                     type: string
 *                   image:
 *                     type: string
 *                   position:
 *                     type: string
 *                   description:
 *                     type: string
 *               isVisible:
 *                 type: boolean
 *     responses:
 *       200:
 *         description: Course details updated successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                 title:
 *                   type: string
 *                 description:
 *                   type: string
 *       400:
 *         description: Bad request - Invalid or incomplete data.
 *       401:
 *         description: Unauthorized - The request is not authenticated.
 *       404:
 *         description: Course not found for the given ID.
 *       500:
 *         description: Internal server error.
 *
 *   put:
 *     summary: Update course visibility by ID
 *     description: Update only the visibility of the course based on its course ID.
 *     tags:
 *       - Course
 *     parameters:
 *       - in: path
 *         name: courseId
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the course to update.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               isVisible:
 *                 type: boolean
 *                 description: Whether the course is visible.
 *     responses:
 *       200:
 *         description: Course visibility updated successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                 isVisible:
 *                   type: boolean
 *       400:
 *         description: Bad request - Invalid or incomplete data.
 *       401:
 *         description: Unauthorized - The request is not authenticated.
 *       404:
 *         description: Course not found for the given ID.
 *       500:
 *         description: Internal server error.
 *
 *   delete:
 *     summary: Delete course by ID
 *     description: Delete a course based on its course ID.
 *     tags:
 *       - Course
 *     parameters:
 *       - in: path
 *         name: courseId
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the course to delete.
 *     responses:
 *       200:
 *         description: Course successfully deleted.
 *       401:
 *         description: Unauthorized - The request is not authenticated.
 *       404:
 *         description: Course not found for the given ID.
 *       500:
 *         description: Internal server error.
 */
export async function GET(req: NextRequest) {
  const courseController = createCourseController();
  return courseController.getCourseById(req);
}

export async function PATCH(req: NextRequest) {
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

  const validationResponse = await validateCourseUpdate(processedRequest);
  if (validationResponse) return validationResponse;

  const courseController = createCourseController();
  return courseController.updateCourse(processedRequest);
}

export async function PUT(req: NextRequest) {
  const authResult = await isAuthenticated(req);
  if (authResult) return authResult;

  const validationResponse = await validateCourseUpdate(req);
  if (validationResponse) return validationResponse;

  const courseController = createCourseController();
  return courseController.updateCourse(req);
}

export async function DELETE(req: NextRequest) {
  const authResult = await isAuthenticated(req);
  if (authResult) return authResult;

  const courseController = createCourseController();
  return courseController.deleteCourse(req);
}
