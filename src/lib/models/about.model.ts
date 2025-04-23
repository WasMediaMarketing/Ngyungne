import mongoose, { Schema, type Document } from "mongoose";
import { ContentType } from "@/types/about.types";
import type { IAboutContent, IHeroSection } from "@/types/about.types";

// Schema for statistics
const StatisticSchema = new Schema({
  title: {
    type: String,
    required: true,
    trim: true,
  },
  value: {
    type: String,
    required: true,
    trim: true,
  },
  icon: {
    type: String,
    required: true,
    trim: true,
  },
  description: {
    type: String,
    required: true,
    trim: true,
  },
  order: {
    type: Number,
    default: 0,
  },
});

// Schema for history items
const HistoryItemSchema = new Schema({
  title: {
    type: String,
    required: true,
    trim: true,
  },
  content: {
    type: String,
    required: true,
    trim: true,
  },
  period: {
    type: String,
    required: true,
    trim: true,
  },
  order: {
    type: Number,
    default: 0,
  },
});

// Schema for practice elements
const PracticeElementSchema = new Schema({
  title: {
    type: String,
    required: true,
    trim: true,
  },
  description: {
    type: String,
    required: true,
    trim: true,
  },
  icon: {
    type: String,
    required: true,
    trim: true,
  },
  order: {
    type: Number,
    default: 0,
  },
});

// Schema for benefit items
const BenefitItemSchema = new Schema({
  title: {
    type: String,
    required: true,
    trim: true,
  },
  icon: {
    type: String,
    required: true,
    trim: true,
  },
  category: {
    type: String,
    required: true,
    trim: true,
  },
  points: {
    type: [String],
    default: [],
  },
  order: {
    type: Number,
    default: 0,
  },
});

// Schema for about content
const AboutContentSchema = new Schema(
  {
    contentType: {
      type: String,
      enum: Object.values(ContentType),
      required: true,
    },
    data: {
      type: Schema.Types.Mixed,
      required: true,
    },
    isVisible: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
    discriminatorKey: "contentType",
  }
);

// Schema for hero section
const HeroSectionSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
      trim: true,
    },
    imageUrl: {
      type: String,
      required: true,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

// Create and export the models
export const AboutContent =
  mongoose.models.AboutContent ||
  mongoose.model<IAboutContent & Document>("AboutContent", AboutContentSchema);

export const HeroSection =
  mongoose.models.HeroSection ||
  mongoose.model<IHeroSection & Document>("HeroSection", HeroSectionSchema);

// Create discriminator models for different content types
export const StatisticModel = AboutContent.discriminator(
  ContentType.STATISTIC,
  StatisticSchema
);

export const HistoryItemModel = AboutContent.discriminator(
  ContentType.HISTORY,
  HistoryItemSchema
);

export const PracticeElementModel = AboutContent.discriminator(
  ContentType.PRACTICE,
  PracticeElementSchema
);

export const BenefitItemModel = AboutContent.discriminator(
  ContentType.BENEFIT,
  BenefitItemSchema
);
