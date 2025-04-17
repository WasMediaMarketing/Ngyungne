import { z } from "zod";
import { NextRequest, NextResponse } from "next/server";
import { handleError } from "@/lib/utils/errorHandler";
import { httpMessages } from "@/lib/utils/HttpMessage";

// Author schema
const authorSchema = z.object({
  name: z.string().min(1, "Author name is required").optional(),
  image: z.string().optional(),
  bio: z.string().optional(),
});

// Blog post update schema
const blogPostSchema = z
  .object({
    title: z.string().min(1, "Title is required").optional(),
    description: z.string().optional(),
    date: z
      .string()
      .refine((val) => !isNaN(Date.parse(val)), {
        message: "Invalid date format",
      })
      .optional(),
    readTime: z.string().optional(),
    author: authorSchema.optional(),
    tags: z.array(z.string()).optional(),
    categories: z.array(z.string()).optional(),
    content: z.string().min(1, "Content is required").optional(),
    image: z.string().optional(),
    views: z.number().int().nonnegative().optional(),
    isVisible: z.boolean().optional(),
    metaTitle: z.string().optional(),
    metaKeywords: z.array(z.string()).optional(),
    metaDescription: z.string().optional(),
  })
  .strict();

// Validation handler function
export const validateBlogPostInput = async (
  req: NextRequest
): Promise<NextResponse | void> => {
  try {
    const blogPostData = await req.clone().json();
    console.log("blog post update", blogPostData);

    const result = blogPostSchema.safeParse(blogPostData);

    if (!result.success) {
      const errorMessages = result.error.errors
        .map((err) => `${err.path.join(".")}: ${err.message}`)
        .join(", ");
      console.log("errorMessage", errorMessages);
      return handleError(httpMessages.BAD_REQUEST(errorMessages));
    }

    return;
  } catch (err) {
    console.error("Error validating blog post update:", err);
    return handleError();
  }
};
