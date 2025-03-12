import { createEventController } from "@/lib/factories/eventFactory";
import { validateEventInput, isAuthenticated } from "@/lib/middlewares";
import { handleMultipartRequest } from "@/lib/utils/multipartHandler";
import { NextRequest, NextResponse } from "next/server";

/**
 * @openapi
 * /api/event:
 *   post:
 *     summary: Create a new event
 *     description: This endpoint creates a new event with images, schedule, teacher data, and other required information.
 *     operationId: createEvent
 *     tags:
 *       - Event
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
 *                 description: Event image (optional, processed later)
 *               teacherImage:
 *                 type: string
 *                 format: binary
 *                 description: Teacher's image (optional, processed later)
 *               title:
 *                 type: string
 *                 description: Title of the event
 *               description:
 *                 type: string
 *                 description: Description of the event
 *               type:
 *                 type: string
 *                 description: Type of the event (e.g., conference, seminar, etc.)
 *               date:
 *                 type: string
 *                 format: date-time
 *                 description: Date of the event
 *               time:
 *                 type: string
 *                 description: Time of the event
 *               location:
 *                 type: string
 *                 description: Location where the event will take place
 *               teacher:
 *                 type: object
 *                 description: Teacher details (name, image, etc.)
 *                 properties:
 *                   name:
 *                     type: string
 *                     description: Teacher's name
 *                   speciality:
 *                     type: string
 *                     description: Teacher's speciality
 *                   description:
 *                     type: string
 *                     description: Teacher's description
 *                   image:
 *                     type: string
 *                     format: uri
 *                     description: Teacher's image URL
 *                   link:
 *                     type: string
 *                     description: Link to teacher's profile
 *                   credentials:
 *                     type: array
 *                     items:
 *                       type: string
 *                     description: Teacher's credentials
 *               tags:
 *                 type: array
 *                 items:
 *                   type: string
 *                 description: Tags related to the event
 *               attending:
 *                 type: integer
 *                 description: Number of people attending
 *               capacity:
 *                 type: integer
 *                 description: Maximum capacity for the event
 *               schedule:
 *                 type: object
 *                 additionalProperties:
 *                   type: object
 *                   properties:
 *                     title:
 *                       type: string
 *                       description: Title of the schedule item
 *                     description:
 *                       type: string
 *                       description: Description of the schedule item
 *     responses:
 *       200:
 *         description: Event created successfully
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
    { fileField: "teacherImage", bodyField: "teacher.image" },
  ];
  const jsonFields = ["tags", "teacher", "schedule"];
  const numericFields = ["attending", "capacity"];
  const booleanFields = ["featured"];
  const processedRequest = await handleMultipartRequest(
    req,
    uploadFields,
    jsonFields,
    numericFields,
    booleanFields
  );

  if (processedRequest instanceof NextResponse) return processedRequest;

  const validationResponse = await validateEventInput(processedRequest);

  if (validationResponse) return validationResponse;

  const eventController = createEventController();
  return eventController.createEvent(processedRequest);
}

/**
 * @openapi
 * /api/event:
 *   get:
 *     summary: Retrieve all events
 *     description: Fetches all the events from the database.
 *     operationId: getEvents
 *     tags:
 *       - Event
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: List of events
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
 *                   date:
 *                     type: string
 *                     format: date-time
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal server error
 */
export async function GET(req: NextRequest) {
  const authResult = await isAuthenticated(req);
  if (authResult) return authResult;

  const eventController = createEventController();

  return eventController.getEvents();
}
/**
 * @openapi
 * /api/event:
 *   delete:
 *     summary: Delete multiple events
 *     description: This endpoint deletes multiple events by their IDs, which are passed in the query parameters.
 *     operationId: deleteEvents
 *     tags:
 *       - Event
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: query
 *         name: eventIds
 *         required: true
 *         description: Comma-separated list of event IDs to be deleted.
 *         schema:
 *           type: string
 *           example: "1,2,3"
 *     responses:
 *       200:
 *         description: Events deleted successfully
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
 *         description: Invalid input or missing eventIds
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

  const eventController = createEventController();
  return eventController.deleteEvents(req);
}

