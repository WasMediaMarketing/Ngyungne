import { Types } from "mongoose";

// Interface for the instructor
export interface IInstructor {
  name: string;
  bio?: string;
  image?: string;
}

// Base interface for meditation
export interface IMeditationBase {
  title: string;
  description: string;
  longDescription?: string;
  duration: number;
  category: string;
  difficulty?: "Beginner" | "Intermediate" | "Advanced";
  instructor: IInstructor;
  steps?: string[];
  benefits?: string[];
  image?: string;
  audioFile?: string;
  tags?: string[];
  isVisible?: boolean;
  views?: number;
  favorites?: number;
  sessions?: number;
  relatedMeditations?: Types.ObjectId[] | string[];
}

// Interface for meditation document (with _id and timestamps)
export interface IMeditation extends IMeditationBase {
  _id: Types.ObjectId | string;
  createdAt?: Date;
  updatedAt?: Date;
}

// Interface for creating a new meditation
export interface IMeditationInput extends IMeditationBase {}

// Interface for updating an existing meditation
export interface IMeditationUpdate extends Partial<IMeditationBase> {}

// Interface for meditation service
export interface IMeditationService {
  createMeditation(meditationData: IMeditationInput): Promise<IMeditation>;
  getMeditations(isVisible?: boolean): Promise<IMeditation[]>;
  getMeditationById(meditationId: Types.ObjectId): Promise<IMeditation | null>;
  updateMeditation(
    meditationId: Types.ObjectId,
    meditationData: IMeditationUpdate
  ): Promise<IMeditation | null>;
  deleteMeditation(meditationId: Types.ObjectId): Promise<IMeditation | null>;
  deleteMeditations(meditationIds: Types.ObjectId[]): Promise<unknown>;
  incrementViews(meditationId: Types.ObjectId): Promise<IMeditation | null>;
}
