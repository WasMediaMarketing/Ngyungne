import axios from "axios";

// Configure axios to handle larger payloads
axios.defaults.maxContentLength = 50 * 1024 * 1024; // 50MB
axios.defaults.maxBodyLength = 50 * 1024 * 1024; // 50MB

// Interface for the UI representation of a cause
export interface CauseUI {
  id: string;
  title: string;
  subtitle: string;
  image: string;
  tags: string[];
  raised: number;
  goal: number;
  startDate: Date;
  endDate: Date;
  volunteers: number;
  location: string;
  totalDonors: number;
  about: { longDescription: string; objectives: string[] };
  impact: string;
  isVisible: boolean;
  updates: string;
  faq: { question: string; answer: string; _id?: string; id?: string }[];
  gallery: string[];
  progress: number; // Calculated field
  categories?: string[]; // Added for category filtering
}

// Helper function to convert API data to UI format
const mapCauseToUI = (cause: any): CauseUI => {
  if (!cause || typeof cause !== "object") {
    console.error("Invalid cause data received:", cause);
    throw new Error("Invalid cause data");
  }

  // Calculate progress percentage
  const progress =
    cause.progress !== undefined
      ? cause.progress
      : cause.goal > 0
      ? Math.min(Math.round((cause.raised / cause.goal) * 100), 100)
      : 0;

  // Calculate days left
  const daysLeft =
    cause.daysLeft !== undefined
      ? cause.daysLeft
      : (() => {
          const endDate = new Date(cause.endDate);
          const today = new Date();
          return Math.max(
            0,
            Math.ceil(
              (endDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)
            )
          );
        })();

  // Ensure about object exists
  let about = cause.about || { longDescription: "", objectives: [] };
  if (typeof about === "string") {
    // Handle case where about might be a string instead of an object
    about = { longDescription: about, objectives: [] };
  }

  // Ensure objectives is an array
  if (!Array.isArray(about.objectives)) {
    about.objectives = [];
  }

  // Ensure faq is an array
  let faq = cause.faq || [];
  if (!Array.isArray(faq)) {
    faq = [];
  }

  // Ensure gallery is an array
  let gallery = cause.gallery || [];
  if (!Array.isArray(gallery)) {
    gallery = [];
  }

  // Ensure tags is an array
  let tags = cause.tags || [];
  if (!Array.isArray(tags)) {
    tags = [];
  }

  return {
    id: cause._id?.toString() || cause.id || "",
    title: cause.title || "",
    subtitle: cause.subtitle || "",
    image: cause.image || "",
    tags: tags,
    raised: cause.raised || 0,
    goal: cause.goal || 0,
    startDate: cause.startDate ? new Date(cause.startDate) : new Date(),
    endDate: cause.endDate ? new Date(cause.endDate) : new Date(),
    volunteers: cause.volunteers || 0,
    location: cause.location || "",
    totalDonors: cause.totalDonors || 0,
    about: about,
    impact: cause.impact || "",
    isVisible: cause.isVisible !== undefined ? cause.isVisible : true,
    updates: cause.updates || "",
    faq: faq,
    gallery: gallery,
    progress: progress,
    categories: cause.categories || tags, // Use tags as categories if not provided
  };
};

// Cause API functions
export const causeApi = {
  // Get all causes (public endpoint - only visible causes)
  getCauses: async (): Promise<CauseUI[]> => {
    try {
      const response = await axios.get("/api/cause");

      // Extract causes from response with more detailed handling
      let causes;
      if (Array.isArray(response.data)) {
        causes = response.data;
      } else if (
        response.data &&
        response.data.data &&
        Array.isArray(response.data.data)
      ) {
        causes = response.data.data;
      } else if (
        response.data &&
        response.data.causes &&
        Array.isArray(response.data.causes)
      ) {
        causes = response.data.causes;
      } else if (response.data && typeof response.data === "object") {
        // If it's a single cause object
        causes = [response.data];
      } else {
        console.error("Unexpected API response format:", response.data);
        causes = [];
      }

      const mappedCauses = causes.map(mapCauseToUI);
      return mappedCauses;
    } catch (error) {
      console.error("Error fetching causes:", error);
      return [];
    }
  },
  getAdminCauses: async (): Promise<CauseUI[]> => {
    try {
      const token = localStorage.getItem("adminToken");
      if (!token) {
        throw new Error("Admin token not found");
      }

      const response = await axios.get("/api/cause", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      // Extract causes from response
      const causes = Array.isArray(response.data)
        ? response.data
        : response.data.data || response.data.causes || [];

      return Array.isArray(causes) ? causes.map(mapCauseToUI) : [];
    } catch (error) {
      console.error("Error fetching admin causes:", error);
      return [];
    }
  },

  // Get cause by ID
  getCauseById: async (id: string): Promise<CauseUI | null> => {
    try {
      const response = await axios.get(`/api/cause/${id}`);

      if (!response.data) {
        console.error("Empty response data");
        return null;
      }

      // Handle different response formats
      let causeData = response.data;

      // If the response is wrapped in a data property
      if (!causeData.id && !causeData._id && causeData.data) {
        causeData = causeData.data;
      }

      // If the response is wrapped in a cause property
      if (!causeData.id && !causeData._id && causeData.cause) {
        causeData = causeData.cause;
      }

      // Map the cause data to UI format
      const mappedCause = mapCauseToUI(causeData);
      return mappedCause;
    } catch (error) {
      console.error(`Error fetching cause ${id}:`, error);
      return null;
    }
  },

  // Create a new cause
  createCause: async (formData: FormData): Promise<boolean> => {
    try {
      const token = localStorage.getItem("adminToken");
      if (!token) {
        throw new Error("Admin token not found");
      }

      await axios.post("/api/cause", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
        // Increase timeout for large uploads
        timeout: 60000, // 60 seconds
      });

      return true;
    } catch (error: any) {
      console.error("Error creating cause:", error);

      return false;
    }
  },

  // Update a cause
  updateCause: async (id: string, formData: FormData): Promise<boolean> => {
    try {
      const token = localStorage.getItem("adminToken");
      if (!token) {
        throw new Error("Admin token not found");
      }

      await axios.patch(`/api/cause/${id}`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
        // Increase timeout for large uploads
        timeout: 60000, // 60 seconds
      });

      return true;
    } catch (error: any) {
      console.error(`Error updating cause ${id}:`, error);

      return false;
    }
  },

  // Toggle cause visibility - using PUT instead of PATCH
  toggleVisibility: async (
    id: string,
    isVisible: boolean
  ): Promise<boolean> => {
    try {
      const token = localStorage.getItem("adminToken");
      if (!token) {
        throw new Error("Admin token not found");
      }

      await axios.put(
        `/api/cause/${id}`,
        { isVisible },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      return true;
    } catch (error) {
      console.error("Error updating cause visibility:", error);
      return false;
    }
  },

  // Delete a cause
  deleteCause: async (id: string): Promise<boolean> => {
    try {
      const token = localStorage.getItem("adminToken");
      if (!token) {
        throw new Error("Admin token not found");
      }

      await axios.delete(`/api/cause/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      return true;
    } catch (error) {
      console.error(`Error deleting cause ${id}:`, error);
      return false;
    }
  },

  // Delete multiple causes
  deleteCauses: async (ids: string[]): Promise<boolean> => {
    try {
      const token = localStorage.getItem("adminToken");
      if (!token) {
        throw new Error("Admin token not found");
      }

      await axios.delete(`/api/cause?causeIds=${ids.join(",")}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      return true;
    } catch (error) {
      console.error("Error deleting causes:", error);
      return false;
    }
  },

  // Search causes
  searchCauses: async (query: string): Promise<CauseUI[]> => {
    try {
      const allCauses = await causeApi.getCauses();

      if (!query.trim()) return allCauses;

      const lowerQuery = query.toLowerCase();

      return allCauses.filter(
        (cause) =>
          cause.title.toLowerCase().includes(lowerQuery) ||
          cause.subtitle.toLowerCase().includes(lowerQuery) ||
          cause.location.toLowerCase().includes(lowerQuery) ||
          cause.tags.some((tag) => tag.toLowerCase().includes(lowerQuery))
      );
    } catch (error) {
      console.error("Error searching causes:", error);
      return [];
    }
  },

  // Filter causes by category
  filterCausesByCategory: async (category: string): Promise<CauseUI[]> => {
    try {
      const allCauses = await causeApi.getCauses();

      if (category === "all") return allCauses;

      return allCauses.filter(
        (cause) =>
          cause.categories?.includes(category) || cause.tags.includes(category)
      );
    } catch (error) {
      console.error("Error filtering causes:", error);
      return [];
    }
  },
};
