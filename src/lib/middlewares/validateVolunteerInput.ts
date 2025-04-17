import { z } from "zod";
import { NextRequest, NextResponse } from "next/server";
import { handleError } from "@/lib/utils/errorHandler";
import { httpMessages } from "@/lib/utils/HttpMessage";

const volunteerSchema = z
  .object({
    name: z.string().min(1, { message: "Name is required" }),

    email: z
      .string()
      .email({ message: "Invalid email address" })
      .min(1, { message: "Email is required" }),

    phoneNumber: z.string().min(1, { message: "Phone number is required" }),

    address: z.string().min(1, { message: "address is required" }),

    page: z.string().min(1, { message: "Page is required" }),

    pageTitle: z.string().min(1, { message: "Page title is required" }),

    image: z.string().min(1, { message: "Image URL is required" }),

    reason: z.string().min(1, { message: "Reason is required" }),

    socialLink: z.record(z.string()).optional(),
  })
  .strict();

// Create a function to validate the volunteer input
export const validateVolunteerInput = async (
  req: NextRequest
): Promise<NextResponse | void> => {
  try {
    const reqClone = req.clone();
    const volunteerData = await reqClone.json();
    console.log(volunteerData);
    // Parse the volunteer input using the zod schema
    const result = volunteerSchema.safeParse(volunteerData);

    if (!result.success) {
      const errorMessages = result.error.errors
        .map((err) => `${err.path.join(".")}: ${err.message}`)
        .join(", ");
      console.log(errorMessages);
      return handleError(httpMessages.BAD_REQUEST(errorMessages));
    }

    return;
  } catch (err) {
    console.error("Error validating volunteer input:", err);
    return handleError();
  }
};
