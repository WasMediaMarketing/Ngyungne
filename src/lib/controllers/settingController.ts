import { NextRequest, NextResponse } from "next/server";
import { SettingService } from "@/lib/services/settingService";
import { CreateSettingInput, UpdateSettingInput } from "@/types/setting.types";

export class SettingController {
  private settingService: SettingService;

  constructor(settingService: SettingService) {
    this.settingService = settingService;
  }

  async getSetting(): Promise<NextResponse> {
    try {
      const setting = await this.settingService.getSetting();

      if (!setting) {
        return NextResponse.json(
          { message: "Setting not found" },
          { status: 404 }
        );
      }

      return NextResponse.json(setting);
    } catch (error) {
      console.error("Error in getSetting controller:", error);
      return NextResponse.json(
        { message: "Internal server error" },
        { status: 500 }
      );
    }
  }

  async createSetting(data: CreateSettingInput): Promise<NextResponse> {
    try {
      const setting = await this.settingService.createSetting(data);

      return NextResponse.json(setting, { status: 201 });
    } catch (error) {
      console.error("Error in createSetting controller:", error);
      return NextResponse.json(
        { message: "Internal server error" },
        { status: 500 }
      );
    }
  }

  async updateSetting(data: UpdateSettingInput): Promise<NextResponse> {
    try {
      const setting = await this.settingService.getSetting();

      if (!setting) {
        return NextResponse.json(
          { message: "Setting not found" },
          { status: 404 }
        );
      }

      const updatedSetting = await this.settingService.updateSetting(
        setting.id,
        data
      );

      if (!updatedSetting) {
        return NextResponse.json(
          { message: "Failed to update setting" },
          { status: 500 }
        );
      }

      return NextResponse.json(updatedSetting);
    } catch (error) {
      console.error("Error in updateSetting controller:", error);
      return NextResponse.json(
        { message: "Internal server error" },
        { status: 500 }
      );
    }
  }

  async deleteSetting(): Promise<NextResponse> {
    try {
      const result = await this.settingService.deleteSetting();

      if (!result) {
        return NextResponse.json(
          { message: "Setting not found" },
          { status: 404 }
        );
      }

      return NextResponse.json({
        message: "Setting reset to defaults successfully",
      });
    } catch (error) {
      console.error("Error in deleteSetting controller:", error);
      return NextResponse.json(
        { message: "Internal server error" },
        { status: 500 }
      );
    }
  }
}
