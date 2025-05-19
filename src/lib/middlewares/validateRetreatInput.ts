import { z } from "zod";
import { NextRequest, NextResponse } from "next/server";
import { handleError } from "@/lib/utils/errorHandler";
import { httpMessages } from "@/lib/utils/HttpMessage";

// Define the schema for a schedule item
const scheduleItemSchema = z.object({
  time: z.string().min(1, { message: "Time is required" }),
  activity: z.string().min(1, { message: "Activity is required" }),
});

// Schema for creating a new retreat
const retreatInputSchema = z
  .object({
    title: z.string().min(1, { message: "Title is required" }),
    description: z.string().min(1, { message: "Description is required" }),
    date: z.string().refine((val) => !isNaN(Date.parse(val)), {
      message: "Invalid date format",
    }),
    duration: z.string().min(1, { message: "Duration is required" }),
    location: z.string().min(1, { message: "Location is required" }),
    participants: z.number().optional(),
    price: z.string().min(1, { message: "Price is required" }),
    type: z.string().min(1, { message: "Retreat Type is required" }),
    isVisible: z.boolean().optional(),
    schedule: z
      .array(scheduleItemSchema)
      .min(1, { message: "At least one schedule item is required" }),
  })
  .strict();

export const validateRetreatInput = async (
  req: NextRequest
): Promise<NextResponse | void> => {
  try {
    const retreatData = await req.clone().json();

    const result = retreatInputSchema.safeParse(retreatData);

    if (!result.success) {
      const errorMessages = result.error.errors
        .map((err) => `${err.path.join(".")}: ${err.message}`)
        .join(", ");
      return handleError(httpMessages.BAD_REQUEST(errorMessages));
    }

    return;
  } catch (err) {
    console.error("Error validating retreat input:", err);
    return handleError();
  }
};
