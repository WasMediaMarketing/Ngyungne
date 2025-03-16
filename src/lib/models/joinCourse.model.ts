import mongoose, { Schema, Types, Model } from "mongoose";
import { IJoinCourseData } from "@/types";

const JoinCourseSchema: Schema<IJoinCourseData> = new Schema<IJoinCourseData>(
  {
    userId: {
      type: Types.ObjectId,
      ref: "User",
      required: true,
    },
    courseId: {
      type: Types.ObjectId,
      ref: "Course",
      required: true,
    },
    experience: {
      type: String,
    },
    specialRequirement: {
      type: String,
    },
    reason: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const JoinCourse =
  (mongoose.models.JoinCourse as Model<IJoinCourseData>) ||
  mongoose.model<IJoinCourseData>("JoinCourse", JoinCourseSchema);

export { JoinCourse };
