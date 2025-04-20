import { IUser, IUserInput, IUserUpdate, IUserLogin } from "@/types";

export interface IUserService {
  createUser(userData: IUserInput): Promise<IUser>;
  loginUser(email: string, password: string): Promise<IUserLogin>;
  getUsers(): Promise<IUser[]>;
  getUserById(userId: string): Promise<IUser | null>;
  updateUser(userId: string, userData: IUserUpdate): Promise<IUser | null>;
  deleteUsers(userIds: string[]): Promise<unknown>;
  deleteUser(userId: string): Promise<IUser | null>;
}
