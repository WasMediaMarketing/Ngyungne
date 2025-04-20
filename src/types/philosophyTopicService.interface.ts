import { Types } from "mongoose";
import {
  IPhilosophyTopic,
  IPhilosophyTopicInput,
  IPhilosophyTopicUpdate,
} from "@/types";

export interface IPhilosophyTopicService {
  createPhilosophyTopic(
    philosophyTopicData: IPhilosophyTopicInput
  ): Promise<IPhilosophyTopic>;

  getPhilosophyTopics(isVisible?: boolean): Promise<IPhilosophyTopic[]>;

  getPhilosophyTopicById(
    philosophyTopicId: Types.ObjectId
  ): Promise<IPhilosophyTopic | null>;

  updatePhilosophyTopic(
    philosophyTopicId: Types.ObjectId,
    philosophyTopicData: IPhilosophyTopicUpdate
  ): Promise<IPhilosophyTopic | null>;

  deletePhilosophyTopic(
    philosophyTopicId: Types.ObjectId
  ): Promise<IPhilosophyTopic | null>;

  deletePhilosophyTopics(
    philosophyTopicIds: Types.ObjectId[]
  ): Promise<unknown>;
}
