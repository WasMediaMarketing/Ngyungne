import { NewsletterService } from "@/lib/services/newsletterService";
import { NewsletterController } from "@/lib/controllers/newsletterController";

/**
 * Creates and returns a new instance of the Newsletter controller
 * @returns {NewsletterController} A new Newsletter controller instance
 */
export function createNewsletterController() {
  const newsletterService = new NewsletterService();
  return new NewsletterController(newsletterService);
}
