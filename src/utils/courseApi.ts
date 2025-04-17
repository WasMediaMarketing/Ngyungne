import { toast } from "sonner";
import type { ICourse } from "@/types";

// Define a simplified course type for API responses
export type CourseApiResponse = {
  _id?: string;
  id: string;
  title: string;
  description: string;
  overView: string;
  outcomes: string[];
  prerequisites: string;
  targetAudience: string;
  duration: string;
  lessons: number;
  level: string;
  featured: boolean;
  students?: number;
  image?: string;
  modules: Array<{
    title: string;
    lessons: string[];
  }>;
  instructor: {
    name: string;
    position: string;
    description: string;
    image?: string;
  };
  isVisible: boolean;
  [key: string]: any; // Allow for additional properties
};

// Helper function to convert API response to ICourse
const mapToCourse = (course: CourseApiResponse): ICourse => {
  // Create a base object with all the properties we need
  const mappedCourse = {
    ...course,
    id: course.id || course._id?.toString() || "",
    modules: course.modules || [],
    outcomes: course.outcomes || [],
    isVisible: course.isVisible !== undefined ? course.isVisible : true,
    students: course.students || 0,
  };

  // Use type assertion to tell TypeScript this is an ICourse
  return mappedCourse as unknown as ICourse;
};

// Course API functions
export const courseApi = {
  // Get public courses (only visible courses)
  getPublicCourses: async (): Promise<ICourse[]> => {
    try {
      const response = await fetch("/api/course");

      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }

      const { data } = await response.json();
      return Array.isArray(data)
        ? (data.map((course) => mapToCourse(course)) as ICourse[])
        : [];
    } catch (error) {
      console.error("Error fetching public courses:", error);
      toast.error("Error", {
        description: "Failed to fetch courses",
      });
      return [];
    }
  },

  // Get all courses (admin - includes visible and hidden courses)
  getCourses: async (): Promise<ICourse[]> => {
    try {
      const response = await fetch("/api/course", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("adminToken")}`,
        },
      });

      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }

      const { data } = await response.json();
      return Array.isArray(data)
        ? (data.map((course) => mapToCourse(course)) as ICourse[])
        : [];
    } catch (error) {
      console.error("Error fetching admin courses:", error);
      toast.error("Error", {
        description: "Failed to fetch courses",
      });
      return [];
    }
  },

  // Get course by ID
  getCourseById: async (id: string): Promise<ICourse | null> => {
    try {
      const response = await fetch(`/api/course/${id}`);

      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }

      const { data } = await response.json();
      return mapToCourse(data);
    } catch (error) {
      console.error(`Error fetching course ${id}:`, error);
      toast.error("Error", {
        description: "Failed to fetch course details",
      });
      return null;
    }
  },

  // Create a new course
  createCourse: async (formData: FormData): Promise<ICourse | null> => {
    try {
      // Log the FormData for debugging
      console.log("API - Form data entries:");
      for (const pair of formData.entries()) {
        console.log(pair[0], typeof pair[1], pair[1]);
      }

      const response = await fetch("/api/course", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("adminToken")}`,
          // Don't set Content-Type for FormData - browser will set it with boundary
        },
        body: formData,
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

      const data = await response.json();
      toast.success("Success", {
        description: "Course created successfully",
      });
      return mapToCourse(data);
    } catch (error: any) {
      console.error("Error creating course:", error);
      toast.error("Error", {
        description: error.message || "Failed to create course",
      });
      return null;
    }
  },

  // Update an existing course
  updateCourse: async (
    id: string,
    formData: FormData
  ): Promise<ICourse | null> => {
    try {
      // Log the FormData for debugging
      console.log("API - Update Form data entries:");
      for (const pair of formData.entries()) {
        console.log(pair[0], typeof pair[1], pair[1]);
      }

      const response = await fetch(`/api/course/${id}`, {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("adminToken")}`,
          // Don't set Content-Type for FormData - browser will set it with boundary
        },
        body: formData,
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

      const data = await response.json();
      toast.success("Success", {
        description: "Course updated successfully",
      });
      return mapToCourse(data);
    } catch (error: any) {
      console.error(`Error updating course ${id}:`, error);
      toast.error("Error", {
        description: error.message || "Failed to update course",
      });
      return null;
    }
  },

  // Update course visibility
  updateCourseVisibility: async (
    id: string,
    isVisible: boolean
  ): Promise<ICourse | null> => {
    try {
      const response = await fetch(`/api/course/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("adminToken")}`,
        },
        body: JSON.stringify({ isVisible }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `Error: ${response.status}`);
      }

      const data = await response.json();
      toast.success("Success", {
        description: `Course ${
          isVisible ? "published" : "unpublished"
        } successfully`,
      });
      return mapToCourse(data);
    } catch (error: any) {
      console.error(`Error toggling course visibility ${id}:`, error);
      toast.error("Error", {
        description:
          error.message ||
          `Failed to ${isVisible ? "publish" : "unpublish"} course`,
      });
      return null;
    }
  },

  // Toggle course visibility with better state management
  toggleVisibility: async (
    id: string,
    isVisible: boolean
  ): Promise<boolean> => {
    try {
      const token = localStorage.getItem("adminToken");
      if (!token) {
        throw new Error("Admin token not found");
      }

      await fetch(`/api/course/${id}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ isVisible }),
      });

      toast.success("Success", {
        description: `Course is now ${
          isVisible ? "visible" : "hidden"
        } on the website`,
      });
      return true;
    } catch (error) {
      toast.error("Error", {
        description: "Failed to update course visibility",
      });
      console.error("Error updating course visibility:", error);
      return false;
    }
  },

  // Delete a course
  deleteCourse: async (id: string): Promise<boolean> => {
    try {
      const response = await fetch(`/api/course/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("adminToken")}`,
        },
      });

      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }

      toast.success("Success", {
        description: "Course deleted successfully",
      });
      return true;
    } catch (error) {
      console.error(`Error deleting course ${id}:`, error);
      toast.error("Error", {
        description: "Failed to delete course",
      });
      return false;
    }
  },

  // Delete multiple courses
  deleteCourses: async (ids: string[]): Promise<boolean> => {
    try {
      const response = await fetch(`/api/course?courseIds=${ids.join(",")}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("adminToken")}`,
        },
      });

      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }

      toast.success("Success", {
        description: `${ids.length} courses deleted successfully`,
      });
      return true;
    } catch (error) {
      console.error("Error deleting courses:", error);
      toast.error("Error", {
        description: "Failed to delete courses",
      });
      return false;
    }
  },
};
