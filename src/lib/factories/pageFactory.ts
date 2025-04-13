import { PageService } from "@/lib/services/pageService";
import { PageController } from "@/lib/controllers/pageController";

/**
 * Creates and returns a new instance of the Page controller
 * @returns {PageController} A new Page controller instance
 */
export function createPageController() {
  const pageService = new PageService();
  return new PageController(pageService);
}
