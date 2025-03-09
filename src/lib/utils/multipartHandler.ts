import { NextRequest, NextResponse } from "next/server";
import { processFormData } from "@/lib/utils/processFormData";
import { parseJsonAndNumbersFields } from "@/lib/utils/parseJsonAndNumbersFields";
import { handleError } from "@/lib/utils/errorHandler";
import { httpMessages } from "@/lib/utils/HttpMessage";
import {deleteFile} from "@/lib/utils/deleteFile";
import { ExtendedNextRequest } from "@/lib/utils/requestHelpers";

/**
 * Handles multipart form data:
 * - Uploads files
 * - Extracts text fields
 * - Maps uploaded file URLs to body fields
 * - Validates the request
 *
 * @param req The incoming Next.js request
 * @param uploadFields Mapping of file fields to body fields
 * @param jsonFields Array of fields to be parsed as JSON
 * @param numericFields Array of fields to be parsed as numbers
 * @returns A NextResponse (success or error)
 */
export async function handleMultipartRequest(
  req: NextRequest,
  uploadFields: { fileField: string; bodyField: string }[],
  jsonFields: string[] = [], // Default to an empty array
  numericFields: string[] = [] // Default to an empty array
) {
  const reqClone = req.clone();
  const formData = await reqClone.formData();

  // Process file uploads
  const fileUrls = await processFormData(
    formData,
    uploadFields.map(({ fileField }) => ({ name: fileField, maxCount: 1 }))
  );

  if (fileUrls instanceof NextResponse) return fileUrls; // If an error occurred in file processing, return the response

  // Extract text fields from formData
  const body: Record<string, unknown> = {};
  formData.forEach((value, key) => {
    if (!uploadFields.some(({ fileField }) => fileField === key)) {
      body[key] = value; // Store non-file fields
    }
  });

  // Map file URLs to the respective body fields
  uploadFields.forEach(({ fileField, bodyField }) => {
    if (fileUrls[fileField]) {
      body[bodyField] = fileUrls[fileField];
    }
  });

  // Parse the specified fields as JSON and/or numbers (if any)
  try {
    const parsedBody = parseJsonAndNumbersFields(
      body,
      jsonFields,
      numericFields
    );
    // Clone request with updated body
    const updatedRequest = new ExtendedNextRequest(
      req.url,
      {
        method: req.method,
        headers: req.headers,
        body: JSON.stringify(parsedBody),
      },
      fileUrls
    );

    return updatedRequest;
  } catch {
    if(fileUrls){
      Object.values(fileUrls).forEach((url) => {
        deleteFile(url); 
      });
    }
    return handleError(
      httpMessages.BAD_REQUEST(
        `Invalid JSON format in one of the fields: ${jsonFields.join(", ")}`
      )
    );
  }
}
