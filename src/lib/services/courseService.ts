import { Course } from "@/lib/models";
import { ICourseInput, ICourseUpdate, ICourse, ICourseService } from "@/types";
import { connectToDatabase } from "@/lib/utils/mongodb";
import { Types } from "mongoose";
import { deleteFile } from "@/lib/utils/deleteFile"; // Import the deleteFile utility

export class CourseService implements ICourseService {
  private async initializeDbConnection() {
    await connectToDatabase();
  }

  /**
   * @description Creates a new course in the system
   * @param {ICourseInput} courseData - Data to create the course
   * @returns {Promise<ICourse>} The created course
   */
  async createCourse(courseData: ICourseInput): Promise<ICourse> {
    await this.initializeDbConnection();
    const course = new Course({
      ...courseData,
    });
    await course.save();
    return course;
  }

  /**
   * @description Retrieves all courses in the system
   * @returns {Promise<ICourse[]>} List of all courses
   */
  async getCourses(isVisible?: boolean): Promise<ICourse[]> {
    await this.initializeDbConnection();
    if (isVisible) {
      return await Course.find({ isVisible: true });
    }
    return await Course.find();
  }

  /**
   * @description Retrieves a single course by its ID
   * @param {string} courseId - The ID of the course to retrieve
   * @returns {Promise<ICourse | null>} The course found or null if not found
   */
  async getCourseById(courseId: Types.ObjectId): Promise<ICourse | null> {
    await this.initializeDbConnection();
    const course = await Course.findById(courseId);
    if (!course) throw new Error("Course not found");
    return course;
  }

  /**
   * @description Updates a course by its ID
   * @param {string} courseId - The ID of the course to update
   * @param {ICourseUpdate} courseData - The data to update the course
   * @returns {Promise<ICourse | null>} The updated course
   */
  async updateCourse(
    courseId: Types.ObjectId,
    courseData: ICourseUpdate
  ): Promise<ICourse | null> {
    await this.initializeDbConnection();
    const existingCourse = await Course.findById(courseId);
    if (!existingCourse) {
      throw new Error("Course Not Found");
    }

    if (
      courseData.image &&
      courseData.image !== existingCourse.image &&
      existingCourse.image
    ) {
      deleteFile(existingCourse.image);
    }

    if (
      courseData.instructor?.image &&
      courseData.instructor.image !== existingCourse.instructor.image &&
      existingCourse.instructor.image
    ) {
      deleteFile(existingCourse.instructor.image);
    }

    const course = await Course.findByIdAndUpdate(courseId, courseData, {
      new: true,
    });
    if (!course) throw new Error("Course not found");
    return course;
  }

  /**
   * @description Deletes a course by its ID
   * @param {string} courseId - The ID of the course to delete
   * @returns {Promise<ICourse | null>} The deleted course
   */
  async deleteCourse(courseId: Types.ObjectId): Promise<ICourse | null> {
    await this.initializeDbConnection();

    const course = await Course.findById(courseId);
    if (!course) throw new Error("Course not found");

    if (course.image) {
      deleteFile(course.image);
    }

    if (course.instructor?.image) {
      deleteFile(course.instructor.image);
    }

    const deletedCourse = await Course.findByIdAndDelete(courseId);
    return deletedCourse;
  }

  /**
   * @description Deletes multiple courses by their IDs
   * @param {Types.ObjectId[]} courseIds - Array of course IDs to delete
   * @returns {Promise<unknown>} A promise indicating the deletion status
   */
  async deleteCourses(courseIds: Types.ObjectId[]): Promise<unknown> {
    await this.initializeDbConnection();

    const courses = await Course.find({ _id: { $in: courseIds } });
    if (courses.length === 0) throw new Error("No courses found");

    courses.forEach((course) => {
      if (course.image) {
        deleteFile(course.image);
      }

      if (course.instructor?.image) {
        deleteFile(course.instructor.image);
      }
    });

    const deletedCourses = await Course.deleteMany({ _id: { $in: courseIds } });
    return deletedCourses;
  }
}
