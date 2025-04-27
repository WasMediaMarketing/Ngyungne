import type { AboutService } from "@/lib/services/aboutService";
import type { NextRequest, NextResponse } from "next/server";
import { handleError } from "../utils/errorHandler";
import { handleResponse } from "../utils/responseHandler";
import { httpMessages } from "../utils/HttpMessage";
import { Types } from "mongoose";
import type { ContentType } from "@/types/about.types";

export class AboutController {
  private aboutService: AboutService;

  constructor(aboutService: AboutService) {
    this.aboutService = aboutService;
  }

  /**
   * @summary Create new content
   * @param {NextRequest} req - The request object
   * @returns {NextResponse} The response with the created content
   */
  async createContent(req: NextRequest): Promise<NextResponse> {
    try {
      const contentData = await req.json();
      const content = await this.aboutService.createContent(contentData);
      return handleResponse(content, httpMessages.CREATED());
    } catch (error) {
      console.log("createContentController error", error);
      return handleError();
    }
  }

  /**
   * @summary Get all content or filtered by type and visibility
   * @param {NextRequest} req - The request object
   * @returns {NextResponse} The response with the list of content
   */
  async getContent(req: NextRequest): Promise<NextResponse> {
    try {
      const url = new URL(req.url);
      const contentType = url.searchParams.get("contentType") as
        | ContentType
        | undefined;
      const isVisible =
        url.searchParams.get("isVisible") !== null
          ? url.searchParams.get("isVisible") === "true"
          : undefined;

      const content = await this.aboutService.getContent(
        contentType,
        isVisible
      );
      return handleResponse(content);
    } catch (error) {
      console.log("getContentController error", error);
      return handleError();
    }
  }

  /**
   * @summary Get content by ID
   * @param {NextRequest} req - The request object
   * @returns {NextResponse} The response with the content details
   */
  async getContentById(req: NextRequest): Promise<NextResponse> {
    try {
      const contentId = req.nextUrl.pathname.split("/").pop();
      if (!contentId || !Types.ObjectId.isValid(contentId)) {
        return handleError(
          httpMessages.BAD_REQUEST("Content ID is either missing or invalid")
        );
      }

      const content = await this.aboutService.getContentById(contentId);
      return handleResponse(content);
    } catch (error) {
      console.log("getContentByIdController error", error);
      return handleError();
    }
  }

  /**
   * @summary Update content by ID
   * @param {NextRequest} req - The request object
   * @returns {NextResponse} The response with the updated content
   */
  async updateContent(req: NextRequest): Promise<NextResponse> {
    try {
      const contentId = req.nextUrl.pathname.split("/").pop();
      if (!contentId || !Types.ObjectId.isValid(contentId)) {
        return handleError(
          httpMessages.BAD_REQUEST("Content ID is either missing or invalid")
        );
      }

      const contentData = await req.json();
      const updatedContent = await this.aboutService.updateContent(
        contentId,
        contentData
      );
      return handleResponse(updatedContent);
    } catch (error) {
      console.log("updateContentController error", error);
      return handleError();
    }
  }

  /**
   * @summary Delete content by ID
   * @param {NextRequest} req - The request object
   * @returns {NextResponse} The response indicating whether the content was deleted successfully
   */
  async deleteContent(req: NextRequest): Promise<NextResponse> {
    try {
      const contentId = req.nextUrl.pathname.split("/").pop();
      if (!contentId || !Types.ObjectId.isValid(contentId)) {
        return handleError(
          httpMessages.BAD_REQUEST("Content ID is either missing or invalid")
        );
      }

      const deletedContent = await this.aboutService.deleteContent(contentId);
      return handleResponse(deletedContent);
    } catch (error) {
      console.log("deleteContentController error", error);
      return handleError();
    }
  }

  /**
   * @summary Get hero section
   * @returns {NextResponse} The response with the hero section
   */
  async getHeroSection(): Promise<NextResponse> {
    try {
      const heroSection = await this.aboutService.getHeroSection();
      return handleResponse(heroSection);
    } catch (error) {
      console.log("getHeroSectionController error", error);
      return handleError();
    }
  }

  /**
   * @summary Update hero section
   * @param {NextRequest} req - The request object
   * @returns {NextResponse} The response with the updated hero section
   */
  async updateHeroSection(req: NextRequest): Promise<NextResponse> {
    try {
      const heroData = await req.json();
      const updatedHeroSection = await this.aboutService.updateHeroSection(
        heroData
      );
      return handleResponse(updatedHeroSection);
    } catch (error) {
      console.log("updateHeroSectionController error", error);
      return handleError();
    }
  }
}
