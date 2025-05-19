import mongoose, { Schema, type Document } from "mongoose";
import {
  ContentType,
  type IAboutContent,
  type IHeroSection,
} from "@/types/about.types";

// Define the schema for the About Content model
const AboutContentSchema = new Schema(
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
    contentType: {
      type: String,
      enum: Object.values(ContentType),
      required: [true, "Content type is required"],
    },
    order: {
      type: Number,
      default: 0,
    },
    isVisible: {
      type: Boolean,
      default: true,
    },
    icon: {
      type: String,
      trim: true,
    },
    data: {
      type: Schema.Types.Mixed,
    },
  },
  {
    timestamps: true,
    discriminatorKey: "contentType",
  }
);

// Define the schema for the Hero Section model
const HeroSectionSchema = new Schema(
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
    imageUrl: {
      type: String,
      required: [true, "Image URL is required"],
      trim: true,
    },
    videoUrl: {
      type: String,
      trim: true,
    },
    buttonText: {
      type: String,
      trim: true,
    },
    buttonUrl: {
      type: String,
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

// Create discriminator models for specific content types
// Check if discriminators already exist before creating them
export const HistoryContent =
  AboutContent.discriminators?.[ContentType.HISTORY] ||
  AboutContent.discriminator(
    ContentType.HISTORY,
    new Schema({
      year: String,
      isLeftSide: Boolean,
    })
  );

export const PracticeContent =
  AboutContent.discriminators?.[ContentType.PRACTICE] ||
  AboutContent.discriminator(
    ContentType.PRACTICE,
    new Schema({
      id: String,
    })
  );

export const BenefitContent =
  AboutContent.discriminators?.[ContentType.BENEFIT] ||
  AboutContent.discriminator(
    ContentType.BENEFIT,
    new Schema({
      items: [String],
    })
  );

export const StatisticContent =
  AboutContent.discriminators?.[ContentType.STATISTIC] ||
  AboutContent.discriminator(
    ContentType.STATISTIC,
    new Schema({
      value: String,
    })
  );

export const CTAContent =
  AboutContent.discriminators?.[ContentType.CTA] ||
  AboutContent.discriminator(
    ContentType.CTA,
    new Schema({
      primaryButtonText: String,
      primaryButtonUrl: String,
      secondaryButtonText: String,
      secondaryButtonUrl: String,
    })
  );
