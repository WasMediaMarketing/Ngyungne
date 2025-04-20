import { toast } from "sonner";
import type { IRetreat, IRetreatInput, IRetreatUpdate } from "@/types";

// Retreat API functions
export const retreatApi = {
  // Get all retreats (public - only visible retreats)
  getPublicRetreats: async (): Promise<IRetreat[]> => {
    try {
      const response = await fetch("/api/retreat");

      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }

      const { data } = await response.json();
      return Array.isArray(data) ? data : [];
    } catch (error) {
      console.error("Error fetching public retreats:", error);
      toast.error("Error", {
        description: "Failed to fetch retreats",
      });
      return [];
    }
  },

  // Get all retreats (admin - includes visible and hidden retreats)
  getAdminRetreats: async (): Promise<IRetreat[]> => {
    try {
      const response = await fetch("/api/retreat", {
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
      console.error("Error fetching admin retreats:", error);
      toast.error("Error", {
        description: "Failed to fetch retreats",
      });
      return [];
    }
  },

  // Get retreat by ID
  getRetreatById: async (id: string): Promise<IRetreat | null> => {
    try {
      const response = await fetch(`/api/retreat/${id}`);

      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }
      const { data } = await response.json();
      return data;
    } catch (error) {
      console.error(`Error fetching retreat ${id}:`, error);
      toast.error("Error", {
        description: "Failed to fetch retreat details",
      });
      return null;
    }
  },

  // Create a new retreat
  createRetreat: async (retreatData: IRetreatInput): Promise<boolean> => {
    try {
      const response = await fetch("/api/retreat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("adminToken")}`,
        },
        body: JSON.stringify(retreatData),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `Error: ${response.status}`);
      }

      toast.success("Success", {
        description: "Retreat created successfully",
      });
      return true;
    } catch (error: any) {
      console.error("Error creating retreat:", error);
      toast.error("Error", {
        description: error.message || "Failed to create retreat",
      });
      return false;
    }
  },

  // Update a retreat
  updateRetreat: async (
    id: string,
    retreatData: IRetreatUpdate
  ): Promise<boolean> => {
    try {
      const response = await fetch(`/api/retreat/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("adminToken")}`,
        },
        body: JSON.stringify(retreatData),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `Error: ${response.status}`);
      }

      toast.success("Success", {
        description: "Retreat updated successfully",
      });
      return true;
    } catch (error: any) {
      console.error(`Error updating retreat ${id}:`, error);
      toast.error("Error", {
        description: error.message || "Failed to update retreat",
      });
      return false;
    }
  },

  // Toggle retreat visibility
  toggleRetreatVisibility: async (
    id: string,
    isVisible: boolean
  ): Promise<boolean> => {
    try {
      const response = await fetch(`/api/retreat/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("adminToken")}`,
        },
        body: JSON.stringify({ isVisible }),
      });

      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }

      toast.success("Success", {
        description: `Retreat ${
          isVisible ? "published" : "unpublished"
        } successfully`,
      });
      return true;
    } catch (error) {
      console.error(`Error toggling retreat visibility ${id}:`, error);
      toast.error("Error", {
        description: `Failed to ${isVisible ? "publish" : "unpublish"} retreat`,
      });
      return false;
    }
  },

  // Delete a retreat
  deleteRetreat: async (id: string): Promise<boolean> => {
    try {
      const response = await fetch(`/api/retreat/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("adminToken")}`,
        },
      });

      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }

      toast.success("Success", {
        description: "Retreat deleted successfully",
      });
      return true;
    } catch (error) {
      console.error(`Error deleting retreat ${id}:`, error);
      toast.error("Error", {
        description: "Failed to delete retreat",
      });
      return false;
    }
  },

  // Delete multiple retreats
  deleteRetreats: async (ids: string[]): Promise<boolean> => {
    try {
      const response = await fetch(`/api/retreat?retreatIds=${ids.join(",")}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("adminToken")}`,
        },
      });

      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }

      toast.success("Success", {
        description: `${ids.length} retreats deleted successfully`,
      });
      return true;
    } catch (error) {
      console.error("Error deleting retreats:", error);
      toast.error("Error", {
        description: "Failed to delete retreats",
      });
      return false;
    }
  },
};
