import { IFaqService, IFaqInput, IFaqUpdate, IFaq } from "@/types";
import { Faq } from "@/lib/models";
import { connectToDatabase } from "@/lib/utils/mongodb";

export class FaqService implements IFaqService {
  private async initializeDbConnection() {
    await connectToDatabase();
  }

  // Create a new FAQ
  async createFaq(faqData: IFaqInput): Promise<IFaq> {
    await this.initializeDbConnection();

    const faq = new Faq(faqData);

    await faq.save();
    return faq;
  }

  async getFaqs(): Promise<IFaq[]> {
    await this.initializeDbConnection();
    return await Faq.find();
  }

  // Update an existing FAQ by ID
  async updateFaq(faqId: string, faqData: IFaqUpdate): Promise<boolean> {
    await this.initializeDbConnection();

    const existingFaq = await Faq.findById(faqId);
    if (!existingFaq) {
      throw new Error("FAQ not found");
    }

    await Faq.findByIdAndUpdate(faqId, faqData, {
      new: true,
    });

    return true;
  }

  // Delete a specific FAQ by ID
  async deleteFaq(faqId: string): Promise<boolean> {
    await this.initializeDbConnection();

    const faq = await Faq.findById(faqId);
    if (!faq) return false;

    const result = await Faq.findByIdAndDelete(faqId);
    return !!result;
  }

  // Delete multiple FAQs by their IDs
  async deleteFaqs(faqIds: string[]): Promise<boolean> {
    await this.initializeDbConnection();

    const result = await Faq.deleteMany({
      _id: { $in: faqIds },
    });

    return result.deletedCount > 0;
  }
}
