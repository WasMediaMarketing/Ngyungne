import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { ContentType } from "@/types/about.types";

// Schema for hero section validation
const heroSectionSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().min(1, "Description is required"),
  imageUrl: z.string().min(1, "Image URL is required"),
  videoUrl: z.string().optional(),
  buttonText: z.string().optional(),
  buttonUrl: z.string().optional(),
});

// Schema for about content validation
const aboutContentSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().min(1, "Description is required"),
  contentType: z.enum([
    ContentType.HISTORY,
    ContentType.PRACTICE,
    ContentType.BENEFIT,
    ContentType.STATISTIC,
    ContentType.CTA,
  ]),
  order: z.number().optional(),
  isVisible: z.boolean().optional(),
  icon: z.string().optional(),
  data: z.any().optional(),
});

// Validate hero section update
export const validateHeroSectionUpdate = async (
  req: NextRequest
): Promise<NextResponse | void> => {
  try {
    // Check if this is a multipart request
    const contentType = req.headers.get("content-type") || "";
    if (contentType.includes("multipart/form-data")) {
      // Skip validation for multipart requests - will be handled by the controller
      return;
    }

    const heroData = await req.clone().json();

    const result = heroSectionSchema.partial().safeParse(heroData);

    if (!result.success) {
      const errors = result.error.errors.map((err) => ({
        field: err.path.join("."),
        message: err.message,
      }));

      return NextResponse.json(
        {
          message: "Validation error",
          errors,
        },
        { status: 400 }
      );
    }
  } catch (error) {
    console.error("Error validating hero section update:", error);
    return NextResponse.json(
      { message: "Error validating request" },
      { status: 400 }
    );
  }
};

// Validate about content creation
export const validateAboutContentCreate = async (
  req: NextRequest
): Promise<NextResponse | void> => {
  try {
    const contentData = await req.clone().json();

    const result = aboutContentSchema.safeParse(contentData);

    if (!result.success) {
      const errors = result.error.errors.map((err) => ({
        field: err.path.join("."),
        message: err.message,
      }));

      return NextResponse.json(
        {
          message: "Validation error",
          errors,
        },
        { status: 400 }
      );
    }
  } catch (error) {
    console.error("Error validating about content creation:", error);
    return NextResponse.json(
      { message: "Error validating request" },
      { status: 400 }
    );
  }
};

// Validate about content update
export const validateAboutContentUpdate = async (
  req: NextRequest
): Promise<NextResponse | void> => {
  try {
    const contentData = await req.clone().json();

    const result = aboutContentSchema.partial().safeParse(contentData);

    if (!result.success) {
      const errors = result.error.errors.map((err) => ({
        field: err.path.join("."),
        message: err.message,
      }));

      return NextResponse.json(
        {
          message: "Validation error",
          errors,
        },
        { status: 400 }
      );
    }
  } catch (error) {
    console.error("Error validating about content update:", error);
    return NextResponse.json(
      { message: "Error validating request" },
      { status: 400 }
    );
  }
};
