import { Types, Document } from "mongoose";

export interface IRetreat extends Document {
  _id: Types.ObjectId;
  id: string;
  title: string;
  description: string;
  date: string;
  duration: string;
  location: string;
  participants: string;
  isVisible: boolean;
  price: string;
  type: string;
  schedule: Array<{ time: string; activity: string }>;
}

export interface IRetreatInput {
  title: string;
  description: string;
  date: string;
  duration: string;
  location: string;
  participants: string;
  isVisible?: boolean;
  price: string;
  type: string;
  schedule: Array<{ time: string; activity: string }>;
}

export interface IRetreatUpdate {
  title?: string;
  description?: string;
  date?: string;
  duration?: string;
  location?: string;
  participants?: string;
  price?: string;
  type?: string;
  isVisible?: boolean;
  schedule?: Array<{ time: string; activity: string }>;
}
