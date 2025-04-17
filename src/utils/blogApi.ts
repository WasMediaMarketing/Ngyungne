import type { IBlogPostUpdate, IBlogPost } from "@/types";
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

export const blogApi = {
  // Get all blog posts (admin view - includes both visible and hidden posts)
  getAdminBlogPosts: async (): Promise<IBlogPost[]> => {
    try {
      const response = await fetch("/api/blogpost", {
        method: "GET",
        headers: createAuthHeaders(),
      });

      await handleResponse(response);
      const result = await response.json();
      // Handle both { data: IBlogPost[] } and IBlogPost[] response formats
      return Array.isArray(result) ? result : result.data || [];
    } catch (error) {
      console.error("Error fetching blog posts:", error);
      throw error;
    }
  },

  // Get all visible blog posts (public view - only includes published posts)
  getPublicBlogPosts: async (): Promise<IBlogPost[]> => {
    try {
      const response = await fetch("/api/blogpost", {
        method: "GET",
      });

      await handleResponse(response);
      const result = await response.json();
      // Handle both { data: IBlogPost[] } and IBlogPost[] response formats
      return Array.isArray(result) ? result : result.data || [];
    } catch (error) {
      console.error("Error fetching public blog posts:", error);
      throw error;
    }
  },

  // Get a single blog post by ID
  getBlogPost: async (id: string): Promise<IBlogPost> => {
    try {
      const response = await fetch(`/api/blogpost/${id}`, {
        method: "GET",
        headers: createAuthHeaders(),
      });

      await handleResponse(response);
      const result = await response.json();
      // Handle both { data: IBlogPost } and IBlogPost response formats
      return result.data || result;
    } catch (error) {
      console.error(`Error fetching blog post ${id}:`, error);
      throw error;
    }
  },

  // Create a new blog post
  createBlogPost: async (blogPostData: FormData): Promise<IBlogPost> => {
    try {
      // Add authentication to FormData request
      const response = await fetch("/api/blogpost", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${getAdminToken()}`,
        },
        body: blogPostData,
      });

      await handleResponse(response);
      const result = await response.json();
      toast.success("Success", {
        description: "Blog post created successfully",
      });
      // Handle both { data: IBlogPost } and IBlogPost response formats
      return result.data || result;
    } catch (error) {
      console.error("Error creating blog post:", error);
      throw error;
    }
  },

  // Update a blog post (with FormData for image upload)
  updateBlogPost: async (
    id: string,
    blogPostData: FormData
  ): Promise<IBlogPost> => {
    console.log("updateBlogPost", id, blogPostData);
    try {
      const response = await fetch(`/api/blogpost/${id}`, {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${getAdminToken()}`,
        },
        body: blogPostData,
      });

      await handleResponse(response);
      const result = await response.json();
      toast.success("Success", {
        description: "Blog post updated successfully",
      });
      // Handle both { data: IBlogPost } and IBlogPost response formats
      return result.data || result;
    } catch (error) {
      console.error(`Error updating blog post ${id}:`, error);
      throw error;
    }
  },

  // Update a blog post (JSON only, e.g., for toggling visibility)
  updateBlogPostJson: async (
    id: string,
    blogPostData: Partial<IBlogPostUpdate>
  ): Promise<IBlogPost> => {
    try {
      const response = await fetch(`/api/blogpost/${id}`, {
        method: "PUT",
        headers: createAuthHeaders(),
        body: JSON.stringify(blogPostData),
      });

      await handleResponse(response);
      const result = await response.json();
      toast.success("Success", {
        description: "Blog post updated successfully",
      });
      // Handle both { data: IBlogPost } and IBlogPost response formats
      return result.data || result;
    } catch (error) {
      console.error(`Error updating blog post ${id}:`, error);
      throw error;
    }
  },

  // Toggle blog post visibility
  toggleBlogPostVisibility: async (
    id: string,
    isVisible: boolean
  ): Promise<boolean> => {
    try {
      const response = await fetch(`/api/blogpost/${id}`, {
        method: "PUT",
        headers: createAuthHeaders(),
        body: JSON.stringify({ isVisible }),
      });

      await handleResponse(response);
      toast.success("Success", {
        description: `Blog post ${
          isVisible ? "published" : "unpublished"
        } successfully`,
      });
      return true;
    } catch (error) {
      console.error(`Error toggling blog post visibility ${id}:`, error);
      return false;
    }
  },

  // Delete a single blog post
  deleteBlogPost: async (id: string): Promise<boolean> => {
    try {
      const response = await fetch(`/api/blogpost/${id}`, {
        method: "DELETE",
        headers: createAuthHeaders(),
      });

      await handleResponse(response);
      toast.success("Success", {
        description: "Blog post deleted successfully",
      });
      return true;
    } catch (error) {
      console.error(`Error deleting blog post ${id}:`, error);
      return false;
    }
  },

  // Delete multiple blog posts
  deleteBlogPosts: async (ids: string[]): Promise<boolean> => {
    try {
      const queryString = ids.join(",");
      const response = await fetch(`/api/blogpost?blogPostIds=${queryString}`, {
        method: "DELETE",
        headers: createAuthHeaders(),
      });

      await handleResponse(response);
      toast.success("Success", {
        description: `${ids.length} blog posts deleted successfully`,
      });
      return true;
    } catch (error) {
      console.error("Error deleting multiple blog posts:", error);
      return false;
    }
  },
};
