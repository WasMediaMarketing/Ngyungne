import { toast } from "sonner";
import type {
  Ambassador,
  CreateAmbassadorInput,
  UpdateAmbassadorInput,
  UpdateAmbassadorVisibilityInput,
} from "@/types/ambassador.types";
import type { TeamMemberRole } from "@/types/team-member";

// Response type that matches your API structure
interface ApiResponse<T> {
  success: boolean;
  message: string;
  data?: T;
}

// Helper function to get the admin token from localStorage
const getAdminToken = (): string | null => {
  if (typeof window !== "undefined") {
    return localStorage.getItem("adminToken");
  }
  return null;
};

// Helper function to create headers with authentication
const createAuthHeaders = (isMultipart: boolean = false): HeadersInit => {
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

export const ambassadorApi = {
  // Get all ambassadors (public - only visible ones)
  getAmbassadors: async (): Promise<Ambassador[]> => {
    try {
      const response = await fetch("/api/ambassador", {
        method: "GET",
      });

      if (!response.ok) {
        const errorData = (await response.json()) as ApiResponse<any>;
        throw new Error(errorData.message || `API error: ${response.status}`);
      }

      const result = (await response.json()) as ApiResponse<Ambassador[]>;
      return result.data || [];
    } catch (error) {
      console.error("Error fetching ambassadors:", error);
      throw error;
    }
  },

  // Get all ambassadors (admin - including hidden ones)
  getAdminAmbassadors: async (): Promise<Ambassador[]> => {
    try {
      const response = await fetch("/api/ambassador", {
        method: "GET",
        headers: createAuthHeaders(),
      });

      if (!response.ok) {
        const errorData = (await response.json()) as ApiResponse<any>;
        throw new Error(errorData.message || `API error: ${response.status}`);
      }

      const result = (await response.json()) as ApiResponse<Ambassador[]>;
      return result.data || [];
    } catch (error) {
      console.error("Error fetching admin ambassadors:", error);
      throw error;
    }
  },

  // Get a specific ambassador by ID
  getAmbassadorById: async (id: string): Promise<Ambassador> => {
    try {
      const response = await fetch(`/api/ambassador/${id}`, {
        method: "GET",
        headers: createAuthHeaders(),
      });

      if (!response.ok) {
        const errorData = (await response.json()) as ApiResponse<any>;
        throw new Error(errorData.message || `API error: ${response.status}`);
      }

      const result = (await response.json()) as ApiResponse<Ambassador>;
      if (!result.data) {
        throw new Error("Ambassador not found");
      }

      return result.data;
    } catch (error) {
      console.error(`Error fetching ambassador with ID ${id}:`, error);
      throw error;
    }
  },

  // Create a new ambassador
  createAmbassador: async (data: FormData): Promise<Ambassador> => {
    try {
      const response = await fetch("/api/ambassador", {
        method: "POST",
        headers: createAuthHeaders(true),
        body: data,
      });

      if (!response.ok) {
        const errorData = (await response.json()) as ApiResponse<any>;
        throw new Error(errorData.message || `API error: ${response.status}`);
      }

      const result = (await response.json()) as ApiResponse<Ambassador>;

      toast.success("Success", {
        description: "Ambassador created successfully",
      });

      return result.data as Ambassador;
    } catch (error) {
      console.error("Error creating ambassador:", error);

      toast.error("Error", {
        description:
          error instanceof Error
            ? error.message
            : "Failed to create ambassador",
      });

      throw error;
    }
  },

  // Update an ambassador
  updateAmbassador: async (id: string, data: FormData): Promise<Ambassador> => {
    try {
      const response = await fetch(`/api/ambassador/${id}`, {
        method: "PATCH",
        headers: createAuthHeaders(true),
        body: data,
      });

      if (!response.ok) {
        const errorData = (await response.json()) as ApiResponse<any>;
        throw new Error(errorData.message || `API error: ${response.status}`);
      }

      const result = (await response.json()) as ApiResponse<Ambassador>;

      toast.success("Success", {
        description: "Ambassador updated successfully",
      });

      return result.data as Ambassador;
    } catch (error) {
      console.error(`Error updating ambassador with ID ${id}:`, error);

      toast.error("Error", {
        description:
          error instanceof Error
            ? error.message
            : "Failed to update ambassador",
      });

      throw error;
    }
  },

  // Update ambassador visibility
  toggleAmbassadorVisibility: async (
    id: string,
    isVisible: boolean
  ): Promise<boolean> => {
    try {
      const data: UpdateAmbassadorVisibilityInput = { isVisible };

      const response = await fetch(`/api/ambassador/${id}`, {
        method: "PUT",
        headers: createAuthHeaders(),
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorData = (await response.json()) as ApiResponse<any>;
        throw new Error(errorData.message || `API error: ${response.status}`);
      }

      toast.success("Success", {
        description: `Ambassador is now ${isVisible ? "visible" : "hidden"}`,
      });

      return true;
    } catch (error) {
      console.error(
        `Error updating ambassador visibility with ID ${id}:`,
        error
      );

      toast.error("Error", {
        description:
          error instanceof Error
            ? error.message
            : "Failed to update ambassador visibility",
      });

      throw error;
    }
  },

  // Delete an ambassador
  deleteAmbassador: async (id: string): Promise<boolean> => {
    try {
      const response = await fetch(`/api/ambassador/${id}`, {
        method: "DELETE",
        headers: createAuthHeaders(),
      });

      if (!response.ok) {
        const errorData = (await response.json()) as ApiResponse<any>;
        throw new Error(errorData.message || `API error: ${response.status}`);
      }

      toast.success("Success", {
        description: "Ambassador deleted successfully",
      });

      return true;
    } catch (error) {
      console.error(`Error deleting ambassador with ID ${id}:`, error);

      toast.error("Error", {
        description:
          error instanceof Error
            ? error.message
            : "Failed to delete ambassador",
      });

      throw error;
    }
  },

  // Delete multiple ambassadors
  deleteAmbassadors: async (ids: string[]): Promise<boolean> => {
    try {
      const queryString = ids.join(",");
      const response = await fetch(
        `/api/ambassador?ambassadorIds=${queryString}`,
        {
          method: "DELETE",
          headers: createAuthHeaders(),
        }
      );

      if (!response.ok) {
        const errorData = (await response.json()) as ApiResponse<any>;
        throw new Error(errorData.message || `API error: ${response.status}`);
      }

      toast.success("Success", {
        description: `${ids.length} ambassadors deleted successfully`,
      });

      return true;
    } catch (error) {
      console.error("Error deleting multiple ambassadors:", error);

      toast.error("Error", {
        description:
          error instanceof Error
            ? error.message
            : "Failed to delete ambassadors",
      });

      throw error;
    }
  },
};
