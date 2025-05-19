import { NextResponse } from "next/server";
import { httpMessages } from "@/lib/utils/HttpMessage"; // Assuming this is where your default messages are stored.
import { ExtendedNextRequest } from "@/lib/utils/requestHelpers";
import { deleteFile } from "@/lib/utils/deleteFile";

/**
 * Handles error by logging, deleting uploaded files if any, and returning an error response.
 *
 * @param error The error object containing message and statusCode.
 * @param req The request object (if available) containing uploaded files to delete.
 * @param fileUrls The file URLs to delete (can be a string or an array of strings).
 * @returns A JSON response with the error message and status code.
 */
export const handleError = (
  error: {
    message: string;
    statusCode: number;
  } = {
    message: httpMessages.INTERNAL_SERVER_ERROR.message,
    statusCode: httpMessages.INTERNAL_SERVER_ERROR.statusCode,
  },
  req?: ExtendedNextRequest,
  fileUrls?: Record<string, string | string[]>
) => {
  const message = error.message;
  const statusCode = error.statusCode;

  // Delete files from the request if uploadedFiles exist
  if (req?.uploadedFiles) {
    Object.values(req.uploadedFiles).forEach((fileUrl) => {
      if (typeof fileUrl === "string") {
        deleteFile(fileUrl);
      } else if (Array.isArray(fileUrl)) {
        // If fileUrl is an array of strings, loop through and delete each file
        fileUrl.forEach((url) => deleteFile(url));
      }
    });
  }

  // Delete files from fileUrls if provided
  if (fileUrls) {
    Object.values(fileUrls).forEach((fileUrl) => {
      // If the fileUrl is a string, delete it directly
      if (typeof fileUrl === "string") {
        deleteFile(fileUrl);
      } else if (Array.isArray(fileUrl)) {
        // If fileUrl is an array of strings, loop through and delete each file
        fileUrl.forEach((url) => deleteFile(url));
      }
    });
  }

  return NextResponse.json({ message }, { status: statusCode });
};
