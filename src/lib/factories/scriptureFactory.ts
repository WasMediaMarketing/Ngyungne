import { ScriptureService } from "@/lib/services/scriptureService";
import { ScriptureController } from "@/lib/controllers/scriptureController";

export function createScriptureController() {
  const scriptureService = new ScriptureService();
  return new ScriptureController(scriptureService);
}
