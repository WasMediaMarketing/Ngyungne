import { NextRequest, NextResponse } from "next/server";
import { validateDonationInput } from "@/lib/middlewares";
import { handleMultipartRequest } from "@/lib/utils/multipartHandler";
import { createDonationController } from "@/lib/factories/donationFactory";
import { isAuthenticated } from "@/lib/middlewares";

export async function POST(req: NextRequest) {
  const uploadFields = [{ fileField: "screenshot", bodyField: "screenshot" }];
  const numericFields = ["amount"];
  const processedRequest = await handleMultipartRequest(
    req,
    uploadFields,
    numericFields
  );
  if (processedRequest instanceof NextResponse) return processedRequest;

  const validationResponse = await validateDonationInput(processedRequest);
  if (validationResponse) return validationResponse;

  const donationController = createDonationController();
  return donationController.createDonation(processedRequest);
}

export async function GET(req: NextRequest) {
  const authResult = await isAuthenticated(req);
  if (authResult) return authResult;

  const donationController = createDonationController();
  return donationController.getDonations();
}

export async function DELETE(req: NextRequest) {
  const authResult = await isAuthenticated(req);
  if (authResult) return authResult;

  const donationController = createDonationController();
  return donationController.deleteDonations(req);
}
