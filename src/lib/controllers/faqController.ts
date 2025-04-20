import type { IFaqService, IFaq } from "@/types";
import type { NextRequest, NextResponse } from "next/server";
import { handleError } from "../utils/errorHandler";
import { handleResponse } from "../utils/responseHandler";
import { httpMessages } from "../utils/HttpMessage";
import { Types } from "mongoose";

/**
 * Controller for handling FAQ-related HTTP requests
 */
export class FaqController {
  private faqService: IFaqService;

  /**
   * Creates a new FAQ controller
   * @param {IFaqService} faqService - The FAQ service to use
   */
  constructor(faqService: IFaqService) {
    this.faqService = faqService;
  }

  // Update the createFaq method to accept the body directly instead of the request
  /**
   * Creates a new FAQ
   * @param {any} faqData - The FAQ data
   * @returns {Promise<NextResponse>} The HTTP response
   */
  async createFaq(faqData: any): Promise<NextResponse> {
    try {
      const faq = await this.faqService.createFaq(faqData);
      return handleResponse(faq, httpMessages.CREATED());
    } catch (error) {
      console.error("createFaqController error:", error);
      return handleError();
    }
  }

  /**
   * Gets all FAQs
   * @returns {Promise<NextResponse>} The HTTP response with all FAQs
   */
  async getFaqs(): Promise<NextResponse> {
    try {
      const faqs = await this.faqService.getFaqs();
      return handleResponse(faqs);
    } catch (error) {
      console.error("getFaqsController error:", error);
      return handleError();
    }
  }

  /**
   * Gets all published FAQs
   * @returns {Promise<NextResponse>} The HTTP response with published FAQs
   */
  async getPublishedFaqs(): Promise<NextResponse> {
    try {
      const faqs = await this.faqService.getFaqs(true);
      return handleResponse(faqs);
    } catch (error) {
      console.error("getPublishedFaqsController error:", error);
      return handleError();
    }
  }

  /**
   * Gets a FAQ by ID
   * @param {NextRequest} req - The HTTP request
   * @returns {Promise<NextResponse>} The HTTP response with the FAQ
   */
  async getFaqById(req: NextRequest): Promise<NextResponse> {
    try {
      const faqId = req.nextUrl.pathname.split("/").pop();
      if (!faqId || !Types.ObjectId.isValid(faqId)) {
        return handleError(
          httpMessages.BAD_REQUEST("FAQ ID is either missing or invalid")
        );
      }

      const faq = await this.faqService.getFaqById(new Types.ObjectId(faqId));
      if (!faq) {
        return handleError(httpMessages.NOT_FOUND("FAQ not found"));
      }

      return handleResponse(faq);
    } catch (error) {
      console.error("getFaqByIdController error:", error);
      return handleError();
    }
  }

  // Update the updateFaq method to accept the ID and body directly
  /**
   * Updates a FAQ by ID
   * @param {Types.ObjectId} faqId - The FAQ ID
   * @param {Partial<IFaq>} faqData - The FAQ data to update
   * @returns {Promise<NextResponse>} The HTTP response with the updated FAQ
   */
  async updateFaq(
    faqId: Types.ObjectId,
    faqData: Partial<IFaq>
  ): Promise<NextResponse> {
    try {
      try {
        const updatedFaq = await this.faqService.updateFaq(faqId, faqData);
        return handleResponse(updatedFaq);
      } catch (error: any) {
        if (error.message === "FAQ not found") {
          return handleError(httpMessages.NOT_FOUND("FAQ not found"));
        }
        throw error;
      }
    } catch (error) {
      console.error("updateFaqController error:", error);
      return handleError();
    }
  }

  /**
   * Deletes a FAQ by ID
   * @param {NextRequest} req - The HTTP request
   * @returns {Promise<NextResponse>} The HTTP response
   */
  async deleteFaq(req: NextRequest): Promise<NextResponse> {
    try {
      const faqId = req.nextUrl.pathname.split("/").pop();
      if (!faqId || !Types.ObjectId.isValid(faqId)) {
        return handleError(
          httpMessages.BAD_REQUEST("FAQ ID is either missing or invalid")
        );
      }

      try {
        const deletedFaq = await this.faqService.deleteFaq(
          new Types.ObjectId(faqId)
        );
        return handleResponse(deletedFaq);
      } catch (error: any) {
        if (error.message === "FAQ not found") {
          return handleError(httpMessages.NOT_FOUND("FAQ not found"));
        }
        throw error;
      }
    } catch (error) {
      console.error("deleteFaqController error:", error);
      return handleError();
    }
  }

  /**
   * Deletes multiple FAQs by their IDs
   * @param {NextRequest} req - The HTTP request
   * @returns {Promise<NextResponse>} The HTTP response
   */
  async deleteFaqs(req: NextRequest): Promise<NextResponse> {
    try {
      const url = req.nextUrl;
      const faqIds = url.searchParams.get("faqIds");
      if (!faqIds) {
        return handleError(httpMessages.BAD_REQUEST("FAQ IDs are required"));
      }

      const faqIdArray = faqIds.split(",").map((id) => id.trim());

      for (const id of faqIdArray) {
        if (!Types.ObjectId.isValid(id)) {
          return handleError(httpMessages.BAD_REQUEST(`Invalid FAQ ID: ${id}`));
        }
      }

      const objectIds = faqIdArray.map((id) => new Types.ObjectId(id));

      console.log("FAQ IDs to delete:", objectIds);
      const result = await this.faqService.deleteFaqs(objectIds);

      if (!result) {
        return handleError(
          httpMessages.NOT_FOUND("No FAQs found with the provided IDs")
        );
      }

      return handleResponse({
        success: true,
        message: "FAQs deleted successfully",
      });
    } catch (error) {
      console.error("deleteFaqsController error:", error);
      return handleError();
    }
  }
}
