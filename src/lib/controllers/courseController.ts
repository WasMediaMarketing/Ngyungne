import { ICourseService } from "@/types";
import { NextRequest, NextResponse } from "next/server";
import { handleError } from "../utils/errorHandler";
import { handleResponse } from "../utils/responseHandler";
import { httpMessages } from "../utils/HttpMessage";
import { Types } from "mongoose";
import { ExtendedNextRequest } from "@/lib/utils/requestHelpers";

export class CourseController {
  private courseService: ICourseService;

  constructor(courseService: ICourseService) {
    this.courseService = courseService;
  }

  /**
   * @summary Create a new course
   * @param {NextRequest} req - The request object
   * @returns {NextResponse} The response with the created course
   */
  async createCourse(req: ExtendedNextRequest): Promise<NextResponse> {
    try {
      const courseData = await req.json();
      const course = await this.courseService.createCourse(courseData);
      return handleResponse(course, httpMessages.CREATED());
    } catch (error) {
      return handleError(undefined, req);
    }
  }

  /**
   * @summary Get all courses
   * @description Retrieves all courses from the system
   * @param {NextRequest} req - The request object
   * @returns {NextResponse} The response with the list of courses
   */
  async getCourses(): Promise<NextResponse> {
    try {
      const courses = await this.courseService.getCourses();
      return handleResponse(courses);
    } catch (error) {
      return handleError();
    }
  }

  /**
   * @summary Get all published courses
   * @description Retrieves all courses from the system
   * @param {NextRequest} req - The request object
   * @returns {NextResponse} The response with the list of courses
   */
  async getPublishedCourses(): Promise<NextResponse> {
    try {
      const courses = await this.courseService.getCourses();
      // You could filter here by visibility if needed
      return handleResponse(courses);
    } catch (error) {
      return handleError();
    }
  }

  /**
   * @summary Get a course by ID
   * @param {NextRequest} req - The request object
   * @returns {NextResponse} The response with the course details
   */
  async getCourseById(req: NextRequest): Promise<NextResponse> {
    try {
      const courseId = req.nextUrl.pathname.split("/").pop();
      if (!courseId || !Types.ObjectId.isValid(courseId)) {
        return handleError(
          httpMessages.BAD_REQUEST("Course ID is either missing or invalid")
        );
      }

      // Fetch the course using the courseId
      const course = await this.courseService.getCourseById(
        new Types.ObjectId(courseId)
      );
      return handleResponse(course);
    } catch (error) {
      return handleError();
    }
  }

  //   /**
  //    * @summary Get all courses directly for props
  //    * @description Retrieves all courses from the system
  //    * @param {NextRequest} req - The request object
  //    * @returns {NextResponse} The response with the list of courses
  //    */
  //   async getCoursesForProps(): Promise<ICourse[] | unknown> {
  //     try {
  //       const courses = await this.courseService.getCourses();
  //       return { data: courses };
  //     } catch (error) {
  //       return { error: error as Error };
  //     }
  //   }

  //   /**
  //    * @summary Get a course by ID directly for props
  //    * @param {NextRequest} req - The request object
  //    * @returns {NextResponse} The response with the course details
  //    */
  //   async getCourseByIdForProps(courseId: string): Promise<ICourse | unknown> {
  //     try {
  //       if (!courseId || !Types.ObjectId.isValid(courseId)) {
  //         throw new Error("Course ID is either missing or invalid");
  //       }

  //       // Fetch the course using the courseId
  //       const course = await this.courseService.getCourseById(
  //         new Types.ObjectId(courseId)
  //       );
  //       return { data: course };
  //     } catch (error) {
  //       return { error: error };
  //     }
  //   }

  /**
   * @summary Update a course by ID
   * @param {NextRequest} req - The request object
   * @returns {NextResponse} The response with the updated course
   */
  async updateCourse(
    req: ExtendedNextRequest | NextRequest
  ): Promise<NextResponse> {
    try {
      const courseId = req.nextUrl.pathname.split("/").pop();
      if (!courseId || !Types.ObjectId.isValid(courseId)) {
        return handleError(
          httpMessages.BAD_REQUEST("Course ID is either missing or invalid")
        );
      }

      const courseData = await req.json();
      const updatedCourse = await this.courseService.updateCourse(
        new Types.ObjectId(courseId),
        courseData
      );
      return handleResponse(updatedCourse);
    } catch (error) {
      return req instanceof ExtendedNextRequest
        ? handleError(undefined, req)
        : handleError();
    }
  }

  /**
   * @summary Delete a course by ID
   * @param {NextRequest} req - The request object
   * @returns {NextResponse} The response indicating whether the course was deleted successfully
   */
  async deleteCourse(req: NextRequest): Promise<NextResponse> {
    try {
      const courseId = req.nextUrl.pathname.split("/").pop();
      if (!courseId || !Types.ObjectId.isValid(courseId)) {
        return handleError(
          httpMessages.BAD_REQUEST("Course ID is either missing or invalid")
        );
      }

      const deletedCourse = await this.courseService.deleteCourse(
        new Types.ObjectId(courseId)
      );
      return handleResponse(deletedCourse);
    } catch (error) {
      return handleError();
    }
  }

  /**
   * @summary Delete multiple courses by their IDs
   * @param {NextRequest} req - The request object
   * @returns {NextResponse} The response indicating the result of the bulk delete
   */
  async deleteCourses(req: NextRequest): Promise<NextResponse> {
    try {
      const url = req.nextUrl;
      const courseIds = url.searchParams.get("courseIds");
      if (!courseIds) {
        return handleError(httpMessages.BAD_REQUEST("Course IDs are required"));
      }

      const courseIdArray = courseIds.split(",").map((id) => id.trim());

      for (const id of courseIdArray) {
        if (!Types.ObjectId.isValid(id)) {
          return handleError(
            httpMessages.BAD_REQUEST(`Invalid Course ID: ${id}`)
          );
        }
      }

      const objectIds = courseIdArray.map((id) => new Types.ObjectId(id));

      const isDeleted = await this.courseService.deleteCourses(objectIds);
      return handleResponse(isDeleted);
    } catch (error) {
      console.error("deleteCoursesController error:", error);
      return handleError();
    }
  }
}
