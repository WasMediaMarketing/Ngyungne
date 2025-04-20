import { Document, Types } from "mongoose";
import { IUser, IUserInput, ICourse } from "@/types";

export interface IJoinCourseInput
  extends Pick<
    IUserInput,
    "name" | "email" | "phoneNumber" | "page" | "pageTitle" | "address"
  > {
  educationalLevel: string;
  courseId: Types.ObjectId;
  experience?: string;
  specialRequirement?: string;
  reason: string;
}

export interface IJoinCourseUpdate {
  educationalLevel?: string;
  experience?: string;
  specialRequirement?: string;
  reason?: string;
}

export interface IJoinCourseData extends Document {
  _id: Types.ObjectId;
  id: string;
  userId: Types.ObjectId | IUser;
  courseId: Types.ObjectId | ICourse;
  educationalLevel: string;
  experience: string;
  specialRequirement?: string;
  reason: string;
  createdAt?: Date;
  updatedAt?: Date;
}
