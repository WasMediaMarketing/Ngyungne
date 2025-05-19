import { AboutService } from "@/lib/services/aboutService";
import { AboutController } from "@/lib/controllers/aboutController";

export function createAboutController() {
  const aboutService = new AboutService();
  return new AboutController(aboutService);
}
