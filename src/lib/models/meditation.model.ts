import mongoose, { Schema, Document } from "mongoose";
import { IMeditation } from "@/types/meditation.types";

// Define the schema for the Meditation model
const MeditationSchema = new Schema(
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
    longDescription: {
      type: String,
      trim: true,
    },
    duration: {
      type: Number,
      required: [true, "Duration is required"],
      min: [1, "Duration must be at least 1 minute"],
    },
    category: {
      type: String,
      required: [true, "Category is required"],
      trim: true,
    },
    difficulty: {
      type: String,
      enum: ["Beginner", "Intermediate", "Advanced"],
      default: "Beginner",
    },
    instructor: {
      name: {
        type: String,
        required: [true, "Instructor name is required"],
        trim: true,
      },
      bio: {
        type: String,
        trim: true,
      },
      image: {
        type: String,
      },
    },
    steps: {
      type: [String],
      default: [],
    },
    benefits: {
      type: [String],
      default: [],
    },
    image: {
      type: String,
    },
    audioFile: {
      type: String,
    },
    tags: {
      type: [String],
      default: [],
    },
    isVisible: {
      type: Boolean,
      default: true,
    },
    views: {
      type: Number,
      default: 0,
    },
    favorites: {
      type: Number,
      default: 0,
    },
    sessions: {
      type: Number,
      default: 0,
    },
    relatedMeditations: {
      type: [Schema.Types.ObjectId],
      ref: "Meditation",
      default: [],
    },
  },
  {
    timestamps: true,
  }
);

// Create and export the Meditation model
export const Meditation =
  mongoose.models.Meditation ||
  mongoose.model<IMeditation & Document>("Meditation", MeditationSchema);
