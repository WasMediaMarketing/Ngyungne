import { Document, Types } from "mongoose";
import { IUser, IUserInput } from "@/types";

export interface IDonationInput
  extends Pick<
    IUserInput,
    "name" | "email" | "phoneNumber" | "page" | "pageTitle"
  > {
  amount: number;
  screenshot: string;
  donationType: string;
  donationMethod: string;
}

export interface IDonationData extends Document {
  _id: Types.ObjectId;
  id: string;
  userId?: Types.ObjectId | IUser;
  amount: number;
  screenshot: string;
  donationType: string;
  donationMethod: string;
}
