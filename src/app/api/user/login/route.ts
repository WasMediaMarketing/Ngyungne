import { createUserController } from "@/lib/factories/userFactory";
import { NextRequest } from "next/server";

export async function POST(req: NextRequest) {
  const userController = createUserController();
  return userController.loginUser(req);
}
