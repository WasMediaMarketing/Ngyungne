import axios from "axios";
import { toast } from "sonner";

// Interface for the UI representation of a volunteer
export interface VolunteerUI {
  id: number | string;
  fullname: string;
  phone: string;
  email: string;
  address: string;
  image: string | null;
  reason: string;
  socialLinks?: Record<string, string>;
}

// Helper function to convert API data to UI format
const mapVolunteerToUI = (volunteer: any): VolunteerUI => {
  const user = volunteer.userId || {};
  return {
    id: volunteer.id || volunteer._id?.toString() || "",
    fullname: user.name || "",
    phone: user.phoneNumber || "",
    email: user.email || "",
    address: user.address || "",
    image: volunteer.image || null,
    reason: volunteer.reason || "",
    socialLinks: volunteer.socialLink || {},
  };
};

// Volunteer API functions
export const volunteerApi = {
  // Get all volunteers (requires authentication)
  getVolunteers: async (): Promise<VolunteerUI[]> => {
    try {
      const token = localStorage.getItem("adminToken");
      const response = await axios.get("/api/volunteer", {
        headers: {
          Authorization: token ? `Bearer ${token}` : "",
        },
      });

      // Extract volunteers from response
      const volunteers = Array.isArray(response.data)
        ? response.data
        : response.data.data || response.data.volunteers || [];

      return Array.isArray(volunteers) ? volunteers.map(mapVolunteerToUI) : [];
    } catch (error) {
      toast.error("Error", { description: "Failed to fetch volunteers" });
      console.error("Error fetching volunteers:", error);
      return [];
    }
  },

  // Create a new volunteer (public endpoint)
  createVolunteer: async (formData: {
    fullname: string;
    phone: string;
    email: string;
    address: string;
    reason: string;
    image: File | null;
    socialLinks: Record<string, string>;
  }): Promise<boolean> => {
    try {
      // Create a FormData object for multipart/form-data
      const volunteerData = new FormData();

      // Add user data
      volunteerData.append("name", formData.fullname);
      volunteerData.append("email", formData.email);
      volunteerData.append("phoneNumber", formData.phone);
      volunteerData.append("address", formData.address);
      volunteerData.append("reason", formData.reason);

      // Add image if provided
      if (formData.image instanceof File) {
        volunteerData.append("image", formData.image);
      }

      // Clean and add social links
      const cleanedSocialLinks: Record<string, string> = {};
      Object.entries(formData.socialLinks || {}).forEach(([key, value]) => {
        if (value && value.trim()) {
          cleanedSocialLinks[key] = value.trim();
        }
      });
      volunteerData.append("socialLink", JSON.stringify(cleanedSocialLinks));

      // Add page info
      volunteerData.append("page", "volunteer");
      volunteerData.append("pageTitle", "Volunteer");

      // Get token
      const token = localStorage.getItem("adminToken");

      // Use axios for multipart/form-data
      const response = await axios.post("/api/volunteer", volunteerData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: token ? `Bearer ${token}` : "",
        },
      });

      toast.success("Success", {
        description: "Your volunteer application has been submitted!",
      });
      return true;
    } catch (error: any) {
      console.error("Error creating volunteer:", error);
      toast.error("Error", {
        description: error.message || "Failed to submit volunteer application",
      });
      return false;
    }
  },

  // Delete a volunteer by ID (requires authentication)
  deleteVolunteer: async (id: string): Promise<boolean> => {
    try {
      const token = localStorage.getItem("adminToken");
      await axios.delete(`/api/volunteer/${id}`, {
        headers: {
          Authorization: token ? `Bearer ${token}` : "",
        },
      });

      toast.success("Success", {
        description: "Volunteer deleted successfully",
      });
      return true;
    } catch (error) {
      toast.error("Error", { description: "Failed to delete volunteer" });
      console.error("Error deleting volunteer:", error);
      return false;
    }
  },

  // Delete multiple volunteers (requires authentication)
  deleteVolunteers: async (ids: string[]): Promise<boolean> => {
    try {
      const token = localStorage.getItem("adminToken");
      await axios.delete(`/api/volunteer?volunteerIds=${ids.join(",")}`, {
        headers: {
          Authorization: token ? `Bearer ${token}` : "",
        },
      });

      toast.success("Success", {
        description: "Volunteers deleted successfully",
      });
      return true;
    } catch (error) {
      toast.error("Error", { description: "Failed to delete volunteers" });
      console.error("Error deleting volunteers:", error);
      return false;
    }
  },
};
