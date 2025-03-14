import { NextRequest } from "next/server";
// Import RequestInit from the path given in the error
import { RequestInit as NextRequestInit } from "next/dist/server/web/spec-extension/request";

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
    options: NextRequestInit,
    uploadedFiles: Record<string, string>
  ) {
    // const modifiedOptions: NextRequestInit = {
    //   ...options,
    //   signal: options.signal ?? undefined,
    // };
    super(url, options);
    this.uploadedFiles = uploadedFiles;
  }
}
