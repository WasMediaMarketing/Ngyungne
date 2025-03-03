import { NextRequest } from "next/server";
import { createUserController } from "@/lib/factories/userFactory";
import { isAuthenticated, validateUserUpdate } from "@/lib/middlewares";

export async function GET(req: NextRequest) {
  const authResult = await isAuthenticated(req);
  if (authResult) return authResult;

  const userController = createUserController();
  return userController.getUserById(req);
}

export async function PATCH(req: NextRequest) {
  const authResult = await isAuthenticated(req);
  if (authResult) return authResult;

  const validateUserBody = await validateUserUpdate(req);
  if (validateUserBody) return validateUserBody;

  const userController = createUserController();
  return userController.updateUser(req);
}

export async function DELETE(req: NextRequest) {
  const authResult = await isAuthenticated(req);
  if (authResult) return authResult;

  const userController = createUserController();
  return userController.deleteUser(req);
}
