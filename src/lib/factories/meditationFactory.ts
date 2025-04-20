import { MeditationService } from "@/lib/services/meditationService";
import { MeditationController } from "@/lib/controllers/meditationController";

export function createMeditationController() {
  const meditationService = new MeditationService();
  return new MeditationController(meditationService);
}
