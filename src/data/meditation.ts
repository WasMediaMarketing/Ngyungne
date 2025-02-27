import { Brain, Heart, Star } from "lucide-react";

// Define the MeditationTechnique type
export interface MeditationTechnique {
  id: string;
  title: string;
  description: string;
  duration: string;
  difficulty: string;
  participants: number;
  benefits: string[];
  steps: string[];
  icon: React.ElementType;
  color: string;
  badges: string[];
  rating: number;
  sessions: number;
  longDescription: string;
}

// Export the data so it can be used in both pages
export const meditationTechniques: MeditationTechnique[] = [
  {
    id: "mindfulness",
    title: "Mindfulness Meditation",
    description:
      "Focus on the present moment and observe your thoughts without judgment.",
    duration: "15 minutes",
    difficulty: "Beginner",
    participants: 1000,
    benefits: ["Stress reduction", "Improved focus", "Emotional regulation"],
    steps: [
      "Find a quiet and comfortable place to sit",
      "Close your eyes and take a few deep breaths",
      "Focus your attention on your breath",
      "When your mind wanders, gently bring it back to your breath",
      "Continue for the duration of the session",
    ],
    icon: Brain,
    color: "bg-blue-50 border-blue-200",
    badges: ["Popular", "Quick Practice"],
    rating: 4.8,
    sessions: 25642,
    longDescription:
      "Mindfulness meditation is about paying attention to the present moment, deliberately and non-judgmentally. This practice helps you become more aware of your thoughts and feelings without getting caught up in them. Regular mindfulness practice has been shown to reduce stress, improve concentration, and enhance overall well-being. It's perfect for beginners and can be practiced anywhere, anytime.",
  },
  {
    id: "loving-kindness",
    title: "Loving-Kindness Meditation",
    description:
      "Cultivate feelings of love and compassion for yourself and others.",
    duration: "20 minutes",
    difficulty: "Intermediate",
    participants: 750,
    benefits: [
      "Increased empathy",
      "Improved relationships",
      "Greater self-acceptance",
    ],
    steps: [
      "Sit comfortably and take a few deep breaths",
      "Bring to mind someone you care about deeply",
      "Silently repeat phrases of goodwill towards them",
      "Extend these feelings to yourself, then to others",
      "Gradually expand your circle of compassion",
    ],
    icon: Heart,
    color: "bg-rose-50 border-rose-200",
    badges: ["Emotional Health"],
    rating: 4.7,
    sessions: 18795,
    longDescription:
      "Loving-kindness meditation (Metta) is a practice designed to enhance feelings of kindness and compassion toward yourself and others. Through directed positive phrases and visualization, this technique gradually expands your capacity for empathy and goodwill. Research suggests regular practice can lead to increased positive emotions, reduced anxiety, and improved interpersonal relationships.",
  },
  {
    id: "zen",
    title: "Zen Meditation",
    description:
      "Practice seated meditation to achieve insight and presence of mind.",
    duration: "30 minutes",
    difficulty: "Advanced",
    participants: 500,
    benefits: [
      "Enhanced clarity",
      "Spiritual growth",
      "Improved concentration",
    ],
    steps: [
      "Assume a comfortable seated position",
      "Half-close your eyes and focus on a point",
      "Breathe naturally and count your breaths",
      "When thoughts arise, acknowledge them without judgment",
      "Return your focus to your breath and counting",
    ],
    icon: Star,
    color: "bg-emerald-50 border-emerald-200",
    badges: ["Spiritual", "Traditional"],
    rating: 4.9,
    sessions: 15320,
    longDescription:
      "Zen meditation (Zazen) is a traditional Buddhist practice focused on finding wisdom through seated meditation. The practice emphasizes posture, breath awareness, and observing thoughts without attachment. Zen meditation cultivates a disciplined mind, leading to insights about the nature of existence and consciousness. This advanced technique requires patience but offers profound benefits for mental clarity and spiritual understanding.",
  },
];
