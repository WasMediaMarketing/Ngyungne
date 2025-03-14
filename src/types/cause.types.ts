import { Types, Document } from "mongoose";

export interface ICauseInput {
  title: string;
  subtitle?: string;
  image: string;
  tags?: string[];
  raised?: number; // Default: 0
  goal: number;
  startDate: Date;
  endDate: Date;
  volunteers?: number; // Default: 0
  location: string;
  totalDonors?: number; // Default: 0
  longDescription?: string;
  objectives: string[];
  impact: string;
  isVisible?: boolean; // Default: true
  updates?: {
    date: Date;
    title: string;
    content: string;
    image?: string;
  }[];
  faq?: {
    question: string;
    answer: string;
  }[];
  gallery?: string[];
}

export interface ICauseUpdate {
  title?: string;
  subtitle?: string;
  image?: string;
  tags?: string[];
  raised?: number;
  goal?: number;
  startDate?: Date;
  endDate?: Date;
  volunteers?: number;
  location?: string;
  totalDonors?: number;
  longDescription?: string;
  objectives?: string[];
  impact?: string;
  isVisible?: boolean;
  updates?: {
    date: Date;
    title: string;
    content: string;
    image?: string;
  }[];
  faq?: {
    question: string;
    answer: string;
  }[];
  gallery?: string[];
}

// Full Cause Interface (For Database Representation)
export interface ICause extends Document {
  _id: Types.ObjectId;
  id: string;
  title: string;
  subtitle: string;
  image: string;
  tags: string[];
  raised: number;
  goal: number;
  startDate: Date;
  endDate: Date;
  volunteers: number;
  location: string;
  totalDonors: number;
  longDescription: string;
  objectives: string[];
  impact: string;
  isVisible: boolean;
  updates: {
    date: Date;
    title: string;
    content: string;
    image: string;
  }[];
  faq: {
    question: string;
    answer: string;
  }[];
  gallery: string[];
}
