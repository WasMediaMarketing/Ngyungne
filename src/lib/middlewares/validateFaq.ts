import type { NextResponse } from "next/server";
import { httpMessages } from "../utils/HttpMessage";
import { handleError } from "../utils/errorHandler";

/**
 * Validates the FAQ data
 * @param {any} body - The FAQ data to validate
 * @returns {NextResponse | null} The error response or null if validation passes
 */
export function validateFaqData(body: any): NextResponse | null {
  // Check if required fields are present
  if (!body.question || !body.answer) {
    return handleError(
      httpMessages.BAD_REQUEST("Question and answer are required fields")
    );
  }

  // Validate question length
  if (body.question.length < 5) {
    return handleError(
      httpMessages.BAD_REQUEST("Question must be at least 5 characters long")
    );
  }

  // Validate answer length
  if (body.answer.length < 10) {
    return handleError(
      httpMessages.BAD_REQUEST("Answer must be at least 10 characters long")
    );
  }

  // If isVisible is provided, ensure it's a boolean
  if (body.isVisible !== undefined && typeof body.isVisible !== "boolean") {
    return handleError(httpMessages.BAD_REQUEST("isVisible must be a boolean"));
  }

  return null;
}
