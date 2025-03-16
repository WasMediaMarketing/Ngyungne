import { z } from "zod";
import { NextRequest, NextResponse } from "next/server";
import { handleError } from "@/lib/utils/errorHandler";
import { httpMessages } from "@/lib/utils/HttpMessage";

const isValidObjectId = (id: string) => {
  return /^[0-9a-fA-F]{24}$/.test(id);
};

// Define the schema for donation input
const donationSchema = z
  .object({
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

    amount: z
      .number()
      .positive({ message: "Amount must be a positive number" })
      .min(1, { message: "Amount must be greater than 0" }),

    screenshot: z.string().min(1, { message: "Screenshot URL is required" }),

    donationType: z
      .string()
      .min(1, { message: "Donation type is required" })
      .optional(),

    donationMethod: z
      .string()
      .min(1, { message: "Donation method is required" })
      .optional(),

    donationTypeId: z
      .string()
      .refine((id) => isValidObjectId(id), { message: "Invalid ID" })
      .optional(), // Initially optional, but will be required if donationType === "Cause"
  })
  .strict()
  .superRefine((data, ctx) => {
    if (data.donationType === "Cause" && !data.donationTypeId) {
      ctx.addIssue({
        path: ["donationTypeId"],
        message: "donationTypeId is required when page is 'Cause'",
        code: "custom",
      });
    }
  });

// Create a function to validate the donation input
export const validateDonationInput = async (
  req: NextRequest
): Promise<NextResponse | void> => {
  try {
    const reqClone = req.clone();
    const donationData = await reqClone.json();

    // Parse the donation input using the zod schema
    const result = donationSchema.safeParse(donationData);

    if (!result.success) {
      const errorMessages = result.error.errors
        .map((err) => `${err.path.join(".")}: ${err.message}`)
        .join(", ");

      return handleError(httpMessages.BAD_REQUEST(errorMessages));
    }

    return;
  } catch (err) {
    console.error("Error validating donation input:", err);
    return handleError();
  }
};
