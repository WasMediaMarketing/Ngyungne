import { z } from "zod";
import { NextRequest, NextResponse } from "next/server";
import { handleError } from "@/lib/utils/errorHandler";
import { httpMessages } from "@/lib/utils/HttpMessage";

const eventSchema = z.object({
  title: z.string().min(1, { message: "Title is required" }),
  description: z.string().min(1, { message: "Description is required" }),
  type: z.string().min(1, {
    message: "Event Type is Required",
  }),
  date: z
    .date()
    .refine((val) => !isNaN(val.getTime()), { message: "Invalid date" }),
  time: z.string().min(1, { message: "Time is required" }),
  location: z.string().min(1, { message: "Location is required" }),
  teacher: z.string().min(1, { message: "Teacher name is required" }),
  image: z.string().optional(),
  tags: z.array(z.string()).optional(),
  featured: z.boolean().optional(),
  attending: z
    .number()
    .min(0, { message: "Attending count cannot be negative" })
    .optional(),
  capacity: z
    .number()
    .min(1, { message: "Capacity must be at least 1" })
    .optional(),
});

export const validateEventInput = async (
  req: NextRequest
): Promise<NextResponse | void> => {
  try {
    const eventData = await req.json();

    const result = eventSchema.safeParse(eventData);

    if (!result.success) {
      const errorMessages = result.error.errors
        .map((err) => err.message)
        .join(", ");
      return handleError(httpMessages.BAD_REQUEST(errorMessages));
    }

    return;
  } catch (err) {
    console.error("Error validating event input:", err);
    return handleError();
  }
};
