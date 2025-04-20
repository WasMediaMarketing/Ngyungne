import { toast } from "sonner";
import type { GalleryItemType } from "@/types/gallery";

// Response type that matches your API structure
interface ApiResponse<T> {
  success: boolean;
  message: string;
  data?: T;
}

// Gallery item interface for frontend use
export interface GalleryItem {
  _id: string;
  title: string;
  description: string;
  fullDescription?: string;
  type: GalleryItemType;
  image: string;
  videoUrl?: string;
  additionalImages?: string[];
  tags?: string[];
  date?: string;
  location?: string;
  photographer?: string;
  presenter?: string;
  event?: string;
  duration?: string;
  isVisible: boolean;
  createdAt?: string;
  updatedAt?: string;
}

// Helper function to get the admin token from localStorage
const getAdminToken = (): string | null => {
  if (typeof window !== "undefined") {
    return localStorage.getItem("adminToken");
  }
  return null;
};

// Helper function to create headers with authentication
const createAuthHeaders = (isMultipart = false): HeadersInit => {
  const token = getAdminToken();
  const headers: HeadersInit = {};

  if (!isMultipart) {
    headers["Content-Type"] = "application/json";
  }

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  return headers;
};

// Helper function to handle API responses\
const handleResponse = async <T>(response: Response): Promise<T> => {
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || `API error: ${response.status}`);
  }

  // Parse the response and extract the data property
  const result = (await response.json()) as ApiResponse<T>;
  return result.data as T;
};

// Helper function to validate ID
const validateId = (id: string | null): string => {
  if (!id || id === "undefined" || id === "null") {
    throw new Error("Invalid ID provided");
  }

  // Check if it's a valid MongoDB ObjectId
  if (!id.match(/^[0-9a-fA-F]{24}$/)) {
    console.error("Invalid ObjectId format:", id);
    throw new Error("Invalid gallery item ID format");
  }

  return id;
};

export const galleryApi = {
  // Get all gallery items (public - only visible ones)
  getGalleryItems: async (): Promise<GalleryItem[]> => {
    try {
      const response = await fetch("/api/gallery", {
        method: "GET",
      });
      return handleResponse<GalleryItem[]>(response);
    } catch (error) {
      console.error("Error fetching gallery items:", error);
      toast.error("Error", {
        description:
          error instanceof Error
            ? error.message
            : "Failed to fetch gallery items",
      });
      throw error;
    }
  },

  // Get all gallery items (admin - including hidden ones)
  getAdminGalleryItems: async (): Promise<GalleryItem[]> => {
    try {
      const response = await fetch("/api/gallery", {
        method: "GET",
        headers: createAuthHeaders(),
      });
      return handleResponse<GalleryItem[]>(response);
    } catch (error) {
      console.error("Error fetching admin gallery items:", error);
      toast.error("Error", {
        description:
          error instanceof Error
            ? error.message
            : "Failed to fetch gallery items",
      });
      throw error;
    }
  },

  // Get a specific gallery item by ID
  getGalleryItemById: async (id: string): Promise<GalleryItem> => {
    try {
      // Validate ID
      const validId = validateId(id);
      console.log("Fetching gallery item with validated ID:", validId);

      const response = await fetch(`/api/gallery/${validId}`, {
        method: "GET",
      });
      return handleResponse<GalleryItem>(response);
    } catch (error) {
      console.error(`Error fetching gallery item with ID ${id}:`, error);
      toast.error("Error", {
        description:
          error instanceof Error
            ? error.message
            : "Failed to fetch gallery item",
      });
      throw error;
    }
  },

  // Create a new gallery item
  createGalleryItem: async (formData: FormData): Promise<GalleryItem> => {
    try {
      const response = await fetch("/api/gallery", {
        method: "POST",
        headers: createAuthHeaders(true),
        body: formData,
      });

      const result = await handleResponse<GalleryItem>(response);

      toast.success("Success", {
        description: "Gallery item created successfully",
      });

      return result;
    } catch (error) {
      console.error("Error creating gallery item:", error);

      toast.error("Error", {
        description:
          error instanceof Error
            ? error.message
            : "Failed to create gallery item",
      });

      throw error;
    }
  },

  // Update a gallery item
  updateGalleryItem: async (
    id: string,
    formData: FormData
  ): Promise<GalleryItem> => {
    try {
      // Validate ID
      const validId = validateId(id);
      console.log("Updating gallery item with validated ID:", validId);

      const response = await fetch(`/api/gallery/${validId}`, {
        method: "PATCH",
        headers: createAuthHeaders(true),
        body: formData,
      });

      const result = await handleResponse<GalleryItem>(response);

      toast.success("Success", {
        description: "Gallery item updated successfully",
      });

      return result;
    } catch (error) {
      console.error(`Error updating gallery item with ID ${id}:`, error);

      toast.error("Error", {
        description:
          error instanceof Error
            ? error.message
            : "Failed to update gallery item",
      });

      throw error;
    }
  },

  // Update gallery item visibility
  toggleGalleryItemVisibility: async (
    id: string,
    isVisible: boolean
  ): Promise<GalleryItem> => {
    try {
      // Validate ID
      const validId = validateId(id);
      console.log(
        "Toggling visibility for gallery item with validated ID:",
        validId
      );

      const response = await fetch(`/api/gallery/${validId}`, {
        method: "PUT",
        headers: createAuthHeaders(),
        body: JSON.stringify({ isVisible }),
      });

      const result = await handleResponse<GalleryItem>(response);

      toast.success("Success", {
        description: `Gallery item is now ${isVisible ? "visible" : "hidden"}`,
      });

      return result;
    } catch (error) {
      console.error(
        `Error updating gallery item visibility with ID ${id}:`,
        error
      );

      toast.error("Error", {
        description:
          error instanceof Error
            ? error.message
            : "Failed to update gallery item visibility",
      });

      throw error;
    }
  },

  // Delete a gallery item
  deleteGalleryItem: async (id: string): Promise<boolean> => {
    try {
      // Validate ID
      const validId = validateId(id);
      console.log("Deleting gallery item with validated ID:", validId);

      const response = await fetch(`/api/gallery/${validId}`, {
        method: "DELETE",
        headers: createAuthHeaders(),
      });

      await handleResponse<{ success: boolean }>(response);

      toast.success("Success", {
        description: "Gallery item deleted successfully",
      });

      return true;
    } catch (error) {
      console.error(`Error deleting gallery item with ID ${id}:`, error);

      toast.error("Error", {
        description:
          error instanceof Error
            ? error.message
            : "Failed to delete gallery item",
      });

      throw error;
    }
  },

  // Delete multiple gallery items
  deleteGalleryItems: async (ids: string[]): Promise<boolean> => {
    try {
      // Filter out invalid IDs
      const validIds = ids.filter((id) => {
        try {
          validateId(id);
          return true;
        } catch (error) {
          console.error(`Invalid ID in batch delete: ${id}`);
          return false;
        }
      });

      if (validIds.length === 0) {
        throw new Error("No valid IDs provided");
      }

      const queryString = validIds.join(",");
      const response = await fetch(
        `/api/gallery?galleryItemIds=${queryString}`,
        {
          method: "DELETE",
          headers: createAuthHeaders(),
        }
      );

      await handleResponse<{ success: boolean }>(response);

      toast.success("Success", {
        description: `${validIds.length} gallery items deleted successfully`,
      });

      return true;
    } catch (error) {
      console.error("Error deleting multiple gallery items:", error);

      toast.error("Error", {
        description:
          error instanceof Error
            ? error.message
            : "Failed to delete gallery items",
      });

      throw error;
    }
  },
};
