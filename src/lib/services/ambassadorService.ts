import { AmbassadorModel } from "@/lib/models/ambassador.model";
import {
  Ambassador,
  CreateAmbassadorInput,
  UpdateAmbassadorInput,
  UpdateAmbassadorVisibilityInput,
} from "@/types/ambassador.types";
import { connectToDatabase } from "../utils/mongodb";

export class AmbassadorService {
  async getAmbassadors(showAll: boolean = false): Promise<Ambassador[]> {
    await connectToDatabase();

    const query = showAll ? {} : { isVisible: true };
    const ambassadors = await AmbassadorModel.find(query).sort({
      createdAt: -1,
    });

    return ambassadors.map((ambassador) => ambassador.toJSON());
  }

  async getAmbassadorById(id: string): Promise<Ambassador | null> {
    await connectToDatabase();

    const ambassador = await AmbassadorModel.findById(id);

    return ambassador ? ambassador.toJSON() : null;
  }

  async createAmbassador(data: any): Promise<Ambassador> {
    await connectToDatabase();

    const ambassador = new AmbassadorModel({
      ...data,
      isVisible: data.isVisible !== undefined ? data.isVisible : false,
    });

    await ambassador.save();

    return ambassador.toJSON();
  }

  async updateAmbassador(
    id: string,
    data: UpdateAmbassadorInput
  ): Promise<Ambassador | null> {
    await connectToDatabase();

    const ambassador = await AmbassadorModel.findByIdAndUpdate(
      id,
      { $set: data },
      { new: true }
    );

    return ambassador ? ambassador.toJSON() : null;
  }

  async updateAmbassadorVisibility(
    id: string,
    data: UpdateAmbassadorVisibilityInput
  ): Promise<Ambassador | null> {
    await connectToDatabase();

    const ambassador = await AmbassadorModel.findByIdAndUpdate(
      id,
      { $set: { isVisible: data.isVisible } },
      { new: true }
    );

    return ambassador ? ambassador.toJSON() : null;
  }

  async deleteAmbassador(id: string): Promise<boolean> {
    await connectToDatabase();

    const result = await AmbassadorModel.findByIdAndDelete(id);

    return !!result;
  }

  async deleteAmbassadors(ids: string[]): Promise<number> {
    await connectToDatabase();

    const result = await AmbassadorModel.deleteMany({ _id: { $in: ids } });

    return result.deletedCount || 0;
  }
}
