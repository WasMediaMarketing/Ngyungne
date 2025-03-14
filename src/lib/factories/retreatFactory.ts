import { RetreatService } from "@/lib/services";
import { RetreatController } from "@/lib/controllers";

export function createRetreatController() {
  const retreatService = new RetreatService();
  return new RetreatController(retreatService);
}
