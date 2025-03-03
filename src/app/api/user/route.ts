import { NextRequest } from "next/server";
import { createUserController } from "@/lib/factories/userFactory";
import { isAuthenticated, validateUserInput } from "@/lib/middlewares";

export async function POST(req: NextRequest) {
  const authResult = await isAuthenticated(req);

  if (authResult) return authResult;

  const userController = createUserController();
  return userController.createUser(req);
}

export async function GET(req: NextRequest) {
  const authResult = await isAuthenticated(req);
  if (authResult) return authResult;

  const valdiateuserBody = await validateUserInput(req);
  if (valdiateuserBody) return valdiateuserBody;

  const userController = createUserController();
  return userController.getUsers();
}
