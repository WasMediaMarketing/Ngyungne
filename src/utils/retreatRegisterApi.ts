import { toast } from "sonner";
import type {
  IRegisterRetreatInput,
  IRegisterRetreatUpdate,
  IRegisterRetreatData,
} from "@/types";
import { Types } from "mongoose";

// Retreat Registration API functions
export const retreatRegisterApi = {
  // Get all retreat registrations (admin only)
  getRegistrations: async (): Promise<IRegisterRetreatData[]> => {
    try {
      const response = await fetch("/api/register-retreat", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("adminToken")}`,
        },
      });

      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }

      const { data } = await response.json();
      return Array.isArray(data) ? data : [];
    } catch (error) {
      console.error("Error fetching retreat registrations:", error);
      toast.error("Error", {
        description: "Failed to fetch retreat registrations",
      });
      return [];
    }
  },

  // Get registration by ID (admin only)
  getRegistrationById: async (
    id: string
  ): Promise<IRegisterRetreatData | null> => {
    try {
      const response = await fetch(`/api/register-retreat/${id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("adminToken")}`,
        },
      });

      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }
      const { data } = await response.json();
      return data;
    } catch (error) {
      console.error(`Error fetching retreat registration ${id}:`, error);
      toast.error("Error", {
        description: "Failed to fetch registration details",
      });
      return null;
    }
  },

  // Create a new retreat registration
  registerForRetreat: async (
    formData: Omit<IRegisterRetreatInput, "retreatId"> & { retreatId: string }
  ): Promise<boolean> => {
    try {
      // Convert string retreatId to ObjectId format for the API
      const registrationData: IRegisterRetreatInput = {
        ...formData,
        retreatId: new Types.ObjectId(formData.retreatId),
      };

      const response = await fetch("/api/register-retreat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(registrationData),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `Error: ${response.status}`);
      }

      return true;
    } catch (error: any) {
      console.error("Error registering for retreat:", error);

      return false;
    }
  },

  // Update a retreat registration (admin only)
  updateRegistration: async (
    id: string,
    updateData: IRegisterRetreatUpdate
  ): Promise<boolean> => {
    try {
      const response = await fetch(`/api/register-retreat/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("adminToken")}`,
        },
        body: JSON.stringify(updateData),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `Error: ${response.status}`);
      }

      return true;
    } catch (error: any) {
      console.error(`Error updating registration ${id}:`, error);

      return false;
    }
  },

  // Delete a retreat registration (admin only)
  deleteRegistration: async (id: string): Promise<boolean> => {
    try {
      const response = await fetch(`/api/register-retreat/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("adminToken")}`,
        },
      });

      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }

      return true;
    } catch (error) {
      console.error(`Error deleting registration ${id}:`, error);

      return false;
    }
  },

  // Delete multiple retreat registrations (admin only)
  deleteRegistrations: async (ids: string[]): Promise<boolean> => {
    try {
      const response = await fetch(
        `/api/register-retreat?registerRetreatIds=${ids.join(",")}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("adminToken")}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }

      return true;
    } catch (error) {
      console.error("Error deleting registrations:", error);

      return false;
    }
  },
};
