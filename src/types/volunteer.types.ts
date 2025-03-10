import { Document, Types } from "mongoose";
import { IUser, IUserInput } from "@/types";

export interface IVolunteerInput
  extends Pick<
    IUserInput,
    "name" | "email" | "phoneNumber" | "page" | "pageTitle"
  > {
  image: string;
  reason: string;
  socialLink: Record<string, string>;
}

export interface IVolunteerData extends Document {
  _id: Types.ObjectId;
  id: string;
  userId?: Types.ObjectId | IUser;
  image: string;
  socialLink: Record<string, string>;
  reason: string;
}
