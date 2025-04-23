import type {
  IAboutContent,
  IAboutContentInput,
  IAboutContentUpdate,
  ContentType,
  IHeroSection,
} from "@/types/about.types";
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

export const aboutApi = {
  // Get all content or filtered by type
  getContent: async (
    contentType?: ContentType,
    isVisible?: boolean
  ): Promise<IAboutContent[]> => {
    try {
      let url = "/api/about/content";
      const params = new URLSearchParams();

      if (contentType) {
        params.append("contentType", contentType);
      }

      if (isVisible !== undefined) {
        params.append("isVisible", isVisible.toString());
      }

      if (params.toString()) {
        url += `?${params.toString()}`;
      }

      const response = await fetch(url, {
        method: "GET",
      });

      await handleResponse(response);
      const result = await response.json();
      return Array.isArray(result) ? result : result.data || [];
    } catch (error) {
      console.error("Error fetching about content:", error);
      throw error;
    }
  },

  // Get content by ID
  getContentById: async (id: string): Promise<IAboutContent> => {
    try {
      const response = await fetch(`/api/about/content/${id}`, {
        method: "GET",
      });

      await handleResponse(response);
      const result = await response.json();
      return result.data || result;
    } catch (error) {
      console.error(`Error fetching content ${id}:`, error);
      throw error;
    }
  },

  // Create new content
  createContent: async (
    contentData: IAboutContentInput
  ): Promise<IAboutContent> => {
    try {
      const response = await fetch("/api/about/content", {
        method: "POST",
        headers: createAuthHeaders(),
        body: JSON.stringify(contentData),
      });

      await handleResponse(response);
      const result = await response.json();
      toast.success("Success", {
        description: "Content created successfully",
      });
      return result.data || result;
    } catch (error) {
      console.error("Error creating content:", error);
      throw error;
    }
  },

  // Update content
  updateContent: async (
    id: string,
    contentData: IAboutContentUpdate
  ): Promise<IAboutContent> => {
    try {
      const response = await fetch(`/api/about/content/${id}`, {
        method: "PUT",
        headers: createAuthHeaders(),
        body: JSON.stringify(contentData),
      });

      await handleResponse(response);
      const result = await response.json();
      toast.success("Success", {
        description: "Content updated successfully",
      });
      return result.data || result;
    } catch (error) {
      console.error(`Error updating content ${id}:`, error);
      throw error;
    }
  },

  // Delete content
  deleteContent: async (id: string): Promise<boolean> => {
    try {
      const response = await fetch(`/api/about/content/${id}`, {
        method: "DELETE",
        headers: createAuthHeaders(),
      });

      await handleResponse(response);
      toast.success("Success", {
        description: "Content deleted successfully",
      });
      return true;
    } catch (error) {
      console.error(`Error deleting content ${id}:`, error);
      return false;
    }
  },

  // Get hero section
  getHeroSection: async (): Promise<IHeroSection | null> => {
    try {
      const response = await fetch("/api/about/hero", {
        method: "GET",
      });

      await handleResponse(response);
      const result = await response.json();
      return result.data || result;
    } catch (error) {
      console.error("Error fetching hero section:", error);
      return null;
    }
  },

  // Update hero section
  updateHeroSection: async (
    heroData: Partial<IHeroSection>
  ): Promise<IHeroSection | null> => {
    try {
      const response = await fetch("/api/about/hero", {
        method: "PUT",
        headers: createAuthHeaders(),
        body: JSON.stringify(heroData),
      });

      await handleResponse(response);
      const result = await response.json();
      toast.success("Success", {
        description: "Hero section updated successfully",
      });
      return result.data || result;
    } catch (error) {
      console.error("Error updating hero section:", error);
      return null;
    }
  },
};
