import { ICauseService } from "@/types";
import { NextRequest, NextResponse } from "next/server";
import { handleError } from "../utils/errorHandler";
import { handleResponse } from "../utils/responseHandler";
import { httpMessages } from "../utils/HttpMessage";
import { Types } from "mongoose";
import { ICause } from "@/types";
import { ExtendedNextRequest } from "@/lib/utils/requestHelpers";

export class CauseController {
  private causeService: ICauseService;

  constructor(causeService: ICauseService) {
    this.causeService = causeService;
  }

  /**
   * @summary Create a new cause
   * @param {NextRequest} req - The request object
   * @returns {NextResponse} The response with the created cause
   */
  async createCause(req: ExtendedNextRequest): Promise<NextResponse> {
    try {
      const causeData = await req.json();
      const cause = await this.causeService.createCause(causeData);
      return handleResponse(cause, httpMessages.CREATED());
    } catch (error) {
      return handleError(undefined, req);
    }
  }

  /**
   * @summary Get all causes
   * @description Retrieves all causes from the system
   * @param {NextRequest} req - The request object
   * @returns {NextResponse} The response with the list of causes
   */
  async getCauses(): Promise<NextResponse> {
    try {
      const causes = await this.causeService.getCauses();
      return handleResponse(causes);
    } catch (error) {
      return handleError();
    }
  }

  /**
   * @summary Get all visible causes
   * @description Retrieves all causes from the system where `isVisible` is true
   * @param {NextRequest} req - The request object
   * @returns {NextResponse} The response with the list of causes
   */
  async getvisibleCauses(): Promise<NextResponse> {
    try {
      const causes = await this.causeService.getCauses(true);
      return handleResponse(causes);
    } catch (error) {
      return handleError();
    }
  }

  /**
   * @summary Get a cause by ID
   * @param {NextRequest} req - The request object
   * @returns {NextResponse} The response with the cause details
   */
  async getCauseById(req: NextRequest): Promise<NextResponse> {
    try {
      const causeId = req.nextUrl.pathname.split("/").pop();
      if (!causeId || !Types.ObjectId.isValid(causeId)) {
        return handleError(
          httpMessages.BAD_REQUEST("Cause ID is either missing or invalid")
        );
      }

      // Fetch the cause using the causeId
      const cause = await this.causeService.getCauseById(
        new Types.ObjectId(causeId)
      );
      return handleResponse(cause);
    } catch (error) {
      return handleError();
    }
  }

  /**
   * @summary Get all causes directly in props
   * @description Retrieves all causes from the system
   * @param {NextRequest} req - The request object
   * @returns {ICause[] | unknown} The list of causes
   */
  async getCausesForProps(): Promise<ICause[] | unknown> {
    try {
      const causes = await this.causeService.getCauses();
      return { data: causes };
    } catch (error) {
      return { error: error as Error };
    }
  }

  /**
   * @summary Get a cause by ID directly for props
   * @param {string} causeId - The cause ID
   * @returns {ICause | unknown} The cause details
   */
  async getCauseByIdForProps(causeId: string): Promise<ICause | unknown> {
    try {
      if (!causeId || !Types.ObjectId.isValid(causeId)) {
        throw new Error("Cause ID is either missing or invalid");
      }

      // Fetch the cause using the causeId
      const cause = await this.causeService.getCauseById(
        new Types.ObjectId(causeId)
      );
      return { data: cause };
    } catch (error) {
      return { error: error };
    }
  }

  /**
   * @summary Update a cause by ID
   * @param {NextRequest} req - The request object
   * @returns {NextResponse} The response with the updated cause
   */
  async updateCause(
    req: ExtendedNextRequest | NextRequest
  ): Promise<NextResponse> {
    try {
      const causeId = req.nextUrl.pathname.split("/").pop();
      if (!causeId || !Types.ObjectId.isValid(causeId)) {
        return handleError(
          httpMessages.BAD_REQUEST("Cause ID is either missing or invalid")
        );
      }

      const causeData = await req.json();
      const updatedCause = await this.causeService.updateCause(
        new Types.ObjectId(causeId),
        causeData
      );
      return handleResponse(updatedCause);
    } catch (error) {
      return req instanceof ExtendedNextRequest
        ? handleError(undefined, req)
        : handleError();
    }
  }

  /**
   * @summary Delete a cause by ID
   * @param {NextRequest} req - The request object
   * @returns {NextResponse} The response indicating whether the cause was deleted successfully
   */
  async deleteCause(req: NextRequest): Promise<NextResponse> {
    try {
      const causeId = req.nextUrl.pathname.split("/").pop();
      if (!causeId || !Types.ObjectId.isValid(causeId)) {
        return handleError(
          httpMessages.BAD_REQUEST("Cause ID is either missing or invalid")
        );
      }

      const deletedCause = await this.causeService.deleteCause(
        new Types.ObjectId(causeId)
      );
      return handleResponse(deletedCause);
    } catch (error) {
      return handleError();
    }
  }

  /**
   * @summary Delete multiple causes by their IDs
   * @param {NextRequest} req - The request object
   * @returns {NextResponse} The response indicating the result of the bulk delete
   */
  async deleteCauses(req: NextRequest): Promise<NextResponse> {
    try {
      const url = req.nextUrl;
      const causeIds = url.searchParams.get("causeIds");
      if (!causeIds) {
        return handleError(httpMessages.BAD_REQUEST("Cause IDs are required"));
      }

      const causeIdArray = causeIds.split(",").map((id) => id.trim());

      for (const id of causeIdArray) {
        if (!Types.ObjectId.isValid(id)) {
          return handleError(
            httpMessages.BAD_REQUEST(`Invalid Cause ID: ${id}`)
          );
        }
      }

      const objectIds = causeIdArray.map((id) => new Types.ObjectId(id));

      const isDeleted = await this.causeService.deleteCauses(objectIds);
      return handleResponse(isDeleted);
    } catch (error) {
      console.error("deleteCausesController error:", error);
      return handleError();
    }
  }
}
