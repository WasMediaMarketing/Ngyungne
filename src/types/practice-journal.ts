export interface JournalEntry {
  id: string;
  date: string;
  type: string;
  duration: number;
  notes: string;
  mood: number;
  insights?: string[];
}

export interface PracticeType {
  value: string;
  icon: string;
  color: string;
}

export interface Stats {
  totalSessions: number;
  totalMinutes: number;
  currentStreak: number;
  practiceTypeCounts: Record<string, number>;
  avgMood: string;
  weeklyPracticeTime: number;
}
