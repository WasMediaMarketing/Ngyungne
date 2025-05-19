import type { ISliderUpdate, ISlider } from "@/types";
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

export const sliderApi = {
  // Get all sliders (admin view - includes both visible and hidden sliders)
  getAdminSliders: async (): Promise<ISlider[]> => {
    try {
      const response = await fetch("/api/slider", {
        method: "GET",
        headers: createAuthHeaders(),
      });

      await handleResponse(response);
      const result = await response.json();
      // Handle both { data: ISlider[] } and ISlider[] response formats
      return Array.isArray(result) ? result : result.data || [];
    } catch (error) {
      console.error("Error fetching sliders:", error);
      throw error;
    }
  },

  // Get all visible sliders (public view - only includes published sliders)
  getPublicSliders: async (): Promise<ISlider[]> => {
    try {
      const response = await fetch("/api/slider", {
        method: "GET",
      });

      await handleResponse(response);
      const result = await response.json();
      // Handle both { data: ISlider[] } and ISlider[] response formats
      return Array.isArray(result) ? result : result.data || [];
    } catch (error) {
      console.error("Error fetching public sliders:", error);
      throw error;
    }
  },

  // Get a single slider by ID
  getSlider: async (id: string): Promise<ISlider> => {
    try {
      const response = await fetch(`/api/slider/${id}`, {
        method: "GET",
        headers: createAuthHeaders(),
      });

      await handleResponse(response);
      const result = await response.json();
      // Handle both { data: ISlider } and ISlider response formats
      return result.data || result;
    } catch (error) {
      console.error(`Error fetching slider ${id}:`, error);
      throw error;
    }
  },

  // Create a new slider
  createSlider: async (sliderData: FormData): Promise<ISlider> => {
    try {
      // Add authentication to FormData request
      const response = await fetch("/api/slider", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${getAdminToken()}`,
        },
        body: sliderData,
      });

      await handleResponse(response);
      const result = await response.json();
      toast.success("Success", {
        description: "Slider created successfully",
      });
      // Handle both { data: ISlider } and ISlider response formats
      return result.data || result;
    } catch (error) {
      console.error("Error creating slider:", error);
      throw error;
    }
  },

  // Update a slider (with FormData for image/video upload)
  updateSlider: async (id: string, sliderData: FormData): Promise<ISlider> => {
    try {
      const response = await fetch(`/api/slider/${id}`, {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${getAdminToken()}`,
        },
        body: sliderData,
      });

      await handleResponse(response);
      const result = await response.json();
      toast.success("Success", {
        description: "Slider updated successfully",
      });
      // Handle both { data: ISlider } and ISlider response formats
      return result.data || result;
    } catch (error) {
      console.error(`Error updating slider ${id}:`, error);
      throw error;
    }
  },

  // Update a slider (JSON only, e.g., for toggling visibility)
  updateSliderJson: async (
    id: string,
    sliderData: Partial<ISliderUpdate>
  ): Promise<ISlider> => {
    try {
      const response = await fetch(`/api/slider/${id}`, {
        method: "PUT",
        headers: createAuthHeaders(),
        body: JSON.stringify(sliderData),
      });

      await handleResponse(response);
      const result = await response.json();
      toast.success("Success", {
        description: "Slider updated successfully",
      });
      // Handle both { data: ISlider } and ISlider response formats
      return result.data || result;
    } catch (error) {
      console.error(`Error updating slider ${id}:`, error);
      throw error;
    }
  },

  // Toggle slider visibility
  toggleSliderVisibility: async (
    id: string,
    isVisible: boolean
  ): Promise<boolean> => {
    try {
      const response = await fetch(`/api/slider/${id}`, {
        method: "PUT",
        headers: createAuthHeaders(),
        body: JSON.stringify({ isVisible }),
      });

      await handleResponse(response);
      toast.success("Success", {
        description: `Slider ${
          isVisible ? "published" : "unpublished"
        } successfully`,
      });
      return true;
    } catch (error) {
      console.error(`Error toggling slider visibility ${id}:`, error);
      return false;
    }
  },

  // Delete a single slider
  deleteSlider: async (id: string): Promise<boolean> => {
    try {
      const response = await fetch(`/api/slider/${id}`, {
        method: "DELETE",
        headers: createAuthHeaders(),
      });

      await handleResponse(response);
      toast.success("Success", {
        description: "Slider deleted successfully",
      });
      return true;
    } catch (error) {
      console.error(`Error deleting slider ${id}:`, error);
      return false;
    }
  },

  // Delete multiple sliders
  deleteSliders: async (ids: string[]): Promise<boolean> => {
    try {
      const queryString = ids.join(",");
      const response = await fetch(`/api/slider?sliderIds=${queryString}`, {
        method: "DELETE",
        headers: createAuthHeaders(),
      });

      await handleResponse(response);
      toast.success("Success", {
        description: `${ids.length} sliders deleted successfully`,
      });
      return true;
    } catch (error) {
      console.error("Error deleting multiple sliders:", error);
      return false;
    }
  },

  // Reorder sliders
  reorderSliders: async (
    items: { id: string; order: number }[]
  ): Promise<boolean> => {
    try {
      const response = await fetch("/api/slider/reorder", {
        method: "POST",
        headers: createAuthHeaders(),
        body: JSON.stringify({ items }),
      });

      await handleResponse(response);
      toast.success("Success", {
        description: "Sliders reordered successfully",
      });
      return true;
    } catch (error) {
      console.error("Error reordering sliders:", error);
      return false;
    }
  },
};
