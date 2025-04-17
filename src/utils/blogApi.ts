import type { IBlogPostUpdate, IBlogPost } from "@/types";
import { toast } from "sonner";

// Helper function to handle API responses
const handleResponse = async (response: Response) => {
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    const errorMessage = errorData.message || "An error occurred";
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
      const response = await fetch("/api/blogPost", {
        method: "GET",
        headers: createAuthHeaders(),
      });

      await handleResponse(response);
      return await response.json();
    } catch (error) {
      console.error("Error fetching blog posts:", error);
      throw error;
    }
  },

  // Get all visible blog posts (public view - only includes published posts)
  getPublicBlogPosts: async (): Promise<IBlogPost[]> => {
    try {
      const response = await fetch("/api/blogPost", {
        method: "GET",
      });

      await handleResponse(response);
      return await response.json();
    } catch (error) {
      console.error("Error fetching public blog posts:", error);
      throw error;
    }
  },

  // Get a single blog post by ID
  getBlogPost: async (id: string): Promise<IBlogPost> => {
    try {
      const response = await fetch(`/api/blogPost/${id}`, {
        method: "GET",
        headers: createAuthHeaders(),
      });

      await handleResponse(response);
      return await response.json();
    } catch (error) {
      console.error(`Error fetching blog post ${id}:`, error);
      throw error;
    }
  },

  // Create a new blog post
  createBlogPost: async (blogPostData: FormData): Promise<IBlogPost> => {
    try {
      // Add authentication to FormData request
      const response = await fetch("/api/blogPost", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${getAdminToken()}`,
        },
        body: blogPostData,
      });

      await handleResponse(response);
      const data = await response.json();
      toast.success("Success", {
        description: "Blog post created successfully",
      });
      return data;
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
    try {
      const response = await fetch(`/api/blogPost/${id}`, {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${getAdminToken()}`,
        },
        body: blogPostData,
      });

      await handleResponse(response);
      const data = await response.json();
      toast.success("Success", {
        description: "Blog post updated successfully",
      });
      return data;
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
      const response = await fetch(`/api/blogPost/${id}`, {
        method: "PUT",
        headers: createAuthHeaders(),
        body: JSON.stringify(blogPostData),
      });

      await handleResponse(response);
      const data = await response.json();
      toast.success("Success", {
        description: "Blog post updated successfully",
      });
      return data;
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
      const response = await fetch(`/api/blogPost/${id}`, {
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
      const response = await fetch(`/api/blogPost/${id}`, {
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
      const response = await fetch(`/api/blogPost?blogPostIds=${queryString}`, {
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
