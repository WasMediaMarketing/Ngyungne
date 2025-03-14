import { Document, Types } from "mongoose";

export interface IUserInput {
  name: string;
  email: string;
  phoneNumber: string;
  role?: "user" | "admin" | "donator" | "volunteer" | "event-participant";
  password?: string;
  address?: string;
  page?: string;
  pageTitle?: string;
  pageId?: string;
}

export interface IUserUpdate {
  name?: string;
  email?: string;
  phoneNumber?: string;
  role?: "user" | "admin" | "donator" | "volunteer" | "event-participant";
  password?: string;
  address?: string;
  page?: string;
  pageTitle?: string;
  jobPostId?: Types.ObjectId;
  pageId: string;
}

export interface IUser extends Document {
  _id: Types.ObjectId;
  id: string;
  name: string;
  email: string;
  phoneNumber: string;
  role: "user" | "admin" | "donator" | "volunteer";
  password?: string;
  address?: string;
  page: string;
  pageTitle: string;
  pageId?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface IUserLogin {
  user: IUser;
  token: string;
}
