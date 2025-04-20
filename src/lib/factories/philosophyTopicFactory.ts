import { PhilosophyTopicService } from "@/lib/services";
import { PhilosophyTopicController } from "@/lib/controllers";

export function createPhilosophyTopicController() {
  const philosophyTopicService = new PhilosophyTopicService();
  return new PhilosophyTopicController(philosophyTopicService);
}
