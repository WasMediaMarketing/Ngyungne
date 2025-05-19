import mongoose, { Schema, type Document } from "mongoose";
import type { ISlider, MediaType, MediaSourceType } from "@/types/slider.types";

// Define the schema for the Media subdocument
const MediaSchema = new Schema(
  {
    type: {
      type: String,
      enum: ["image", "video"],
      required: [true, "Media type is required"],
    },
    sourceType: {
      type: String,
      enum: ["file", "url"],
      required: [true, "Source type is required"],
    },
    url: {
      type: String,
      trim: true,
    },
    file: {
      type: String,
      trim: true,
    },
    altText: {
      type: String,
      trim: true,
    },
  },
  { _id: false }
);

// Define the schema for the Slider model
const SliderSchema = new Schema(
  {
    title: {
      type: String,
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
    media: {
      type: MediaSchema,
      required: [true, "Media is required"],
      validate: {
        validator: function (media: any) {
          // Either URL or file must be provided based on sourceType
          if (media.sourceType === "url" && !media.url) {
            return false;
          }
          if (media.sourceType === "file" && !media.file) {
            return false;
          }
          return true;
        },
        message:
          "Either URL or file path must be provided based on the selected source type",
      },
    },
    buttonText: {
      type: String,
      trim: true,
    },
    buttonUrl: {
      type: String,
      trim: true,
    },
    order: {
      type: Number,
      default: 0,
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

// Create and export the Slider model
export const Slider =
  mongoose.models.Slider ||
  mongoose.model<ISlider & Document>("Slider", SliderSchema);
