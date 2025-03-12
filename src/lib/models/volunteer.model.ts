import mongoose, { Schema, Model } from "mongoose";
import { IVolunteerData } from "@/types";

const VolunteerSchema: Schema<IVolunteerData> = new mongoose.Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User", 
      required: false, 
    },
    image: {
      type: String, 
      required: true,
    },
    isVisible:{
      type:Boolean,
      deafult: false
    },
    reason: {
      type: String, 
      required: true,
    },
    socialLink: {
      type: Map, 
      of: String, 
      required: false, 
    },
  },
  { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } }
);

// Virtual field to get `id` as a string representation of the ObjectId
VolunteerSchema.virtual("id").get(function () {
  return this._id.toHexString();
});

// Define and export the Volunteer model
const Volunteer =
  (mongoose.models.Volunteer as Model<IVolunteerData>) ||
  mongoose.model<IVolunteerData>("Volunteer", VolunteerSchema);

export { Volunteer };
