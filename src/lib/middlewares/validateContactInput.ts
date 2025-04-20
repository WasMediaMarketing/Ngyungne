import { z } from "zod";
import { NextRequest, NextResponse } from "next/server";
import { handleError } from "@/lib/utils/errorHandler";
import { httpMessages } from "@/lib/utils/HttpMessage";

// Define the schema for contact input
const contactSchema = z.object({
  name: z.string().min(1, { message: "Name is required" }),

  email: z
    .string()
    .email({ message: "Invalid email address" })
    .min(1, { message: "Email is required" }),

  phoneNumber: z.string().min(1, { message: "Phone number is required" }),

  page: z.string().min(1, { message: "Page is required" }).optional(),

  pageTitle: z
    .string()
    .min(1, { message: "Page title is required" })
    .optional(),

  subject: z.string().min(1, { message: "subject is required" }),
  message: z.string().min(1, { message: "subject is required" }),
}).strict();

// Create a function to validate the contact input
export const validateContactInput = async (
  req: NextRequest
): Promise<NextResponse | void> => {
  try {
    const reqClone = req.clone();
    const contactData = await reqClone.json();
    console.log(contactData);

    // Parse the contact input using the zod schema
    const result = contactSchema.safeParse(contactData);

    if (!result.success) {
      const errorMessages = result.error.errors
        .map((err) => `${err.path.join(".")}: ${err.message}`)
        .join(", ");

      return handleError(httpMessages.BAD_REQUEST(errorMessages));
    }

    return;
  } catch (err) {
    console.error("Error validating contact input:", err);
    return handleError();
  }
};
