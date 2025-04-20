import { z } from "zod";
import { NextRequest, NextResponse } from "next/server";
import { handleError } from "@/lib/utils/errorHandler";
import { httpMessages } from "@/lib/utils/HttpMessage";

export const faqUpdateSchema = z
  .object({
    question: z
      .string()
      .min(1, { message: "Question must be a non-empty string" })
      .optional(),
    answer: z
      .string()
      .min(1, { message: "Answer must be a non-empty string" })
      .optional(),
  })
  .strict();

export const validateFaqUpdate = async (
  req: NextRequest
): Promise<NextResponse | void> => {
  try {
    const reqClone = req.clone();
    const faqUpdateData = await reqClone.json();

    const result = faqUpdateSchema.safeParse(faqUpdateData);

    if (!result.success) {
      const errorMessages = result.error.errors
        .map((err) => `${err.path.join(".")}: ${err.message}`)
        .join(", ");

      return handleError(httpMessages.BAD_REQUEST(errorMessages));
    }

    return;
  } catch (err) {
    console.error("Error validating FAQ update input:", err);
    return handleError();
  }
};
