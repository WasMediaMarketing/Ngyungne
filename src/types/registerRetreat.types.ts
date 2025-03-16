import { Document, Types } from "mongoose";
import { IUser, IRetreat, IUserInput } from "@/types";

export interface IRegisterRetreatInput
  extends Pick<
    IUserInput,
    "name" | "email" | "phoneNumber" | "page" | "pageTitle" | "address"
  > {
  retreatId: Types.ObjectId;
  MeditationExperience: string;
  dietaryRestriction?: string;
  specialRequest?: string;
  accomodationType: string;
  emergencyContactName: string;
  emergencyContactNumber: string;
}

export interface IRegisterRetreatUpdate {
  MeditationExperience?: string;
  dietaryRestriction?: string;
  specialRequest?: string;
  accomodationType?: string;
  emergencyContactName?: string;
  emergencyContactNumber?: string;
}

export interface IRegisterRetreatData extends Document {
  _id: Types.ObjectId;
  id: string;
  userId: Types.ObjectId | IUser;
  retreatId: Types.ObjectId | IRetreat;
  MeditationExperience: string;
  dietaryRestriction?: string;
  specialRequest?: string;
  accomodationType: string;
  emergencyContactName: string;
  emergencyContactNumber: string;
  createdAt?: Date;
  updatedAt?: Date;
}
