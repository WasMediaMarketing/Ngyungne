import {
  IJoinCourseService,
  IJoinCourseInput,
  IJoinCourseData,
  IJoinCourseUpdate,
} from "@/types";
import { JoinCourse, Course } from "@/lib/models";
import { UserService } from "@/lib/services";
import { connectToDatabase } from "@/lib/utils/mongodb";

export class JoinCourseService implements IJoinCourseService {
  private async initializeDbConnection() {
    await connectToDatabase();
  }

  // Create a new course enrollment
  async createJoinCourse(
    joinCourseData: IJoinCourseInput
  ): Promise<IJoinCourseData> {
    await this.initializeDbConnection();

    const course = await Course.findById(joinCourseData.courseId);

    if (!course) {
      throw new Error("Course not found");
    }

    const userService = new UserService();
    const user = await userService.createUser({
      name: joinCourseData.name,
      email: joinCourseData.email,
      phoneNumber: joinCourseData.phoneNumber,
      page: joinCourseData.page,
      pageTitle: joinCourseData.pageTitle,
      address: joinCourseData.address,
    });

    const joinCourse = new JoinCourse({
      userId: user.id,
      courseId: joinCourseData.courseId,
      experience: joinCourseData.experience,
      specialRequirement: joinCourseData.specialRequirement,
      reason: joinCourseData.reason,
    });

    await joinCourse.save();

    // Increment students count in course
    course.students += 1;
    await course.save();

    return joinCourse;
  }

  // Get all course enrollments or filter by courseId
  async getJoinCourses(courseId?: string): Promise<IJoinCourseData[]> {
    await this.initializeDbConnection();

    if (courseId) {
      return await JoinCourse.find({ courseId })
        .populate("userId")
        .populate("courseId");
    }

    return await JoinCourse.find().populate("userId").populate("courseId");
  }

  // Delete a single course enrollment
  async deleteJoinCourse(joinCourseId: string): Promise<boolean> {
    await this.initializeDbConnection();

    const joinCourse = await JoinCourse.findById(joinCourseId);
    if (!joinCourse) return false;

    const course = await Course.findById(joinCourse.courseId);
    if (course) {
      course.students -= 1;
      await course.save();
    }

    const result = await JoinCourse.findByIdAndDelete(joinCourseId);
    return !!result;
  }

  // Delete multiple course enrollments
  async deleteJoinCourses(joinCourseIds: string[]): Promise<boolean> {
    await this.initializeDbConnection();

    const joinCourses = await JoinCourse.find({ _id: { $in: joinCourseIds } });

    for (const joinCourse of joinCourses) {
      const course = await Course.findById(joinCourse.courseId);
      if (course) {
        course.students -= 1;
        await course.save();
      }
    }

    const result = await JoinCourse.deleteMany({
      _id: { $in: joinCourseIds },
    });

    return result.deletedCount > 0;
  }

  // Update a course enrollment
  async updateJoinCourse(
    joinCourseId: string,
    joinCourseData: IJoinCourseUpdate
  ): Promise<boolean> {
    await this.initializeDbConnection();
    const existingJoinCourse = await JoinCourse.findById(joinCourseId);

    if (!existingJoinCourse) {
      throw new Error("Join course entry not found");
    }

    await JoinCourse.findByIdAndUpdate(joinCourseId, joinCourseData, {
      new: true,
    });

    return true;
  }
}
