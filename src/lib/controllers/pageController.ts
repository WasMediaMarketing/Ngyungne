import type { NextRequest, NextResponse } from "next/server";
import type {
  IPageService,
  CreatePageInput,
  UpdatePageInput,
} from "@/types/page.types";
import { handleError } from "@/lib/utils/errorHandler";
import { handleResponse } from "@/lib/utils/responseHandler";
import { httpMessages } from "@/lib/utils/HttpMessage";

export class PageController {
  private pageService: IPageService;

  constructor(pageService: IPageService) {
    this.pageService = pageService;
  }

  async createPage(data: CreatePageInput): Promise<NextResponse> {
    try {
      const page = await this.pageService.createPage(data);
      return handleResponse(page, httpMessages.CREATED());
    } catch (error) {
      console.error("Error in createPage controller:", error);
      return handleError();
    }
  }

  async getPages(): Promise<NextResponse> {
    try {
      const pages = await this.pageService.getPages();
      return handleResponse({ pages });
    } catch (error) {
      console.error("Error in getPages controller:", error);
      return handleError();
    }
  }

  async getPublishedPages(): Promise<NextResponse> {
    try {
      const pages = await this.pageService.getPublishedPages();
      return handleResponse({ pages });
    } catch (error) {
      console.error("Error in getPublishedPages controller:", error);
      return handleError();
    }
  }

  async getPageBySlug(req: NextRequest): Promise<NextResponse> {
    try {
      // Get the slug from the URL
      const slugPath = req.nextUrl.pathname.replace("/api/pages/slug/", "");

      if (!slugPath) {
        return handleError(httpMessages.BAD_REQUEST("Slug is required"));
      }

      // Replace spaces or %20 with hyphens
      const modifiedSlug = slugPath.replace(/%20| /g, "-");

      console.log("Original Slug Path:", slugPath);
      console.log("Modified Slug (Spaces or %20 to Hyphens):", modifiedSlug);

      const page = await this.pageService.getPageBySlug(modifiedSlug);

      if (!page) {
        return handleError(httpMessages.NOT_FOUND("Page not found"));
      }

      return handleResponse({ page });
    } catch (error) {
      console.error("Error in getPageBySlug controller:", error);
      return handleError();
    }
  }

  // Updated to accept pageId and data directly
  async updatePage(
    pageId: string,
    data: UpdatePageInput
  ): Promise<NextResponse> {
    try {
      if (!pageId) {
        return handleError(httpMessages.BAD_REQUEST("Page ID is required"));
      }

      const updatedPage = await this.pageService.updatePage(pageId, data);
      return handleResponse(updatedPage);
    } catch (error) {
      console.error("Error in updatePage controller:", error);
      return handleError();
    }
  }

  async deletePage(req: NextRequest): Promise<NextResponse> {
    try {
      const pageId = req.nextUrl.pathname.split("/").pop();

      if (!pageId) {
        return handleError(httpMessages.BAD_REQUEST("Page ID is required"));
      }

      const deletedPage = await this.pageService.deletePage(pageId);
      return handleResponse(deletedPage);
    } catch (error) {
      console.error("Error in deletePage controller:", error);
      return handleError();
    }
  }

  async deletePages(req: NextRequest): Promise<NextResponse> {
    try {
      const url = req.nextUrl;
      const pageIds = url.searchParams.get("pageIds");

      if (!pageIds) {
        return handleError(
          httpMessages.BAD_REQUEST("pageIds query parameter is required")
        );
      }

      const ids = pageIds.split(",").map((id) => id.trim());

      if (ids.length === 0) {
        return handleError(httpMessages.BAD_REQUEST("No page IDs provided"));
      }

      const result = await this.pageService.deletePages(ids);

      return handleResponse({
        message: `Successfully deleted ${result.deletedCount} page${
          result.deletedCount > 1 ? "s" : ""
        }`,
        deletedCount: result.deletedCount,
      });
    } catch (error) {
      console.error("Error in deletePages controller:", error);
      return handleError();
    }
  }
}
