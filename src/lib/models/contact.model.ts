import mongoose, { Schema, Model } from "mongoose";
import { IContactData } from "@/types";

const ContactSchema: Schema<IContactData> = new mongoose.Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    subject: {
      type: String,
      required: true,
    },
    message: {
      type: String,
      required: true,
    },
  },
  { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } }
);

ContactSchema.virtual("id").get(function () {
  return this._id.toHexString();
});

const Contact =
  (mongoose.models.Contact as Model<IContactData>) ||
  mongoose.model<IContactData>("Contact", ContactSchema);

export { Contact };
