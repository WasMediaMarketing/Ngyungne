import type {
  IPhilosophyTopic,
  IPhilosophyTopicInput,
  IPhilosophyTopicUpdate,
} from "@/types";

// Response type that matches your API structure
interface ApiResponse<T> {
  message: string;
  data: T;
}

// Helper function to get the admin token from localStorage
const getAdminToken = (): string | null => {
  if (typeof window !== "undefined") {
    return localStorage.getItem("adminToken");
  }
  return null;
};

// Helper function to create headers with authentication
const createAuthHeaders = (): HeadersInit => {
  const token = getAdminToken();
  const headers: HeadersInit = {
    "Content-Type": "application/json",
  };

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  return headers;
};

// Helper function to handle API responses
const handleResponse = async <T>(response: Response): Promise<T> => {
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || `API error: ${response.status}`);
  }

  // Parse the response and extract the data property
  const result = (await response.json()) as ApiResponse<T>;
  return result.data;
};

export const philosophyApi = {
  // Get all philosophy topics
  getAdminPhilosophyTopics: async (): Promise<IPhilosophyTopic[]> => {
    try {
      const response = await fetch("/api/philosophy", {
        method: "GET",
        headers: createAuthHeaders(),
      });
      return handleResponse<IPhilosophyTopic[]>(response);
    } catch (error) {
      console.error("Error fetching philosophy topics:", error);
      throw error;
    }
  },
  getPhilosophyTopics: async (): Promise<IPhilosophyTopic[]> => {
    try {
      const response = await fetch("/api/philosophy", {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });
      return handleResponse<IPhilosophyTopic[]>(response);
    } catch (error) {
      console.error("Error fetching philosophy topics:", error);
      throw error;
    }
  },

  // Get a specific philosophy topic by ID
  getPhilosophyTopicById: async (id: string): Promise<IPhilosophyTopic> => {
    try {
      const response = await fetch(`/api/philosophy/${id}`, {
        method: "GET",
        headers: createAuthHeaders(),
      });
      return handleResponse<IPhilosophyTopic>(response);
    } catch (error) {
      console.error(`Error fetching philosophy topic with ID ${id}:`, error);
      throw error;
    }
  },

  // Create a new philosophy topic
  createPhilosophyTopic: async (
    data: IPhilosophyTopicInput
  ): Promise<IPhilosophyTopic> => {
    try {
      const response = await fetch("/api/philosophy", {
        method: "POST",
        headers: createAuthHeaders(),
        body: JSON.stringify(data),
      });
      return handleResponse<IPhilosophyTopic>(response);
    } catch (error) {
      console.error("Error creating philosophy topic:", error);
      throw error;
    }
  },

  // Update a philosophy topic
  updatePhilosophyTopic: async (
    id: string,
    data: IPhilosophyTopicUpdate
  ): Promise<IPhilosophyTopic> => {
    try {
      const response = await fetch(`/api/philosophy/${id}`, {
        method: "PATCH",
        headers: createAuthHeaders(),
        body: JSON.stringify(data),
      });
      return handleResponse<IPhilosophyTopic>(response);
    } catch (error) {
      console.error(`Error updating philosophy topic with ID ${id}:`, error);
      throw error;
    }
  },

  // Delete a philosophy topic
  deletePhilosophyTopic: async (id: string): Promise<boolean> => {
    try {
      const response = await fetch(`/api/philosophy/${id}`, {
        method: "DELETE",
        headers: createAuthHeaders(),
      });

      if (response.ok) {
        // For delete operations, we just need to know if it was successful
        return true;
      }

      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `API error: ${response.status}`);
    } catch (error) {
      console.error(`Error deleting philosophy topic with ID ${id}:`, error);
      throw error;
    }
  },

  // Delete multiple philosophy topics
  deletePhilosophyTopics: async (ids: string[]): Promise<boolean> => {
    try {
      const queryString = ids.join(",");
      const response = await fetch(
        `/api/philosophy?philosophyTopicIds=${queryString}`,
        {
          method: "DELETE",
          headers: createAuthHeaders(),
        }
      );

      if (response.ok) {
        // For delete operations, we just need to know if it was successful
        return true;
      }

      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `API error: ${response.status}`);
    } catch (error) {
      console.error("Error deleting multiple philosophy topics:", error);
      throw error;
    }
  },
};
