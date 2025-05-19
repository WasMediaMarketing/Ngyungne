import type { ISliderService } from "@/types/slider.types";
import type { NextRequest, NextResponse } from "next/server";
import { handleError } from "../utils/errorHandler";
import { handleResponse } from "../utils/responseHandler";
import { httpMessages } from "../utils/HttpMessage";
import { Types } from "mongoose";
import { ExtendedNextRequest } from "@/lib/utils/requestHelpers";

export class SliderController {
  private sliderService: ISliderService;

  constructor(sliderService: ISliderService) {
    this.sliderService = sliderService;
  }

  /**
   * @summary Create a new slider
   * @param {NextRequest} req - The request object
   * @returns {NextResponse} The response with the created slider
   */
  async createSlider(req: ExtendedNextRequest): Promise<NextResponse> {
    try {
      const sliderData = await req.json();
      const slider = await this.sliderService.createSlider(sliderData);
      return handleResponse(slider, httpMessages.CREATED());
    } catch (error) {
      return handleError(undefined, req);
    }
  }

  /**
   * @summary Get all sliders
   * @description Retrieves all sliders from the system
   * @returns {NextResponse} The response with the list of sliders
   */
  async getSliders(): Promise<NextResponse> {
    try {
      const sliders = await this.sliderService.getSliders();
      return handleResponse(sliders);
    } catch (error) {
      return handleError();
    }
  }

  /**
   * @summary Get all published sliders
   * @description Retrieves all published sliders from the system
   * @returns {NextResponse} The response with the list of published sliders
   */
  async getPublishedSliders(): Promise<NextResponse> {
    try {
      const sliders = await this.sliderService.getSliders(true);
      return handleResponse(sliders);
    } catch (error) {
      return handleError();
    }
  }

  /**
   * @summary Get a slider by ID
   * @param {NextRequest} req - The request object
   * @returns {NextResponse} The response with the slider details
   */
  async getSliderById(req: NextRequest): Promise<NextResponse> {
    try {
      const sliderId = req.nextUrl.pathname.split("/").pop();
      if (!sliderId || !Types.ObjectId.isValid(sliderId)) {
        return handleError(
          httpMessages.BAD_REQUEST("Slider ID is either missing or invalid")
        );
      }

      const slider = await this.sliderService.getSliderById(
        new Types.ObjectId(sliderId)
      );
      return handleResponse(slider);
    } catch (error) {
      return handleError();
    }
  }

  /**
   * @summary Update a slider by ID
   * @param {NextRequest} req - The request object
   * @returns {NextResponse} The response with the updated slider
   */
  async updateSlider(
    req: ExtendedNextRequest | NextRequest
  ): Promise<NextResponse> {
    try {
      const sliderId = req.nextUrl.pathname.split("/").pop();
      if (!sliderId || !Types.ObjectId.isValid(sliderId)) {
        return handleError(
          httpMessages.BAD_REQUEST("Slider ID is either missing or invalid")
        );
      }

      const sliderData = await req.json();
      const updatedSlider = await this.sliderService.updateSlider(
        new Types.ObjectId(sliderId),
        sliderData
      );
      return handleResponse(updatedSlider);
    } catch (error) {
      return req instanceof ExtendedNextRequest
        ? handleError(undefined, req)
        : handleError();
    }
  }

  /**
   * @summary Delete a slider by ID
   * @param {NextRequest} req - The request object
   * @returns {NextResponse} The response indicating whether the slider was deleted successfully
   */
  async deleteSlider(req: NextRequest): Promise<NextResponse> {
    try {
      const sliderId = req.nextUrl.pathname.split("/").pop();
      if (!sliderId || !Types.ObjectId.isValid(sliderId)) {
        return handleError(
          httpMessages.BAD_REQUEST("Slider ID is either missing or invalid")
        );
      }

      const deletedSlider = await this.sliderService.deleteSlider(
        new Types.ObjectId(sliderId)
      );
      return handleResponse(deletedSlider);
    } catch (error) {
      return handleError();
    }
  }

  /**
   * @summary Delete multiple sliders by their IDs
   * @param {NextRequest} req - The request object
   * @returns {NextResponse} The response indicating the result of the bulk delete
   */
  async deleteSliders(req: NextRequest): Promise<NextResponse> {
    try {
      const url = req.nextUrl;
      const sliderIds = url.searchParams.get("sliderIds");
      if (!sliderIds) {
        return handleError(httpMessages.BAD_REQUEST("Slider IDs are required"));
      }

      const sliderIdArray = sliderIds.split(",").map((id) => id.trim());

      for (const id of sliderIdArray) {
        if (!Types.ObjectId.isValid(id)) {
          return handleError(
            httpMessages.BAD_REQUEST(`Invalid Slider ID: ${id}`)
          );
        }
      }

      const objectIds = sliderIdArray.map((id) => new Types.ObjectId(id));

      const isDeleted = await this.sliderService.deleteSliders(objectIds);
      return handleResponse(isDeleted);
    } catch (error) {
      console.error("deleteSlidersController error:", error);
      return handleError();
    }
  }

  /**
   * @summary Update slider order
   * @param {NextRequest} req - The request object
   * @returns {NextResponse} The response with the updated slider
   */
  async updateSliderOrder(req: NextRequest): Promise<NextResponse> {
    try {
      const sliderId = req.nextUrl.pathname.split("/").pop();
      if (!sliderId || !Types.ObjectId.isValid(sliderId)) {
        return handleError(
          httpMessages.BAD_REQUEST("Slider ID is either missing or invalid")
        );
      }

      const data = await req.json();
      const { order } = data;

      if (typeof order !== "number") {
        return handleError(httpMessages.BAD_REQUEST("Order must be a number"));
      }

      const updatedSlider = await this.sliderService.updateSliderOrder(
        new Types.ObjectId(sliderId),
        order
      );

      return handleResponse(updatedSlider);
    } catch (error) {
      return handleError();
    }
  }
}
