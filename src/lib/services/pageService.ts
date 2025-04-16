import { PageModel } from "../models/page.model";
import type {
  CreatePageInput,
  IPageService,
  Page,
  UpdatePageInput,
} from "@/types/page.types";
import { connectToDatabase } from "../utils/mongodb";
import { httpMessages } from "@/lib/utils/HttpMessage";
import { Types } from "mongoose";

export class PageService implements IPageService {
  async createPage(pageData: CreatePageInput): Promise<Page> {
    try {
      await connectToDatabase();
      const newPage = new PageModel(pageData);
      await newPage.save();
      return newPage.toObject() as Page;
    } catch (error) {
      console.error("Error creating page:", error);
      throw httpMessages.INTERNAL_SERVER_ERROR;
    }
  }

  async getPages(): Promise<Page[]> {
    try {
      await connectToDatabase();
      const pages = await PageModel.find();
      return pages.map((page) => page.toObject() as Page);
    } catch (error) {
      console.error("Error fetching pages:", error);
      throw httpMessages.INTERNAL_SERVER_ERROR;
    }
  }

  async getPublishedPages(): Promise<Page[]> {
    try {
      await connectToDatabase();
      const pages = await PageModel.find({ status: "published" });
      return pages.map((page) => page.toObject() as Page);
    } catch (error) {
      console.error("Error fetching published pages:", error);
      throw httpMessages.INTERNAL_SERVER_ERROR;
    }
  }

  async getPageBySlug(slug: string): Promise<Page | null> {
    try {
      await connectToDatabase();
      // Find the page directly by slug
      const page = await PageModel.findOne({
        slug: slug,
        status: "published",
      });

      if (!page) {
        throw httpMessages.NOT_FOUND("Page not found with the given slug");
      }

      return page.toObject() as Page;
    } catch (error) {
      console.error("Error fetching page by slug:", error);
      if (
        error === httpMessages.NOT_FOUND("Page not found with the given slug")
      ) {
        throw error;
      }
      throw httpMessages.INTERNAL_SERVER_ERROR;
    }
  }

  async updatePage(
    pageId: string,
    pageData: UpdatePageInput
  ): Promise<Page | null> {
    try {
      await connectToDatabase();
      const updatedPage = await PageModel.findByIdAndUpdate(pageId, pageData, {
        new: true,
      });

      if (!updatedPage) {
        throw httpMessages.NOT_FOUND("Page not found");
      }

      return updatedPage.toObject() as Page;
    } catch (error) {
      console.error("Error updating page:", error);
      if (error === httpMessages.NOT_FOUND("Page not found")) {
        throw error;
      }
      throw httpMessages.INTERNAL_SERVER_ERROR;
    }
  }

  async deletePage(pageId: string): Promise<Page | null> {
    try {
      await connectToDatabase();
      const pageToDelete = await PageModel.findById(pageId);

      if (!pageToDelete) {
        throw httpMessages.NOT_FOUND("Page not found");
      }

      await PageModel.findByIdAndDelete(pageId);
      return pageToDelete.toObject() as Page;
    } catch (error) {
      console.error("Error deleting page:", error);
      if (error === httpMessages.NOT_FOUND("Page not found")) {
        throw error;
      }
      throw httpMessages.INTERNAL_SERVER_ERROR;
    }
  }

  async deletePages(pageIds: string[]): Promise<{ deletedCount: number }> {
    try {
      await connectToDatabase();

      // Validate all IDs are valid ObjectIds
      const validObjectIds = pageIds.filter((id) => Types.ObjectId.isValid(id));

      if (validObjectIds.length === 0) {
        throw httpMessages.BAD_REQUEST("No valid page IDs provided");
      }

      // Delete multiple pages
      const result = await PageModel.deleteMany({
        _id: { $in: validObjectIds },
      });

      if (result.deletedCount === 0) {
        throw httpMessages.NOT_FOUND("No pages found with the provided IDs");
      }

      return { deletedCount: result.deletedCount };
    } catch (error) {
      console.error("Error deleting multiple pages:", error);
      throw error;
    }
  }
}
