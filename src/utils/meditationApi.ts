import type { IMeditationUpdate, IMeditation } from "@/types/meditation.types";
import { toast } from "sonner";

// Helper function to handle API responses
const handleResponse = async (response: Response) => {
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    const errorMessage = errorData.message || "An error occurred";
    toast.error("Error", { description: errorMessage });
    throw new Error(errorMessage);
  }
  return response;
};

// Helper function to get admin token
const getAdminToken = () => {
  return localStorage.getItem("adminToken") || "";
};

// Helper function to create headers with authentication
const createAuthHeaders = (contentType = "application/json") => {
  return {
    "Content-Type": contentType,
    Authorization: `Bearer ${getAdminToken()}`,
  };
};

// Keep track of recently viewed meditations to prevent double counting
const recentlyViewed = new Set<string>();

export const meditationApi = {
  // Get all meditations (admin view - includes both visible and hidden meditations)
  getAdminMeditations: async (): Promise<IMeditation[]> => {
    try {
      const response = await fetch("/api/meditation", {
        method: "GET",
        headers: createAuthHeaders(),
      });

      await handleResponse(response);
      const result = await response.json();
      // Handle both { data: IMeditation[] } and IMeditation[] response formats
      return Array.isArray(result) ? result : result.data || [];
    } catch (error) {
      console.error("Error fetching meditations:", error);
      throw error;
    }
  },

  // Get all visible meditations (public view - only includes published meditations)
  getPublicMeditations: async (): Promise<IMeditation[]> => {
    try {
      const response = await fetch("/api/meditation", {
        method: "GET",
      });

      await handleResponse(response);
      const result = await response.json();
      // Handle both { data: IMeditation[] } and IMeditation[] response formats
      return Array.isArray(result) ? result : result.data || [];
    } catch (error) {
      console.error("Error fetching public meditations:", error);
      throw error;
    }
  },

  // Get a single meditation by ID with view increment
  getMeditation: async (id: string): Promise<IMeditation> => {
    try {
      const response = await fetch(`/api/meditation/${id}`, {
        method: "GET",
        headers: createAuthHeaders(),
      });

      await handleResponse(response);
      const result = await response.json();

      // Increment views only if not recently viewed
      if (!recentlyViewed.has(id)) {
        recentlyViewed.add(id);
        // Remove from recently viewed after 30 minutes
        setTimeout(() => recentlyViewed.delete(id), 30 * 60 * 1000);

        // Increment views in background
        meditationApi.incrementViews(id).catch(console.error);
      }

      // Handle both { data: IMeditation } and IMeditation response formats
      return result.data || result;
    } catch (error) {
      console.error(`Error fetching meditation ${id}:`, error);
      throw error;
    }
  },

  // Create a new meditation
  createMeditation: async (meditationData: FormData): Promise<IMeditation> => {
    try {
      // Add authentication to FormData request
      const response = await fetch("/api/meditation", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${getAdminToken()}`,
        },
        body: meditationData,
      });

      await handleResponse(response);
      const result = await response.json();
      toast.success("Success", {
        description: "Meditation created successfully",
      });
      // Handle both { data: IMeditation } and IMeditation response formats
      return result.data || result;
    } catch (error) {
      console.error("Error creating meditation:", error);
      throw error;
    }
  },

  // Update a meditation (with FormData for image upload)
  updateMeditation: async (
    id: string,
    meditationData: FormData
  ): Promise<IMeditation> => {
    try {
      const response = await fetch(`/api/meditation/${id}`, {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${getAdminToken()}`,
        },
        body: meditationData,
      });

      await handleResponse(response);
      const result = await response.json();
      toast.success("Success", {
        description: "Meditation updated successfully",
      });
      // Handle both { data: IMeditation } and IMeditation response formats
      return result.data || result;
    } catch (error) {
      console.error(`Error updating meditation ${id}:`, error);
      throw error;
    }
  },

  // Update a meditation (JSON only, e.g., for toggling visibility)
  updateMeditationJson: async (
    id: string,
    meditationData: Partial<IMeditationUpdate>
  ): Promise<IMeditation> => {
    try {
      const response = await fetch(`/api/meditation/${id}`, {
        method: "PUT",
        headers: createAuthHeaders(),
        body: JSON.stringify(meditationData),
      });

      await handleResponse(response);
      const result = await response.json();
      toast.success("Success", {
        description: "Meditation updated successfully",
      });
      // Handle both { data: IMeditation } and IMeditation response formats
      return result.data || result;
    } catch (error) {
      console.error(`Error updating meditation ${id}:`, error);
      throw error;
    }
  },

  // Toggle meditation visibility
  toggleMeditationVisibility: async (
    id: string,
    isVisible: boolean
  ): Promise<boolean> => {
    try {
      const response = await fetch(`/api/meditation/${id}`, {
        method: "PUT",
        headers: createAuthHeaders(),
        body: JSON.stringify({ isVisible }),
      });

      await handleResponse(response);
      toast.success("Success", {
        description: `Meditation ${
          isVisible ? "published" : "unpublished"
        } successfully`,
      });
      return true;
    } catch (error) {
      console.error(`Error toggling meditation visibility ${id}:`, error);
      return false;
    }
  },

  // Increment view count for a meditation
  incrementViews: async (id: string): Promise<boolean> => {
    try {
      const response = await fetch(`/api/meditation/${id}/views`, {
        method: "POST",
      });

      await handleResponse(response);
      return true;
    } catch (error) {
      console.error(
        `Error incrementing view count for meditation ${id}:`,
        error
      );
      return false;
    }
  },

  // Delete a single meditation
  deleteMeditation: async (id: string): Promise<boolean> => {
    try {
      const response = await fetch(`/api/meditation/${id}`, {
        method: "DELETE",
        headers: createAuthHeaders(),
      });

      await handleResponse(response);
      toast.success("Success", {
        description: "Meditation deleted successfully",
      });
      return true;
    } catch (error) {
      console.error(`Error deleting meditation ${id}:`, error);
      return false;
    }
  },

  // Delete multiple meditations
  deleteMeditations: async (ids: string[]): Promise<boolean> => {
    try {
      const queryString = ids.join(",");
      const response = await fetch(
        `/api/meditation?meditationIds=${queryString}`,
        {
          method: "DELETE",
          headers: createAuthHeaders(),
        }
      );

      await handleResponse(response);
      toast.success("Success", {
        description: `${ids.length} meditations deleted successfully`,
      });
      return true;
    } catch (error) {
      console.error("Error deleting multiple meditations:", error);
      return false;
    }
  },
};
