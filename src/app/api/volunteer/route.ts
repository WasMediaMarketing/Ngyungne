import { NextRequest, NextResponse } from "next/server";
import { validateVolunteerInput } from "@/lib/middlewares";
import { handleMultipartRequest } from "@/lib/utils/multipartHandler";
import { createVolunteerController } from "@/lib/factories/volunteerFactory";
import { isAuthenticated } from "@/lib/middlewares";

/**
 * @openapi
 * paths:
 *   /api/volunteer:
 *     post:
 *       summary: Create a new volunteer
 *       description: This endpoint allows the user to create a new volunteer.
 *       tags:
 *         - Volunteer
 *       requestBody:
 *         required: true
 *         content:
 *           multipart/form-data:
 *             schema:
 *               type: object
 *               properties:
 *                 name:
 *                   type: string
 *                   description: Volunteer’s name.
 *                 email:
 *                   type: string
 *                   description: Volunteer’s email.
 *                 phoneNumber:
 *                   type: string
 *                   description: Volunteer’s phone number.
 *                 image:
 *                   type: string
 *                   format: uri
 *                   description: A URL for the volunteer’s image.
 *                 reason:
 *                   type: string
 *                   description: Reason for volunteering.
 *                 socialLink:
 *                   type: object
 *                   additionalProperties:
 *                     type: string
 *                   description: Social media links of the volunteer.
 *                 page:
 *                   type: string
 *                   description: Page related to the volunteer.
 *                 pageTitle:
 *                   type: string
 *                   description: Title for the page related to the volunteer.
 *       responses:
 *         200:
 *           description: Volunteer successfully created
 *         400:
 *           description: Bad request if the input is invalid
 *         500:
 *           description: Internal server error
 *     get:
 *       summary: Get all volunteers
 *       description: This endpoint retrieves all volunteers in the system.
 *       tags:
 *         - Volunteer
 *       parameters:
 *         - in: header
 *           name: Authorization
 *           required: true
 *           schema:
 *             type: string
 *             example: Bearer <your_token_here>
 *           description: Authorization token required to access this endpoint.
 *       responses:
 *         200:
 *           description: List of volunteers retrieved successfully
 *         401:
 *           description: Unauthorized if token is invalid or missing
 *         500:
 *           description: Internal server error
 *     delete:
 *       summary: Delete volunteers by their IDs
 *       description: Delete volunteers based on their volunteer IDs.
 *       tags:
 *         - Volunteer
 *       parameters:
 *         - in: query
 *           name: volunteerIds
 *           required: true
 *           schema:
 *             type: string
 *             example: "1,2,3,4"
 *           description: A comma-separated list of volunteer IDs to delete.
 *         - in: header
 *           name: Authorization
 *           required: true
 *           schema:
 *             type: string
 *             example: Bearer <your_token_here>
 *           description: Authorization token required to access this endpoint.
 *       responses:
 *         200:
 *           description: Volunteers successfully deleted
 *         401:
 *           description: Unauthorized - The request is not authenticated
 *         404:
 *           description: No volunteers found for the given IDs
 *         500:
 *           description: Internal server error
 */
export async function POST(req: NextRequest) {
  const uploadFields = [{ fileField: "image", bodyField: "image" }];
  const processedRequest = await handleMultipartRequest(req, uploadFields);
  if (processedRequest instanceof NextResponse) return processedRequest;

  const validationResponse = await validateVolunteerInput(processedRequest);
  if (validationResponse) return validationResponse;

  const volunteerController = createVolunteerController();
  return volunteerController.createVolunteer(processedRequest);
}

export async function GET(req: NextRequest) {
  const authResult = await isAuthenticated(req);
  if (authResult) return authResult;

  const volunteerController = createVolunteerController();
  return volunteerController.getVolunteers();
}

export async function DELETE(req: NextRequest) {
  const authResult = await isAuthenticated(req);
  if (authResult) return authResult;

  const volunteerController = createVolunteerController();
  return volunteerController.deleteVolunteers(req);
}
