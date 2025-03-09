import { IVolunteerService, IVolunteerInput, IVolunteerData } from "@/types";
import { Volunteer } from "@/lib/models";
import { UserService } from "@/lib/services";
import { connectToDatabase } from "@/lib/utils/mongodb";
import { deleteFile } from "@/lib/utils/deleteFile";

export class VolunteerService implements IVolunteerService {
  private async initializeDbConnection() {
    await connectToDatabase();
  }

  async createVolunteer(
    volunteerData: IVolunteerInput
  ): Promise<IVolunteerData> {
    await this.initializeDbConnection();

    const userService = new UserService();
    const user = await userService.createUser({
      name: volunteerData.name,
      email: volunteerData.email,
      phoneNumber: volunteerData.phoneNumber,
      role: "volunteer", 
      page: volunteerData.page,
      pageTitle: volunteerData.pageTitle,
    });

    const volunteer = new Volunteer({
      userId: user.id,
      image: volunteerData.image,
      reason: volunteerData.reason,
      socialLink: volunteerData.socialLink,
    });

    await volunteer.save();
    return volunteer;
  }

  async getVolunteers(): Promise<IVolunteerData[]> {
    await this.initializeDbConnection();
    return await Volunteer.find().populate("userId");
  }

  async deleteVolunteer(volunteerId: string): Promise<boolean> {
    await this.initializeDbConnection();

    const volunteer = await Volunteer.findById(volunteerId);
    if (!volunteer) return false;

    deleteFile(volunteer.image);

    const result = await Volunteer.findByIdAndDelete(volunteerId);
    return !!result;
  }

  async deleteVolunteers(volunteerIds: string[]): Promise<boolean> {
    await this.initializeDbConnection();

    const volunteers = await Volunteer.find({ _id: { $in: volunteerIds } });
    volunteers.forEach((volunteer) => deleteFile(volunteer.image));

    const result = await Volunteer.deleteMany({ _id: { $in: volunteerIds } });
    return result.deletedCount > 0;
  }
}
