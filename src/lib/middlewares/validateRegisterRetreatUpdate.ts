import { z } from "zod";
import { NextRequest, NextResponse } from "next/server";
import { handleError } from "@/lib/utils/errorHandler";
import { httpMessages } from "@/lib/utils/HttpMessage";

export const registerRetreatUpdateSchema = z
  .object({
    MeditationExperience: z
      .string()
      .min(1, { message: "Meditation experience cannot be empty" })
      .optional(),

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
      .min(1, { message: "Accommodation type cannot be empty" })
      .optional(),

    emergencyContactName: z
      .string()
      .min(1, { message: "Emergency contact name cannot be empty" })
      .optional(),

    emergencyContactNumber: z
      .string()
      .min(1, { message: "Emergency contact number cannot be empty" })
      .optional(),
  })
  .strict();

export const validateRegisterRetreatUpdate = async (
  req: NextRequest
): Promise<NextResponse | void> => {
  try {
    const reqClone = req.clone();
    const updateData = await reqClone.json();

    const result = registerRetreatUpdateSchema.safeParse(updateData);

    if (!result.success) {
      const errorMessages = result.error.errors
        .map((err) => `${err.path.join(".")}: ${err.message}`)
        .join(", ");

      return handleError(httpMessages.BAD_REQUEST(errorMessages));
    }

    return;
  } catch (err) {
    console.error("Error validating register retreat update input:", err);
    return handleError();
  }
};
