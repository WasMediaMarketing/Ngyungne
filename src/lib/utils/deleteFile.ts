import fs from "fs";
import path from "path";

export const deleteFile = (relativePath: string) => {
  if (!relativePath) return;

  const filePath = path.join(process.cwd(), "public", relativePath);

  if (fs.existsSync(filePath)) {
    fs.unlinkSync(filePath);
  } else {
    console.warn(`⚠️ File not found: ${filePath}`);
  }
};
