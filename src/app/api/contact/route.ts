import { NextRequest } from "next/server";
import { validateContactInput } from "@/lib/middlewares";
import { createContactController } from "@/lib/factories/contactFactory";
import { isAuthenticated } from "@/lib/middlewares";

export async function POST(req: NextRequest) {
  const validationResponse = await validateContactInput(req);
  if (validationResponse) return validationResponse;

  const contactController = createContactController();
  return contactController.createContact(req);
}

export async function GET(req: NextRequest) {
  const authResult = await isAuthenticated(req);
  if (authResult) return authResult;

  const contactController = createContactController();
  return contactController.getContacts();
}

export async function DELETE(req: NextRequest) {
  const authResult = await isAuthenticated(req);
  if (authResult) return authResult;

  const contactController = createContactController();
  return contactController.deleteContacts(req);
}
