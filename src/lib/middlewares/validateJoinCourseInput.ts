import { z } from "zod";
import { NextRequest, NextResponse } from "next/server";
import { handleError } from "@/lib/utils/errorHandler";
import { httpMessages } from "@/lib/utils/HttpMessage";

const isValidObjectId = (id: string) => /^[0-9a-fA-F]{24}$/.test(id);

export const joinCourseSchema = z
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

    courseId: z
      .string()
      .refine((id) => isValidObjectId(id), { message: "Invalid course ID" }),

    educationalLevel: z
      .string()
      .min(1, { message: "EducationalLevel is required" }),

    experience: z
      .string()
      .min(1, { message: "Experience is required" })
      .optional(),

    specialRequirement: z
      .string()
      .min(1, { message: "Special requirement cannot be empty" })
      .optional(),

    reason: z.string().min(1, { message: "Reason is required" }),
  })
  .strict();

export const validateJoinCourseInput = async (
  req: NextRequest
): Promise<NextResponse | void> => {
  try {
    const reqClone = req.clone();
    const joinCourseData = await reqClone.json();

    const result = joinCourseSchema.safeParse(joinCourseData);

    if (!result.success) {
      const errorMessages = result.error.errors
        .map((err) => `${err.path.join(".")}: ${err.message}`)
        .join(", ");

      return handleError(httpMessages.BAD_REQUEST(errorMessages));
    }

    return;
  } catch (err) {
    console.error("Error validating join course input:", err);
    return handleError();
  }
};
