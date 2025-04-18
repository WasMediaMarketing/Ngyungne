import type { IScriptureService } from "@/types/scripture.types";
import type { NextRequest, NextResponse } from "next/server";
import { handleError } from "../utils/errorHandler";
import { handleResponse } from "../utils/responseHandler";
import { httpMessages } from "../utils/HttpMessage";
import { Types } from "mongoose";
import { ExtendedNextRequest } from "@/lib/utils/requestHelpers";

export class ScriptureController {
  private scriptureService: IScriptureService;
  constructor(scriptureService: IScriptureService) {
    this.scriptureService = scriptureService;
  }

  /**
   * @summary Create a new scripture
   * @param {NextRequest} req - The request object
   * @returns {NextResponse} The response with the created scripture
   */
  async createScripture(req: ExtendedNextRequest): Promise<NextResponse> {
    try {
      const scriptureData = await req.json();
      const scripture = await this.scriptureService.createScripture(
        scriptureData
      );
      return handleResponse(scripture, httpMessages.CREATED());
    } catch (error) {
      console.log("createScriptureController error", error);
      return handleError(undefined, req);
    }
  }

  /**
   * @summary Get all scriptures
   * @description Retrieves all scriptures from the system
   * @returns {NextResponse} The response with the list of scriptures
   */
  async getScriptures(): Promise<NextResponse> {
    try {
      const scriptures = await this.scriptureService.getScriptures();
      console.log("result of scripture controller get", scriptures);
      return handleResponse(scriptures);
    } catch (error) {
      console.log("getScripturesController error", error);
      return handleError();
    }
  }

  /**
   * @summary Get all published scriptures
   * @description Retrieves all published scriptures from the system
   * @returns {NextResponse} The response with the list of published scriptures
   */
  async getPublishedScriptures(): Promise<NextResponse> {
    try {
      const scriptures = await this.scriptureService.getScriptures(true);
      console.log("result of scripture service get", scriptures); // Assuming true means published
      return handleResponse(scriptures);
    } catch (error) {
      console.log("getPublishedScripturesController error", error);
      return handleError();
    }
  }

  /**
   * @summary Get a scripture by ID
   * @param {NextRequest} req - The request object
   * @returns {NextResponse} The response with the scripture details
   */
  async getScriptureById(req: NextRequest): Promise<NextResponse> {
    try {
      const scriptureId = req.nextUrl.pathname.split("/").pop();
      if (!scriptureId || !Types.ObjectId.isValid(scriptureId)) {
        return handleError(
          httpMessages.BAD_REQUEST("Scripture ID is either missing or invalid")
        );
      }

      // Fetch the scripture using the scriptureId
      const scripture = await this.scriptureService.getScriptureById(
        new Types.ObjectId(scriptureId)
      );
      return handleResponse(scripture);
    } catch (error) {
      console.log("getScriptureByIdController error", error);
      return handleError();
    }
  }

  /**
   * @summary Update a scripture by ID
   * @param {NextRequest} req - The request object
   * @returns {NextResponse} The response with the updated scripture
   */
  async updateScripture(
    req: ExtendedNextRequest | NextRequest
  ): Promise<NextResponse> {
    try {
      const scriptureId = req.nextUrl.pathname.split("/").pop();
      if (!scriptureId || !Types.ObjectId.isValid(scriptureId)) {
        return handleError(
          httpMessages.BAD_REQUEST("Scripture ID is either missing or invalid")
        );
      }

      const scriptureData = await req.json();
      const updatedScripture = await this.scriptureService.updateScripture(
        new Types.ObjectId(scriptureId),
        scriptureData
      );
      return handleResponse(updatedScripture);
    } catch (error) {
      console.log("updateScriptureController error", error);
      return req instanceof ExtendedNextRequest
        ? handleError(undefined, req)
        : handleError();
    }
  }

  /**
   * @summary Delete a scripture by ID
   * @param {NextRequest} req - The request object
   * @returns {NextResponse} The response indicating whether the scripture was deleted successfully
   */
  async deleteScripture(req: NextRequest): Promise<NextResponse> {
    try {
      const scriptureId = req.nextUrl.pathname.split("/").pop();
      if (!scriptureId || !Types.ObjectId.isValid(scriptureId)) {
        return handleError(
          httpMessages.BAD_REQUEST("Scripture ID is either missing or invalid")
        );
      }

      const deletedScripture = await this.scriptureService.deleteScripture(
        new Types.ObjectId(scriptureId)
      );
      return handleResponse(deletedScripture);
    } catch (error) {
      console.log("deleteScriptureController error", error);
      return handleError();
    }
  }

  /**
   * @summary Delete multiple scriptures by their IDs
   * @param {NextRequest} req - The request object
   * @returns {NextResponse} The response indicating the result of the bulk delete
   */
  async deleteScriptures(req: NextRequest): Promise<NextResponse> {
    try {
      const url = req.nextUrl;
      const scriptureIds = url.searchParams.get("scriptureIds");
      if (!scriptureIds) {
        return handleError(
          httpMessages.BAD_REQUEST("Scripture IDs are required")
        );
      }

      const scriptureIdArray = scriptureIds.split(",").map((id) => id.trim());

      for (const id of scriptureIdArray) {
        if (!Types.ObjectId.isValid(id)) {
          return handleError(
            httpMessages.BAD_REQUEST(`Invalid Scripture ID: ${id}`)
          );
        }
      }

      const objectIds = scriptureIdArray.map((id) => new Types.ObjectId(id));

      console.log("Scripture IDs (ObjectId format):", objectIds);
      const isDeleted = await this.scriptureService.deleteScriptures(objectIds);
      return handleResponse(isDeleted);
    } catch (error) {
      console.error("deleteScripturesController error:", error);
      return handleError();
    }
  }
}
