import { AmbassadorController } from "@/lib/controllers/ambassadorController";
import { AmbassadorService } from "@/lib/services/ambassadorService";

export function createAmbassadorController(): AmbassadorController {
  const ambassadorService = new AmbassadorService();
  return new AmbassadorController(ambassadorService);
}
