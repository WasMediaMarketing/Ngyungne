import { toast } from "sonner";
import type { IEvent } from "@/types";

// Event API functions
export const eventApi = {
  // Get all events (public - only visible events)
  getEvents: async (): Promise<IEvent[]> => {
    try {
      const response = await fetch("/api/event");

      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }

      const { data } = await response.json();
      return Array.isArray(data) ? data : [];
    } catch (error) {
      console.error("Error fetching events:", error);
      toast.error("Error", {
        description: "Failed to fetch events",
      });
      return [];
    }
  },

  // Get all events (admin - includes visible and hidden events)
  getAdminEvents: async (): Promise<IEvent[]> => {
    try {
      const response = await fetch("/api/event", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("adminToken")}`,
        },
      });

      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }

      const { data } = await response.json();
      return Array.isArray(data) ? data : [];
    } catch (error) {
      console.error("Error fetching admin events:", error);
      toast.error("Error", {
        description: "Failed to fetch events",
      });
      return [];
    }
  },

  // Get event by ID
  getEventById: async (id: string): Promise<IEvent | null> => {
    try {
      const response = await fetch(`/api/event/${id}`);

      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }
      const { data } = await response.json();
      return data;
    } catch (error) {
      console.error(`Error fetching event ${id}:`, error);
      toast.error("Error", {
        description: "Failed to fetch event details",
      });
      return null;
    }
  },

  // Create a new event
  createEvent: async (eventData: FormData): Promise<boolean> => {
    try {
      // Log FormData for debugging
      console.log("Creating event with FormData:");
      for (const pair of eventData.entries()) {
        const value =
          pair[1] instanceof File
            ? `File: ${pair[1].name} (${pair[1].size} bytes)`
            : pair[1];
        console.log(`${pair[0]}: ${value}`);
      }

      const response = await fetch("/api/event", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("adminToken")}`,
        },
        // Don't set Content-Type for FormData - browser will set it with boundary
        body: eventData,
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `Error: ${response.status}`);
      }

      toast.success("Success", {
        description: "Event created successfully",
      });
      return true;
    } catch (error: any) {
      console.error("Error creating event:", error);
      toast.error("Error", {
        description: error.message || "Failed to create event",
      });
      return false;
    }
  },

  // Update an event
  updateEvent: async (id: string, eventData: FormData): Promise<boolean> => {
    try {
      const response = await fetch(`/api/event/${id}`, {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("adminToken")}`,
        },
        // Don't set Content-Type for FormData - browser will set it with boundary
        body: eventData,
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `Error: ${response.status}`);
      }

      toast.success("Success", {
        description: "Event updated successfully",
      });
      return true;
    } catch (error: any) {
      console.error(`Error updating event ${id}:`, error);
      toast.error("Error", {
        description: error.message || "Failed to update event",
      });
      return false;
    }
  },

  // Update event with JSON data (for simple updates like visibility)
  updateEventJson: async (
    id: string,
    eventData: { isVisible?: boolean }
  ): Promise<boolean> => {
    try {
      const response = await fetch(`/api/event/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("adminToken")}`,
        },
        body: JSON.stringify(eventData),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `Error: ${response.status}`);
      }

      toast.success("Success", {
        description: "Event updated successfully",
      });
      return true;
    } catch (error: any) {
      console.error(`Error updating event ${id}:`, error);
      toast.error("Error", {
        description: error.message || "Failed to update event",
      });
      return false;
    }
  },

  // Toggle event visibility
  toggleEventVisibility: async (
    id: string,
    isVisible: boolean
  ): Promise<boolean> => {
    try {
      // Using the PUT endpoint for JSON data
      const response = await fetch(`/api/event/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("adminToken")}`,
        },
        body: JSON.stringify({ isVisible }),
      });

      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }

      toast.success("Success", {
        description: `Event ${
          isVisible ? "published" : "unpublished"
        } successfully`,
      });
      return true;
    } catch (error) {
      console.error(`Error toggling event visibility ${id}:`, error);
      toast.error("Error", {
        description: `Failed to ${isVisible ? "publish" : "unpublish"} event`,
      });
      return false;
    }
  },

  // Delete an event
  deleteEvent: async (id: string): Promise<boolean> => {
    try {
      const response = await fetch(`/api/event/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("adminToken")}`,
        },
      });

      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }

      toast.success("Success", {
        description: "Event deleted successfully",
      });
      return true;
    } catch (error) {
      console.error(`Error deleting event ${id}:`, error);
      toast.error("Error", {
        description: "Failed to delete event",
      });
      return false;
    }
  },

  // Delete multiple events
  deleteEvents: async (ids: string[]): Promise<boolean> => {
    try {
      const response = await fetch(`/api/event?eventIds=${ids.join(",")}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("adminToken")}`,
        },
      });

      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }
      return true;
    } catch (error) {
      console.error("Error deleting events:", error);
      toast.error("Error", {
        description: "Failed to delete events",
      });
      return false;
    }
  },
};
