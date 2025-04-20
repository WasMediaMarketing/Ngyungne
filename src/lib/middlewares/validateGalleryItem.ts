import { z } from "zod";
import type { NextResponse } from "next/server";
import { handleError } from "../utils/errorHandler";
import { httpMessages } from "../utils/HttpMessage";
import { GalleryItemType } from "@/types/gallery";

const galleryItemSchema = z.object({
  title: z.string().min(1, { message: "Title is required" }),
  description: z.string().min(1, { message: "Description is required" }),
  fullDescription: z.string().optional(),
  type: z.enum([GalleryItemType.PHOTO, GalleryItemType.VIDEO], {
    errorMap: () => ({ message: "Type must be either 'photo' or 'video'" }),
  }),
  image: z.string().min(1, { message: "Image is required" }),
  videoUrl: z.string().optional(),
  additionalImages: z.array(z.string()).optional(),
  tags: z.array(z.string()).optional(),
  date: z.string().or(z.date()).optional(),
  location: z.string().optional(),
  photographer: z.string().optional(),
  presenter: z.string().optional(),
  event: z.string().optional(),
  duration: z.string().optional(),
  isVisible: z.boolean().optional(),
});

/**
 * Validates the Gallery item data
 * @param {any} body - The Gallery item data to validate
 * @returns {NextResponse | null} The error response or null if validation passes
 */
export function validateGalleryItemData(body: any): NextResponse | null {
  try {
    const result = galleryItemSchema.safeParse(body);

    if (!result.success) {
      const errorMessages = result.error.errors
        .map((err) => `${err.path.join(".")}: ${err.message}`)
        .join(", ");
      return handleError(httpMessages.BAD_REQUEST(errorMessages));
    }

    // Additional validation for video type
    if (body.type === GalleryItemType.VIDEO && !body.videoUrl) {
      return handleError(
        httpMessages.BAD_REQUEST("videoUrl is required for video type")
      );
    }

    return null;
  } catch (err) {
    console.error("Error validating gallery item data:", err);
    return handleError();
  }
}

/**
 * Validates the Gallery item update data
 * @param {any} body - The Gallery item update data to validate
 * @returns {NextResponse | null} The error response or null if validation passes
 */
export function validateGalleryItemUpdateData(body: any): NextResponse | null {
  try {
    const updateSchema = galleryItemSchema.partial();
    const result = updateSchema.safeParse(body);

    if (!result.success) {
      const errorMessages = result.error.errors
        .map((err) => `${err.path.join(".")}: ${err.message}`)
        .join(", ");
      return handleError(httpMessages.BAD_REQUEST(errorMessages));
    }

    return null;
  } catch (err) {
    console.error("Error validating gallery item update data:", err);
    return handleError();
  }
}
