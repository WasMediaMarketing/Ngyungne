import {
  CreateSettingInput,
  Setting,
  UpdateSettingInput,
} from "@/types/setting.types";

// Get settings
export async function getSettings(): Promise<Setting> {
  try {
    const response = await fetch("/api/setting", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Failed to fetch settings");
    }

    return response.json();
  } catch (error) {
    console.error("Error fetching settings:", error);
    throw error;
  }
}

// Create or update settings
export async function createSettings(
  data: CreateSettingInput
): Promise<Setting> {
  try {
    const response = await fetch("/api/setting", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("adminToken")}`,
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(
        errorData.message ||
          errorData.errors?.join(", ") ||
          "Failed to create settings"
      );
    }

    return response.json();
  } catch (error) {
    console.error("Error creating settings:", error);
    throw error;
  }
}

// Update settings
export async function updateSettings(
  data: UpdateSettingInput
): Promise<Setting> {
  try {
    const response = await fetch("/api/setting", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("adminToken")}`,
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(
        errorData.message ||
          errorData.errors?.join(", ") ||
          "Failed to update settings"
      );
    }

    return response.json();
  } catch (error) {
    console.error("Error updating settings:", error);
    throw error;
  }
}

// Reset settings to defaults
export async function resetSettings(): Promise<{ message: string }> {
  try {
    const response = await fetch("/api/setting", {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("adminToken")}`,
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Failed to reset settings");
    }

    return response.json();
  } catch (error) {
    console.error("Error resetting settings:", error);
    throw error;
  }
}
