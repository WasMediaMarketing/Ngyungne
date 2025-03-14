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
  uploadFields: { name: string; maxCount: number }[] // maxCount now properly used
): Promise<NextResponse | Record<string, string>> {
  const fileUrls: Record<string, string> = {};

  try {
    for (const field of uploadFields) {
      const files = formData.getAll(field.name) as File[]; // Get all files for this field

      if (files.length > 0) {
        if (files.length > field.maxCount) {
          return handleError(
            httpMessages.BAD_REQUEST(
              `Cannot upload more than ${field.maxCount} files for field "${field.name}"`
            )
          );
        }

        const uploadedFileUrls: string[] = [];

        for (const file of files) {
          if (!file.name || !file.type) {
            return handleError(httpMessages.BAD_REQUEST("Invalid file data"));
          }

          try {
            const fileUrl = await handleFileUpload(file);
            if (fileUrl instanceof NextResponse) {
              return fileUrl;
            }

            uploadedFileUrls.push(fileUrl);
          } catch (uploadError) {
            console.error("File upload error:", uploadError);
            return handleError(httpMessages.INTERNAL_SERVER_ERROR);
          }
        }

        if (uploadedFileUrls.length === 1) {
          fileUrls[field.name] = uploadedFileUrls[0];
        } else {
          fileUrls[field.name] = uploadedFileUrls.join(",");
        }
      }
    }

    return fileUrls;
  } catch (error) {
    console.error("Error processing form data:", error);
    return handleError(httpMessages.INTERNAL_SERVER_ERROR);
  }
}
