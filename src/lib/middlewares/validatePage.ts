import { NextResponse } from "next/server";

// Slug regex: Only allows lowercase letters, numbers, and hyphens (-), no spaces or special characters
const slugRegex = /^[a-z0-9]+(-[a-z0-9]+)*$/;

export function validatePageInput(data: any): NextResponse | null {
  // Check required fields for page creation
  if (
    !data.title ||
    typeof data.title !== "string" ||
    data.title.trim() === ""
  ) {
    return NextResponse.json(
      { success: false, message: "Title is required" },
      { status: 400 }
    );
  }

  if (!data.slug || typeof data.slug !== "string" || data.slug.trim() === "") {
    return NextResponse.json(
      { success: false, message: "Slug is required" },
      { status: 400 }
    );
  }

  // Validate slug format
  if (!slugRegex.test(data.slug)) {
    return NextResponse.json(
      {
        success: false,
        message:
          "Slug can only contain lowercase letters, numbers, and hyphens (-). No spaces or special characters allowed.",
      },
      { status: 400 }
    );
  }

  if (!data.location || !["header", "footer"].includes(data.location)) {
    return NextResponse.json(
      {
        success: false,
        message: "Location must be either 'header' or 'footer'",
      },
      { status: 400 }
    );
  }

  if (
    !data.content ||
    typeof data.content !== "string" ||
    data.content.trim() === ""
  ) {
    return NextResponse.json(
      { success: false, message: "Content is required" },
      { status: 400 }
    );
  }

  if (!data.status || !["draft", "published"].includes(data.status)) {
    return NextResponse.json(
      {
        success: false,
        message: "Status must be either 'draft' or 'published'",
      },
      { status: 400 }
    );
  }

  return null;
}

export function validatePageUpdateInput(data: any): NextResponse | null {
  // For updates, fields are optional but must be valid if provided

  if (
    data.title !== undefined &&
    (typeof data.title !== "string" || data.title.trim() === "")
  ) {
    return NextResponse.json(
      { success: false, message: "Title must be a non-empty string" },
      { status: 400 }
    );
  }

  if (data.slug !== undefined) {
    if (typeof data.slug !== "string" || data.slug.trim() === "") {
      return NextResponse.json(
        { success: false, message: "Slug must be a non-empty string" },
        { status: 400 }
      );
    }

    // Validate slug format
    if (!slugRegex.test(data.slug)) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Slug can only contain lowercase letters, numbers, and hyphens (-). No spaces or special characters allowed.",
        },
        { status: 400 }
      );
    }
  }

  if (
    data.location !== undefined &&
    !["header", "footer"].includes(data.location)
  ) {
    return NextResponse.json(
      {
        success: false,
        message: "Location must be either 'header' or 'footer'",
      },
      { status: 400 }
    );
  }

  if (
    data.content !== undefined &&
    (typeof data.content !== "string" || data.content.trim() === "")
  ) {
    return NextResponse.json(
      { success: false, message: "Content must be a non-empty string" },
      { status: 400 }
    );
  }

  if (
    data.status !== undefined &&
    !["draft", "published"].includes(data.status)
  ) {
    return NextResponse.json(
      {
        success: false,
        message: "Status must be either 'draft' or 'published'",
      },
      { status: 400 }
    );
  }

  return null;
}
