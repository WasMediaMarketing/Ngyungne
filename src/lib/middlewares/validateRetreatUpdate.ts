import { z } from "zod";
import { NextRequest, NextResponse } from "next/server";
import { handleError } from "@/lib/utils/errorHandler";
import { httpMessages } from "@/lib/utils/HttpMessage";

// Define the schema for a schedule item
const scheduleItemSchema = z.object({
  time: z.string().min(1, { message: "Time is required" }),
  activity: z.string().min(1, { message: "Activity is required" }),
});

// Schema for updating an existing retreat
const retreatUpdateSchema = z
  .object({
    title: z.string().optional(),
    description: z.string().optional(),
    date: z
      .string()
      .refine((val) => !isNaN(Date.parse(val)), {
        message: "Invalid date format",
      })
      .optional(),
    duration: z.string().optional(),
    location: z.string().optional(),
    participants: z.number().optional(),
    price: z.string().optional(),
    type: z.string().optional(),
    isVisible: z.boolean().optional(),
    schedule: z
      .array(scheduleItemSchema)
      .min(1, { message: "At least one schedule item is required" })
      .optional(),
  })
  .strict();

export const validateRetreatUpdate = async (
  req: NextRequest
): Promise<NextResponse | void> => {
  try {
    const retreatData = await req.clone().json();

    const result = retreatUpdateSchema.safeParse(retreatData);

    if (!result.success) {
      const errorMessages = result.error.errors
        .map((err) => `${err.path.join(".")}: ${err.message}`)
        .join(", ");
      console.log("errorMessage", errorMessages);
      return handleError(httpMessages.BAD_REQUEST(errorMessages));
    }

    return;
  } catch (err) {
    console.error("Error validating retreat update:", err);
    return handleError();
  }
};
