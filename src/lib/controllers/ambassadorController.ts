import { IAmbassadorService } from "@/types/ambassadorService.interface";
import { NextRequest, NextResponse } from "next/server";
import { handleError } from "../utils/errorHandler";
import { handleResponse } from "../utils/responseHandler";
import { httpMessages } from "../utils/HttpMessage";
import { Types } from "mongoose";
import { Ambassador } from "@/types/ambassador.types";
import { ExtendedNextRequest } from "@/lib/utils/requestHelpers";
import { deleteFile } from "@/lib/utils/deleteFile";

export class AmbassadorController {
  private ambassadorService: IAmbassadorService;

  constructor(ambassadorService: IAmbassadorService) {
    this.ambassadorService = ambassadorService;
  }

  /**
   * @summary Get all ambassadors
   * @description Retrieves all ambassadors from the system (both visible and hidden)
   * @returns {NextResponse} The response with the list of ambassadors
   */
  async getAmbassadors(): Promise<NextResponse> {
    try {
      const ambassadors = await this.ambassadorService.getAmbassadors(true);
      return handleResponse(ambassadors);
    } catch (error) {
      console.log("getAmbassadorsController error", error);
      return handleError();
    }
  }

  /**
   * @summary Get all visible ambassadors
   * @description Retrieves only visible ambassadors from the system
   * @returns {NextResponse} The response with the list of visible ambassadors
   */
  async getAmbassadorsToDisplay(): Promise<NextResponse> {
    try {
      const ambassadors = await this.ambassadorService.getAmbassadors(false);
      return handleResponse(ambassadors);
    } catch (error) {
      console.log("getAmbassadorsToDisplayController error", error);
      return handleError();
    }
  }

  /**
   * @summary Create a new ambassador
   * @param {ExtendedNextRequest} req - The request object with uploaded files
   * @returns {NextResponse} The response with the created ambassador
   */
  async createAmbassador(req: ExtendedNextRequest): Promise<NextResponse> {
    try {
      let data = await req.json();

      // Handle file uploads if present
      if (req.uploadedFiles && req.uploadedFiles.image) {
        data.image = req.uploadedFiles.image;
      }

      // Set default visibility if not specified
      if (data.isVisible === undefined) {
        data.isVisible = false;
      }

      const ambassador = await this.ambassadorService.createAmbassador(data);
      return handleResponse(ambassador, httpMessages.CREATED());
    } catch (error) {
      console.log("createAmbassadorController error", error);

      // Clean up uploaded files on error
      if (req.uploadedFiles) {
        for (const [field, url] of Object.entries(req.uploadedFiles)) {
          if (typeof url === "string") {
            deleteFile(url);
          } else if (Array.isArray(url)) {
            url.forEach((fileUrl) => deleteFile(fileUrl));
          }
        }
      }

      return handleError(undefined, req);
    }
  }

  /**
   * @summary Update an ambassador by ID
   * @param {ExtendedNextRequest} req - The request object
   * @returns {NextResponse} The response with the updated ambassador
   */
  async updateAmbassador(req: ExtendedNextRequest): Promise<NextResponse> {
    try {
      const ambassadorId = req.nextUrl.pathname.split("/").pop();
      if (!ambassadorId || !Types.ObjectId.isValid(ambassadorId)) {
        return handleError(
          httpMessages.BAD_REQUEST("Ambassador ID is either missing or invalid")
        );
      }

      let data = await req.json();

      // Handle file uploads if present
      if (req.uploadedFiles && req.uploadedFiles.image) {
        data.image = req.uploadedFiles.image;
      }

      const updatedAmbassador = await this.ambassadorService.updateAmbassador(
        ambassadorId,
        data
      );

      if (!updatedAmbassador) {
        return handleError(httpMessages.NOT_FOUND("Ambassador not found"));
      }

      return handleResponse(updatedAmbassador);
    } catch (error) {
      console.log("updateAmbassadorController error", error);
      return handleError(undefined, req);
    }
  }

  /**
   * @summary Update an ambassador's visibility
   * @param {ExtendedNextRequest} req - The request object
   * @returns {NextResponse} The response with the updated ambassador
   */
  async updateAmbassadorVisibility(
    req: ExtendedNextRequest
  ): Promise<NextResponse> {
    try {
      const ambassadorId = req.nextUrl.pathname.split("/").pop();
      if (!ambassadorId || !Types.ObjectId.isValid(ambassadorId)) {
        return handleError(
          httpMessages.BAD_REQUEST("Ambassador ID is either missing or invalid")
        );
      }

      const data = await req.json();
      if (data.isVisible === undefined) {
        return handleError(
          httpMessages.BAD_REQUEST("isVisible property is required")
        );
      }

      const updatedAmbassador =
        await this.ambassadorService.updateAmbassadorVisibility(ambassadorId, {
          isVisible: Boolean(data.isVisible),
        });

      if (!updatedAmbassador) {
        return handleError(httpMessages.NOT_FOUND("Ambassador not found"));
      }

      return handleResponse(updatedAmbassador);
    } catch (error) {
      console.log("updateAmbassadorVisibilityController error", error);
      return handleError(undefined, req);
    }
  }

  /**
   * @summary Delete an ambassador by ID
   * @param {NextRequest} req - The request object
   * @returns {NextResponse} The response indicating whether the ambassador was deleted successfully
   */
  async deleteAmbassador(req: NextRequest): Promise<NextResponse> {
    try {
      const ambassadorId = req.nextUrl.pathname.split("/").pop();
      if (!ambassadorId || !Types.ObjectId.isValid(ambassadorId)) {
        return handleError(
          httpMessages.BAD_REQUEST("Ambassador ID is either missing or invalid")
        );
      }

      // Get ambassador to retrieve image before deletion
      const ambassador = await this.ambassadorService.getAmbassadorById(
        ambassadorId
      );
      if (!ambassador) {
        return handleError(httpMessages.NOT_FOUND("Ambassador not found"));
      }

      const isDeleted = await this.ambassadorService.deleteAmbassador(
        ambassadorId
      );
      if (!isDeleted) {
        return handleError(httpMessages.INTERNAL_SERVER_ERROR);
      }

      // Delete the associated image if it exists
      if (ambassador.image) {
        deleteFile(ambassador.image);
      }

      return handleResponse({ message: "Ambassador deleted successfully" });
    } catch (error) {
      console.log("deleteAmbassadorController error", error);
      return handleError();
    }
  }

  /**
   * @summary Delete multiple ambassadors by their IDs
   * @param {NextRequest} req - The request object
   * @returns {NextResponse} The response indicating the result of the bulk delete
   */
  async deleteAmbassadors(req: NextRequest): Promise<NextResponse> {
    try {
      const url = req.nextUrl;
      const ambassadorIds = url.searchParams.get("ambassadorIds");
      if (!ambassadorIds) {
        return handleError(
          httpMessages.BAD_REQUEST("Ambassador IDs are required")
        );
      }

      const idArray = ambassadorIds.split(",").map((id) => id.trim());

      for (const id of idArray) {
        if (!Types.ObjectId.isValid(id)) {
          return handleError(
            httpMessages.BAD_REQUEST(`Invalid Ambassador ID: ${id}`)
          );
        }
      }

      // Get ambassadors to retrieve images before deletion
      const ambassadors = [];
      for (const id of idArray) {
        const ambassador = await this.ambassadorService.getAmbassadorById(id);
        if (ambassador) {
          ambassadors.push(ambassador);
        }
      }

      const deletedCount = await this.ambassadorService.deleteAmbassadors(
        idArray
      );
      if (deletedCount === 0) {
        return handleError(
          httpMessages.NOT_FOUND("No ambassadors found for the given IDs")
        );
      }

      // Delete associated images
      for (const ambassador of ambassadors) {
        if (ambassador.image) {
          deleteFile(ambassador.image);
        }
      }

      return handleResponse({
        message: `Successfully deleted ${deletedCount} ambassador${
          deletedCount > 1 ? "s" : ""
        }`,
        deletedCount,
      });
    } catch (error) {
      console.error("deleteAmbassadorsController error:", error);
      return handleError();
    }
  }

  /**
   * @summary Get an ambassador by ID
   * @param {NextRequest} req - The request object
   * @returns {NextResponse} The response with the ambassador details
   */
  async getAmbassadorById(req: NextRequest): Promise<NextResponse> {
    try {
      const ambassadorId = req.nextUrl.pathname.split("/").pop();
      if (!ambassadorId || !Types.ObjectId.isValid(ambassadorId)) {
        return handleError(
          httpMessages.BAD_REQUEST("Ambassador ID is either missing or invalid")
        );
      }

      const ambassador = await this.ambassadorService.getAmbassadorById(
        ambassadorId
      );
      if (!ambassador) {
        return handleError(httpMessages.NOT_FOUND("Ambassador not found"));
      }

      return handleResponse(ambassador);
    } catch (error) {
      console.log("getAmbassadorByIdController error", error);
      return handleError();
    }
  }

  /**
   * @summary Get all ambassadors directly for props
   * @returns {IAmbassador[] | unknown} The list of ambassadors or error
   */
  async getAmbassadorsForProps(): Promise<Ambassador[] | unknown> {
    try {
      const ambassadors = await this.ambassadorService.getAmbassadors(true);
      return { data: ambassadors };
    } catch (error) {
      console.log("getAmbassadorsForProps error", error);
      return { error: error as Error };
    }
  }

  /**
   * @summary Get an ambassador by ID directly for props
   * @param {string} ambassadorId - The ambassador ID
   * @returns {IAmbassador | unknown} The ambassador or error
   */
  async getAmbassadorByIdForProps(
    ambassadorId: string
  ): Promise<Ambassador | unknown> {
    try {
      if (!ambassadorId || !Types.ObjectId.isValid(ambassadorId)) {
        throw new Error("Ambassador ID is either missing or invalid");
      }

      const ambassador = await this.ambassadorService.getAmbassadorById(
        ambassadorId
      );
      return { data: ambassador };
    } catch (error) {
      console.log("getAmbassadorByIdForProps error", error);
      return { error: error };
    }
  }
}
