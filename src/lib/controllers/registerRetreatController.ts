import { NextRequest, NextResponse } from "next/server";
import { IRegisterRetreatService } from "@/types";
import { httpMessages } from "@/lib/utils/HttpMessage";
import { handleError } from "@/lib/utils/errorHandler";
import { handleResponse } from "@/lib/utils/responseHandler";
import { Types } from "mongoose";

export class RegisterRetreatController {
  private registerRetreatService: IRegisterRetreatService;

  constructor(registerRetreatService: IRegisterRetreatService) {
    this.registerRetreatService = registerRetreatService;
  }

  async createRegisterRetreat(req: NextRequest): Promise<NextResponse> {
    try {
      const registerRetreatData = await req.json();
      const registerRetreat =
        await this.registerRetreatService.createRegisterRetreat(
          registerRetreatData
        );
      return handleResponse(registerRetreat, httpMessages.CREATED());
    } catch (error) {
      console.error("createRegisterRetreatController error:", error);
      return handleError();
    }
  }

  async getRegisterRetreats(): Promise<NextResponse> {
    try {
      const registerRetreats =
        await this.registerRetreatService.getRegisterRetreats();
      return handleResponse(registerRetreats);
    } catch (error) {
      console.error("getRegisterRetreatsController error:", error);
      return handleError();
    }
  }

  async getRegisterRetreatById(req: NextRequest): Promise<NextResponse> {
    try {
      const registerRetreatId = req.nextUrl.pathname.split("/").pop();

      if (!registerRetreatId) {
        return handleError(
          httpMessages.BAD_REQUEST("RegisterRetreat ID is required")
        );
      }

      const registerRetreat =
        await this.registerRetreatService.getRegisterRetreats(
          registerRetreatId
        );
      return handleResponse(registerRetreat);
    } catch (error) {
      console.error("getRegisterRetreatByIdController error:", error);
      return handleError();
    }
  }

  async updateRegisterRetreat(req: NextRequest): Promise<NextResponse> {
    try {
      const registerRetreatId = req.nextUrl.pathname.split("/").pop();

      if (!registerRetreatId) {
        return handleError(
          httpMessages.BAD_REQUEST("RegisterRetreat ID is required")
        );
      }

      const registerRetreatData = await req.json();
      const updatedRegisterRetreat =
        await this.registerRetreatService.updateRegisterRetreat(
          registerRetreatId,
          registerRetreatData
        );
      return handleResponse(updatedRegisterRetreat);
    } catch (error) {
      console.error("updateRegisterRetreatController error:", error);
      return handleError();
    }
  }

  // Delete a single registerRetreat by ID
  async deleteRegisterRetreat(req: NextRequest): Promise<NextResponse> {
    try {
      const registerRetreatId = req.nextUrl.pathname.split("/").pop();

      if (!registerRetreatId) {
        return handleError(
          httpMessages.BAD_REQUEST("RegisterRetreat ID is required")
        );
      }

      const isDeleted = await this.registerRetreatService.deleteRegisterRetreat(
        registerRetreatId
      );
      return handleResponse(isDeleted);
    } catch (error) {
      console.error("deleteRegisterRetreatController error:", error);
      return handleError();
    }
  }

  // Delete multiple registerRetreats by their IDs
  async deleteRegisterRetreats(req: NextRequest): Promise<NextResponse> {
    try {
      const url = req.nextUrl;
      const registerRetreatIds = url.searchParams.get("registerRetreatIds");

      if (!registerRetreatIds) {
        return handleError(
          httpMessages.BAD_REQUEST("RegisterRetreat IDs are required")
        );
      }

      const registerRetreatIdArray = registerRetreatIds
        .split(",")
        .map((id) => id.trim());

      for (const id of registerRetreatIdArray) {
        if (!Types.ObjectId.isValid(id)) {
          return handleError(
            httpMessages.BAD_REQUEST(`Invalid Retreat ID: ${id}`)
          );
        }
      }

      const isDeleted =
        await this.registerRetreatService.deleteRegisterRetreats(
          registerRetreatIdArray
        );
      return handleResponse(isDeleted);
    } catch (error) {
      console.error("deleteRegisterRetreatsController error:", error);
      return handleError();
    }
  }
}
