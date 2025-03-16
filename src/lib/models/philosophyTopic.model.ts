import mongoose, { Schema, Model } from "mongoose";
import { IPhilosophyTopic } from "@/types";

const PhilosophyTopicSchema: Schema<IPhilosophyTopic> = new mongoose.Schema(
  {
    title: { type: String, required: true },
    icon: { type: String, required: true },
    description: { type: String, required: true },
    content: { type: String, required: true },
    quotes: [
      {
        text: { type: String, required: false },
        author: { type: String, required: false },
      },
    ],
    practices: { type: [String], required: false },
    isVisible: { type: Boolean, default: true },
  },
  { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } }
);

PhilosophyTopicSchema.virtual("id").get(function () {
  return this._id.toHexString();
});

const PhilosophyTopic: Model<IPhilosophyTopic> =
  mongoose.models.PhilosophyTopic ||
  mongoose.model<IPhilosophyTopic>("PhilosophyTopic", PhilosophyTopicSchema);

export { PhilosophyTopic };
