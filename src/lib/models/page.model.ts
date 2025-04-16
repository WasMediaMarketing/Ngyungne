import mongoose, { type Schema, type Model } from "mongoose";
import type { Page } from "@/types/page.types";

const PageSchema: Schema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
    },
    location: {
      type: String,
      enum: ["header", "footer"],
      required: true,
    },
    parentPage: {
      type: String,
      required: false,
    },
    content: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ["draft", "published"],
      default: "draft",
    },
    metaTitle: {
      type: String,
      required: false,
    },
    metaKeywords: {
      type: String,
      required: false,
    },
    metaDescription: {
      type: String,
      required: false,
    },
  },
  { timestamps: true }
);

// Add virtual properties
PageSchema.virtual("id").get(function (this: { _id: mongoose.Types.ObjectId }) {
  return this._id.toHexString();
});

PageSchema.virtual("lastUpdated").get(function () {
  return (this.updatedAt as Date).toDateString();
});

// Configure the schema to include virtuals when converting to JSON
PageSchema.set("toJSON", {
  virtuals: true,
  transform: (_, ret) => {
    delete ret._id;
    delete ret.__v;
    return ret;
  },
});

// Configure the schema to include virtuals when converting to Object
PageSchema.set("toObject", {
  virtuals: true,
  transform: (_, ret) => {
    delete ret._id;
    delete ret.__v;
    return ret;
  },
});

// Create and export the model
export const PageModel: Model<Page> =
  mongoose.models.Page || mongoose.model<Page>("Page", PageSchema);
