import { SliderService } from "@/lib/services/sliderService";
import { SliderController } from "@/lib/controllers/sliderController";

export function createSliderController() {
  const sliderService = new SliderService();
  return new SliderController(sliderService);
}
