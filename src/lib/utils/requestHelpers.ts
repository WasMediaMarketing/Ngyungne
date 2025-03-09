// lib/utils/requestHelpers.ts
import { NextRequest } from "next/server";

/**
 * Extend the request object to attach uploadedFileUrls.
 * @param req The original request object
 * @param fileUrls The file URLs to attach
 * @returns The extended request object
 */
export class ExtendedNextRequest extends NextRequest {
  uploadedFiles: Record<string, string>;

  constructor(
    url: string,
    options: RequestInit,
    uploadedFiles: Record<string, string>
  ) {
    super(url);
    this.uploadedFiles = uploadedFiles; // Custom property to hold uploaded files
  }
}
