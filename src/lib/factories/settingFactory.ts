import { SettingService } from "@/lib/services/settingService";
import { SettingController } from "@/lib/controllers/settingController";

export function createSettingController() {
  const settingService = new SettingService();
  return new SettingController(settingService);
}
