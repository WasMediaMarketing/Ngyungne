import { CauseService } from "@/lib/services";
import { CauseController } from "@/lib/controllers";

export function createCauseController() {
  const causeService = new CauseService();
  return new CauseController(causeService);
}
