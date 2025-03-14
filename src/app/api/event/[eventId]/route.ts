import { NextRequest, NextResponse } from "next/server";
import { createEventController } from "@/lib/factories/eventFactory";
import { isAuthenticated, validateEventUpdate } from "@/lib/middlewares";
import { handleMultipartRequest } from "@/lib/utils/multipartHandler";

/**
 * @openapi
 * /api/event/{eventId}:
 *   get:
 *     summary: Get event by ID
 *     description: Fetch event details by its event ID.
 *     tags:
 *       - Event
 *     parameters:
 *       - in: path
 *         name: eventId
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the event to fetch.
 *     responses:
 *       200:
 *         description: Event details retrieved successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                   description: The event's ID.
 *                 title:
 *                   type: string
 *                   description: The event's title.
 *                 description:
 *                   type: string
 *                   description: The event's description.
 *                 type:
 *                   type: string
 *                   description: The event's type (e.g., seminar, workshop).
 *                 date:
 *                   type: string
 *                   format: date
 *                   description: The event's date.
 *                 time:
 *                   type: string
 *                   description: The event's start time.
 *                 location:
 *                   type: string
 *                   description: The event's location.
 *                 teacher:
 *                   type: object
 *                   description: Teacher's information for the event.
 *                   properties:
 *                     name:
 *                       type: string
 *                     speciality:
 *                       type: string
 *                     description:
 *                       type: string
 *                     image:
 *                       type: string
 *                     link:
 *                       type: string
 *                     credentials:
 *                       type: array
 *                       items:
 *                         type: string
 *                 image:
 *                   type: string
 *                   description: The URL of the event image.
 *                 tags:
 *                   type: array
 *                   items:
 *                     type: string
 *                 featured:
 *                   type: boolean
 *                   description: Whether the event is featured.
 *                 attending:
 *                   type: integer
 *                   description: Number of attendees for the event.
 *                 capacity:
 *                   type: integer
 *                   description: Maximum capacity of the event.
 *       401:
 *         description: Unauthorized - The request is not authenticated.
 *       404:
 *         description: Event not found for the given ID.
 *       500:
 *         description: Internal server error.
 *
 *   patch:
 *     summary: Update event by ID
 *     description: Update the event's details based on its event ID.
 *     tags:
 *       - Event
 *     parameters:
 *       - in: path
 *         name: eventId
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the event to update.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 description: The updated title of the event.
 *               description:
 *                 type: string
 *                 description: The updated description of the event.
 *               type:
 *                 type: string
 *                 description: The updated type of the event.
 *               date:
 *                 type: string
 *                 format: date
 *                 description: The updated date of the event.
 *               time:
 *                 type: string
 *                 description: The updated time of the event.
 *               location:
 *                 type: string
 *                 description: The updated location of the event.
 *               teacher:
 *                 type: object
 *                 properties:
 *                   name:
 *                     type: string
 *                   speciality:
 *                     type: string
 *                   description:
 *                     type: string
 *                   image:
 *                     type: string
 *                   link:
 *                     type: string
 *                   credentials:
 *                     type: array
 *                     items:
 *                       type: string
 *               image:
 *                 type: string
 *                 description: The updated image URL for the event.
 *               tags:
 *                 type: array
 *                 items:
 *                   type: string
 *               featured:
 *                 type: boolean
 *                 description: Whether the event should be featured.
 *               attending:
 *                 type: integer
 *                 description: The updated number of attendees.
 *               capacity:
 *                 type: integer
 *                 description: The updated capacity of the event.
 *               schedule:
 *                 type: object
 *                 additionalProperties:
 *                   type: object
 *                   properties:
 *                     title:
 *                       type: string
 *                     description:
 *                       type: string
 *                 description: The updated event schedule.
 *     responses:
 *       200:
 *         description: Event details updated successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                   description: The event's ID.
 *                 title:
 *                   type: string
 *                   description: The updated title of the event.
 *                 description:
 *                   type: string
 *                   description: The updated description of the event.
 *       400:
 *         description: Bad request - Invalid or incomplete data.
 *       401:
 *         description: Unauthorized - The request is not authenticated.
 *       404:
 *         description: Event not found for the given ID.
 *       500:
 *         description: Internal server error.
 *
 *   delete:
 *     summary: Delete event by ID
 *     description: Delete an event based on its event ID.
 *     tags:
 *       - Event
 *     parameters:
 *       - in: path
 *         name: eventId
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the event to delete.
 *     responses:
 *       200:
 *         description: Event successfully deleted.
 *       401:
 *         description: Unauthorized - The request is not authenticated.
 *       404:
 *         description: Event not found for the given ID.
 *       500:
 *         description: Internal server error.
 */
export async function GET(req: NextRequest) {
  const eventController = createEventController();
  return eventController.getEventById(req);
}

export async function PATCH(req: NextRequest) {
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

  const validationResponse = await validateEventUpdate(processedRequest);
  if (validationResponse) return validationResponse;

  const eventController = createEventController();
  return eventController.updateEvent(processedRequest);
}

export async function DELETE(req: NextRequest) {
  const authResult = await isAuthenticated(req);
  if (authResult) return authResult;

  const eventController = createEventController();
  return eventController.deleteEvent(req);
}
