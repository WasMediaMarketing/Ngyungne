// types/buddhist-event.ts

export type EventType = "teaching" | "practice" | "festival" | "moon";

export interface BuddhistEvent {
  id: string;
  date: Date;
  title: string;
  type: EventType;
  description: string;
  location?: string;
  time?: string;
  teacher?: string;
  traditions?: string[];
}
