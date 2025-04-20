import mongoose, { Schema, Model } from "mongoose";
import { IRetreat } from "@/types";

const RetreatSchema: Schema<IRetreat> = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    date: { type: String, required: true },
    duration: { type: String, required: true },
    location: { type: String, required: true },
    participants: { type: Number, default: 0 },
    price: { type: String, required: true },
    type: { type: String, required: true },
    isVisible: { type: Boolean, default: true },
    schedule: [
      {
        time: { type: String, required: true },
        activity: { type: String, required: true },
      },
    ],
  },
  { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } }
);

RetreatSchema.virtual("id").get(function () {
  return this._id.toHexString();
});

const Retreat =
  (mongoose.models.Retreat as Model<IRetreat>) ||
  mongoose.model<IRetreat>("Retreat", RetreatSchema);

export { Retreat };
