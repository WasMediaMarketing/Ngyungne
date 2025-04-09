import { FaqService } from "@/lib/services/faqService";
import { FaqController } from "@/lib/controllers/faqController";

/**
 * Creates and returns a new instance of the FAQ controller
 * @returns {FaqController} A new FAQ controller instance
 */
export function createFaqController() {
  const faqService = new FaqService();
  return new FaqController(faqService);
}
