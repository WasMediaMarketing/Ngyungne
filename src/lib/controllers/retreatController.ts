import { IRetreatService } from "@/types";
import { NextRequest, NextResponse } from "next/server";
import { handleError } from "../utils/errorHandler";
import { handleResponse } from "../utils/responseHandler";
import { httpMessages } from "../utils/HttpMessage";
import { Types } from "mongoose";

export class RetreatController {
  private retreatService: IRetreatService;

  constructor(retreatService: IRetreatService) {
    this.retreatService = retreatService;
  }

  /**
   * @summary Create a new retreat
   * @param {NextRequest} req - The request object
   * @returns {NextResponse} The response with the created retreat
   */
  async createRetreat(req: NextRequest): Promise<NextResponse> {
    try {
      const retreatData = await req.json();
      const retreat = await this.retreatService.createRetreat(retreatData);
      return handleResponse(retreat, httpMessages.CREATED());
    } catch (error) {
      console.log("createRetreatController error", error);
      return handleError();
    }
  }

  /**
   * @summary Get all retreats
   * @description Retrieves all retreats from the system
   * @param {NextRequest} req - The request object
   * @returns {NextResponse} The response with the list of retreats
   */
  async getRetreats(): Promise<NextResponse> {
    try {
      const retreats = await this.retreatService.getRetreats();
      return handleResponse(retreats);
    } catch (error) {
      console.log("getRetreatsController error", error);
      return handleError();
    }
  }

  /**
   * @summary Get all published retreats
   * @description Retrieves all retreats from the system
   * @param {NextRequest} req - The request object
   * @returns {NextResponse} The response with the list of published retreats
   */
  async getPublishedRetreats(): Promise<NextResponse> {
    try {
      const retreats = await this.retreatService.getRetreats(true);
      return handleResponse(retreats);
    } catch (error) {
      console.log("getPublishedRetreatsController error", error);
      return handleError();
    }
  }

  /**
   * @summary Get a retreat by ID
   * @param {NextRequest} req - The request object
   * @returns {NextResponse} The response with the retreat details
   */
  async getRetreatById(req: NextRequest): Promise<NextResponse> {
    try {
      const retreatId = req.nextUrl.pathname.split("/").pop();
      if (!retreatId || !Types.ObjectId.isValid(retreatId)) {
        return handleError(
          httpMessages.BAD_REQUEST("Retreat ID is either missing or invalid")
        );
      }

      // Fetch the retreat using the retreatId
      const retreat = await this.retreatService.getRetreatById(
        new Types.ObjectId(retreatId)
      );
      return handleResponse(retreat);
    } catch (error) {
      console.log("getRetreatByIdController error", error);
      return handleError();
    }
  }

  /**
   * @summary Update a retreat by ID
   * @param {NextRequest} req - The request object
   * @returns {NextResponse} The response with the updated retreat
   */
  async updateRetreat(req: NextRequest): Promise<NextResponse> {
    try {
      const retreatId = req.nextUrl.pathname.split("/").pop();
      if (!retreatId || !Types.ObjectId.isValid(retreatId)) {
        return handleError(
          httpMessages.BAD_REQUEST("Retreat ID is either missing or invalid")
        );
      }

      const retreatData = await req.json();
      const updatedRetreat = await this.retreatService.updateRetreat(
        new Types.ObjectId(retreatId),
        retreatData
      );
      return handleResponse(updatedRetreat);
    } catch (error) {
      console.log("updateRetreatController error", error);
      return handleError();
    }
  }

  /**
   * @summary Delete a retreat by ID
   * @param {NextRequest} req - The request object
   * @returns {NextResponse} The response indicating whether the retreat was deleted successfully
   */
  async deleteRetreat(req: NextRequest): Promise<NextResponse> {
    try {
      const retreatId = req.nextUrl.pathname.split("/").pop();
      if (!retreatId || !Types.ObjectId.isValid(retreatId)) {
        return handleError(
          httpMessages.BAD_REQUEST("Retreat ID is either missing or invalid")
        );
      }

      const deletedRetreat = await this.retreatService.deleteRetreat(
        new Types.ObjectId(retreatId)
      );
      return handleResponse(deletedRetreat);
    } catch (error) {
      console.log("deleteRetreatController error", error);
      return handleError();
    }
  }

  /**
   * @summary Delete multiple retreats by their IDs
   * @param {NextRequest} req - The request object
   * @returns {NextResponse} The response indicating the result of the bulk delete
   */
  async deleteRetreats(req: NextRequest): Promise<NextResponse> {
    try {
      const url = req.nextUrl;
      const retreatIds = url.searchParams.get("retreatIds");
      if (!retreatIds) {
        return handleError(
          httpMessages.BAD_REQUEST("Retreat IDs are required")
        );
      }

      const retreatIdArray = retreatIds.split(",").map((id) => id.trim());

      for (const id of retreatIdArray) {
        if (!Types.ObjectId.isValid(id)) {
          return handleError(
            httpMessages.BAD_REQUEST(`Invalid Retreat ID: ${id}`)
          );
        }
      }

      const objectIds = retreatIdArray.map((id) => new Types.ObjectId(id));

      console.log("Retreat IDs (ObjectId format):", objectIds);
      const isDeleted = await this.retreatService.deleteRetreats(objectIds);
      return handleResponse(isDeleted);
    } catch (error) {
      console.error("deleteRetreatsController error:", error);
      return handleError();
    }
  }
}
