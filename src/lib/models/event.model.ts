import mongoose, { Schema, Model } from "mongoose";
import { IEvent } from "@/types";

const EventSchema: Schema<IEvent> = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    type: { type: String, required: true },
    date: { type: Date, required: true },
    time: { type: String, required: true },
    location: { type: String, required: true },
    teacher: { type: String, required: true },
    image: { type: String, required: false },
    tags: { type: [String], required: false },
    featured: { type: Boolean, required: false },
    attending: { type: Number, required: false },
    capacity: { type: Number, required: false },
  },
  { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } }
);

EventSchema.virtual("id").get(function () {
  return this._id.toHexString();
});

const Event =
  (mongoose.models.Event as Model<IEvent>) ||
  mongoose.model<IEvent>("Event", EventSchema);

export { Event };
