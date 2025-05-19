import { z } from "zod";
import { NextRequest, NextResponse } from "next/server";
import { handleError } from "@/lib/utils/errorHandler";
import { httpMessages } from "@/lib/utils/HttpMessage";

// Define the schema for a FAQ item
const faqSchema = z.object({
  question: z.string().min(1, { message: "FAQ question is required" }),
  answer: z.string().min(1, { message: "FAQ answer is required" }),
});

// Cause Input Schema (For Creation)
const causeInputSchema = z
  .object({
    title: z.string().min(1, { message: "Title is required" }),
    subtitle: z.string().optional(),
    image: z.string().min(1, { message: "Image is required" }),
    tags: z.array(z.string()).optional(),
    raised: z
      .number()
      .min(0, { message: "Raised amount cannot be negative" })
      .optional(),
    goal: z.number().min(1, { message: "Goal amount must be at least 1" }),
    startDate: z.string().refine((val) => !isNaN(Date.parse(val)), {
      message: "Invalid start date format",
    }),
    endDate: z.string().refine((val) => !isNaN(Date.parse(val)), {
      message: "Invalid end date format",
    }),
    volunteers: z
      .number()
      .min(0, { message: "Volunteers count cannot be negative" })
      .optional(),
    location: z.string().min(1, { message: "Location is required" }),
    totalDonors: z
      .number()
      .min(0, { message: "Total donors cannot be negative" })
      .optional(),
    about: z
      .object({
        longDescription: z.string(),
        objectives: z.array(z.string()).optional(),
      })
      .optional(),
    impact: z.string().min(1, { message: "Impact description is required" }),
    isVisible: z.boolean().optional(),
    updates: z.string().optional(),
    faq: z.array(faqSchema).optional(),
    gallery: z.array(z.string()).optional(),
  })
  .strict();

export const validateCauseInput = async (
  req: NextRequest
): Promise<NextResponse | void> => {
  try {
    const causeData = await req.clone().json();
    const result = causeInputSchema.safeParse(causeData);

    if (!result.success) {
      const errorMessages = result.error.errors
        .map((err) => `${err.path.join(".")}: ${err.message}`)
        .join(", ");
      return handleError(httpMessages.BAD_REQUEST(errorMessages));
    }
    return;
  } catch (err) {
    console.error("Error validating cause input:", err);
    return handleError();
  }
};
