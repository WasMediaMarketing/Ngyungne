import { z } from "zod";
import { NextRequest, NextResponse } from "next/server";
import { handleError } from "@/lib/utils/errorHandler";
import { httpMessages } from "@/lib/utils/HttpMessage";

export const joinCourseUpdateSchema = z
  .object({
    educationalLevel: z
      .string()
      .min(1, { message: "EducationalLevel is required" })
      .optional(),

    experience: z
      .string()
      .min(1, { message: "Experience is required" })
      .optional(),

    specialRequirement: z
      .string()
      .min(1, { message: "Special requirement cannot be empty" })
      .optional(),

    reason: z.string().min(1, { message: "Reason is required" }).optional(),
  })
  .strict();

export const validateJoinCourseUpdate = async (
  req: NextRequest
): Promise<NextResponse | void> => {
  try {
    const reqClone = req.clone();
    const joinCourseUpdateData = await reqClone.json();

    const result = joinCourseUpdateSchema.safeParse(joinCourseUpdateData);

    if (!result.success) {
      const errorMessages = result.error.errors
        .map((err) => `${err.path.join(".")}: ${err.message}`)
        .join(", ");

      return handleError(httpMessages.BAD_REQUEST(errorMessages));
    }

    return;
  } catch (err) {
    console.error("Error validating join course update input:", err);
    return handleError();
  }
};
