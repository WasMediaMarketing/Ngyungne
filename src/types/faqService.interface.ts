import { IFaqInput, IFaqUpdate, IFaq } from "@/types";

export interface IFaqService {
  createFaq(faqData: IFaqInput): Promise<IFaq>;

  updateFaq(faqId: string, faqData: IFaqUpdate): Promise<boolean>;

  getFaqs(faqId?: string): Promise<IFaq[]>;

  deleteFaq(faqId: string): Promise<boolean>;

  deleteFaqs(faqIds: string[]): Promise<boolean>;
}
