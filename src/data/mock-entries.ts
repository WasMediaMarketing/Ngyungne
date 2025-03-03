import { JournalEntry } from "@/types/practice-journal";

export const mockEntries: JournalEntry[] = [
  {
    id: "1",
    date: "2024-02-25",
    type: "Meditation",
    duration: 30,
    notes:
      "Morning meditation session. Focused on breath awareness. Found it difficult to maintain focus for the first ten minutes, but gradually settled into a more stable awareness. Noticed tension in my shoulders that I was able to release.",
    mood: 4,
    insights: [
      "Noticed patterns of distraction",
      "Body scan helped with focus",
    ],
  },
  {
    id: "2",
    date: "2024-02-24",
    type: "Scripture Study",
    duration: 45,
    notes:
      "Read the Heart Sutra and reflected on emptiness. Interesting insights on the nature of form. Beginning to understand the concept of emptiness not as nihilism but as interdependence.",
    mood: 5,
    insights: ["Form is emptiness", "Emptiness is form", "Interdependence"],
  },
  {
    id: "3",
    date: "2024-02-23",
    type: "Mantra Recitation",
    duration: 20,
    notes:
      "Recited Om Mani Padme Hum 108 times. Felt very centered afterward. The rhythm helped calm my mind, and I noticed a warm feeling in my chest.",
    mood: 3,
    insights: [
      "Rhythm creates stability",
      "Physical sensations during practice",
    ],
  },
  {
    id: "4",
    date: "2024-02-22",
    type: "Prostrations",
    duration: 15,
    notes:
      "Did 21 prostrations before morning meditation. Felt energized and humble. The physical aspect helped ground my practice.",
    mood: 4,
  },
  {
    id: "5",
    date: "2024-02-21",
    type: "Prayer",
    duration: 25,
    notes:
      "Evening prayer session focusing on gratitude. Listed five things I'm grateful for and held them in my heart.",
    mood: 5,
    insights: ["Gratitude amplifies joy", "Connection to all beings"],
  },
];
