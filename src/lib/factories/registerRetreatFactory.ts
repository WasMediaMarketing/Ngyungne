import { RegisterRetreatService } from "@/lib/services";
import { RegisterRetreatController } from "@/lib/controllers";

export function createRegisterRetreatController() {
  const registerRetreatService = new RegisterRetreatService();
  return new RegisterRetreatController(registerRetreatService);
}
