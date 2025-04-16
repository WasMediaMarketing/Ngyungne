import mongoose, { Schema, Document } from "mongoose";
import { Ambassador } from "@/types/ambassador.types";

export interface AmbassadorDocument extends Document, Omit<Ambassador, "id"> {
  // Document interface
}

const SocialLinksSchema = new Schema(
  {
    linkedin: { type: String, trim: true },
    twitter: { type: String, trim: true },
    instagram: { type: String, trim: true },
    facebook: { type: String, trim: true },
    website: { type: String, trim: true },
    email: { type: String, trim: true },
  },
  { _id: false }
);

const AmbassadorSchema = new Schema(
  {
    name: { type: String, required: true, trim: true },
    role: {
      type: String,
      required: true,
      enum: [
        "Founder",
        "Co-Founder",
        "Executive Director",
        "Ambassador",
        "Program Coordinator",
        "Community Liaison",
        "Volunteer",
      ],
    },
    bio: { type: String, required: true },
    image: { type: String, required: true },
    location: { type: String, trim: true },
    quote: { type: String, trim: true },
    achievements: [{ type: String, trim: true }],
    socialLinks: { type: SocialLinksSchema, default: {} },
    isVisible: { type: Boolean, default: false },
  },
  { timestamps: true }
);

// Transform the document to return a clean object
AmbassadorSchema.set("toJSON", {
  transform: (doc, ret) => {
    ret.id = ret._id.toString();
    delete ret._id;
    delete ret.__v;
    return ret;
  },
});

export const AmbassadorModel =
  mongoose.models.Ambassador ||
  mongoose.model<AmbassadorDocument>("Ambassador", AmbassadorSchema);
