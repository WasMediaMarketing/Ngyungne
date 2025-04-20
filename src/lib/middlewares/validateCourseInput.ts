import { z } from "zod";
import { NextRequest, NextResponse } from "next/server";
import { handleError } from "@/lib/utils/errorHandler";
import { httpMessages } from "@/lib/utils/HttpMessage";

const moduleSchema = z.object({
  title: z.string().min(1, { message: "Module title is required" }),
  lessons: z
    .array(z.string())
    .min(1, { message: "At least one lesson is required" }),
});

const instructorSchema = z.object({
  name: z.string(),
  image: z.string(),
  position: z.string(),
  description: z.string(),
});

const courseSchema = z
  .object({
    isVisible: z.boolean().optional(),
    title: z.string().min(1, { message: "Course title is required" }),
    description: z
      .string()
      .min(1, { message: "Course description is required" }),
    overView: z.string().min(1, { message: "Overview is required" }),
    outcomes: z
      .array(z.string())
      .min(1, { message: "At least one outcome is required" }),
    prerequisites: z.string().min(1, { message: "Prerequisites are required" }),
    targetAudience: z
      .string()
      .min(1, { message: "Target audience is required" }),
    duration: z.string().min(1, { message: "Course duration is required" }),
    lessons: z
      .number()
      .min(1, { message: "Number of lessons must be at least 1" }),
    level: z.string().min(1, { message: "Course level is required" }),
    featured: z.boolean().optional(),
    students: z
      .number()
      .min(0, { message: "Students must be a positive number" })
      .optional(),
    image: z.string().optional(),
    modules: z
      .array(moduleSchema)
      .min(1, { message: "At least one module is required" }),
    instructor: instructorSchema,
  })
  .strict();

// Validate course input
export const validateCourseInput = async (
  req: NextRequest
): Promise<NextResponse | void> => {
  try {
    const courseData = await req.clone().json();

    // Validate using zod
    const result = courseSchema.safeParse(courseData);

    if (!result.success) {
      const errorMessages = result.error.errors
        .map((err) => `${err.path.join(".")}: ${err.message}`)
        .join(", ");
      return handleError(httpMessages.BAD_REQUEST(errorMessages));
    }

    return;
  } catch (err) {
    console.error("Error validating course input:", err);
    return handleError();
  }
};
