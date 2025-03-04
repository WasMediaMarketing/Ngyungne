"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Breadcrumbs } from "@/components/breadcrumbs";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  PlayCircle,
  Clock,
  Users,
  Heart,
  Brain,
  Star,
  Calendar,
  ArrowRight,
} from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetFooter,
} from "@/components/ui/sheet";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useRouter } from "next/navigation";

// Define the MeditationTechnique type
interface MeditationTechnique {
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

// Export the data so it can be used in the detail page
export const meditationTechniques: MeditationTechnique[] = [
  {
    id: "1",
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
    id: "2",
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
    id: "3",
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

export default function Meditation() {
  const [selectedTechnique, setSelectedTechnique] =
    useState<MeditationTechnique | null>(null);
  const router = useRouter();

  const handleViewDetails = (technique: MeditationTechnique) => {
    router.push(`/teachings/meditation/${technique.id}`);
  };

  return (
    <div className="container mx-auto px-4 py-8 bg-gradient-to-br from-amber-50 to-white min-h-screen">
      <Breadcrumbs />
      <motion.div
        className="text-center mb-12"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <h1 className="text-5xl font-bold mb-4 text-amber-900 bg-clip-text text-transparent bg-gradient-to-r from-amber-700 to-rose-700">
          Meditation Journey
        </h1>
        <p className="text-xl mb-6 text-amber-800 max-w-2xl mx-auto">
          Discover guided meditation sessions and techniques to cultivate
          mindfulness, reduce stress, and enhance your well-being.
        </p>
        <div className="flex justify-center space-x-4 mb-8">
          <Button className="bg-amber-600 hover:bg-amber-700 text-white">
            <Calendar className="mr-2 h-4 w-4" /> Schedule Session
          </Button>
          <Button
            variant="outline"
            className="border-amber-600 text-amber-700 hover:bg-amber-100"
          >
            <Users className="mr-2 h-4 w-4" /> Join Group Meditation
          </Button>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {meditationTechniques.map((technique, index) => {
          const IconComponent = technique.icon;
          return (
            <motion.div
              key={technique.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Card
                className={`h-full flex flex-col shadow-lg hover:shadow-xl transition-shadow ${technique.color}`}
              >
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div className="flex items-center">
                      <div className="mr-3 p-2 rounded-full bg-white/80">
                        <IconComponent className="h-6 w-6 text-amber-700" />
                      </div>
                      <div>
                        <CardTitle className="text-2xl text-amber-900">
                          {technique.title}
                        </CardTitle>
                        <CardDescription className="text-amber-800 mt-1">
                          {technique.description}
                        </CardDescription>
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-2 mt-2">
                    <Badge
                      variant="secondary"
                      className="bg-amber-200 text-amber-800"
                    >
                      {technique.difficulty}
                    </Badge>
                    {technique.badges.map((badge, i) => (
                      <Badge
                        key={i}
                        variant="outline"
                        className="border-amber-400 text-amber-700"
                      >
                        {badge}
                      </Badge>
                    ))}
                  </div>
                </CardHeader>
                <CardContent className="flex-grow">
                  <Tabs defaultValue="overview" className="w-full">
                    <TabsList className="grid w-full grid-cols-2 bg-white/50">
                      <TabsTrigger
                        value="overview"
                        className="data-[state=active]:bg-amber-300 data-[state=active]:text-amber-900"
                      >
                        Overview
                      </TabsTrigger>
                      <TabsTrigger
                        value="steps"
                        className="data-[state=active]:bg-amber-300 data-[state=active]:text-amber-900"
                      >
                        Steps
                      </TabsTrigger>
                    </TabsList>
                    <TabsContent value="overview">
                      <div className="space-y-4">
                        <div className="flex justify-between items-center">
                          <div className="flex items-center text-amber-800">
                            <Clock className="mr-2 h-4 w-4" />
                            {technique.duration}
                          </div>
                          <div className="flex items-center text-amber-800">
                            <Star className="mr-1 h-4 w-4 fill-amber-500 text-amber-500" />
                            <span>{technique.rating}</span>
                          </div>
                        </div>
                        <div className="flex items-center text-amber-800 text-sm">
                          <Users className="mr-2 h-4 w-4" />
                          {technique.sessions.toLocaleString()} sessions
                          completed
                        </div>
                        <div>
                          <h4 className="font-semibold text-amber-800 mb-2">
                            Benefits:
                          </h4>
                          <ul className="space-y-1">
                            {technique.benefits.map((benefit, i) => (
                              <li
                                key={i}
                                className="flex items-center text-amber-700"
                              >
                                <div className="rounded-full bg-amber-200 p-1 mr-2">
                                  <ArrowRight className="h-3 w-3 text-amber-700" />
                                </div>
                                {benefit}
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </TabsContent>
                    <TabsContent value="steps" className="space-y-2 py-2">
                      {technique.steps.map((step, i) => (
                        <div key={i} className="flex items-start">
                          <div className="bg-amber-200 text-amber-800 rounded-full w-6 h-6 flex items-center justify-center mr-3 mt-0.5 flex-shrink-0">
                            {i + 1}
                          </div>
                          <p className="text-amber-700">{step}</p>
                        </div>
                      ))}
                    </TabsContent>
                  </Tabs>
                </CardContent>
                <CardFooter className="pt-0">
                  <div className="w-full space-y-2">
                    <Button
                      className="w-full bg-amber-600 hover:bg-amber-700 text-white"
                      onClick={() => setSelectedTechnique(technique)}
                    >
                      <PlayCircle className="mr-2 h-4 w-4" /> Start Meditation
                    </Button>

                    <Button
                      variant="outline"
                      className="w-full border-amber-600 text-amber-700 hover:bg-amber-100"
                      onClick={() => handleViewDetails(technique)}
                    >
                      View Details
                    </Button>
                  </div>
                </CardFooter>
              </Card>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
