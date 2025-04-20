import type { IMeditationService } from "@/types/meditation.types";
import type { NextRequest, NextResponse } from "next/server";
import { handleError } from "../utils/errorHandler";
import { handleResponse } from "../utils/responseHandler";
import { httpMessages } from "../utils/HttpMessage";
import { Types } from "mongoose";
import { ExtendedNextRequest } from "@/lib/utils/requestHelpers";

export class MeditationController {
  private meditationService: IMeditationService;

  constructor(meditationService: IMeditationService) {
    this.meditationService = meditationService;
  }

  /**
   * @summary Create a new meditation
   * @param {NextRequest} req - The request object
   * @returns {NextResponse} The response with the created meditation
   */
  async createMeditation(req: ExtendedNextRequest): Promise<NextResponse> {
    try {
      const meditationData = await req.json();
      const meditation = await this.meditationService.createMeditation(
        meditationData
      );
      return handleResponse(meditation, httpMessages.CREATED());
    } catch (error) {
      console.log("createMeditationController error", error);
      return handleError(undefined, req);
    }
  }

  /**
   * @summary Get all meditations
   * @description Retrieves all meditations from the system
   * @returns {NextResponse} The response with the list of meditations
   */
  async getMeditations(): Promise<NextResponse> {
    try {
      const meditations = await this.meditationService.getMeditations();
      return handleResponse(meditations);
    } catch (error) {
      console.log("getMeditationsController error", error);
      return handleError();
    }
  }

  /**
   * @summary Get all published meditations
   * @description Retrieves all published meditations from the system
   * @returns {NextResponse} The response with the list of published meditations
   */
  async getPublishedMeditations(): Promise<NextResponse> {
    try {
      const meditations = await this.meditationService.getMeditations(true);
      return handleResponse(meditations);
    } catch (error) {
      console.log("getPublishedMeditationsController error", error);
      return handleError();
    }
  }

  /**
   * @summary Get a meditation by ID
   * @param {NextRequest} req - The request object
   * @returns {NextResponse} The response with the meditation details
   */
  async getMeditationById(req: NextRequest): Promise<NextResponse> {
    try {
      const meditationId = req.nextUrl.pathname.split("/").pop();
      if (!meditationId || !Types.ObjectId.isValid(meditationId)) {
        return handleError(
          httpMessages.BAD_REQUEST("Meditation ID is either missing or invalid")
        );
      }

      const meditation = await this.meditationService.getMeditationById(
        new Types.ObjectId(meditationId)
      );
      return handleResponse(meditation);
    } catch (error) {
      console.log("getMeditationByIdController error", error);
      return handleError();
    }
  }

  /**
   * @summary Update a meditation by ID
   * @param {NextRequest} req - The request object
   * @returns {NextResponse} The response with the updated meditation
   */
  async updateMeditation(
    req: ExtendedNextRequest | NextRequest
  ): Promise<NextResponse> {
    try {
      const meditationId = req.nextUrl.pathname.split("/").pop();
      if (!meditationId || !Types.ObjectId.isValid(meditationId)) {
        return handleError(
          httpMessages.BAD_REQUEST("Meditation ID is either missing or invalid")
        );
      }

      const meditationData = await req.json();
      const updatedMeditation = await this.meditationService.updateMeditation(
        new Types.ObjectId(meditationId),
        meditationData
      );
      return handleResponse(updatedMeditation);
    } catch (error) {
      console.log("updateMeditationController error", error);
      return req instanceof ExtendedNextRequest
        ? handleError(undefined, req)
        : handleError();
    }
  }

  /**
   * @summary Increment views for a meditation
   * @param {NextRequest} req - The request object
   * @returns {NextResponse} The response with the updated meditation
   */
  async incrementViews(req: NextRequest): Promise<NextResponse> {
    try {
      const segments = req.url.split("/");
      const meditationId = segments[segments.length - 2]; // Get ID from /api/meditation/{id}/views

      if (!meditationId || !Types.ObjectId.isValid(meditationId)) {
        return handleError(
          httpMessages.BAD_REQUEST("Meditation ID is either missing or invalid")
        );
      }

      const updatedMeditation = await this.meditationService.incrementViews(
        new Types.ObjectId(meditationId)
      );
      return handleResponse(updatedMeditation);
    } catch (error) {
      console.log("incrementViewsController error", error);
      return handleError();
    }
  }

  /**
   * @summary Delete a meditation by ID
   * @param {NextRequest} req - The request object
   * @returns {NextResponse} The response indicating whether the meditation was deleted successfully
   */
  async deleteMeditation(req: NextRequest): Promise<NextResponse> {
    try {
      const meditationId = req.nextUrl.pathname.split("/").pop();
      if (!meditationId || !Types.ObjectId.isValid(meditationId)) {
        return handleError(
          httpMessages.BAD_REQUEST("Meditation ID is either missing or invalid")
        );
      }

      const deletedMeditation = await this.meditationService.deleteMeditation(
        new Types.ObjectId(meditationId)
      );
      return handleResponse(deletedMeditation);
    } catch (error) {
      console.log("deleteMeditationController error", error);
      return handleError();
    }
  }

  /**
   * @summary Delete multiple meditations by their IDs
   * @param {NextRequest} req - The request object
   * @returns {NextResponse} The response indicating the result of the bulk delete
   */
  async deleteMeditations(req: NextRequest): Promise<NextResponse> {
    try {
      const url = req.nextUrl;
      const meditationIds = url.searchParams.get("meditationIds");
      if (!meditationIds) {
        return handleError(
          httpMessages.BAD_REQUEST("Meditation IDs are required")
        );
      }

      const meditationIdArray = meditationIds.split(",").map((id) => id.trim());

      for (const id of meditationIdArray) {
        if (!Types.ObjectId.isValid(id)) {
          return handleError(
            httpMessages.BAD_REQUEST(`Invalid Meditation ID: ${id}`)
          );
        }
      }

      const objectIds = meditationIdArray.map((id) => new Types.ObjectId(id));

      console.log("Meditation IDs (ObjectId format):", objectIds);
      const isDeleted = await this.meditationService.deleteMeditations(
        objectIds
      );
      return handleResponse(isDeleted);
    } catch (error) {
      console.error("deleteMeditationsController error:", error);
      return handleError();
    }
  }
}
