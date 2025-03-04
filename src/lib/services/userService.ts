import bcrypt from "bcryptjs";
import { User } from "@/lib/models";
import {
  IUserInput,
  IUserUpdate,
  IUser,
  IUserService,
  IUserLogin,
} from "@/types";
import { connectToDatabase } from "@/lib/utils/mongodb";
import { generateToken } from "../utils/token";

export class UserService implements IUserService {
  private async initializeDbConnection() {
    await connectToDatabase();
  }
  async createUser(userData: IUserInput): Promise<IUser> {
    await this.initializeDbConnection();
    const user = new User(userData);
    await user.save();
    return user;
  }

  async getUsers(): Promise<IUser[]> {
    await this.initializeDbConnection();
    return await User.find();
  }

  async getUserById(userId: string): Promise<IUser | null> {
    await this.initializeDbConnection();
    const user = await User.findById(userId);
    if (!user) throw new Error("User not found");
    return user;
  }

  async updateUser(
    userId: string,
    userData: IUserUpdate
  ): Promise<IUser | null> {
    await this.initializeDbConnection();
    const user = await User.findByIdAndUpdate(userId, userData, { new: true });
    if (!user) throw new Error("User not found");
    return user;
  }

  async deleteUsers(userIds: string[]): Promise<unknown> {
    await this.initializeDbConnection();
    const deletedUsers = await User.deleteMany({
      _id: { $in: userIds }, // Matching any user whose _id is in the userIds array
    });

    if (deletedUsers.deletedCount === 0) {
      throw new Error("No users found to delete");
    }
    return deletedUsers;
  }

  async loginUser(email: string, password: string): Promise<IUserLogin> {
    await this.initializeDbConnection();
    const user = await User.findOne({ email: email, role: "admin" });
    if (!user) throw new Error("Credentials Not Valid");

    const isPasswordValid = await bcrypt.compare(password, user.password!);
    if (!isPasswordValid) throw new Error("Credentials Not Valid");
    const tokenData = {
      id: user._id.toString(),
      role: user.role,
      email: user.email,
    };
    const token = generateToken(tokenData);
    return { user, token };
  }
}
