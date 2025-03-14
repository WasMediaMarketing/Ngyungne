import mongoose, { Schema, Types, Model } from "mongoose";
import { IBookEventData } from "@/types";

const BookEventSchema: Schema<IBookEventData> = new Schema<IBookEventData>(
  {
    userId: {
      type: Types.ObjectId,
      ref: "User",
      required: true,
    },
    eventId: {
      type: Types.ObjectId,
      ref: "Event",
      required: true,
    },
    TicketNumber: {
      type: Number,
      required: true,
    },
    dietaryRequirements: {
      type: String,
    },
    specialAccomodation: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

const BookEvent =
  (mongoose.models.BookEvent as Model<IBookEventData>) ||
  mongoose.model<IBookEventData>("BookEvent", BookEventSchema);

export { BookEvent };
