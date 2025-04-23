import type { NextRequest, NextResponse } from "next/server";
import { handleError } from "@/lib/utils/errorHandler";
import { handleResponse } from "@/lib/utils/responseHandler";
import { httpMessages } from "@/lib/utils/HttpMessage";
import { Types } from "mongoose";
import type { AboutService } from "@/lib/services/aboutService";
import type { ContentType } from "@/types/about.types";

export class AboutController {
  private aboutService: AboutService;

  constructor(aboutService: AboutService) {
    this.aboutService = aboutService;
  }

  /**
   * @summary Create new about content
   * @param {NextRequest} req - The request object
   * @returns {NextResponse} The response with the created content
   */
  async createContent(req: NextRequest): Promise<NextResponse> {
    try {
      const contentData = await req.json();
      const content = await this.aboutService.createContent(contentData);
      return handleResponse(content, httpMessages.CREATED());
    } catch (error) {
      console.error("createContentController error", error);
      return handleError();
    }
  }

  /**
   * @summary Get all about content
   * @param {NextRequest} req - The request object
   * @returns {NextResponse} The response with the list of content
   */
  async getContent(req: NextRequest): Promise<NextResponse> {
    try {
      const url = req.nextUrl;
      const contentType = url.searchParams.get(
        "contentType"
      ) as ContentType | null;
      const isVisible =
        url.searchParams.get("isVisible") === "true"
          ? true
          : url.searchParams.get("isVisible") === "false"
          ? false
          : undefined;

      const content = await this.aboutService.getContent(
        contentType || undefined,
        isVisible
      );
      return handleResponse(content);
    } catch (error) {
      console.error("getContentController error", error);
      return handleError();
    }
  }

  /**
   * @summary Get about content by ID
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

      const content = await this.aboutService.getContentById(
        new Types.ObjectId(contentId)
      );
      return handleResponse(content);
    } catch (error) {
      console.error("getContentByIdController error", error);
      return handleError();
    }
  }

  /**
   * @summary Update about content by ID
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
        new Types.ObjectId(contentId),
        contentData
      );
      return handleResponse(updatedContent);
    } catch (error) {
      console.error("updateContentController error", error);
      return handleError();
    }
  }

  /**
   * @summary Delete about content by ID
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

      const deletedContent = await this.aboutService.deleteContent(
        new Types.ObjectId(contentId)
      );
      return handleResponse(deletedContent);
    } catch (error) {
      console.error("deleteContentController error", error);
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
      console.error("getHeroSectionController error", error);
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
      const updatedHero = await this.aboutService.updateHeroSection(heroData);
      return handleResponse(updatedHero);
    } catch (error) {
      console.error("updateHeroSectionController error", error);
      return handleError();
    }
  }
}
