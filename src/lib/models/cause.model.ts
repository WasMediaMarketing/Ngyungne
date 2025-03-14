import mongoose, { Schema, Model } from "mongoose";
import { ICause } from "@/types";

const CauseSchema: Schema<ICause> = new Schema(
  {
    title: { type: String, required: true },
    subtitle: { type: String, required: false },
    image: { type: String, required: true },
    tags: { type: [String], required: false },
    raised: { type: Number, default: 0 },
    goal: { type: Number, required: true },
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    volunteers: { type: Number, default: 0 },
    location: { type: String, required: true },
    totalDonors: { type: Number, default: 0 },
    about: {
      longDescription: { type: String, required: false },
      objectives: { type: [String], required: true },
    },
    impact: { type: String, required: true },
    isVisible: { type: Boolean, default: true },
    updates: { type: String, required: true },
    faq: [
      {
        question: { type: String, required: true },
        answer: { type: String, required: true },
      },
    ],
    gallery: { type: [String], required: false },
  },
  { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } }
);

CauseSchema.virtual("id").get(function () {
  return this._id.toHexString();
});

const Cause =
  (mongoose.models.Cause as Model<ICause>) ||
  mongoose.model<ICause>("Cause", CauseSchema);

export { Cause };
