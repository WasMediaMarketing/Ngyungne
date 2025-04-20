import mongoose, { Schema } from "mongoose";
import { GalleryItem, GalleryItemType } from "@/types/gallery";

/**
 * Mongoose schema for the Gallery model
 */
const gallerySchema = new Schema<GalleryItem>(
  {
    title: {
      type: String,
      required: [true, "Title is required"],
      trim: true,
    },
    description: {
      type: String,
      required: [true, "Description is required"],
      trim: true,
    },
    fullDescription: {
      type: String,
      trim: true,
    },
    type: {
      type: String,
      enum: Object.values(GalleryItemType),
      required: [true, "Type is required"],
    },
    image: {
      type: String,
      required: [true, "Image is required"],
    },
    videoUrl: {
      type: String,
    },
    additionalImages: {
      type: [String],
      default: [],
    },
    tags: {
      type: [String],
      default: [],
    },
    date: {
      type: Date,
      default: Date.now,
    },
    location: {
      type: String,
    },
    photographer: {
      type: String,
    },
    presenter: {
      type: String,
    },
    event: {
      type: String,
    },
    duration: {
      type: String,
    },
    isVisible: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

// Check if the model is already defined to prevent overwriting
export const Gallery =
  mongoose.models.Gallery ||
  mongoose.model<GalleryItem>("Gallery", gallerySchema);
