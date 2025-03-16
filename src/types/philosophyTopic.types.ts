import { Document, Types } from "mongoose";

export interface Quote {
  text: string;
  author: string;
}

export interface ScheduleItem {
  title?: string;
  description?: string;
}

export interface IPhilosophyTopicInput {
  title: string;
  icon: string;
  description: string;
  content: string;
  quotes?: Quote[];
  practices?: string[];
  isVisible?: boolean;
}

export interface IPhilosophyTopicUpdate {
  title?: string;
  icon?: string;
  description?: string;
  content?: string;
  quotes?: Quote[];
  practices?: string[];
  isVisible?: boolean;
}

export interface IPhilosophyTopic extends Document {
  _id: Types.ObjectId;
  id: string;
  title: string;
  icon: string;
  description: string;
  content: string;
  quotes: [
    {
      text: string;
      author: string;
    }
  ];
  isVisible: boolean;
  practices: string[];
}
