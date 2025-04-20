import {
  IRegisterRetreatInput,
  IRegisterRetreatData,
  IRegisterRetreatUpdate,
} from "@/types";

export interface IRegisterRetreatService {
  createRegisterRetreat(
    registerRetreatData: IRegisterRetreatInput
  ): Promise<IRegisterRetreatData>;

  updateRegisterRetreat(
    registerRetreatId: string,
    registerRetreatData: IRegisterRetreatUpdate
  ): Promise<boolean>;

  getRegisterRetreats(
    registerRetreatId?: string
  ): Promise<IRegisterRetreatData[]>;

  deleteRegisterRetreat(registerRetreatId: string): Promise<boolean>;

  deleteRegisterRetreats(registerRetreatIds: string[]): Promise<boolean>;
}
