import mongoose, { Schema, Model } from "mongoose";
import { IScripture } from "@/types/scripture.types";

const VerseSchema = new Schema({
  number: { type: Number, required: true },
  chapter: { type: String, required: true },
  text: { type: String, required: true },
  commentary: { type: String },
});

const ScriptureSchema = new Schema(
  {
    title: { type: String, required: true },
    tradition: { type: String, required: true },
    period: { type: String, required: true },
    language: { type: String, required: true },
    description: { type: String, required: true },
    overview: { type: String, required: true },
    verses: { type: [VerseSchema], default: [] },
    significance: { type: String },
    historicalContext: { type: String },
    image: { type: String },
    isVisible: { type: Boolean, default: true },
    views: { type: Number, default: 0 },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

ScriptureSchema.virtual("id").get(function () {
  return this._id.toHexString();
});

export const Scripture =
  (mongoose.models.Scripture as Model<IScripture>) ||
  mongoose.model<IScripture>("Scripture", ScriptureSchema);
