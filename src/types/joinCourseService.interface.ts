import { IJoinCourseInput, IJoinCourseData, IJoinCourseUpdate } from "@/types";

export interface IJoinCourseService {
  createJoinCourse(joinCourseData: IJoinCourseInput): Promise<IJoinCourseData>;

  updateJoinCourse(
    joinCourseId: string,
    joinCourseData: IJoinCourseUpdate
  ): Promise<boolean>;

  getJoinCourses(joinCourseId?: string): Promise<IJoinCourseData[]>;

  deleteJoinCourse(joinCourseId: string): Promise<boolean>;

  deleteJoinCourses(joinCourseIds: string[]): Promise<boolean>;
}
