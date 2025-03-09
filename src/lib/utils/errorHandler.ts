import { NextResponse } from "next/server";
import { httpMessages } from "@/lib/utils/HttpMessage"; // Assuming this is where your default messages are stored.
import { ExtendedNextRequest } from "@/lib/utils/requestHelpers";
import { deleteFile } from "@/lib/utils/deleteFile";

export const handleError = (
  error: {
    message: string;
    statusCode: number;
  } = {
    message: httpMessages.INTERNAL_SERVER_ERROR.message,
    statusCode: httpMessages.INTERNAL_SERVER_ERROR.statusCode,
  },
  req?: ExtendedNextRequest
) => {
  const message = error.message
  const statusCode = error.statusCode

  if (req?.uploadedFiles) {
    // Loop through and delete the files if they exist in the request
    Object.values(req.uploadedFiles).forEach((fileUrl) => {
      deleteFile(fileUrl);
    });
  }

  return NextResponse.json({ message }, { status: statusCode });
};
