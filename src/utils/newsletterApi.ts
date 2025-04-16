import { toast } from "sonner";

// Response type that matches your API structure
interface ApiResponse<T> {
  success: boolean;
  message: string;
  data?: T;
}

// Newsletter subscription input
interface NewsletterInput {
  email: string;
}

// Newsletter subscription model
export interface NewsletterSubscription {
  _id: string;
  email: string;
  createdAt: string;
  updatedAt: string;
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

export const newsletterApi = {
  // Subscribe to newsletter
  subscribe: async (email: string): Promise<boolean> => {
    try {
      const response = await fetch("/api/newsletter", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      const data = (await response.json()) as ApiResponse<any>;

      if (!response.ok) {
        // Handle specific error cases
        if (response.status === 409) {
          toast.error("Already Subscribed", {
            description: "This email is already subscribed to our newsletter.",
          });
        } else {
          toast.error("Subscription Failed", {
            description: data.message || `Error: ${response.status}`,
          });
        }
        return false;
      }

      // Show success toast
      toast.success("Subscription Successful", {
        description: "Thank you for subscribing to our newsletter!",
      });

      return true;
    } catch (error) {
      console.error("Error subscribing to newsletter:", error);

      // Show error toast
      toast.error("Subscription Failed", {
        description: "An unexpected error occurred. Please try again later.",
      });

      return false;
    }
  },

  // Get all newsletter subscriptions (admin only)
  getSubscriptions: async (): Promise<NewsletterSubscription[]> => {
    try {
      const response = await fetch("/api/newsletter", {
        method: "GET",
        headers: createAuthHeaders(),
      });

      if (!response.ok) {
        const errorData = (await response.json()) as ApiResponse<any>;
        throw new Error(errorData.message || `API error: ${response.status}`);
      }

      const result = (await response.json()) as ApiResponse<
        NewsletterSubscription[]
      >;
      return result.data || [];
    } catch (error) {
      console.error("Error fetching newsletter subscriptions:", error);
      throw error;
    }
  },

  // Get a specific newsletter subscription by ID (admin only)
  getSubscriptionById: async (id: string): Promise<NewsletterSubscription> => {
    try {
      const response = await fetch(`/api/newsletter/${id}`, {
        method: "GET",
        headers: createAuthHeaders(),
      });

      if (!response.ok) {
        const errorData = (await response.json()) as ApiResponse<any>;
        throw new Error(errorData.message || `API error: ${response.status}`);
      }

      const result =
        (await response.json()) as ApiResponse<NewsletterSubscription>;
      if (!result.data) {
        throw new Error("Subscription not found");
      }

      return result.data;
    } catch (error) {
      console.error(
        `Error fetching newsletter subscription with ID ${id}:`,
        error
      );
      throw error;
    }
  },

  // Delete a newsletter subscription by ID (admin only)
  deleteSubscription: async (id: string): Promise<boolean> => {
    try {
      const response = await fetch(`/api/newsletter/${id}`, {
        method: "DELETE",
        headers: createAuthHeaders(),
      });

      if (!response.ok) {
        const errorData = (await response.json()) as ApiResponse<any>;
        throw new Error(errorData.message || `API error: ${response.status}`);
      }

      return true;
    } catch (error) {
      console.error(
        `Error deleting newsletter subscription with ID ${id}:`,
        error
      );
      throw error;
    }
  },

  // Delete multiple newsletter subscriptions by their IDs (admin only)
  deleteSubscriptions: async (ids: string[]): Promise<boolean> => {
    try {
      const queryString = ids.join(",");
      const response = await fetch(
        `/api/newsletter?subscriberIds=${queryString}`,
        {
          method: "DELETE",
          headers: createAuthHeaders(),
        }
      );

      if (!response.ok) {
        const errorData = (await response.json()) as ApiResponse<any>;
        throw new Error(errorData.message || `API error: ${response.status}`);
      }

      return true;
    } catch (error) {
      console.error("Error deleting multiple newsletter subscriptions:", error);
      throw error;
    }
  },
};
