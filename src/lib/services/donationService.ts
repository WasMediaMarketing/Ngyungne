import { IDonationService, IDonationInput, IDonationData } from "@/types";
import { Donation, Cause } from "@/lib/models";
import { UserService } from "@/lib/services";
import { connectToDatabase } from "@/lib/utils/mongodb";
import { deleteFile } from "@/lib/utils/deleteFile";

export class DonationService implements IDonationService {
  private async initializeDbConnection() {
    await connectToDatabase();
  }

  async createDonation(donationData: IDonationInput): Promise<IDonationData> {
    await this.initializeDbConnection();

    const userService = new UserService();
    const user = await userService.createUser({
      name: donationData.name,
      email: donationData.email,
      phoneNumber: donationData.phoneNumber,
      role: "donator",
      page: donationData.page,
      pageTitle: donationData.pageTitle,
    });

    // Create the donation with the user's ID
    const donation = new Donation({
      userId: user.id,
      amount: donationData.amount,
      screenshot: donationData.screenshot,
      donationType: donationData.donationType,
      donationMethod: donationData.donationMethod,
      donationTypeId: donationData.donationTypeId,
    });
    await donation.save();

    if (donationData.donationType === "Cause" && donationData.donationTypeId) {
      const cause = await Cause.findById(donationData.donationTypeId);

      if (!cause) {
        throw new Error("Cause not found");
      }

      cause.raised += donationData.amount;
      cause.totalDonors += 1;

      await cause.save();
    }
    return donation;
  }

  async getDonations(donationId?: string): Promise<IDonationData[]> {
    await this.initializeDbConnection();

    if (donationId) {
      const donation = await Donation.findById(donationId)
        .populate({ path: "userId", strictPopulate: false }) // Set strictPopulate: false
        .populate({ path: "donationTypeId", strictPopulate: false });

      return donation ? [donation] : [];
    }

    return await Donation.find()
      .populate({ path: "userId", strictPopulate: false })
      .populate({ path: "donationTypeId", strictPopulate: false });
  }

  async deleteDonation(donationId: string): Promise<boolean> {
    await this.initializeDbConnection();
    console.log(Donation.schema.pre);
    const donation = await Donation.findById(donationId);
    if (!donation) return false;
    deleteFile(donation.screenshot);
    const result = await Donation.findByIdAndDelete(donationId);
    return !!result;
  }

  async deleteDonations(donationIds: string[]): Promise<boolean> {
    await this.initializeDbConnection();
    const donations = await Donation.find({ _id: { $in: donationIds } });
    donations.forEach((donation) => deleteFile(donation.screenshot));
    const result = await Donation.deleteMany({ _id: { $in: donationIds } });
    return result.deletedCount > 0;
  }
}
