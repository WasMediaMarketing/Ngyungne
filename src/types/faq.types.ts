import type { Types } from "mongoose";

// Add these to your existing types/index.ts file

export interface IFaq {
  _id?: Types.ObjectId;
  question: string;
  answer: string;
  category?: string;
  isVisible?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}
