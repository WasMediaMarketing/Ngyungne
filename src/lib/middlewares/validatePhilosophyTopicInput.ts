import { z } from "zod";
import { NextRequest, NextResponse } from "next/server";
import { handleError } from "@/lib/utils/errorHandler";
import { httpMessages } from "@/lib/utils/HttpMessage";

const quoteSchema = z.object({
  text: z.string().min(1, { message: "Quote text cannot be empty" }),
  author: z.string().min(1, { message: "Quote author cannot be empty" }),
});

const philosophyTopicSchema = z
  .object({
    title: z.string().min(1, { message: "Title is required" }),

    icon: z.string().min(1, { message: "Icon is required" }),

    description: z.string().min(1, { message: "Description is required" }),

    content: z.string().min(1, { message: "Content is required" }),

    quotes: z.array(quoteSchema).optional(),

    practices: z.array(z.string()).optional(),

    isVisible: z.boolean().optional(),
  })
  .strict();

// Function to validate Philosophy Topic input
export const validatePhilosophyTopicInput = async (
  req: NextRequest
): Promise<NextResponse | void> => {
  try {
    const reqClone = req.clone();
    const philosophyTopicData = await reqClone.json();

    const result = philosophyTopicSchema.safeParse(philosophyTopicData);

    if (!result.success) {
      const errorMessages = result.error.errors
        .map((err) => `${err.path.join(".")}: ${err.message}`)
        .join(", ");

      return handleError(httpMessages.BAD_REQUEST(errorMessages));
    }

    return;
  } catch (err) {
    console.error("Error validating philosophy topic input:", err);
    return handleError();
  }
};
