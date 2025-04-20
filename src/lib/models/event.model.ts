import mongoose, { Schema, Model } from "mongoose";
import { IEvent } from "@/types";

const TeacherSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    speciality: { type: String, required: false },
    description: { type: String, required: false },
    image: { type: String, required: false },
    link: { type: String, required: false },
    credentials: { type: [String], required: false },
  },
  { _id: false }
);

const EventSchema: Schema<IEvent> = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    type: { type: String, required: true },
    date: { type: Date, required: true },
    time: { type: String, required: true },
    location: { type: String, required: true },
    teacher: { type: TeacherSchema, required: true },
    image: { type: String, required: false },
    tags: { type: [String], required: false },
    featured: { type: Boolean, required: false },
    attending: { type: Number, required: false },
    capacity: { type: Number, required: true },
    availableTickets: { type: Number, required: true },
    isVisible: { type: Boolean, default: true },
    schedule: {
      type: Map,
      of: {
        title: { type: String, required: false },
        description: { type: String, required: false },
      },
      required: false,
    },
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
