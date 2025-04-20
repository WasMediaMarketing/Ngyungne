import { z } from "zod";
import { NextRequest, NextResponse } from "next/server";
import { handleError } from "@/lib/utils/errorHandler";
import { httpMessages } from "@/lib/utils/HttpMessage";

// Define the schema for a schedule item
const scheduleItemSchema = z
  .object({
    title: z.string().optional(),
    description: z.string().optional(),
  })
  .refine((data) => data.title || data.description, {
    message: "At least one of 'title' or 'description' must be provided",
  });
const teacherSchema = z.object({
  name: z.string().min(1, { message: "Teacher name is required" }),
  speciality: z.string().optional(),
  description: z.string().optional(),
  image: z.string().optional(),
  link: z.string().optional(),
  credentials: z.array(z.string()).optional(),
});

// Main event schema
const eventSchema = z
  .object({
    title: z.string().min(1, { message: "Title is required" }),
    description: z.string().min(1, { message: "Description is required" }),
    type: z.string().min(1, { message: "Event Type is required" }),
    date: z
      .string()
      .refine((val) => !isNaN(Date.parse(val)), {
        message: "Invalid date format",
      }),
    time: z.string().min(1, { message: "Time is required" }),
    location: z.string().min(1, { message: "Location is required" }),
    teacher: teacherSchema,
    image: z.string().optional(),
    tags: z.array(z.string()).optional(),
    featured: z.boolean().optional(),
    isVisible: z.boolean().optional(),
    attending: z
      .number()
      .min(0, { message: "Attending count cannot be negative" })
      .optional(),
    capacity: z.number().min(1, { message: "Capacity must be at least 1" }),
    schedule: z
      .record(z.string(), scheduleItemSchema) // Allows an object with dynamic keys
      .optional(),
  })
  .strict();

export const validateEventInput = async (
  req: NextRequest
): Promise<NextResponse | void> => {
  try {
    const eventData = await req.clone().json();

    const result = eventSchema.safeParse(eventData);
    console.log("eventData", eventData);

    if (!result.success) {
      const errorMessages = result.error.errors
        .map((err) => `${err.path.join(".")}: ${err.message}`)
        .join(", ");
      console.log("errorMessage", errorMessages);
      return handleError(httpMessages.BAD_REQUEST(errorMessages));
    }

    return;
  } catch (err) {
    console.error("Error validating event input:", err);
    return handleError();
  }
};
