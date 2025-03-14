import { NextRequest, NextResponse } from "next/server";
import { IVolunteerService } from "@/types";
import { httpMessages } from "@/lib/utils/HttpMessage";
import { handleError } from "@/lib/utils/errorHandler";
import { handleResponse } from "@/lib/utils/responseHandler";
import { Types } from "mongoose";
import { ExtendedNextRequest } from "@/lib/utils/requestHelpers";

export class VolunteerController {
  private volunteerService: IVolunteerService;

  constructor(volunteerService: IVolunteerService) {
    this.volunteerService = volunteerService;
  }

  async createVolunteer(req: ExtendedNextRequest): Promise<NextResponse> {
    try {
      const volunteerData = await req.json();
      const volunteer = await this.volunteerService.createVolunteer(
        volunteerData
      );
      return handleResponse(volunteer, httpMessages.CREATED());
    } catch (error) {
      console.error("createVolunteerController error:", error);
      return handleError(undefined, req);
    }
  }

  async getVolunteers(): Promise<NextResponse> {
    try {
      const volunteers = await this.volunteerService.getVolunteers();
      return handleResponse(volunteers);
    } catch (error) {
      console.error("getVolunteersController error:", error);
      return handleError();
    }
  }

  async getVolunteersToDisplay(): Promise<NextResponse> {
    try {
      const volunteers = await this.volunteerService.getVolunteers(true);
      return handleResponse(volunteers);
    } catch (error) {
      console.error("getVolunteersController error:", error);
      return handleError();
    }
  }

  async deleteVolunteer(req: NextRequest): Promise<NextResponse> {
    try {
      const volunteerId = req.nextUrl.pathname.split("/").pop(); 
      if (!volunteerId || !Types.ObjectId.isValid(volunteerId)) {
        return handleError(
          httpMessages.BAD_REQUEST("Event ID is either missing or invalid")
        );
      }

      const isDeleted = await this.volunteerService.deleteVolunteer(
        volunteerId
      );
      return handleResponse(isDeleted);
    } catch (error) {
      console.error("deleteVolunteerController error:", error);
      return handleError();
    }
  }

  async deleteVolunteers(req: NextRequest): Promise<NextResponse> {
    try {
      const url = req.nextUrl;
      const volunteerIds = url.searchParams.get("volunteerIds");
      if (!volunteerIds) {
        return handleError(
          httpMessages.BAD_REQUEST("Volunteer IDs are required")
        );
      }

      const volunteerIdArray = volunteerIds.split(",").map((id) => id.trim());
      for (const id of volunteerIdArray) {
        if (!Types.ObjectId.isValid(id)) {
          return handleError(
            httpMessages.BAD_REQUEST(`Invalid Volunteer ID: ${id}`)
          );
        }
      }

      const isDeleted = await this.volunteerService.deleteVolunteers(
        volunteerIdArray
      );
      return handleResponse(isDeleted);
    } catch (error) {
      console.error("deleteVolunteersController error:", error);
      return handleError();
    }
  }
}
