import { IDonationInput, IDonationData } from "@/types";

export interface IDonationService {
  createDonation(donationData: IDonationInput): Promise<IDonationData>;
  getDonations(donationId?: string): Promise<IDonationData[]>;
  deleteDonation(donationId: string): Promise<boolean>;
  deleteDonations(donationIds: string[]): Promise<boolean>;
}
