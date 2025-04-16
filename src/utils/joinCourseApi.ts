import { toast } from "sonner";
import type {
  IJoinCourseData,
  IJoinCourseInput,
  IJoinCourseUpdate,
} from "@/types";
import { Types } from "mongoose";

// Define a simplified join course type for API responses
export type JoinCourseApiResponse = {
  _id?: string;
  id: string;
  userId: string;
  courseId: string;
  educationalLevel: string;
  experience?: string;
  specialRequirement?: string;
  reason: string;
  createdAt?: string;
  updatedAt?: string;
  [key: string]: any; // Allow for additional properties
};

// Helper function to convert API response to IJoinCourseData
const mapToJoinCourse = (
  joinCourse: JoinCourseApiResponse
): IJoinCourseData => {
  // Create a base object with all the properties we need
  const mappedJoinCourse = {
    ...joinCourse,
    id: joinCourse.id || joinCourse._id?.toString() || "",
  };

  // Use type assertion to tell TypeScript this is an IJoinCourseData
  return mappedJoinCourse as unknown as IJoinCourseData;
};

// Join Course API functions
export const joinCourseApi = {
  // Create a new course enrollment
  createJoinCourse: async (
    data: Omit<IJoinCourseInput, "courseId"> & { courseId: string }
  ): Promise<IJoinCourseData | null> => {
    try {
      // Convert string courseId to ObjectId format expected by the API
      const formattedData = {
        ...data,
        courseId: new Types.ObjectId(data.courseId),
      };

      const response = await fetch("/api/join-course", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formattedData),
      });

      if (!response.ok) {
        const errorText = await response.text();
        let errorMessage = `Error: ${response.status}`;

        try {
          // Try to parse as JSON to get a better error message
          const errorData = JSON.parse(errorText);
          errorMessage = errorData.message || errorMessage;
        } catch (e) {
          // If it's not JSON, use the raw text if available
          if (errorText) errorMessage = errorText;
        }

        throw new Error(errorMessage);
      }

      const responseData = await response.json(); // Changed data to responseData to avoid shadowing

      return mapToJoinCourse(responseData);
    } catch (error: any) {
      console.error("Error creating course enrollment:", error);
      toast.error("Error", {
        description: error.message || "Failed to submit course enrollment",
      });
      return null;
    }
  },

  // Get all course enrollments (admin only)
  getJoinCourses: async (): Promise<IJoinCourseData[]> => {
    try {
      const response = await fetch("/api/join-course", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("adminToken")}`,
        },
      });

      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }

      const { data } = await response.json();
      return Array.isArray(data)
        ? (data.map((joinCourse) =>
            mapToJoinCourse(joinCourse)
          ) as IJoinCourseData[])
        : [];
    } catch (error) {
      console.error("Error fetching course enrollments:", error);
      toast.error("Error", {
        description: "Failed to fetch course enrollments",
      });
      return [];
    }
  },

  // Get course enrollment by ID (admin only)
  getJoinCourseById: async (id: string): Promise<IJoinCourseData | null> => {
    try {
      const response = await fetch(`/api/join-course/${id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("adminToken")}`,
        },
      });

      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }

      const data = await response.json();
      return mapToJoinCourse(data);
    } catch (error) {
      console.error(`Error fetching course enrollment ${id}:`, error);
      toast.error("Error", {
        description: "Failed to fetch course enrollment details",
      });
      return null;
    }
  },

  // Update an existing course enrollment (admin only)
  updateJoinCourse: async (
    id: string,
    data: IJoinCourseUpdate
  ): Promise<IJoinCourseData | null> => {
    try {
      const response = await fetch(`/api/join-course/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("adminToken")}`,
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorText = await response.text();
        let errorMessage = `Error: ${response.status}`;

        try {
          // Try to parse as JSON to get a better error message
          const errorData = JSON.parse(errorText);
          errorMessage = errorData.message || errorMessage;
        } catch (e) {
          // If it's not JSON, use the raw text if available
          if (errorText) errorMessage = errorText;
        }

        throw new Error(errorMessage);
      }

      const responseData = await response.json();
      toast.success("Success", {
        description: "Course enrollment updated successfully",
      });
      return mapToJoinCourse(responseData);
    } catch (error: any) {
      console.error(`Error updating course enrollment ${id}:`, error);
      toast.error("Error", {
        description: error.message || "Failed to update course enrollment",
      });
      return null;
    }
  },

  // Delete a course enrollment (admin only)
  deleteJoinCourse: async (id: string): Promise<boolean> => {
    try {
      const response = await fetch(`/api/join-course/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("adminToken")}`,
        },
      });

      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }

      toast.success("Success", {
        description: "Course enrollment deleted successfully",
      });
      return true;
    } catch (error) {
      console.error(`Error deleting course enrollment ${id}:`, error);
      toast.error("Error", {
        description: "Failed to delete course enrollment",
      });
      return false;
    }
  },

  // Delete multiple course enrollments (admin only)
  deleteJoinCourses: async (ids: string[]): Promise<boolean> => {
    try {
      const response = await fetch(
        `/api/join-course?joinCourseIds=${ids.join(",")}`,
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

      toast.success("Success", {
        description: `${ids.length} course enrollments deleted successfully`,
      });
      return true;
    } catch (error) {
      console.error("Error deleting course enrollments:", error);
      toast.error("Error", {
        description: "Failed to delete course enrollments",
      });
      return false;
    }
  },
};
