import { Types } from "mongoose";
import { ICourseInput, ICourse, ICourseUpdate } from "@/types";

export interface ICourseService {
  createCourse(courseData: ICourseInput): Promise<ICourse>;
  getCourses(isVisible?: boolean): Promise<ICourse[]>;
  getCourseById(id: Types.ObjectId): Promise<ICourse | null>;
  updateCourse(
    id: Types.ObjectId,
    courseData: ICourseUpdate
  ): Promise<ICourse | null>;
  deleteCourse(id: Types.ObjectId): Promise<ICourse | null>;
  deleteCourses(ids: Types.ObjectId[]): Promise<unknown>;
}
