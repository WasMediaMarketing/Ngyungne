import { z } from "zod";
import { NextRequest, NextResponse } from "next/server";
import { handleError } from "@/lib/utils/errorHandler";
import { httpMessages } from "@/lib/utils/HttpMessage";


export const bookEventUpdateSchema = z
  .object({
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

export const validateBookEventUpdate = async (
  req: NextRequest
): Promise<NextResponse | void> => {
  try {
    const reqClone = req.clone();
    const bookEventData = await reqClone.json();

    const result = bookEventUpdateSchema.safeParse(bookEventData);

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
