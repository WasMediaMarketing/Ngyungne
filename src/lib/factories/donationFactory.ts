import { DonationService } from "@/lib/services";
import { DonationController } from "@/lib/controllers";

export function createDonationController() {
  const donationService = new DonationService();
  return new DonationController(donationService);
}
