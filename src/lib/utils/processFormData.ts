import { handleFileUpload } from "./uploadHandler";
import { handleError } from "@/lib/utils/errorHandler";
import { httpMessages } from "@/lib/utils/HttpMessage";
import { NextResponse } from "next/server";

/**
 * Extracts and processes file fields from the form data.
 *
 * @param formData The FormData object containing all files.
 * @param uploadFields Array of objects representing the fields and their validation rules.
 * @returns A Record of field names and their respective file URLs, or a NextResponse in case of an error.
 */
export async function processFormData(
  formData: FormData,
  uploadFields: { name: string; maxCount: number }[]
): Promise<NextResponse | Record<string, string>> {
  const fileUrls: Record<string, string> = {};

  try {
    for (const field of uploadFields) {
      const file = formData.get(field.name) as File | null; // Cast to File

      if (file) {
        // Ensure the file has a valid name and type
        if (!file.name || !file.type) {
          return handleError(httpMessages.BAD_REQUEST("Invalid file data"));
        }

        try {
          const fileUrl = await handleFileUpload(file);

          // If handleFileUpload returned an error response, return it immediately
          if (fileUrl instanceof NextResponse) {
            return fileUrl;
          }

          fileUrls[field.name] = fileUrl;
        } catch (uploadError) {
          console.error("File upload error:", uploadError);
          return handleError(httpMessages.INTERNAL_SERVER_ERROR);
        }
      }
    }

    return fileUrls;
  } catch (error) {
    console.error("Error processing form data:", error);
    return handleError(httpMessages.INTERNAL_SERVER_ERROR);
  }
}
