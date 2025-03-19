import { z } from "zod";
import { NextRequest, NextResponse } from "next/server";
import { handleError } from "@/lib/utils/errorHandler";
import { httpMessages } from "@/lib/utils/HttpMessage";

const moduleSchema = z
  .object({
    title: z.string().min(1, { message: "Module title is required" }),
    lessons: z
      .array(z.string())
      .min(1, { message: "At least one lesson is required" }),
  })
  .optional();

const instructorSchema = z
  .object({
    name: z
      .string()
      .min(1, { message: "Instructor name is required" })
      .optional(),
    image: z.string().optional(),
    position: z.string().min(1, { message: "Position is required" }).optional(),
    description: z
      .string()
      .min(1, { message: "Instructor description is required" })
      .optional(),
  })
  .optional();

const courseUpdateSchema = z
  .object({
    isVisible: z.boolean().optional(),
    title: z
      .string()
      .min(1, { message: "Course title must be a non-empty string" })
      .optional(),
    description: z
      .string()
      .min(1, { message: "Course description must be a non-empty string" })
      .optional(),
    overView: z
      .string()
      .min(1, { message: "Overview must be a non-empty string" })
      .optional(),
    outcomes: z
      .array(z.string())
      .min(1, { message: "At least one outcome must be provided" })
      .optional(),
    prerequisites: z
      .string()
      .min(1, { message: "Prerequisites must be a non-empty string" })
      .optional(),
    targetAudience: z
      .string()
      .min(1, { message: "Target audience must be a non-empty string" })
      .optional(),
    duration: z
      .string()
      .min(1, { message: "Course duration must be a non-empty string" })
      .optional(),
    lessons: z
      .number()
      .min(1, { message: "Lessons must be at least 1" })
      .optional(),
    level: z
      .string()
      .min(1, { message: "Course level must be a non-empty string" })
      .optional(),
    featured: z.boolean().optional(),
    students: z
      .number()
      .min(0, { message: "Students count must be a positive number" })
      .optional(),
    image: z.string().optional(),
    modules: z.array(moduleSchema).optional(),
    instructor: instructorSchema.optional(),
  })
  .strict();

export const validateCourseUpdate = async (
  req: NextRequest
): Promise<NextResponse | void> => {
  try {
    const courseData = await req.clone().json();

    const result = courseUpdateSchema.safeParse(courseData);

    if (!result.success) {
      const errorMessages = result.error.errors
        .map((err) => `${err.path.join(".")}: ${err.message}`)
        .join(", ");
      return handleError(httpMessages.BAD_REQUEST(errorMessages));
    }

    return;
  } catch (err) {
    console.error("Error validating course update input:", err);
    return handleError();
  }
};
