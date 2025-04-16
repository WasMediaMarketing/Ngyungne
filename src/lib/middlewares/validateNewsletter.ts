import type { NextResponse } from "next/server";
import { httpMessages } from "../utils/HttpMessage";
import { handleError } from "../utils/errorHandler";

/**
 * Validates the Newsletter data
 * @param {any} body - The Newsletter data to validate
 * @returns {NextResponse | null} The error response or null if validation passes
 */
export function validateNewsletterData(body: any): NextResponse | null {
  // Check if email is present
  if (!body.email) {
    return handleError(httpMessages.BAD_REQUEST("Email is required"));
  }

  // Validate email format
  const emailRegex = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/;
  if (!emailRegex.test(body.email)) {
    return handleError(
      httpMessages.BAD_REQUEST("Please provide a valid email address")
    );
  }

  return null;
}
