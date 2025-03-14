import { Document, Types } from "mongoose";
import { IEvent, IUser, IUserInput } from "@/types";

export interface IBookEventInput
  extends Pick<
    IUserInput,
    "name" | "email" | "phoneNumber" | "page" | "pageTitle"
  > {
  TicketNumber: number;
  eventId: Types.ObjectId;
  dietaryRequirements?: string;
  specialAccomodation?: string;
}

export interface IBookEventupdate {
  TicketNumber?: number;
  dietaryRequirements?: string;
  specialAccomodation?: string;
}

export interface IBookEventData extends Document {
  _id: Types.ObjectId;
  id: string;
  userId: Types.ObjectId | IUser;
  eventId: Types.ObjectId | IEvent;
  TicketNumber: number;
  dietaryRequirements?: string;
  specialAccomodation?: string;
}
