import { NextRequest } from "next/server";
import { createDonationController } from "@/lib/factories/donationFactory";
import { isAuthenticated } from "@/lib/middlewares";

export async function DELETE(req: NextRequest) {
  const authResult = await isAuthenticated(req);
  if (authResult) return authResult;

  const userController = createDonationController();
  return userController.deleteDonation(req);
}
