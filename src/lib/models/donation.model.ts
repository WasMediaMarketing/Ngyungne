import mongoose, { Schema, Model } from "mongoose";
import { IDonationData } from "@/types";

const DonationSchema: Schema<IDonationData> = new mongoose.Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    amount: {
      type: Number,
      required: true,
      min: 0,
    },
    screenshot: {
      type: String, // Stores relative path like /uploads/05-03-2025/image-12345.png
      required: true,
    },
    donationType: {
      type: String,
      required: true,
    },
    donationMethod: {
      type: String,
      required: true,
    },
  },
  { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } }
);

DonationSchema.virtual("id").get(function () {
  return this._id.toHexString();
});

const Donation =
  (mongoose.models.Donation as Model<IDonationData>) ||
  mongoose.model<IDonationData>("Donation", DonationSchema);

export { Donation };
