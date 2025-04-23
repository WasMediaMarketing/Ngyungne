import { z } from "zod";
import type { NextRequest, NextResponse } from "next/server";
import { handleError } from "@/lib/utils/errorHandler";
import { httpMessages } from "@/lib/utils/HttpMessage";

// Media schema
const mediaSchema = z
  .object({
    type: z.enum(["image", "video"]),
    sourceType: z.enum(["file", "url"]),
    url: z.string().optional(),
    file: z.string().optional(),
    altText: z.string().optional(),
  })
  .refine(
    (data) => {
      // Either URL or file must be provided based on sourceType
      if (data.sourceType === "url" && !data.url) {
        return false;
      }
      if (data.sourceType === "file" && !data.file) {
        return false;
      }
      return true;
    },
    {
      message:
        "Either URL or file path must be provided based on the selected source type",
    }
  );

// Slider input schema
const sliderSchema = z
  .object({
    title: z.string().optional(),
    description: z.string().optional(),
    media: mediaSchema,
    buttonText: z.string().optional(),
    buttonUrl: z.string().optional(),
    order: z.number().int().optional(),
    isVisible: z.boolean().optional(),
  })
  .strict();

// Slider update schema - Make media optional for updates
const sliderUpdateSchema = z
  .object({
    title: z.string().optional(),
    description: z.string().optional(),
    media: mediaSchema.optional(), // Media is optional for updates
    buttonText: z.string().optional(),
    buttonUrl: z.string().optional(),
    order: z.number().int().optional(),
    isVisible: z.boolean().optional(),
  })
  .strict();

// Validation handler function for slider creation
export const validateSliderInput = async (
  req: NextRequest
): Promise<NextResponse | void> => {
  try {
    const sliderData = await req.clone().json();
    console.log("slider input", sliderData);

    const result = sliderSchema.safeParse(sliderData);

    if (!result.success) {
      const errorMessages = result.error.errors
        .map((err) => `${err.path.join(".")}: ${err.message}`)
        .join(", ");
      console.log("errorMessage", errorMessages);
      return handleError(httpMessages.BAD_REQUEST(errorMessages));
    }

    return;
  } catch (err) {
    console.error("Error validating slider input:", err);
    return handleError();
  }
};

// Validation handler function for slider updates
export const validateSliderUpdate = async (
  req: NextRequest
): Promise<NextResponse | void> => {
  try {
    const sliderData = await req.clone().json();
    console.log("slider update", sliderData);

    const result = sliderUpdateSchema.safeParse(sliderData);

    if (!result.success) {
      const errorMessages = result.error.errors
        .map((err) => `${err.path.join(".")}: ${err.message}`)
        .join(", ");
      console.log("errorMessage", errorMessages);
      return handleError(httpMessages.BAD_REQUEST(errorMessages));
    }

    return;
  } catch (err) {
    console.error("Error validating slider update:", err);
    return handleError();
  }
};

// Validation handler function for reordering slider items
export const validateReorderInput = async (
  req: NextRequest
): Promise<NextResponse | void> => {
  try {
    const data = await req.clone().json();
    console.log("reorder input", data);

    const reorderSchema = z.object({
      items: z.array(
        z.object({
          id: z.string().min(1, "Item ID is required"),
          order: z.number().int("Order must be an integer"),
        })
      ),
    });

    const result = reorderSchema.safeParse(data);

    if (!result.success) {
      const errorMessages = result.error.errors
        .map((err) => `${err.path.join(".")}: ${err.message}`)
        .join(", ");
      console.log("errorMessage", errorMessages);
      return handleError(httpMessages.BAD_REQUEST(errorMessages));
    }

    return;
  } catch (err) {
    console.error("Error validating reorder input:", err);
    return handleError();
  }
};
