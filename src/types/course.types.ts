import { Types, Document } from "mongoose";

interface Module {
  title: string;
  lessons: string[];
}

export interface ICourse extends Document {
  _id: Types.ObjectId;
  id: string;
  title: string;
  description: string;
  overView: string;
  outcomes: string[];
  prerequisites: string;
  targetAudience: string;
  duration: string;
  lessons: number;
  level: string;
  featured: boolean;
  students: number;
  image: string;
  modules: Module[];
  instructor: {
    name: string;
    image: string;
    position: string;
    description: string;
  };
  isVisible: boolean;
}

export interface ICourseInput {
  title: string;
  description: string;
  overView: string;
  outcomes: string[];
  prerequisites: string;
  targetAudience: string;
  duration: string;
  lessons: number;
  level: string;
  featured: boolean;
  students?: number;
  image: string;
  modules: Module[];
  instructor: {
    name: string;
    image: string;
    position: string;
    description: string;
  };
  isVisible?: boolean;
}

export interface ICourseUpdate {
  title?: string;
  description?: string;
  overView?: string;
  outcomes?: string[];
  prerequisites?: string;
  targetAudience?: string;
  duration?: string;
  lessons?: number;
  level?: string;
  featured?: boolean;
  students?: number;
  image?: string;
  modules?: Module[];
  instructor?: {
    name: string;
    image: string;
    position: string;
    description: string;
  };
  isVisible?: boolean;
}
