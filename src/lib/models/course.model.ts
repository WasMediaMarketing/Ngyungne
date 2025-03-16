import mongoose, { Schema, Model } from "mongoose";
import { ICourse } from "@/types";

const ModuleSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    lessons: { type: [String], required: true },
  },
  { _id: false }
);

const InstructorSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    image: { type: String, required: true },
    position: { type: String, required: true },
    description: { type: String, required: true },
  },
  { _id: false }
);

const CourseSchema: Schema<ICourse> = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    overView: { type: String, required: true },
    outcomes: { type: [String], required: true },
    prerequisites: { type: String, required: true },
    targetAudience: { type: String, required: true },
    duration: { type: String, required: true },
    lessons: { type: Number, required: true },
    level: { type: String, required: true },
    featured: { type: Boolean, required: true },
    students: { type: Number, default: 0 },
    image: { type: String, required: true },
    modules: { type: [ModuleSchema], required: true },
    instructor: { type: InstructorSchema, required: true },
    isVisible: { type: Boolean, default: true },
  },
  { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } }
);

CourseSchema.virtual("id").get(function () {
  return this._id.toHexString();
});

const Course =
  (mongoose.models.Course as Model<ICourse>) ||
  mongoose.model<ICourse>("Course", CourseSchema);

export { Course };
