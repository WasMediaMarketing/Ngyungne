import { NextRequest, NextResponse } from "next/server";
import { validateDonationInput } from "@/lib/middlewares";
import { handleMultipartRequest } from "@/lib/utils/multipartHandler";
import { createDonationController } from "@/lib/factories/donationFactory";
import { isAuthenticated } from "@/lib/middlewares";

/**
 * @openapi
 * paths:
 *   /api/donation:
 *     post:
 *       summary: Create a new donation
 *       description: This endpoint allows the user to create a new donation.
 *       tags:
 *         - Donation
 *       requestBody:
 *         required: true
 *         content:
 *           multipart/form-data:
 *             schema:
 *               type: object
 *               properties:
 *                 amount:
 *                   type: number
 *                   description: Donation amount (must be greater than 0).
 *                 name:
 *                   type: string
 *                   description: Donor's name.
 *                 email:
 *                   type: string
 *                   description: Donor's email.
 *                 phoneNumber:
 *                   type: string
 *                   description: Donor's phone number.
 *                 screenshot:
 *                   type: string
 *                   format: uri
 *                   description: A URL for the screenshot of the donation.
 *                 donationType:
 *                   type: string
 *                   description: Type of donation (e.g., "charity", "event").
 *                 donationMethod:
 *                   type: string
 *                   description: Method of donation (e.g., "credit card", "paypal").
 *       responses:
 *         200:
 *           description: Donation successfully created
 *         400:
 *           description: Bad request if the input is invalid
 *         500:
 *           description: Internal server error
 *     get:
 *       summary: Get all donations
 *       description: This endpoint retrieves all donations in the system.
 *       tags:
 *         - Donation
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
 *           description: List of donations retrieved successfully
 *         401:
 *           description: Unauthorized if token is invalid or missing
 *         500:
 *           description: Internal server error
 *     delete:
 *       summary: Delete donations by their IDs
 *       description: Delete donations based on their donation IDs.
 *       tags:
 *         - Donation
 *       parameters:
 *         - in: query
 *           name: donationIds
 *           required: true
 *           schema:
 *             type: string
 *             example: "1,2,3,4"
 *           description: A comma-separated list of donation IDs to delete.
 *         - in: header
 *           name: Authorization
 *           required: true
 *           schema:
 *             type: string
 *             example: Bearer <your_token_here>
 *           description: Authorization token required to access this endpoint.
 *       responses:
 *         200:
 *           description: Donations successfully deleted
 *         401:
 *           description: Unauthorized - The request is not authenticated
 *         404:
 *           description: No donations found for the given IDs
 *         500:
 *           description: Internal server error
 */
export async function POST(req: NextRequest) {
  const uploadFields = [{ fileField: "screenshot", bodyField: "screenshot" }];
  const numericFields = ["amount"];
  const processedRequest = await handleMultipartRequest(
    req,
    uploadFields,
    numericFields
  );
  if (processedRequest instanceof NextResponse) return processedRequest;

  const validationResponse = await validateDonationInput(processedRequest);
  if (validationResponse) return validationResponse;

  const donationController = createDonationController();
  return donationController.createDonation(processedRequest);
}

export async function GET(req: NextRequest) {
  const authResult = await isAuthenticated(req);
  if (authResult) return authResult;

  const donationController = createDonationController();
  return donationController.getDonations();
}

export async function DELETE(req: NextRequest) {
  const authResult = await isAuthenticated(req);
  if (authResult) return authResult;

  const donationController = createDonationController();
  return donationController.deleteDonations(req);
}
