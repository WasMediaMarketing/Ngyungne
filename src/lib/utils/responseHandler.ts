import { NextResponse } from "next/server";

interface ResponseOptions {
  message?: string;
  statusCode?: number;
}
/**
 * Handles the creation of a successful response with optional data and customizable message/status code.
 *
 * @param {unknown} [data=null] - The optional data to return in the response body.
 * @param {Object} [options={ message: "Success", statusCode: 200 }] - The optional options to customize the response.
 * @param {string} [options.message="Success"] - The message to include in the response.
 * @param {number} [options.statusCode=200] - The HTTP status code to return.
 * @returns {NextResponse} - A NextResponse containing the response data and message.
 */
export const handleResponse = (
  data: unknown = null,
  options: ResponseOptions = { message: "Success", statusCode: 200 }
) => {
  const { message, statusCode } = options;

  return NextResponse.json(
    {
      message: message,
      data: data,
    },
    {
      status: statusCode,
      headers: {
        "Cache-Control": "no-store", // Disable caching
      },
    }
  );
};
