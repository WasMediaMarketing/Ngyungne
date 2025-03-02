export interface BuddhistEvent {
  id: string;
  date: Date;
  title: string;
  type: "teaching" | "practice" | "festival" | "moon";
  description: string;
  location?: string;
  time?: string;
  teacher?: string;
  traditions?: string[];
}
