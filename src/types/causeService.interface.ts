import { Types } from "mongoose";
import { ICauseInput, ICauseUpdate, ICause } from "@/types";

export interface ICauseService {
  createCause(causeData: ICauseInput): Promise<ICause>;
  getCauses(isVisible?: boolean): Promise<ICause[]>;
  getCauseById(causeId: Types.ObjectId): Promise<ICause | null>;
  updateCause(
    causeId: Types.ObjectId,
    causeData: ICauseUpdate
  ): Promise<ICause | null>;
  deleteCause(causeId: Types.ObjectId): Promise<ICause | null>;
  deleteCauses(causeIds: Types.ObjectId[]): Promise<unknown>;
}
