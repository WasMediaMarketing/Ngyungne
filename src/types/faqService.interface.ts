import { Types } from "mongoose";
import { IFaq } from "./faq.types";

export interface IFaqService {
  createFaq(faqData: IFaq): Promise<IFaq>;
  getFaqs(onlyVisible?: boolean): Promise<IFaq[]>;
  getFaqById(faqId: Types.ObjectId): Promise<IFaq>;
  updateFaq(faqId: Types.ObjectId, faqData: Partial<IFaq>): Promise<IFaq>;
  deleteFaq(faqId: Types.ObjectId): Promise<IFaq>;
  deleteFaqs(faqIds: Types.ObjectId[]): Promise<boolean>;
}
