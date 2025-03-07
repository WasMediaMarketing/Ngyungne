import { NextRequest, NextResponse } from "next/server";
import { IDonationService } from "@/types";
import { httpMessages } from "@/lib/utils/HttpMessage";
import { handleError } from "@/lib/utils/errorHandler";
import { handleResponse } from "@/lib/utils/responseHandler";

export class DonationController {
  private donationService: IDonationService;

  constructor(donationService: IDonationService) {
    this.donationService = donationService;
  }

  // Create a new donation
  async createDonation(req: NextRequest): Promise<NextResponse> {
    try {
      const donationData = await req.json();
      const donation = await this.donationService.createDonation(donationData);
      return handleResponse(donation, httpMessages.CREATED());
    } catch (error) {
      console.error("createDonationController error:", error);
      return handleError();
    }
  }

  // Get all donations or a specific donation by ID
  async getDonations(): Promise<NextResponse> {
    try {
      const donations = await this.donationService.getDonations();

      return handleResponse(donations);
    } catch (error) {
      console.error("getDonationsController error:", error);
      return handleError();
    }
  }

  // Delete a single donation by ID
  async deleteDonation(req: NextRequest): Promise<NextResponse> {
    try {
      const donationId = req.nextUrl.pathname.split("/").pop(); // Extract the donationId from the URL path

      if (!donationId) {
        return handleError(httpMessages.BAD_REQUEST("Donation ID is required"));
      }

      const isDeleted = await this.donationService.deleteDonation(donationId);
      return handleResponse(isDeleted);
    } catch (error) {
      console.error("deleteDonationController error:", error);
      return handleError();
    }
  }

  // Delete multiple donations by their IDs
  async deleteDonations(req: NextRequest): Promise<NextResponse> {
    try {
      // Extract donation IDs from query parameters
      const url = req.nextUrl;
      const donationIds = url.searchParams.get("donationIds");
      if (!donationIds) {
        return handleError(
          httpMessages.BAD_REQUEST("Donation IDs are required")
        );
      }

      // Parse donation IDs into an array
      const donationIdArray = donationIds.split(",").map((id) => id.trim());

      // Call the deleteDonations method for each ID
      console.log("donation ids", donationIdArray);
      const isDeleted = await this.donationService.deleteDonations(
        donationIdArray
      );
      return handleResponse(isDeleted);
    } catch (error) {
      console.error("deleteDonationsController error:", error);
      return handleError();
    }
  }
}
