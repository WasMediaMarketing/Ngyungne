import { Types, Document } from "mongoose";

export interface IEventInput {
  title: string;
  description: string;
  type: string;
  date: Date;
  time: string;
  location: string;
  teacher: string;
  image?: string;
  tags?: string[];
  featured?: boolean;
  attending?: number;
  capacity?: number;
}

export interface IEventUpdate {
  title?: string;
  description?: string;
  type?: string;
  date?: Date;
  time?: string;
  location?: string;
  teacher?: string;
  image?: string;
  tags?: string[];
  featured?: boolean;
  attending?: number;
  capacity?: number;
}

export interface IEvent extends Document {
  _id: Types.ObjectId;
  id: Types.ObjectId;
  title: string;
  description: string;
  type: string;
  date: Date;
  time: string;
  location: string;
  teacher: string;
  image?: string;
  tags?: string[];
  featured?: boolean;
  attending?: number;
  capacity?: number;
}
