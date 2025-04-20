import { NextRequest } from "next/server";
import { createContactController } from "@/lib/factories/contactFactory";
import { isAuthenticated } from "@/lib/middlewares";

export async function DELETE(req: NextRequest) {
  const authResult = await isAuthenticated(req);
  if (authResult) return authResult;

  const userController = createContactController();
  return userController.deleteContact(req);
}
