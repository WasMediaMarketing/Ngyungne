import { z } from "zod";
import { NextRequest, NextResponse } from "next/server";
import { handleError } from "@/lib/utils/errorHandler";
import { httpMessages } from "@/lib/utils/HttpMessage";

const userUpdateSchema = z.object({
  name: z.string().optional(),
  email: z.string().email().optional(),
  phoneNumber: z.string().optional(),
  role: z.enum(["user", "admin", "donator", "volunteer"]).optional(),
  password: z.string().optional(),
  address: z.string().optional(),
  page: z.string().optional(),
  pageTitle: z.string().optional(),
});

export const validateUserUpdate = async (
  req: NextRequest
): Promise<NextResponse | void> => {
  try {
    const reqClone = req.clone();
    const userData = await reqClone.json();

    const result = userUpdateSchema.safeParse(userData);

    if (!result.success) {
      const errorMessages = result.error.errors
        .map((err) => `${err.path.join(".")}: ${err.message}`)
        .join(", ");

      return handleError(httpMessages.BAD_REQUEST(errorMessages));
    }

    return;
  } catch (err) {
    console.error("Error validating user input:", err);
    return handleError();
  }
};
