import path from "path";
import fs from "fs";
import mime from "mime";
import { join } from "path";
import { stat, mkdir, writeFile } from "fs/promises";
import * as dateFn from "date-fns";
import { NextResponse } from "next/server";
import { handleError } from "@/lib/utils/errorHandler";
import { httpMessages } from "@/lib/utils/HttpMessage";

interface NodeError extends Error {
  code?: string;
}

export const ROOT_UPLOAD_DIR = path.join(process.cwd(), "uploads"); // uploads in project root

// Ensure root upload directory exists
export const ensureUploadFolderExists = async () => {
  try {
    await fs.promises.access(ROOT_UPLOAD_DIR, fs.constants.F_OK);
  } catch {
    await fs.promises.mkdir(ROOT_UPLOAD_DIR, { recursive: true });
  }
};

// Call once to ensure base folder exists
ensureUploadFolderExists();

export async function handleFileUpload(
  file: File
): Promise<NextResponse | string> {
  try {
    const buffer = Buffer.from(await file.arrayBuffer());

    // Format date-based subfolder
    const relativeUploadDir = dateFn.format(Date.now(), "dd-MM-y");
    const uploadDir = join(ROOT_UPLOAD_DIR, relativeUploadDir); // Root uploads/21-05-2025

    // Ensure date-based folder exists
    try {
      await stat(uploadDir);
    } catch (e: unknown) {
      const error = e as NodeError;
      if (error.code === "ENOENT") {
        await mkdir(uploadDir, { recursive: true });
      } else {
        console.error("Error checking directory:", error);
        throw new Error("Something went wrong while accessing storage.");
      }
    }

    // Validate file
    if (!file.name || !file.type) {
      return handleError(httpMessages.BAD_REQUEST("Invalid file data"));
    }

    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    const extension = mime.getExtension(file.type);

    if (!extension) {
      return handleError(httpMessages.BAD_REQUEST("Unsupported file type"));
    }

    const filename = `${file.name.replace(
      /\.[^/.]+$/,
      ""
    )}-${uniqueSuffix}.${extension}`;
    const fullPath = join(uploadDir, filename);

    await writeFile(fullPath, buffer);

    // Return file path relative to project root
    return `uploads/${relativeUploadDir}/${filename}`;
  } catch (error) {
    console.error("File upload failed:", error);
    return handleError(httpMessages.INTERNAL_SERVER_ERROR);
  }
}
