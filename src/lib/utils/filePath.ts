import path from "path";
import fs from "fs";

const UPLOAD_FOLDER = process.env.UPLOAD_FOLDER!;

// Resolve the absolute upload path dynamically using process.cwd() for Next.js compatibility
export const uploadPath = path.join(process.cwd(), UPLOAD_FOLDER); // Using process.cwd() instead of __dirname

// Ensure the upload folder exists, create it if not
export const ensureUploadFolderExists = async () => {
  try {
    await fs.promises.access(uploadPath, fs.constants.F_OK);
  } catch {
    await fs.promises.mkdir(uploadPath, { recursive: true });
  }
};

ensureUploadFolderExists();
