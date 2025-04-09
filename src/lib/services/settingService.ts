import SettingModel from "@/lib/models/setting.model";
import {
  CreateSettingInput,
  Setting,
  UpdateSettingInput,
} from "@/types/setting.types";
import { connectToDatabase } from "../utils/mongodb";

export class SettingService {
  constructor() {
    // Ensure database connection is established
    connectToDatabase();
  }
  async getSetting(): Promise<Setting | null> {
    try {
      // Use findOrCreate to ensure we always have a setting document
      const setting = await SettingModel.findOrCreate();
      return setting.toObject();
    } catch (error) {
      console.error("Error getting setting:", error);
      throw error;
    }
  }

  async createSetting(data: CreateSettingInput): Promise<Setting> {
    try {
      // Check if setting already exists
      const existingSetting = await SettingModel.findOne();

      if (existingSetting) {
        // If exists, update it instead
        const updated = await this.updateSetting(existingSetting.id, data);
        if (!updated) {
          throw new Error("Failed to update existing setting");
        }
        return updated;
      }

      // Create new setting
      const setting = await SettingModel.create(data);
      return setting.toObject();
    } catch (error) {
      console.error("Error creating setting:", error);
      throw error;
    }
  }

  async updateSetting(
    id: string,
    data: UpdateSettingInput
  ): Promise<Setting | null> {
    try {
      const setting = await SettingModel.findById(id);

      if (!setting) {
        return null;
      }

      // Update organization info if provided
      if (data.organizationInfo) {
        Object.assign(setting.organizationInfo, data.organizationInfo);
      }

      // Replace payment info if provided
      if (data.paymentInfo) {
        setting.paymentInfo = data.paymentInfo;
      }

      // Update meta info if provided
      if (data.metaInfo) {
        Object.assign(setting.metaInfo, data.metaInfo);
      }

      await setting.save();
      return setting.toObject();
    } catch (error) {
      console.error("Error updating setting:", error);
      throw error;
    }
  }

  async deleteSetting(): Promise<boolean> {
    try {
      // Since we want to maintain one setting document, we'll just reset to defaults
      // instead of actually deleting
      const setting = await SettingModel.findOne();

      if (!setting) {
        return false;
      }

      setting.organizationInfo = {
        name: "Ngyungne Practice",
        address: "Jorpati, Gokarneshwor 5, Kathmandu, Nepal",
        email: "donation@ngyungne.org",
        phone: "+977 9818123174",
        socialLinks: [],
      };

      setting.paymentInfo = [];

      setting.metaInfo = {
        title: "Ngyungne Practice",
        description:
          "Ngyungne Practice is a serene space in Nepal dedicated to deepening spiritual practice and meditation, offering a peaceful environment for personal growth and healing through traditional methods.",
        keywords: [
          "Ngyungne Practice",
          "meditation",
          "spiritual growth",
          "Nepal retreats",
          "peaceful meditation",
          "healing practices",
          "Buddhism",
          "meditation center",
          "spiritual retreat",
          "mindfulness",
          "meditative practices",
          "Nepal wellness",
        ],
        ogImage: "https://example.com/og-image.jpg",
        favicon: "https://example.com/favicon.ico",
        twitterHandle: "@ngyungnepractice",
      };

      await setting.save();
      return true;
    } catch (error) {
      console.error("Error resetting setting:", error);
      throw error;
    }
  }
}
