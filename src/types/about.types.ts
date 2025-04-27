import type { Types } from "mongoose";

export enum ContentType {
  HISTORY = "history",
  PRACTICE = "practice",
  BENEFIT = "benefit",
  STATISTIC = "statistic",
  CTA = "cta",
}

export interface IAboutContentBase {
  title: string;
  description: string;
  contentType: ContentType;
  order?: number;
  isVisible?: boolean;
  icon?: string;
  data?: any;
}

export interface IAboutContent extends IAboutContentBase {
  _id: Types.ObjectId | string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface IAboutContentInput extends IAboutContentBase {}

export interface IAboutContentUpdate extends Partial<IAboutContentBase> {}

export interface IHeroSection {
  title: string;
  description: string;
  imageUrl: string;
  videoUrl?: string;
  buttonText?: string;
  buttonUrl?: string;
}

export interface IHistoryItem {
  _id?: Types.ObjectId | string; // Added _id property
  title: string;
  description: string;
  year?: string;
  order: number;
  isLeftSide?: boolean;
}

export interface IPracticeItem {
  _id?: Types.ObjectId | string; // Added _id property
  id: string;
  title: string;
  description: string;
  icon: string;
  order: number;
}

export interface IBenefitItem {
  _id?: Types.ObjectId | string; // Added _id property
  title: string;
  icon: string;
  items: string[];
  order: number;
}

export interface IStatistic {
  title: string;
  value: string;
  icon?: string;
  description?: string;
}

export interface ICTASection {
  title: string;
  description: string;
  primaryButtonText: string;
  primaryButtonUrl: string;
  secondaryButtonText?: string;
  secondaryButtonUrl?: string;
}
