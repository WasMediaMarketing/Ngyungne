import {
  type IAboutContent,
  type IHeroSection,
  ContentType,
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
  // Hero Section API
  getHeroSection: async (): Promise<IHeroSection> => {
    try {
      const response = await fetch("/api/about/hero", {
        method: "GET",
      });

      await handleResponse(response);
      const result = await response.json();
      return result.data || result;
    } catch (error) {
      console.error("Error fetching hero section:", error);
      throw error;
    }
  },

  updateHeroSection: async (
    heroData: Partial<IHeroSection>
  ): Promise<IHeroSection> => {
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
      throw error;
    }
  },

  // New method for file uploads
  updateHeroSectionWithFiles: async (
    formData: FormData
  ): Promise<IHeroSection> => {
    try {
      // Add authentication header to FormData request
      const response = await fetch("/api/about/hero", {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${getAdminToken()}`,
        },
        body: formData,
      });

      await handleResponse(response);
      const result = await response.json();
      toast.success("Success", {
        description: "Hero section updated successfully",
      });
      return result.data || result;
    } catch (error) {
      console.error("Error updating hero section with files:", error);
      throw error;
    }
  },

  // About Content API
  getAboutContents: async (
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
      console.error("Error fetching about contents:", error);
      throw error;
    }
  },

  getAboutContent: async (id: string): Promise<IAboutContent> => {
    try {
      const response = await fetch(`/api/about/content/${id}`, {
        method: "GET",
        headers: createAuthHeaders(),
      });

      await handleResponse(response);
      const result = await response.json();
      return result.data || result;
    } catch (error) {
      console.error(`Error fetching about content ${id}:`, error);
      throw error;
    }
  },

  createAboutContent: async (
    contentData: IAboutContent
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
      console.error("Error creating about content:", error);
      throw error;
    }
  },

  updateAboutContent: async (
    id: string,
    contentData: Partial<IAboutContent>
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
      console.error(`Error updating about content ${id}:`, error);
      throw error;
    }
  },

  deleteAboutContent: async (id: string): Promise<boolean> => {
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
      console.error(`Error deleting about content ${id}:`, error);
      return false;
    }
  },

  reorderAboutContents: async (
    contentType: ContentType,
    items: { id: string; order: number }[]
  ): Promise<boolean> => {
    try {
      const response = await fetch("/api/about/content/reorder", {
        method: "POST",
        headers: createAuthHeaders(),
        body: JSON.stringify({ contentType, items }),
      });

      await handleResponse(response);
      toast.success("Success", {
        description: "Content reordered successfully",
      });
      return true;
    } catch (error) {
      console.error("Error reordering about contents:", error);
      return false;
    }
  },
};
