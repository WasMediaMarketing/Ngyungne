import { UserService } from "@/lib/services";
import { UserController } from "@/lib/controllers";

export function createUserController() {
  const userService = new UserService();
  return new UserController(userService);
}
