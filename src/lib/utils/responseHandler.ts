import { NextResponse } from "next/server";

interface ResponseOptions {
  message?: string;
  statusCode?: number;
}

export const handleResponse = (
  data: unknown = null,
  options: ResponseOptions = { message: "Success", statusCode: 200 }
) => {
  const { message, statusCode } = options;

  return NextResponse.json(
    {
      message: message,
      data: data,
    },
    { status: statusCode }
  );
};
