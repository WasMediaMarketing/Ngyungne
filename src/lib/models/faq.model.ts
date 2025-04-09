import mongoose, { Schema } from "mongoose";
import type { IFaq } from "@/types";

/**
 * Mongoose schema for the FAQ model
 */
const faqSchema = new Schema<IFaq>(
  {
    question: {
      type: String,
      required: [true, "Question is required"],
      trim: true,
    },
    answer: {
      type: String,
      required: [true, "Answer is required"],
      trim: true,
    },
    category: {
      type: String,
      default: "General",
      trim: true,
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
export const Faq =
  mongoose.models.Faq || mongoose.model<IFaq>("Faq", faqSchema);
