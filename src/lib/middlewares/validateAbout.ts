import { z } from "zod";
import type { NextRequest, NextResponse } from "next/server";
import { handleError } from "@/lib/utils/errorHandler";
import { httpMessages } from "@/lib/utils/HttpMessage";
import { ContentType } from "@/types/about.types";

// Base schemas for different content types
const statisticSchema = z.object({
  title: z.string().min(1, "Title is required"),
  value: z.string().min(1, "Value is required"),
  icon: z.string().min(1, "Icon is required"),
  description: z.string().min(1, "Description is required"),
  order: z.number().int().nonnegative().optional(),
});

const historyItemSchema = z.object({
  title: z.string().min(1, "Title is required"),
  content: z.string().min(1, "Content is required"),
  period: z.string().min(1, "Period is required"),
  order: z.number().int().nonnegative().optional(),
});

const practiceElementSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().min(1, "Description is required"),
  icon: z.string().min(1, "Icon is required"),
  order: z.number().int().nonnegative().optional(),
});

const benefitItemSchema = z.object({
  title: z.string().min(1, "Title is required"),
  icon: z.string().min(1, "Icon is required"),
  category: z.string().min(1, "Category is required"),
  points: z.array(z.string()).min(1, "At least one point is required"),
  order: z.number().int().nonnegative().optional(),
});

// Content input schema
const contentInputSchema = z.object({
  contentType: z.nativeEnum(ContentType),
  data: z.union([
    statisticSchema,
    historyItemSchema,
    practiceElementSchema,
    benefitItemSchema,
  ]),
  isVisible: z.boolean().optional(),
});

// Content update schema
const contentUpdateSchema = z.object({
  contentType: z.nativeEnum(ContentType).optional(),
  data: z
    .union([
      statisticSchema,
      historyItemSchema,
      practiceElementSchema,
      benefitItemSchema,
    ])
    .optional(),
  isVisible: z.boolean().optional(),
});

// Hero section schema
const heroSectionSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().min(1, "Description is required"),
  imageUrl: z.string().url("Image URL must be a valid URL"),
});

// Hero section update schema
const heroSectionUpdateSchema = z.object({
  title: z.string().min(1, "Title is required").optional(),
  description: z.string().min(1, "Description is required").optional(),
  imageUrl: z.string().url("Image URL must be a valid URL").optional(),
});

// Validation handler function for content creation
export const validateContentInput = async (
  req: NextRequest
): Promise<NextResponse | void> => {
  try {
    const contentData = await req.clone().json();

    const result = contentInputSchema.safeParse(contentData);

    if (!result.success) {
      const errorMessages = result.error.errors
        .map((err) => `${err.path.join(".")}: ${err.message}`)
        .join(", ");
      return handleError(httpMessages.BAD_REQUEST(errorMessages));
    }

    return;
  } catch (err) {
    console.error("Error validating content input:", err);
    return handleError();
  }
};

// Validation handler function for content updates
export const validateContentUpdate = async (
  req: NextRequest
): Promise<NextResponse | void> => {
  try {
    const contentData = await req.clone().json();

    const result = contentUpdateSchema.safeParse(contentData);

    if (!result.success) {
      const errorMessages = result.error.errors
        .map((err) => `${err.path.join(".")}: ${err.message}`)
        .join(", ");
      return handleError(httpMessages.BAD_REQUEST(errorMessages));
    }

    return;
  } catch (err) {
    console.error("Error validating content update:", err);
    return handleError();
  }
};

// Validation handler function for hero section update
export const validateHeroSectionUpdate = async (
  req: NextRequest
): Promise<NextResponse | void> => {
  try {
    const heroData = await req.clone().json();

    const result = heroSectionUpdateSchema.safeParse(heroData);

    if (!result.success) {
      const errorMessages = result.error.errors
        .map((err) => `${err.path.join(".")}: ${err.message}`)
        .join(", ");
      return handleError(httpMessages.BAD_REQUEST(errorMessages));
    }

    return;
  } catch (err) {
    console.error("Error validating hero section update:", err);
    return handleError();
  }
};
