import { Document, Types } from "mongoose";
import { IUser, IUserInput } from "@/types";

export interface IContactInput
  extends Pick<
    IUserInput,
    "name" | "email" | "phoneNumber" | "page" | "pageTitle"
  > {
  message: string;
  subject: string;
}

export interface IContactData extends Document {
  _id: Types.ObjectId;
  id: string;
  userId?: Types.ObjectId | IUser;
  subject: string;
  message: string;
}
