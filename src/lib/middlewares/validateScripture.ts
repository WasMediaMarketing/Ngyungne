import { z } from "zod";
import type { NextRequest, NextResponse } from "next/server";
import { handleError } from "@/lib/utils/errorHandler";
import { httpMessages } from "@/lib/utils/HttpMessage";

// Verse schema
const verseSchema = z.object({
  number: z.number().int().positive("Verse number must be positive"),
  chapter: z.string().min(1, "Chapter is required"),
  text: z.string().min(1, "Verse text is required"),
  commentary: z.string().optional(),
});

// Scripture schema
const scriptureSchema = z
  .object({
    title: z.string().min(1, "Title is required"),
    tradition: z.string().min(1, "Tradition is required"),
    period: z.string().min(1, "Period is required"),
    language: z.string().min(1, "Language is required"),
    description: z.string().min(1, "Description is required"),
    overview: z.string().min(1, "Overview is required"),
    verses: z.array(verseSchema).min(1, "At least one verse is required"),
    significance: z.string().optional(),
    historicalContext: z.string().optional(),
    image: z.string().optional(),
    views: z.number().int().nonnegative().optional(),
    isVisible: z.boolean().optional(),
  })
  .strict();

// Validation handler function
export const validateScriptureInput = async (
  req: NextRequest
): Promise<NextResponse | void> => {
  try {
    const scriptureData = await req.clone().json();
    console.log("scripture input", scriptureData);

    const result = scriptureSchema.safeParse(scriptureData);

    if (!result.success) {
      const errorMessages = result.error.errors
        .map((err) => `${err.path.join(".")}: ${err.message}`)
        .join(", ");
      console.log("errorMessage", errorMessages);
      return handleError(httpMessages.BAD_REQUEST(errorMessages));
    }

    return;
  } catch (err) {
    console.error("Error validating scripture input:", err);
    return handleError();
  }
};

// Scripture update schema (all fields optional)
const scriptureUpdateSchema = z
  .object({
    title: z.string().min(1).optional(),
    tradition: z.string().min(1).optional(),
    period: z.string().min(1).optional(),
    language: z.string().min(1).optional(),
    description: z.string().min(1).optional(),
    overview: z.string().min(1).optional(),
    verses: z.array(verseSchema).optional(),
    significance: z.string().optional(),
    historicalContext: z.string().optional(),
    image: z.string().optional(),
    views: z.number().int().nonnegative().optional(),
    isVisible: z.boolean().optional(),
  })
  .strict();

export const validateScriptureUpdate = async (
  req: NextRequest
): Promise<NextResponse | void> => {
  try {
    const scriptureData = await req.clone().json();
    console.log("scripture update", scriptureData);

    const result = scriptureUpdateSchema.safeParse(scriptureData);

    if (!result.success) {
      const errorMessages = result.error.errors
        .map((err) => `${err.path.join(".")}: ${err.message}`)
        .join(", ");
      console.log("errorMessage", errorMessages);
      return handleError(httpMessages.BAD_REQUEST(errorMessages));
    }

    return;
  } catch (err) {
    console.error("Error validating scripture update:", err);
    return handleError();
  }
};
