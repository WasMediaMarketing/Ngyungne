import { NextRequest, NextResponse } from "next/server";
import { IUserService } from "@/types";
import { httpMessages } from "@/lib/utils/HttpMessage";
import { handleError } from "@/lib/utils/errorHandler";
import { handleResponse } from "@/lib/utils/responseHandler";

export class UserController {
  private userService: IUserService;

  constructor(userService: IUserService) {
    this.userService = userService;
  }

  async createUser(req: NextRequest): Promise<NextResponse> {
    try {
      const userData = await req.json();
      const user = await this.userService.createUser(userData);
      return handleResponse(user, httpMessages.CREATED());
    } catch (error) {
      console.error("createUserController error:", error);
      return handleError();
    }
  }

  async loginUser(req: NextRequest): Promise<NextResponse> {
    try {
      const { email, password } = await req.json();
      const loginUser = await this.userService.loginUser(email, password);
      return handleResponse(loginUser, httpMessages.OK());
    } catch (error) {
      console.error("loginUserController error", error);
      return handleError();
    }
  }

  async getUsers(): Promise<NextResponse> {
    try {
      const users = await this.userService.getUsers();
      return handleResponse(users);
    } catch (error) {
      console.error("getUsersController error:", error);
      return handleError();
    }
  }

  async getUserById(req: NextRequest): Promise<NextResponse> {
    try {
      const userId = req.nextUrl.pathname.split("/").pop();

      if (!userId) {
        return handleError(httpMessages.BAD_REQUEST("User ID is required"));
      }

      const user = await this.userService.getUserById(userId);
      return handleResponse(user);
    } catch (error) {
      console.error("getUserByIdController error:", error);
      return handleError();
    }
  }

  async updateUser(req: NextRequest): Promise<NextResponse> {
    try {
      const userId = req.nextUrl.pathname.split("/").pop();

      if (!userId) {
        return handleError(httpMessages.BAD_REQUEST("User ID is required"));
      }

      const userData = await req.json();
      const updatedUser = await this.userService.updateUser(userId, userData);
      return handleResponse(updatedUser);
    } catch (error) {
      console.error("updateUserController error:", error);
      return handleError();
    }
  }

  async deleteUser(req: NextRequest): Promise<NextResponse> {
    try {
      const userId = req.nextUrl.pathname.split("/").pop();

      if (!userId) {
        return handleError(httpMessages.BAD_REQUEST("User ID is required"));
      }

      const deletedUser = await this.userService.deleteUser(userId);
      return handleResponse(deletedUser);
    } catch (error) {
      console.error("deleteUserController error:", error);
      return handleError();
    }
  }
  async deleteUsers(req: NextRequest): Promise<NextResponse> {
    try {
      // Extract user IDs from query parameters
      const url = req.nextUrl;
      const userIds = url.searchParams.get("userIds");

      if (!userIds) {
        return handleError(httpMessages.BAD_REQUEST("User IDs are required"));
      }

      // Parse user IDs into an array
      const userIdArray = userIds.split(",").map((id) => id.trim());

      // Call the deleteUser method for each ID
      const deletedUsers = await this.userService.deleteUsers(userIdArray);
      return handleResponse(deletedUsers);
    } catch (error) {
      console.error("deleteUsersController error:", error);
      return handleError();
    }
  }
}
