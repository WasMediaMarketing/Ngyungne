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
    // Create a new options object to ensure signal is not null
    const modifiedOptions: RequestInit = {
      ...options,
      signal: options.signal === null ? undefined : options.signal, // Set null to undefined
    };

    // Cast the modified options to match the NextRequest's expected RequestInit type
    super(url, modifiedOptions); // Type casting
    this.uploadedFiles = uploadedFiles; // Custom property to hold uploaded files
  }
}
