import { NextResponse } from "next/server";
import { httpMessages } from "@/lib/utils/HttpMessage"; // Assuming this is where your default messages are stored.

export const handleError = (error?: {
  message: string;
  statusCode: number;
}) => {
  const message = error
    ? error.message
    : httpMessages.INTERNAL_SERVER_ERROR.message;
  const statusCode = error
    ? error.statusCode
    : httpMessages.INTERNAL_SERVER_ERROR.statusCode;

  return NextResponse.json({ message }, { status: statusCode });
};
