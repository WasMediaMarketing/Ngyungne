import { Types, Document } from "mongoose";

// Verse interface
export interface IVerse {
  number: number;
  chapter: string;
  text: string;
  commentary?: string;
}

// Scripture interface
export interface IScripture extends Document {
  _id: Types.ObjectId;
  id: string;
  title: string;
  tradition: string;
  period: string;
  language: string;
  description: string;
  overview: string;
  verses: IVerse[];
  significance?: string;
  historicalContext?: string;
  image?: string;
  isVisible: boolean;
  views: number;
  createdAt?: Date;
  updatedAt?: Date;
}

// Scripture input interface for creation
export interface IScriptureInput {
  title: string;
  tradition: string;
  period: string;
  language: string;
  description: string;
  overview: string;
  verses: IVerse[];
  significance?: string;
  historicalContext?: string;
  image?: string;
  isVisible?: boolean;
  views?: number;
}

// Scripture update interface
export interface IScriptureUpdate {
  title?: string;
  tradition?: string;
  period?: string;
  language?: string;
  description?: string;
  overview?: string;
  verses?: IVerse[];
  significance?: string;
  historicalContext?: string;
  image?: string;
  isVisible?: boolean;
  views?: number;
}

// Scripture service interface
export interface IScriptureService {
  createScripture(scriptureData: IScriptureInput): Promise<IScripture>;
  getScriptures(isVisible?: boolean): Promise<IScripture[]>;
  getScriptureById(scriptureId: Types.ObjectId): Promise<IScripture | null>;
  updateScripture(
    scriptureId: Types.ObjectId,
    scriptureData: IScriptureUpdate
  ): Promise<IScripture | null>;
  deleteScripture(scriptureId: Types.ObjectId): Promise<IScripture | null>;
  deleteScriptures(scriptureIds: Types.ObjectId[]): Promise<unknown>;
}
