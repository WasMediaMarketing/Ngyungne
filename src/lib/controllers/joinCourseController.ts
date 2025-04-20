import { NextRequest, NextResponse } from "next/server";
import { IJoinCourseService } from "@/types";
import { httpMessages } from "@/lib/utils/HttpMessage";
import { handleError } from "@/lib/utils/errorHandler";
import { handleResponse } from "@/lib/utils/responseHandler";
import { Types } from "mongoose";

export class JoinCourseController {
  private joinCourseService: IJoinCourseService;

  constructor(joinCourseService: IJoinCourseService) {
    this.joinCourseService = joinCourseService;
  }

  // Create a new course enrollment
  async createJoinCourse(req: NextRequest): Promise<NextResponse> {
    try {
      const joinCourseData = await req.json();
      const joinCourse = await this.joinCourseService.createJoinCourse(
        joinCourseData
      );
      return handleResponse(joinCourse, httpMessages.CREATED());
    } catch (error) {
      console.error("createJoinCourseController error:", error);
      return handleError();
    }
  }

  // Get all course enrollments
  async getJoinCourses(): Promise<NextResponse> {
    try {
      const joinCourses = await this.joinCourseService.getJoinCourses();
      return handleResponse(joinCourses);
    } catch (error) {
      console.error("getJoinCoursesController error:", error);
      return handleError();
    }
  }

  // Get a specific course enrollment by ID
  async getJoinCourseById(req: NextRequest): Promise<NextResponse> {
    try {
      const joinCourseId = req.nextUrl.pathname.split("/").pop();

      if (!joinCourseId) {
        return handleError(
          httpMessages.BAD_REQUEST("JoinCourse ID is required")
        );
      }

      const joinCourse = await this.joinCourseService.getJoinCourses(
        joinCourseId
      );
      return handleResponse(joinCourse);
    } catch (error) {
      console.error("getJoinCourseByIdController error:", error);
      return handleError();
    }
  }

  // Update a specific course enrollment
  async updateJoinCourse(req: NextRequest): Promise<NextResponse> {
    try {
      const joinCourseId = req.nextUrl.pathname.split("/").pop();

      if (!joinCourseId) {
        return handleError(
          httpMessages.BAD_REQUEST("JoinCourse ID is required")
        );
      }

      const joinCourseData = await req.json();
      const updatedJoinCourse = await this.joinCourseService.updateJoinCourse(
        joinCourseId,
        joinCourseData
      );
      return handleResponse(updatedJoinCourse);
    } catch (error) {
      console.error("updateJoinCourseController error:", error);
      return handleError();
    }
  }

  // Delete a single course enrollment
  async deleteJoinCourse(req: NextRequest): Promise<NextResponse> {
    try {
      const joinCourseId = req.nextUrl.pathname.split("/").pop();

      if (!joinCourseId) {
        return handleError(
          httpMessages.BAD_REQUEST("JoinCourse ID is required")
        );
      }

      const isDeleted = await this.joinCourseService.deleteJoinCourse(
        joinCourseId
      );
      return handleResponse(isDeleted);
    } catch (error) {
      console.error("deleteJoinCourseController error:", error);
      return handleError();
    }
  }

  // Delete multiple course enrollments
  async deleteJoinCourses(req: NextRequest): Promise<NextResponse> {
    try {
      const url = req.nextUrl;
      const joinCourseIds = url.searchParams.get("joinCourseIds");

      if (!joinCourseIds) {
        return handleError(
          httpMessages.BAD_REQUEST("JoinCourse IDs are required")
        );
      }

      const joinCourseIdArray = joinCourseIds.split(",").map((id) => id.trim());

      for (const id of joinCourseIdArray) {
        if (!Types.ObjectId.isValid(id)) {
          return handleError(
            httpMessages.BAD_REQUEST(`Invalid Course ID: ${id}`)
          );
        }
      }

      const isDeleted = await this.joinCourseService.deleteJoinCourses(
        joinCourseIdArray
      );
      return handleResponse(isDeleted);
    } catch (error) {
      console.error("deleteJoinCoursesController error:", error);
      return handleError();
    }
  }
}
