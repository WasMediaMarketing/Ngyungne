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
    isVisible: {
      type: Boolean,
      deafult: false,
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

VolunteerSchema.virtual("id").get(function () {
  return this._id.toHexString();
});

const Volunteer =
  (mongoose.models.Volunteer as Model<IVolunteerData>) ||
  mongoose.model<IVolunteerData>("Volunteer", VolunteerSchema);

export { Volunteer };
