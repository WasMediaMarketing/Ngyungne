import { Types, Document } from "mongoose";

// ScheduleItem interface for the title and description
export interface ScheduleItem {
  title?: string;
  description?: string;
}

interface TeacherInput {
  name: string;
  speciality?: string;
  description?: string;
  image?: string;
  link?: string;
  credentials?: string[];
}

interface TeacherUpdate {
  name?: string;
  speciality?: string;
  description?: string;
  image?: string;
  link?: string;
  credentials?: string[];
}

// The schedule can be an object of key-value pairs
export interface IEventInput {
  title: string;
  description: string;
  type: string;
  date: Date;
  time: string;
  location: string;
  teacher: TeacherInput;
  isVisible?:boolean;
  image?: string;
  tags?: string[];
  featured?: boolean;
  attending?: number;
  capacity: number;
  schedule?: { [key: string]: ScheduleItem }; // schedule added here
}

export interface IEventUpdate {
  title?: string;
  description?: string;
  type?: string;
  date?: Date;
  time?: string;
  location?: string;
  teacher?: TeacherUpdate;
  image?: string;
  tags?: string[];
  featured?: boolean;
  isVisible?:boolean;
  attending?: number;
  capacity?: number;
  schedule?: { [key: string]: ScheduleItem }; // schedule added here
}

export interface IEvent extends Document {
  _id: Types.ObjectId;
  id: Types.ObjectId;
  title: string;
  description: string;
  type: string;
  date: Date;
  time: string;
  location: string;
  teacher: TeacherInput;
  image?: string;
  tags?: string[];
  featured?: boolean;
  isVisible:boolean;
  attending?: number;
  capacity: number;
  availableTickets: number;
  schedule?: { [key: string]: ScheduleItem }; // schedule added here
}
