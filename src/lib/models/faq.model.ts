import mongoose, { Schema, Model } from "mongoose";
import { IFaq } from "@/types";

const FaqSchema: Schema<IFaq> = new mongoose.Schema(
  {
    question: { type: String, required: true },
    answer: { type: String, required: true },
  },
  { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } }
);

FaqSchema.virtual("id").get(function () {
  return this._id.toHexString();
});

const Faq =
  (mongoose.models.Faq as Model<IFaq>) ||
  mongoose.model<IFaq>("Faq", FaqSchema);

export { Faq };
