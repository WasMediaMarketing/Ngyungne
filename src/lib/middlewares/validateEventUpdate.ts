import { z } from "zod";
import { NextRequest, NextResponse } from "next/server";
import { handleError } from "@/lib/utils/errorHandler";
import { httpMessages } from "@/lib/utils/HttpMessage";

const scheduleItemSchema = z
  .object({
    title: z.string().optional(),
    description: z.string().optional(),
  })
  .refine((data) => data.title || data.description, {
    message: "At least one of 'title' or 'description' must be provided",
  });

const teacherSchema = z.object({
  name: z.string().optional(),
  speciality: z.string().optional(),
  description: z.string().optional(),
  image: z.string().optional(),
  link: z.string().optional(),
  credentials: z.array(z.string()).optional(),
});

const eventUpdateSchema = z
  .object({
    title: z.string().min(1).optional(),
    description: z.string().min(1).optional(),
    type: z.string().optional(),
    date: z
      .string()
      .refine((val) => !isNaN(Date.parse(val)), {
        message: "Invalid date format",
      })
      .optional(),
    time: z.string().min(1).optional(),
    location: z.string().min(1).optional(),
    teacher: teacherSchema,
    image: z.string().optional(),
    tags: z.array(z.string()).min(1).optional(),
    featured: z.boolean().optional(),
    isVisible: z.boolean().optional(),
    attending: z.number().min(0).optional(),
    capacity: z.number().min(1).optional(),
    schedule: z
      .record(z.string(), scheduleItemSchema) // Allows an object with dynamic keys
      .optional(),
  })
  .strict();

export const validateEventUpdate = async (
  req: NextRequest
): Promise<NextResponse | void> => {
  try {
    const eventData = await req.clone().json();

    const result = eventUpdateSchema.safeParse(eventData);

    if (!result.success) {
      const errorMessages = result.error.errors
        .map((err) => `${err.path.join(".")}: ${err.message}`)
        .join(", ");

      return handleError(httpMessages.BAD_REQUEST(errorMessages));
    }

    return;
  } catch (err) {
    console.error("Error validating event update:", err);
    return handleError();
  }
};
