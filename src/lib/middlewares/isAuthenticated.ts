import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { httpMessages } from "@/lib/utils/HttpMessage";
import { handleError } from "@/lib/utils/errorHandler";

const JWT_SECRET = process.env.JWT_SECRET as string;

if (!JWT_SECRET) {
  throw new Error("JWT_SECRET is not defined in environment variables.");
}

export const isAuthenticated = async (
  req: NextRequest
): Promise<NextResponse | void> => {
  const authHeader = req.headers.get("authorization");

  if (!authHeader) {
    return handleError(httpMessages.UNAUTHORIZED_NO_TOKEN);
  }

  const token = authHeader.split(" ")[1];
  if (!token) {
    return handleError(httpMessages.UNAUTHORIZED_INVALID_TOKEN);
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);

    return;
  } catch {
    return handleError(httpMessages.UNAUTHORIZED("Invalid or Expired Token"));
  }
};
