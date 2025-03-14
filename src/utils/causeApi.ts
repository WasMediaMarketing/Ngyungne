import axios from "axios";
import { toast } from "sonner";

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
  faq: { question: string; answer: string }[];
  gallery: string[];
  progress: number; // Calculated field
  daysLeft: number; // Calculated field
}

// Helper function to convert API data to UI format
const mapCauseToUI = (cause: any): CauseUI => {
  // Calculate progress percentage
  const progress =
    cause.goal > 0
      ? Math.min(Math.round((cause.raised / cause.goal) * 100), 100)
      : 0;

  // Calculate days left
  const endDate = new Date(cause.endDate);
  const today = new Date();
  const daysLeft = Math.max(
    0,
    Math.ceil((endDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))
  );

  return {
    id: cause._id?.toString() || cause.id || "",
    title: cause.title || "",
    subtitle: cause.subtitle || "",
    image: cause.image || "",
    tags: cause.tags || [],
    raised: cause.raised || 0,
    goal: cause.goal || 0,
    startDate: cause.startDate ? new Date(cause.startDate) : new Date(),
    endDate: cause.endDate ? new Date(cause.endDate) : new Date(),
    volunteers: cause.volunteers || 0,
    location: cause.location || "",
    totalDonors: cause.totalDonors || 0,
    about: cause.about || { longDescription: "", objectives: [] },
    impact: cause.impact || "",
    isVisible: cause.isVisible !== undefined ? cause.isVisible : true,
    updates: cause.updates || "",
    faq: cause.faq || [],
    gallery: cause.gallery || [],
    progress,
    daysLeft,
  };
};

// Cause API functions
export const causeApi = {
  // Get all causes (public endpoint - only visible causes)
  getCauses: async (): Promise<CauseUI[]> => {
    try {
      const response = await axios.get("/api/cause");

      // Extract causes from response
      const causes = Array.isArray(response.data)
        ? response.data
        : response.data.data || response.data.causes || [];

      return Array.isArray(causes) ? causes.map(mapCauseToUI) : [];
    } catch (error) {
      toast.error("Error", { description: "Failed to fetch causes" });
      console.error("Error fetching causes:", error);
      return [];
    }
  },

  // Get all causes for admin (includes hidden causes)
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
      toast.error("Error", { description: "Failed to fetch causes" });
      console.error("Error fetching admin causes:", error);
      return [];
    }
  },

  // Get cause by ID
  getCauseById: async (id: string): Promise<CauseUI | null> => {
    try {
      const response = await axios.get(`/api/cause/${id}`);
      return mapCauseToUI(response.data);
    } catch (error) {
      toast.error("Error", { description: "Failed to fetch cause details" });
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

      toast.success("Success", {
        description: "Cause created successfully",
      });
      return true;
    } catch (error: any) {
      console.error("Error creating cause:", error);
      toast.error("Error", {
        description: error.message || "Failed to create cause",
      });
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

      toast.success("Success", {
        description: "Cause updated successfully",
      });
      return true;
    } catch (error: any) {
      console.error(`Error updating cause ${id}:`, error);
      toast.error("Error", {
        description: error.message || "Failed to update cause",
      });
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

      toast.success("Success", {
        description: `Cause is now ${
          isVisible ? "visible" : "hidden"
        } on the website`,
      });
      return true;
    } catch (error) {
      toast.error("Error", {
        description: "Failed to update cause visibility",
      });
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

      toast.success("Success", {
        description: "Cause deleted successfully",
      });
      return true;
    } catch (error) {
      toast.error("Error", { description: "Failed to delete cause" });
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

      toast.success("Success", {
        description: "Causes deleted successfully",
      });
      return true;
    } catch (error) {
      toast.error("Error", { description: "Failed to delete causes" });
      console.error("Error deleting causes:", error);
      return false;
    }
  },
};
