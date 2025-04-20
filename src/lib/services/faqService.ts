import type { IFaqService, IFaq } from "@/types";
import type { Types } from "mongoose";
import { Faq } from "../models/faq.model";
import { connectToDatabase } from "../utils/mongodb";

/**
 * Service for handling FAQ-related database operations
 */
export class FaqService implements IFaqService {
  constructor() {
    // Ensure database connection is established
    connectToDatabase();
  }

  /**
   * Creates a new FAQ
   * @param {IFaq} faqData - The FAQ data
   * @returns {Promise<IFaq>} The created FAQ
   */
  async createFaq(faqData: IFaq): Promise<IFaq> {
    try {
      const faq = new Faq(faqData);
      await faq.save();
      return faq;
    } catch (error) {
      console.error("createFaq service error:", error);
      throw error;
    }
  }

  /**
   * Gets all FAQs
   * @param {boolean} onlyVisible - Whether to retrieve only visible FAQs
   * @returns {Promise<IFaq[]>} The list of FAQs
   */
  async getFaqs(onlyVisible = false): Promise<IFaq[]> {
    try {
      const query = onlyVisible ? { isVisible: true } : {};
      const faqs = await Faq.find(query).sort({ createdAt: -1 });
      return faqs;
    } catch (error) {
      console.error("getFaqs service error:", error);
      throw error;
    }
  }

  /**
   * Gets a FAQ by ID
   * @param {Types.ObjectId} faqId - The FAQ ID
   * @returns {Promise<IFaq>} The FAQ details
   */
  async getFaqById(faqId: Types.ObjectId): Promise<IFaq> {
    try {
      const faq = await Faq.findById(faqId);
      if (!faq) {
        throw new Error("FAQ not found");
      }
      return faq;
    } catch (error) {
      console.error("getFaqById service error:", error);
      throw error;
    }
  }

  /**
   * Updates a FAQ by ID
   * @param {Types.ObjectId} faqId - The FAQ ID
   * @param {Partial<IFaq>} faqData - The FAQ data to update
   * @returns {Promise<IFaq>} The updated FAQ
   */
  async updateFaq(
    faqId: Types.ObjectId,
    faqData: Partial<IFaq>
  ): Promise<IFaq> {
    try {
      const faq = await Faq.findByIdAndUpdate(
        faqId,
        { $set: faqData },
        { new: true }
      );
      if (!faq) {
        throw new Error("FAQ not found");
      }
      return faq;
    } catch (error) {
      console.error("updateFaq service error:", error);
      throw error;
    }
  }

  /**
   * Deletes a FAQ by ID
   * @param {Types.ObjectId} faqId - The FAQ ID
   * @returns {Promise<IFaq>} The deleted FAQ
   */
  async deleteFaq(faqId: Types.ObjectId): Promise<IFaq> {
    try {
      const faq = await Faq.findByIdAndDelete(faqId);
      if (!faq) {
        throw new Error("FAQ not found");
      }
      return faq;
    } catch (error) {
      console.error("deleteFaq service error:", error);
      throw error;
    }
  }

  /**
   * Deletes multiple FAQs by their IDs
   * @param {Types.ObjectId[]} faqIds - The FAQ IDs
   * @returns {Promise<boolean>} Whether the FAQs were deleted successfully
   */
  async deleteFaqs(faqIds: Types.ObjectId[]): Promise<boolean> {
    try {
      const result = await Faq.deleteMany({ _id: { $in: faqIds } });
      return result.deletedCount > 0;
    } catch (error) {
      console.error("deleteFaqs service error:", error);
      throw error;
    }
  }
}
