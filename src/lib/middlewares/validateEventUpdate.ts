import { z } from "zod";
import { NextRequest, NextResponse } from "next/server";
import { handleError } from "@/lib/utils/errorHandler";
import { httpMessages } from "@/lib/utils/HttpMessage";

const eventUpdateSchema = z.object({
  title: z.string().min(1).optional(),
  description: z.string().min(1).optional(),
  type: z.string().optional(),
  date: z
    .date()
    .refine((val) => !isNaN(val.getTime()), { message: "Invalid date" })
    .optional(),
  time: z.string().min(1).optional(),
  location: z.string().min(1).optional(),
  teacher: z.string().min(1).optional(),
  image: z.string().optional(),
  tags: z.array(z.string()).min(1).optional(),
  featured: z.boolean().optional(),
  attending: z.number().min(0).optional(),
  capacity: z.number().min(1).optional(),
});

export const validateEventUpdate = async (
  req: NextRequest
): Promise<NextResponse | void> => {
  try {
    const eventData = await req.json();

    const result = eventUpdateSchema.safeParse(eventData);

    if (!result.success) {
      const errorMessages = result.error.errors
        .map((err) => err.message)
        .join(", ");
      return handleError(httpMessages.BAD_REQUEST(errorMessages));
    }

    return;
  } catch (err) {
    console.error("Error validating event update:", err);
    return handleError();
  }
};
