import { toast } from "sonner";
import type {
  IBookEventData,
  IBookEventInput,
  IBookEventupdate,
} from "@/types";

// Booking API functions
export const bookingApi = {
  // Get all bookings
  getBookings: async (): Promise<IBookEventData[]> => {
    try {
      const response = await fetch("/api/book-event", {
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
      console.error("Error fetching bookings:", error);
      toast.error("Error", {
        description: "Failed to fetch bookings",
      });
      return [];
    }
  },

  // Get booking by ID
  getBookingById: async (id: string): Promise<IBookEventData | null> => {
    try {
      const response = await fetch(`/api/book-event/${id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("adminToken")}`,
        },
      });

      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }
      const { data } = await response.json();
      return data;
    } catch (error) {
      console.error(`Error fetching booking ${id}:`, error);
      toast.error("Error", {
        description: "Failed to fetch booking details",
      });
      return null;
    }
  },

  // Create a new booking
  createBooking: async (bookingData: IBookEventInput): Promise<boolean> => {
    try {
      const response = await fetch("/api/book-event", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(bookingData),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `Error: ${response.status}`);
      }

      return true;
    } catch (error: any) {
      console.error("Error creating booking:", error);
      toast.error("Error", {
        description: error.message || "Failed to create booking",
      });
      return false;
    }
  },

  // Update a booking
  updateBooking: async (
    id: string,
    bookingData: IBookEventupdate
  ): Promise<boolean> => {
    try {
      const response = await fetch(`/api/book-event/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("adminToken")}`,
        },
        body: JSON.stringify(bookingData),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `Error: ${response.status}`);
      }

      toast.success("Success", {
        description: "Booking updated successfully",
      });
      return true;
    } catch (error: any) {
      console.error(`Error updating booking ${id}:`, error);
      toast.error("Error", {
        description: error.message || "Failed to update booking",
      });
      return false;
    }
  },

  // Delete a booking
  deleteBooking: async (id: string): Promise<boolean> => {
    try {
      const response = await fetch(`/api/book-event/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("adminToken")}`,
        },
      });

      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }

      toast.success("Success", {
        description: "Booking deleted successfully",
      });
      return true;
    } catch (error) {
      console.error(`Error deleting booking ${id}:`, error);
      toast.error("Error", {
        description: "Failed to delete booking",
      });
      return false;
    }
  },

  // Delete multiple bookings
  deleteBookings: async (ids: string[]): Promise<boolean> => {
    try {
      const response = await fetch(
        `/api/book-event?bookEventIds=${ids.join(",")}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("adminToken")}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }
      return true;
    } catch (error) {
      console.error("Error deleting bookings:", error);
      toast.error("Error", {
        description: "Failed to delete bookings",
      });
      return false;
    }
  },
};
