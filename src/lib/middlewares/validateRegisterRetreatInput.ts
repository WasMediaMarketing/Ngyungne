import { z } from "zod";
import { NextRequest, NextResponse } from "next/server";
import { handleError } from "@/lib/utils/errorHandler";
import { httpMessages } from "@/lib/utils/HttpMessage";

const isValidObjectId = (id: string) => /^[0-9a-fA-F]{24}$/.test(id);

export const registerRetreatSchema = z
  .object({
    name: z.string().min(1, { message: "Name is required" }),

    email: z
      .string()
      .email({ message: "Invalid email address" })
      .min(1, { message: "Email is required" }),

    phoneNumber: z.string().min(1, { message: "Phone number is required" }),

    page: z.string().min(1, { message: "Page is required" }),

    pageTitle: z.string().min(1, { message: "Page title is required" }),

    address: z.string().min(1, { message: "Address is required" }),

    retreatId: z
      .string()
      .refine((id) => isValidObjectId(id), { message: "Invalid retreat ID" }),

    MeditationExperience: z
      .string()
      .min(1, { message: "Meditation experience is required" }),

    dietaryRestriction: z
      .string()
      .min(1, { message: "Dietary restriction cannot be empty" })
      .optional(),

    specialRequest: z
      .string()
      .min(1, { message: "Special request cannot be empty" })
      .optional(),

    AccommodationType: z
      .string()
      .min(1, { message: "Accommodation type is required" }),

    emergencyContactName: z
      .string()
      .min(1, { message: "Emergency contact name is required" }),

    emergencyContactNumber: z
      .string()
      .min(1, { message: "Emergency contact number is required" }),
  })
  .strict();

export const validateRegisterRetreatInput = async (
  req: NextRequest
): Promise<NextResponse | void> => {
  try {
    const reqClone = req.clone();
    const registerRetreatData = await reqClone.json();

    const result = registerRetreatSchema.safeParse(registerRetreatData);

    if (!result.success) {
      const errorMessages = result.error.errors
        .map((err) => `${err.path.join(".")}: ${err.message}`)
        .join(", ");

      return handleError(httpMessages.BAD_REQUEST(errorMessages));
    }

    return;
  } catch (err) {
    console.error("Error validating register retreat input:", err);
    return handleError();
  }
};
