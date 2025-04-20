import { z } from "zod";
import { NextRequest, NextResponse } from "next/server";
import { handleError } from "@/lib/utils/errorHandler";
import { httpMessages } from "@/lib/utils/HttpMessage";

// Zod schema for creating FAQ
export const faqInputSchema = z
  .object({
    question: z.string().min(1, { message: "Question is required" }),
    answer: z.string().min(1, { message: "Answer is required" }),
  })
  .strict();

// Function to validate input for creating FAQ
export const validateFaqInput = async (
  req: NextRequest
): Promise<NextResponse | void> => {
  try {
    const reqClone = req.clone();
    const faqData = await reqClone.json();

    const result = faqInputSchema.safeParse(faqData);

    if (!result.success) {
      const errorMessages = result.error.errors
        .map((err) => `${err.path.join(".")}: ${err.message}`)
        .join(", ");

      return handleError(httpMessages.BAD_REQUEST(errorMessages));
    }

    return;
  } catch (err) {
    console.error("Error validating FAQ input:", err);
    return handleError();
  }
};
