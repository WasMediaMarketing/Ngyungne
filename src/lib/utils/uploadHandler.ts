import { NextResponse } from "next/server";
import mime from "mime";
import { join } from "path";
import { stat, mkdir, writeFile } from "fs/promises";
import * as dateFn from "date-fns";
import { handleError } from "@/lib/utils/errorHandler";
import { httpMessages } from "@/lib/utils/HttpMessage";

interface NodeError extends Error {
  code?: string;
}

// Ensure that handleFileUpload accepts a File object
export async function handleFileUpload(
  file: File
): Promise<NextResponse | string> {
  try {
    const buffer = Buffer.from(await file.arrayBuffer());
    const relativeUploadDir = `/uploads/${dateFn.format(
      Date.now(),
      "dd-MM-y"
    )}`;
    const uploadDir = join(process.cwd(), "public", relativeUploadDir);

    // Create the upload directory if it doesn't exist
    try {
      await stat(uploadDir);
    } catch (e: unknown) {
      const error = e as NodeError;
      if (error.code === "ENOENT") {
        try {
          await mkdir(uploadDir, { recursive: true });
        } catch (mkdirError) {
          console.error("Error creating upload directory:", mkdirError);
          throw new Error("Failed to create upload directory.");
        }
      } else {
        console.error("Error checking directory:", error);
        throw new Error("Something went wrong while accessing storage.");
      }
    }

    // Ensure the file has a valid name and type
    if (!file.name || !file.type) {
      return handleError(httpMessages.BAD_REQUEST("Invalid file data"));
    }

    // Generate a unique file name
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    const extension = mime.getExtension(file.type);

    if (!extension) {
      return handleError(httpMessages.BAD_REQUEST("Unsupported file type"));
    }

    const filename = `${file.name.replace(
      /\.[^/.]+$/,
      ""
    )}-${uniqueSuffix}.${extension}`;

    // Write the file to disk
    try {
      await writeFile(`${uploadDir}/${filename}`, buffer);
    } catch (writeError) {
      console.error("Error writing file:", writeError);
      return handleError(httpMessages.INTERNAL_SERVER_ERROR);
    }

    return `${relativeUploadDir}/${filename}`;
  } catch (error) {
    console.error("File upload failed:", error);
    return handleError(httpMessages.INTERNAL_SERVER_ERROR);
  }
}
