import {
  IRegisterRetreatService,
  IRegisterRetreatInput,
  IRegisterRetreatData,
  IRegisterRetreatUpdate,
} from "@/types";
import { RegisterRetreat, Retreat } from "@/lib/models";
import { UserService } from "@/lib/services";
import { connectToDatabase } from "@/lib/utils/mongodb";

export class RegisterRetreatService implements IRegisterRetreatService {
  private async initializeDbConnection() {
    await connectToDatabase();
  }

  async createRegisterRetreat(
    registerRetreatData: IRegisterRetreatInput
  ): Promise<IRegisterRetreatData> {
    await this.initializeDbConnection();

    const retreat = await Retreat.findById(registerRetreatData.retreatId);

    if (!retreat) {
      throw new Error("Retreat not found");
    }

    const userService = new UserService();
    const user = await userService.createUser({
      name: registerRetreatData.name,
      email: registerRetreatData.email,
      phoneNumber: registerRetreatData.phoneNumber,
      page: registerRetreatData.page,
      pageTitle: registerRetreatData.pageTitle,
    });

    const registerRetreat = new RegisterRetreat({
      userId: user.id,
      retreatId: registerRetreatData.retreatId,
      MeditationExperience: registerRetreatData.MeditationExperience,
      dietaryRestriction: registerRetreatData.dietaryRestriction,
      specialRequest: registerRetreatData.specialRequest,
      AccomodationType: registerRetreatData.AccomodationType,
      emergencyContactName: registerRetreatData.emergencyContactName,
      emergencyContactNumber: registerRetreatData.emergencyContactNumber,
    });
    await registerRetreat.save();

    retreat.participants += 1;
    await retreat.save();

    return registerRetreat;
  }

  async getRegisterRetreats(
    retreatId?: string
  ): Promise<IRegisterRetreatData[]> {
    await this.initializeDbConnection();

    if (retreatId) {
      return await RegisterRetreat.find({ retreatId })
        .populate("userId")
        .populate("retreatId");
    }

    return await RegisterRetreat.find()
      .populate("userId")
      .populate("retreatId");
  }

  async deleteRegisterRetreat(registerRetreatId: string): Promise<boolean> {
    await this.initializeDbConnection();

    const registerRetreat = await RegisterRetreat.findById(registerRetreatId);
    if (!registerRetreat) return false;

    const result = await RegisterRetreat.findByIdAndDelete(registerRetreatId);
    return !!result;
  }

  async deleteRegisterRetreats(registerRetreatIds: string[]): Promise<boolean> {
    await this.initializeDbConnection();

    const result = await RegisterRetreat.deleteMany({
      _id: { $in: registerRetreatIds },
    });

    return result.deletedCount > 0;
  }

  async updateRegisterRetreat(
    registerRetreatId: string,
    registerRetreatData: IRegisterRetreatUpdate
  ): Promise<boolean> {
    await this.initializeDbConnection();
    const existingRegisterRetreat = await RegisterRetreat.findById(
      registerRetreatId
    );
    if (!existingRegisterRetreat) {
      throw new Error("Register retreat not found");
    }

    await RegisterRetreat.findByIdAndUpdate(
      registerRetreatId,
      registerRetreatData,
      {
        new: true,
      }
    );

    return true;
  }
}
