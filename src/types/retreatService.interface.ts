import { Types } from "mongoose";
import { IRetreatInput, IRetreatUpdate, IRetreat } from "@/types";

export interface IRetreatService {
  createRetreat(retreatData: IRetreatInput): Promise<IRetreat>;
  getRetreats(isVisible?: boolean): Promise<IRetreat[]>;
  getRetreatById(retreatId: Types.ObjectId): Promise<IRetreat | null>;
  updateRetreat(
    retreatId: Types.ObjectId,
    retreatData: IRetreatUpdate
  ): Promise<IRetreat | null>;
  deleteRetreat(retreatId: Types.ObjectId): Promise<IRetreat | null>;
  deleteRetreats(retreatIds: Types.ObjectId[]): Promise<unknown>;
}
