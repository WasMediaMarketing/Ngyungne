import { FaqService } from "@/lib/services";
import { FaqController } from "@/lib/controllers";

export function createFaqController() {
  const faqService = new FaqService();
  return new FaqController(faqService);
}
