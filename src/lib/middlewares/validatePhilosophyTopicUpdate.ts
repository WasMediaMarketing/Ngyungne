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
    title: z.string().optional(),
    icon: z.string().optional(),
    description: z.string().optional(),
    content: z.string().optional(),
    quotes: z.array(quoteSchema).optional(),
    practices: z.array(z.string()).optional(),
    isVisible: z.boolean().optional(),
  })
  .strict();

// Function to validate Philosophy Topic update data directly
export const validatePhilosophyTopicUpdateData = (
  data: any
): NextResponse | null => {
  try {
    const result = philosophyTopicSchema.safeParse(data);

    if (!result.success) {
      const errorMessages = result.error.errors
        .map((err) => `${err.path.join(".")}: ${err.message}`)
        .join(", ");

      return handleError(httpMessages.BAD_REQUEST(errorMessages));
    }

    return null;
  } catch (err) {
    console.error("Error validating philosophy topic update data:", err);
    return handleError();
  }
};

// Function to validate Philosophy Topic update from request
export const validatePhilosophyTopicUpdate = async (
  req: NextRequest
): Promise<{ error: NextResponse | null; body: any }> => {
  try {
    // Parse the request body
    let body;
    try {
      body = await req.json();
    } catch (error) {
      console.error("Invalid JSON body:", error);
      return {
        error: handleError(httpMessages.BAD_REQUEST("Invalid request body")),
        body: null,
      };
    }

    // Validate the parsed body
    const validationError = validatePhilosophyTopicUpdateData(body);
    if (validationError) {
      return { error: validationError, body: null };
    }

    return { error: null, body };
  } catch (err) {
    console.error("Error validating philosophy topic update:", err);
    return {
      error: handleError(),
      body: null,
    };
  }
};
