import { NextRequest, NextResponse } from "next/server";
import { createAboutController } from "@/lib/factories/aboutFactory";
import { isAuthenticated, validateHeroSectionUpdate } from "@/lib/middlewares";
import { handleMultipartRequest } from "@/lib/utils/multipartHandler";

/**
 * GET /api/about/hero
 * Retrieves the hero section content
 */
export async function GET() {
  try {
    const aboutController = createAboutController();
    return aboutController.getHeroSection();
  } catch (error) {
    console.error("Error in GET /api/about/hero:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}

/**
 * PUT /api/about/hero
 * Updates the hero section content
 */
export async function PUT(req: NextRequest) {
  try {
    // Check authentication
    const authResult = await isAuthenticated(req);
    if (authResult) return authResult;

    // Determine if this is a multipart request
    const contentType = req.headers.get("content-type") || "";
    const isMultipart = contentType.includes("multipart/form-data");

    let heroData;

    if (isMultipart) {
      // Handle multipart/form-data request with file uploads
      const uploadFields = [
        { fileField: "image", bodyField: "imageFile" },
        { fileField: "video", bodyField: "videoFile" },
      ];

      heroData = await handleMultipartRequest(
        req,
        uploadFields,
        [], // No JSON fields
        [], // No numeric fields
        ["isVisible"] // Boolean fields
      );

      if (heroData instanceof NextResponse) return heroData;
    } else {
      // Handle JSON request
      try {
        heroData = await req.json();

        // Validate the JSON data
        const validationResult = await validateHeroSectionUpdate(req);
        if (validationResult) return validationResult;
      } catch (error) {
        console.error("Error parsing JSON:", error);
        return NextResponse.json(
          { message: "Invalid JSON format" },
          { status: 400 }
        );
      }
    }

    // Process the hero section update
    const aboutController = createAboutController();
    return aboutController.updateHeroSection(heroData);
  } catch (error) {
    console.error("Error in PUT /api/about/hero:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}

export const config = {
  api: {
    bodyParser: {
      sizeLimit: "25mb",
    },
  },
};
