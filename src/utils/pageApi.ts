import { toast } from "sonner";

// Define the Page interface for frontend use
export interface PageUI {
  id: string;
  title: string;
  slug: string;
  location: "header" | "footer";
  parentPage?: string;
  content: string;
  status: "draft" | "published";
  metaTitle?: string;
  metaKeywords?: string;
  metaDescription?: string;
  lastUpdated?: string;
  createdAt: Date;
  updatedAt: Date;
}

// Define the input types for creating and updating pages
export interface CreatePageInput {
  title: string;
  slug: string;
  location: "header" | "footer";
  parentPage?: string;
  content: string;
  status: "draft" | "published";
  metaTitle?: string;
  metaKeywords?: string;
  metaDescription?: string;
}

export interface UpdatePageInput {
  title?: string;
  slug?: string;
  location?: "header" | "footer";
  parentPage?: string;
  content?: string;
  status?: "draft" | "published";
  metaTitle?: string;
  metaKeywords?: string;
  metaDescription?: string;
}

// The admin token for authenticated requests
const getAdminToken = () => {
  if (typeof window !== "undefined") {
    return (
      localStorage.getItem("adminToken") ||
      process.env.NEXT_PUBLIC_ADMIN_TOKEN ||
      ""
    );
  }
  return process.env.NEXT_PUBLIC_ADMIN_TOKEN || "";
};

// Base API URL
const API_URL = "/api/pages";
const BASE_URL = "http://localhost:3000"; // Adjust this as needed

// Helper function to handle API errors
const handleApiError = (error: unknown, customMessage?: string): never => {
  console.error("API Error:", error);
  const message =
    customMessage || "An error occurred while processing your request";
  if (typeof window !== "undefined") {
    toast.error("Error", { description: message });
  }
  throw new Error(message);
};

// New function to log errors without throwing
const logApiError = (error: unknown, customMessage?: string) => {
  console.error("API Error:", error);
  const message =
    customMessage || "An error occurred while processing your request";
  if (typeof window !== "undefined") {
    toast.error("Error", { description: message });
  }
  return null;
};

export const pageApi = {
  // Get all pages (admin view - includes drafts)
  async getAdminPages(): Promise<PageUI[]> {
    try {
      const response = await fetch(API_URL, {
        headers: {
          Authorization: `Bearer ${getAdminToken()}`,
        },
        cache: "no-store",
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch pages: ${response.statusText}`);
      }

      const data = await response.json();
      return data.data.pages;
    } catch (error) {
      return handleApiError(error, "Failed to fetch pages");
    }
  },

  // Get published pages only (public view)
  async getPublishedPages(): Promise<PageUI[]> {
    try {
      const response = await fetch(`${API_URL}?published=true`, {
        next: { revalidate: 60 }, // Revalidate every minute
      });

      if (!response.ok) {
        throw new Error(
          `Failed to fetch published pages: ${response.statusText}`
        );
      }

      const data = await response.json();
      return data.data.pages;
    } catch (error) {
      return handleApiError(error, "Failed to fetch published pages");
    }
  },

  // Get a page by slug - FIXED to handle errors gracefully
  async getPageBySlug(slug: string): Promise<PageUI | null> {
    try {
      const url = `${BASE_URL}/api/pages/slug/${slug}`;
      console.log(`Fetching from: ${url}`);

      const response = await fetch(url, {
        next: { revalidate: 60 },
      });

      if (!response.ok) {
        console.error(`Status: ${response.status}`);
        return null;
      }

      const data = await response.json();
      return data.data.page;
    } catch (error) {
      console.error(`Error fetching page with slug: ${slug}`, error);
      return null;
    }
  },

  // Create a new page
  async createPage(pageData: CreatePageInput): Promise<PageUI> {
    try {
      const response = await fetch(API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${getAdminToken()}`,
        },
        body: JSON.stringify(pageData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.message || `Failed to create page: ${response.statusText}`
        );
      }

      const data = await response.json();
      return data.data;
    } catch (error) {
      return handleApiError(error, "Failed to create page");
    }
  },

  // Update a page
  async updatePage(pageId: string, pageData: UpdatePageInput): Promise<PageUI> {
    try {
      const response = await fetch(`${API_URL}/${pageId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${getAdminToken()}`,
        },
        body: JSON.stringify(pageData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.message || `Failed to update page: ${response.statusText}`
        );
      }

      const data = await response.json();
      return data.data;
    } catch (error) {
      return handleApiError(error, "Failed to update page");
    }
  },

  // Delete a page
  async deletePage(pageId: string): Promise<boolean> {
    try {
      const response = await fetch(`${API_URL}/${pageId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${getAdminToken()}`,
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to delete page: ${response.statusText}`);
      }

      return true;
    } catch (error) {
      handleApiError(error, "Failed to delete page");
      return false;
    }
  },

  // Delete multiple pages
  async deletePages(pageIds: string[]): Promise<boolean> {
    try {
      const response = await fetch(`${API_URL}?pageIds=${pageIds.join(",")}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${getAdminToken()}`,
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to delete pages: ${response.statusText}`);
      }

      return true;
    } catch (error) {
      handleApiError(error, "Failed to delete selected pages");
      return false;
    }
  },

  // Toggle page status (draft/published)
  async togglePageStatus(
    pageId: string,
    currentStatus: "draft" | "published"
  ): Promise<boolean> {
    try {
      const newStatus = currentStatus === "draft" ? "published" : "draft";
      console.log(
        `Toggling page ${pageId} status from ${currentStatus} to ${newStatus}`
      );
      console.log(`Using auth token: ${getAdminToken().substring(0, 5)}...`);

      const response = await fetch(`${API_URL}/${pageId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${getAdminToken()}`,
        },
        body: JSON.stringify({ status: newStatus }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.error("Error response:", errorData);
        throw new Error(
          errorData.message ||
            `Failed to update page status: ${response.statusText}`
        );
      }

      return true;
    } catch (error) {
      console.error("Error toggling page status:", error);
      handleApiError(error, "Failed to update page status");
      return false;
    }
  },
};
