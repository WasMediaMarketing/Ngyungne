import { z } from "zod";
import { NextRequest, NextResponse } from "next/server";
import { handleError } from "@/lib/utils/errorHandler";
import { httpMessages } from "@/lib/utils/HttpMessage";

// Author update schema (optional fields)
const authorUpdateSchema = z.object({
  name: z.string().min(1).optional(),
  image: z.string().optional(),
  bio: z.string().optional(),
});

const blogPostUpdateSchema = z
  .object({
    title: z.string().min(1).optional(),
    description: z.string().optional(),
    date: z
      .string()
      .refine((val) => !isNaN(Date.parse(val)), {
        message: "Invalid date format",
      })
      .optional(),
    readTime: z.string().optional(),
    author: authorUpdateSchema.optional(),
    tags: z.array(z.string()).optional(),
    categories: z.array(z.string()).optional(),
    content: z.string().optional(),
    image: z.string().optional(),
    views: z.number().int().nonnegative().optional(),
    isVisible: z.boolean().optional(),
  })
  .strict();

export const validateBlogPostUpdate = async (
  req: NextRequest
): Promise<NextResponse | void> => {
  try {
    const blogPostData = await req.clone().json();
    console.log("blog post update", blogPostData);

    const result = blogPostUpdateSchema.safeParse(blogPostData);

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
