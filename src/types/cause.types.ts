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
  about?: { longDescription: string; objectives: string[] };
  impact: string;
  isVisible?: boolean; // Default: true
  updates?: string;
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
  goal?: number;
  startDate?: Date;
  endDate?: Date;
  location?: string;
  about?: { longDescription: string; objectives: string[] };
  impact?: string;
  isVisible?: boolean;
  updates?: string;
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
  about: { longDescription: string; objectives: string[] };
  impact: string;
  isVisible: boolean;
  updates: string;
  faq: {
    question: string;
    answer: string;
  }[];
  gallery: string[];
}
