import { z } from "zod";
import { NextRequest, NextResponse } from "next/server";
import { handleError } from "@/lib/utils/errorHandler";
import { httpMessages } from "@/lib/utils/HttpMessage";

const userSchema = z.object({
  name: z.string(),

  email: z.string().email({ message: "Invalid email address" }),

  phoneNumber: z.string(),

  role: z.enum(["user", "admin", "volunteer", "donator"]),

  password: z
    .string()
    .min(6, { message: "Password must be at least 6 characters long" })
    .optional()
    .refine(
      (val) => {
        if (val === "admin" && !val) {
          return false;
        }
        return true;
      },
      {
        message: "Password is required for admin users",
      }
    ),

  page: z
    .string()
    .min(1, { message: "Page is required for non-admin users" })
    .optional()
    .refine(
      (val) => {
        if (val !== "admin" && !val) {
          return false; // Page is required for non-admin users
        }
        return true;
      },
      {
        message: "Page is required for non-admin users",
      }
    ),

  pageTitle: z
    .string()
    .min(1, { message: "Page title is required for non-admin users" })
    .optional()
    .refine(
      (val) => {
        if (val !== "admin" && !val) {
          return false; // Page title is required for non-admin users
        }
        return true;
      },
      {
        message: "Page title is required for non-admin users",
      }
    ),

  address: z.string().optional(),
});

export const validateUserInput = async (
  req: NextRequest
): Promise<NextResponse | void> => {
  try {
    const reqClone = req.clone();
    const userData = await reqClone.json();

    const result = userSchema.safeParse(userData);

    if (!result.success) {
      const errorMessages = result.error.errors
        .map((err) => err.message)
        .join(", ");
      return handleError(httpMessages.BAD_REQUEST(errorMessages));
    }

    return;
  } catch (err) {
    console.error("Error validating user input:", err);
    return handleError();
  }
};
