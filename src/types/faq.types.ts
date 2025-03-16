import { Types, Document } from "mongoose";

export interface IFaq extends Document {
  _id: Types.ObjectId;
  id: string;
  question: string;
  answer: string;
  updateAt: Date;
  createdAt: Date;
}
export interface IFaqInput {
  question: string;
  answer: string;
}
export interface IFaqUpdate {
  question?: string;
  answer?: string;
}
