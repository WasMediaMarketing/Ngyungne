import { NextResponse } from "next/server";
import type { TeamMemberRole } from "@/types/team-member";

const validRoles: TeamMemberRole[] = [
  "Founder",
  "Co-Founder",
  "Executive Director",
  "Ambassador",
  "Program Coordinator",
  "Community Liaison",
  "Volunteer",
];

export async function validateAmbassadorInput(
  data: any,
  isPatch = false
): Promise<NextResponse | null> {
  const errors = [];

  // Required fields - only check if it's a POST request or if the field is present in PATCH
  if (!isPatch || data.name !== undefined) {
    if (!data.name) errors.push("Name is required");
  }

  if (!isPatch || data.role !== undefined) {
    if (!data.role) errors.push("Role is required");
    else if (!validRoles.includes(data.role)) errors.push("Invalid role");
  }

  if (!isPatch || data.bio !== undefined) {
    if (!data.bio) errors.push("Bio is required");
  }

  // For image, we don't check in pre-validation
  // The image will be validated in the controller after file upload

  // Validate social links if provided
  if (data.socialLinks) {
    if (typeof data.socialLinks !== "object") {
      errors.push("Social links must be an object");
    } else {
      // Validate each social link URL if provided
      const socialLinks = data.socialLinks;
      const urlRegex =
        /^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([/\w .-]*)*\/?$/;

      for (const [platform, url] of Object.entries(socialLinks)) {
        if (url && typeof url === "string" && !urlRegex.test(url)) {
          errors.push(`Invalid URL for ${platform}`);
        }
      }
    }
  }

  // Validate achievements if provided
  if (data.achievements) {
    if (!Array.isArray(data.achievements)) {
      errors.push("Achievements must be an array");
    }
  }

  // Return validation errors if any
  if (errors.length > 0) {
    return NextResponse.json(
      { message: "Validation failed", errors },
      { status: 400 }
    );
  }

  return null;
}
