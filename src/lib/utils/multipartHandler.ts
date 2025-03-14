import { NextRequest, NextResponse } from "next/server";
import { processFormData } from "@/lib/utils/processFormData";
import { parseJsonAndNumbersFields } from "@/lib/utils/parseJsonAndNumbersFields";
import { handleError } from "@/lib/utils/errorHandler";
import { httpMessages } from "@/lib/utils/HttpMessage";
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
 * @param booleanFields Array of fields to be parsed as boolean
 * @returns A NextResponse (success or error)
 */
export async function handleMultipartRequest(
  req: NextRequest,
  uploadFields: {
    fileField: string;
    bodyField: string;
    maxCount?: number;
  }[],
  jsonFields: string[] = [], // Default to an empty array
  numericFields: string[] = [], // Default to an empty array
  booleanFields: string[] = [] // Fields to be parsed as booleans
) {
  const reqClone = req.clone();
  const formData = await reqClone.formData();

  // Process file uploads
  const fileUrls = await processFormData(
    formData,
    uploadFields.map(({ fileField, maxCount }) => ({
      name: fileField,
      maxCount: maxCount || 1,
    }))
  );

  if (fileUrls instanceof NextResponse) return fileUrls; // If an error occurred in file processing, return the response

  // Extract text fields from formData
  console.log(fileUrls, fileUrls);
  const body: Record<string, unknown> = {};
  formData.forEach((value, key) => {
    if (!uploadFields.some(({ fileField }) => fileField === key)) {
      body[key] = value; // Store non-file fields
    }
  });

  // Parse the specified fields as JSON and/or numbers (if any)
  let parsedBody;
  try {
    parsedBody = parseJsonAndNumbersFields(
      body,
      jsonFields,
      numericFields,
      booleanFields
    );
  } catch {
    return handleError(
      httpMessages.BAD_REQUEST(
        `Invalid JSON format in one of the fields: ${jsonFields.join(", ")}`
      ),
      undefined,
      fileUrls
    );
  }

  // Map file URLs to the respective body fields, including nested fields
  for (const { fileField, bodyField } of uploadFields) {
    if (fileUrls[fileField]) {
      // Handle nested fields (e.g., "teacher.image")
      const keys = bodyField.split("."); // Split the field path into an array of keys
      let nestedObject = parsedBody;

      for (let i = 0; i < keys.length; i++) {
        const key = keys[i];

        // If we are at the last key, assign the value
        if (i === keys.length - 1) {
          nestedObject[key] = fileUrls[fileField]; // Set the final value
        } else {
          // Ensure the nested object exists before accessing it
          if (!nestedObject[key]) {
            nestedObject[key] = {};
          }
          nestedObject = nestedObject[key] as Record<string, unknown>; // Move deeper into the object
        }
      }
    }
  }

  // Create a new ExtendedNextRequest with the updated body (now parsed and with file URLs)
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
}
