import type { NextRequest, NextResponse } from "next/server";
import type { IGalleryService } from "@/types/gallery";
import { handleError } from "../utils/errorHandler";
import { handleResponse } from "../utils/responseHandler";
import { httpMessages } from "../utils/HttpMessage";
import { Types } from "mongoose";

/**
 * Controller for handling Gallery-related HTTP requests
 */
export class GalleryController {
  private galleryService: IGalleryService;

  /**
   * Creates a new Gallery controller
   * @param {IGalleryService} galleryService - The Gallery service to use
   */
  constructor(galleryService: IGalleryService) {
    this.galleryService = galleryService;
  }

  /**
   * Creates a new gallery item
   * @param {any} body - The parsed request body
   * @returns {Promise<NextResponse>} The HTTP response
   */
  async createGalleryItem(body: any): Promise<NextResponse> {
    try {
      const galleryItem = await this.galleryService.createGalleryItem(body);
      return handleResponse(galleryItem, httpMessages.CREATED());
    } catch (error) {
      console.error("createGalleryItemController error:", error);
      return handleError();
    }
  }

  /**
   * Gets all gallery items
   * @returns {Promise<NextResponse>} The HTTP response with all gallery items
   */
  async getGalleryItems(): Promise<NextResponse> {
    try {
      const galleryItems = await this.galleryService.getGalleryItems();
      return handleResponse(galleryItems);
    } catch (error) {
      console.error("getGalleryItemsController error:", error);
      return handleError();
    }
  }

  /**
   * Gets all visible gallery items
   * @returns {Promise<NextResponse>} The HTTP response with visible gallery items
   */
  async getVisibleGalleryItems(): Promise<NextResponse> {
    try {
      const galleryItems = await this.galleryService.getGalleryItems(true);
      return handleResponse(galleryItems);
    } catch (error) {
      console.error("getVisibleGalleryItemsController error:", error);
      return handleError();
    }
  }

  /**
   * Gets a gallery item by ID
   * @param {string} galleryItemId - The ID of the gallery item to get
   * @returns {Promise<NextResponse>} The HTTP response with the gallery item
   */
  async getGalleryItemById(galleryItemId: string): Promise<NextResponse> {
    try {
      // Validate galleryItemId
      if (!galleryItemId || galleryItemId === "undefined") {
        console.error("Invalid gallery item ID in controller:", galleryItemId);
        return handleError(
          httpMessages.BAD_REQUEST("Gallery item ID is missing or invalid")
        );
      }

      // Check if it's a valid MongoDB ObjectId
      if (!Types.ObjectId.isValid(galleryItemId)) {
        console.error("Invalid ObjectId format in controller:", galleryItemId);
        return handleError(
          httpMessages.BAD_REQUEST("Invalid gallery item ID format")
        );
      }

      const galleryItem = await this.galleryService.getGalleryItemById(
        galleryItemId
      );
      if (!galleryItem) {
        return handleError(httpMessages.NOT_FOUND("Gallery item not found"));
      }

      return handleResponse(galleryItem);
    } catch (error) {
      console.error("getGalleryItemByIdController error:", error);
      return handleError();
    }
  }

  /**
   * Updates a gallery item by ID
   * @param {string} galleryItemId - The ID of the gallery item to update
   * @param {any} body - The parsed request body
   * @returns {Promise<NextResponse>} The HTTP response with the updated gallery item
   */
  async updateGalleryItem(
    galleryItemId: string,
    body: any
  ): Promise<NextResponse> {
    try {
      // Validate galleryItemId
      if (!galleryItemId || galleryItemId === "undefined") {
        console.error("Invalid gallery item ID in controller:", galleryItemId);
        return handleError(
          httpMessages.BAD_REQUEST("Gallery item ID is missing or invalid")
        );
      }

      // Check if it's a valid MongoDB ObjectId
      if (!Types.ObjectId.isValid(galleryItemId)) {
        console.error("Invalid ObjectId format in controller:", galleryItemId);
        return handleError(
          httpMessages.BAD_REQUEST("Invalid gallery item ID format")
        );
      }

      const updatedGalleryItem = await this.galleryService.updateGalleryItem(
        galleryItemId,
        body
      );

      if (!updatedGalleryItem) {
        return handleError(httpMessages.NOT_FOUND("Gallery item not found"));
      }

      return handleResponse(updatedGalleryItem);
    } catch (error) {
      console.error("updateGalleryItemController error:", error);
      return handleError();
    }
  }

  /**
   * Updates a gallery item's visibility by ID
   * @param {string} galleryItemId - The ID of the gallery item to update
   * @param {any} body - The parsed request body
   * @returns {Promise<NextResponse>} The HTTP response with the updated gallery item
   */
  async updateGalleryItemVisibility(
    galleryItemId: string,
    body: any
  ): Promise<NextResponse> {
    try {
      // Validate galleryItemId
      if (!galleryItemId || galleryItemId === "undefined") {
        console.error("Invalid gallery item ID in controller:", galleryItemId);
        return handleError(
          httpMessages.BAD_REQUEST("Gallery item ID is missing or invalid")
        );
      }

      // Check if it's a valid MongoDB ObjectId
      if (!Types.ObjectId.isValid(galleryItemId)) {
        console.error("Invalid ObjectId format in controller:", galleryItemId);
        return handleError(
          httpMessages.BAD_REQUEST("Invalid gallery item ID format")
        );
      }

      if (typeof body.isVisible !== "boolean") {
        return handleError(
          httpMessages.BAD_REQUEST("isVisible field must be a boolean")
        );
      }

      const updatedGalleryItem =
        await this.galleryService.updateGalleryItemVisibility(
          galleryItemId,
          body.isVisible
        );

      if (!updatedGalleryItem) {
        return handleError(httpMessages.NOT_FOUND("Gallery item not found"));
      }

      return handleResponse(updatedGalleryItem);
    } catch (error) {
      console.error("updateGalleryItemVisibilityController error:", error);
      return handleError();
    }
  }

  /**
   * Deletes a gallery item by ID
   * @param {string} galleryItemId - The ID of the gallery item to delete
   * @returns {Promise<NextResponse>} The HTTP response
   */
  async deleteGalleryItem(galleryItemId: string): Promise<NextResponse> {
    try {
      // Validate galleryItemId
      if (!galleryItemId || galleryItemId === "undefined") {
        console.error("Invalid gallery item ID in controller:", galleryItemId);
        return handleError(
          httpMessages.BAD_REQUEST("Gallery item ID is missing or invalid")
        );
      }

      // Check if it's a valid MongoDB ObjectId
      if (!Types.ObjectId.isValid(galleryItemId)) {
        console.error("Invalid ObjectId format in controller:", galleryItemId);
        return handleError(
          httpMessages.BAD_REQUEST("Invalid gallery item ID format")
        );
      }

      const deletedGalleryItem = await this.galleryService.deleteGalleryItem(
        galleryItemId
      );

      if (!deletedGalleryItem) {
        return handleError(httpMessages.NOT_FOUND("Gallery item not found"));
      }

      return handleResponse({
        success: true,
        message: "Gallery item deleted successfully",
      });
    } catch (error) {
      console.error("deleteGalleryItemController error:", error);
      return handleError();
    }
  }

  /**
   * Deletes multiple gallery items by their IDs
   * @param {NextRequest} req - The HTTP request
   * @returns {Promise<NextResponse>} The HTTP response
   */
  async deleteGalleryItems(req: NextRequest): Promise<NextResponse> {
    try {
      const url = req.nextUrl;
      const galleryItemIds = url.searchParams.get("galleryItemIds");
      if (!galleryItemIds) {
        return handleError(
          httpMessages.BAD_REQUEST("Gallery item IDs are required")
        );
      }

      const galleryItemIdArray = galleryItemIds
        .split(",")
        .map((id) => id.trim());

      // Validate all IDs
      const validIds = galleryItemIdArray.filter(
        (id) => id && id !== "undefined" && Types.ObjectId.isValid(id)
      );

      if (validIds.length === 0) {
        return handleError(
          httpMessages.BAD_REQUEST("No valid gallery item IDs provided")
        );
      }

      const result = await this.galleryService.deleteGalleryItems(validIds);

      if (!result) {
        return handleError(
          httpMessages.NOT_FOUND("No gallery items found with the provided IDs")
        );
      }

      return handleResponse({
        success: true,
        message: "Gallery items deleted successfully",
      });
    } catch (error) {
      console.error("deleteGalleryItemsController error:", error);
      return handleError();
    }
  }
}
