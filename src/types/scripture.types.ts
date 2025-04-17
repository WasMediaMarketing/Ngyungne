import { Document, Types } from "mongoose";

// Verse interface representing each verse in a scripture
export interface Verse {
  number: number;
  chapter: string;
  text: string;
  commentary: string;
}

// Timeline event interface to represent individual events in the historical timeline
export interface TimelineEvent {
  date: string;
  event: string;
}

// Geographic origin interface to represent information about the geographic origin of the scripture
export interface GeographicOrigin {
  description: string;
  regions: string[];
  map: string; // A reference to an image or a map URL
}

// Scripture interface representing the structure of each scripture document
export interface Scripture extends Document {
  _id: Types.ObjectId;
  id: string;
  title: string;
  tradition: string;
  period: string;
  language: string;
  description: string;
  overview: string;
  verses: Verse[];
  significance: string;
  historicalContext: {
    description: string;
    timeline: TimelineEvent[];
    geographicOrigins: GeographicOrigin[];
  };
}
