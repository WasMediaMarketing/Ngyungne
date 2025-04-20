import { z } from "zod";
import { NextRequest, NextResponse } from "next/server";
import { handleError } from "@/lib/utils/errorHandler";
import { httpMessages } from "@/lib/utils/HttpMessage";

// Instructor schema
const instructorSchema = z.object({
  name: z.string().min(1, "Instructor name is required"),
  bio: z.string().optional(),
  image: z.string().optional(),
});

// Meditation input schema
const meditationSchema = z
  .object({
    title: z.string().min(1, "Title is required"),
    description: z.string().min(1, "Description is required"),
    longDescription: z.string().optional(),
    duration: z.number().int().min(1, "Duration must be at least 1 minute"),
    category: z.string().min(1, "Category is required"),
    difficulty: z.enum(["Beginner", "Intermediate", "Advanced"]).optional(),
    instructor: instructorSchema,
    steps: z.array(z.string()).optional(),
    benefits: z.array(z.string()).optional(),
    image: z.string().optional(),
    audioFile: z.string().optional(),
    tags: z.array(z.string()).optional(),
    isVisible: z.boolean().optional(),
    views: z.number().int().nonnegative().optional(),
    favorites: z.number().int().nonnegative().optional(),
    sessions: z.number().int().nonnegative().optional(),
    relatedMeditations: z.array(z.string()).optional(),
  })
  .strict();

// Meditation update schema
const meditationUpdateSchema = z
  .object({
    title: z.string().min(1, "Title is required").optional(),
    description: z.string().min(1, "Description is required").optional(),
    longDescription: z.string().optional(),
    duration: z
      .number()
      .int()
      .min(1, "Duration must be at least 1 minute")
      .optional(),
    category: z.string().min(1, "Category is required").optional(),
    difficulty: z.enum(["Beginner", "Intermediate", "Advanced"]).optional(),
    instructor: instructorSchema.optional(),
    steps: z.array(z.string()).optional(),
    benefits: z.array(z.string()).optional(),
    image: z.string().optional(),
    audioFile: z.string().optional(),
    tags: z.array(z.string()).optional(),
    isVisible: z.boolean().optional(),
    views: z.number().int().nonnegative().optional(),
    favorites: z.number().int().nonnegative().optional(),
    sessions: z.number().int().nonnegative().optional(),
    relatedMeditations: z.array(z.string()).optional(),
  })
  .strict();

// Validation handler function for meditation creation
export const validateMeditationInput = async (
  req: NextRequest
): Promise<NextResponse | void> => {
  try {
    const meditationData = await req.clone().json();
    console.log("meditation input", meditationData);

    const result = meditationSchema.safeParse(meditationData);

    if (!result.success) {
      const errorMessages = result.error.errors
        .map((err) => `${err.path.join(".")}: ${err.message}`)
        .join(", ");
      console.log("errorMessage", errorMessages);
      return handleError(httpMessages.BAD_REQUEST(errorMessages));
    }

    return;
  } catch (err) {
    console.error("Error validating meditation input:", err);
    return handleError();
  }
};

// Validation handler function for meditation updates
export const validateMeditationUpdate = async (
  req: NextRequest
): Promise<NextResponse | void> => {
  try {
    const meditationData = await req.clone().json();
    console.log("meditation update", meditationData);

    const result = meditationUpdateSchema.safeParse(meditationData);

    if (!result.success) {
      const errorMessages = result.error.errors
        .map((err) => `${err.path.join(".")}: ${err.message}`)
        .join(", ");
      console.log("errorMessage", errorMessages);
      return handleError(httpMessages.BAD_REQUEST(errorMessages));
    }

    return;
  } catch (err) {
    console.error("Error validating meditation update:", err);
    return handleError();
  }
};
