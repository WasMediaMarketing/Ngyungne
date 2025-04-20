import { z } from "zod";
import { NextRequest, NextResponse } from "next/server";
import { handleError } from "@/lib/utils/errorHandler";
import { httpMessages } from "@/lib/utils/HttpMessage";

// Custom validation to ensure the eventId is a valid ObjectId format (as a string)
const isValidObjectId = (id: string) => {
  return /^[0-9a-fA-F]{24}$/.test(id); // A valid ObjectId is a 24-character hex string
};


export const bookEventSchema = z
  .object({
    name: z.string().min(1, { message: "Name is required" }),

    email: z
      .string()
      .email({ message: "Invalid email address" })
      .min(1, { message: "Email is required" }),

    phoneNumber: z.string().min(1, { message: "Phone number is required" }),

    page: z.string().min(1, { message: "Page is required" }),

    pageTitle: z.string().min(1, { message: "Page title is required" }),

    eventId: z
      .string()
      .refine((id) => isValidObjectId(id), { message: "Invalid event ID" }),

    TicketNumber: z
      .number()
      .positive({ message: "Ticket number must be a positive number" })
      .min(1, { message: "Ticket number must be greater than 0" }),

    dietaryRequirements: z
      .string()
      .min(1, { message: "Dietary requirements cannot be empty" })
      .optional(),

    specialAccomodation: z
      .string()
      .min(1, { message: "Special accommodation cannot be empty" })
      .optional(),
  })
  .strict();

export const validateBookEventInput = async (
  req: NextRequest
): Promise<NextResponse | void> => {
  try {
    const reqClone = req.clone();
    const bookEventData = await reqClone.json();

    const result = bookEventSchema.safeParse(bookEventData);

    if (!result.success) {
      const errorMessages = result.error.errors
        .map((err) => `${err.path.join(".")}: ${err.message}`)
        .join(", ");

      return handleError(httpMessages.BAD_REQUEST(errorMessages));
    }

    return;
  } catch (err) {
    console.error("Error validating book event input:", err);
    return handleError();
  }
};
