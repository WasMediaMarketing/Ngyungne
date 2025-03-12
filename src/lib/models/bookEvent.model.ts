import { Schema, model, Types } from "mongoose";
import { IBookEventData } from "@/types"; 

const BookEventSchema:Schema <IBookEventData> = new Schema<IBookEventData>(
  {
    userId: {
      type: Types.ObjectId,
      ref: "User", 
      required: true,
    },
    eventId:{
      type:Types.ObjectId,
      ref:"Event",
      required: true
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

export const BookEvent = model<IBookEventData>("BookEvent", BookEventSchema);

