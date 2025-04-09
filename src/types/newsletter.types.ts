import type { Types } from "mongoose";

/**
 * Interface for the Newsletter document
 */
export interface INewsletter {
  _id?: Types.ObjectId;
  email: string;
  createdAt?: Date;
  updatedAt?: Date;
}
