import { VolunteerService } from "@/lib/services";
import { VolunteerController } from "@/lib/controllers";

export function createVolunteerController() {
  const volunteerService = new VolunteerService();
  return new VolunteerController(volunteerService);
}
