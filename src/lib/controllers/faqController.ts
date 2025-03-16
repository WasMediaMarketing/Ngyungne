import { NextRequest, NextResponse } from "next/server";
import { IFaqService } from "@/types";
import { httpMessages } from "@/lib/utils/HttpMessage";
import { handleError } from "@/lib/utils/errorHandler";
import { handleResponse } from "@/lib/utils/responseHandler";
import { Types } from "mongoose";

export class FaqController {
  private faqService: IFaqService;

  constructor(faqService: IFaqService) {
    this.faqService = faqService;
  }

  // Create a new FAQ
  async createFaq(req: NextRequest): Promise<NextResponse> {
    try {
      const faqData = await req.json();
      const faq = await this.faqService.createFaq(faqData);
      return handleResponse(faq, httpMessages.CREATED());
    } catch (error) {
      console.error("createFaqController error:", error);
      return handleError();
    }
  }

  // Get all FAQs or a specific FAQ by ID
  async getFaqs(): Promise<NextResponse> {
    try {
      const faqs = await this.faqService.getFaqs();
      return handleResponse(faqs);
    } catch (error) {
      console.error("getFaqsController error:", error);
      return handleError();
    }
  }

  // Update an existing FAQ
  async updateFaq(req: NextRequest): Promise<NextResponse> {
    try {
      const faqId = req.nextUrl.pathname.split("/").pop();
      if (!faqId) {
        return handleError(httpMessages.BAD_REQUEST("FAQ ID is required"));
      }

      const faqData = await req.json();
      const updatedFaq = await this.faqService.updateFaq(faqId, faqData);
      return handleResponse(updatedFaq);
    } catch (error) {
      console.error("updateFaqController error:", error);
      return handleError();
    }
  }

  // Delete a specific FAQ by ID
  async deleteFaq(req: NextRequest): Promise<NextResponse> {
    try {
      const faqId = req.nextUrl.pathname.split("/").pop();
      if (!faqId) {
        return handleError(httpMessages.BAD_REQUEST("FAQ ID is required"));
      }

      const isDeleted = await this.faqService.deleteFaq(faqId);
      return handleResponse(isDeleted);
    } catch (error) {
      console.error("deleteFaqController error:", error);
      return handleError();
    }
  }

  // Delete multiple FAQs by their IDs
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

      const isDeleted = await this.faqService.deleteFaqs(faqIdArray);
      return handleResponse(isDeleted);
    } catch (error) {
      console.error("deleteFaqsController error:", error);
      return handleError();
    }
  }
}
