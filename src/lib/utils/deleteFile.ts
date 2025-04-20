import fs from "fs";
import path from "path";

export const deleteFile = (relativePath: string) => {
  console.log(relativePath);
  if (!relativePath) return;

  const filePath = path.join(process.cwd(), "public", relativePath);

  if (fs.existsSync(filePath)) {
    fs.unlinkSync(filePath);
    console.log(`✅ Deleted screenshot: ${filePath}`);
  } else {
    console.warn(`⚠️ File not found: ${filePath}`);
  }
};
