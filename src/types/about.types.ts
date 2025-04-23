import type { Types } from "mongoose";

// Enums for content types
export enum ContentType {
  HISTORY = "HISTORY",
  PRACTICE = "PRACTICE",
  BENEFIT = "BENEFIT",
  STATISTIC = "STATISTIC",
}

// Interface for statistics shown on the about page
export interface IStatistic {
  _id?: Types.ObjectId | string;
  title: string;
  value: string;
  icon: string;
  description: string;
  order: number;
}

// Interface for history timeline items
export interface IHistoryItem {
  _id?: Types.ObjectId | string;
  title: string;
  content: string;
  period: string;
  order: number;
}

// Interface for practice elements (the orbiting items)
export interface IPracticeElement {
  _id?: Types.ObjectId | string;
  title: string;
  description: string;
  icon: string;
  order: number;
}

// Interface for benefit items
export interface IBenefitItem {
  _id?: Types.ObjectId | string;
  title: string;
  icon: string;
  category: string;
  points: string[];
  order: number;
}

// Interface for the hero section
export interface IHeroSection {
  _id?: Types.ObjectId | string;
  title: string;
  description: string;
  imageUrl: string;
}

// Interface for the about page content
export interface IAboutContent {
  _id?: Types.ObjectId | string;
  contentType: ContentType;
  data: IStatistic | IHistoryItem | IPracticeElement | IBenefitItem;
  isVisible: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

// Input interfaces for creating content
export interface IAboutContentInput {
  contentType: ContentType;
  data: IStatistic | IHistoryItem | IPracticeElement | IBenefitItem;
  isVisible?: boolean;
}

// Update interfaces
export interface IAboutContentUpdate extends Partial<IAboutContentInput> {}

// Service interface
export interface IAboutService {
  createContent(contentData: IAboutContentInput): Promise<IAboutContent>;
  getContent(
    contentType?: ContentType,
    isVisible?: boolean
  ): Promise<IAboutContent[]>;
  getContentById(contentId: Types.ObjectId): Promise<IAboutContent | null>;
  updateContent(
    contentId: Types.ObjectId,
    contentData: IAboutContentUpdate
  ): Promise<IAboutContent | null>;
  deleteContent(contentId: Types.ObjectId): Promise<IAboutContent | null>;
  updateHeroSection(
    heroData: Partial<IHeroSection>
  ): Promise<IHeroSection | null>;
  getHeroSection(): Promise<IHeroSection | null>;
}
