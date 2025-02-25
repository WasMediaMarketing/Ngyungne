"use client";

import { motion } from "framer-motion";
import { Breadcrumbs } from "@/components/breadcrumbs";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PlayCircle, Clock, BarChart, Users } from "lucide-react";

const meditationTechniques = [
  {
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
  },
  {
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
  },
  {
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
  },
];

export default function Meditation() {
  return (
    <div className="container mx-auto px-4 py-8">
      <Breadcrumbs />
      <motion.h1
        className="text-4xl font-bold mb-6 text-crimson-800"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        Meditation
      </motion.h1>
      <motion.p
        className="text-xl mb-8 text-maroon-700"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        Discover guided meditation sessions and techniques to enhance your
        practice.
      </motion.p>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {meditationTechniques.map((technique, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
          >
            <Card className="bg-saffron-50 border-saffron-200 h-full flex flex-col">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-2xl text-crimson-700">
                      {technique.title}
                    </CardTitle>
                    <CardDescription className="text-maroon-600 mt-1">
                      {technique.description}
                    </CardDescription>
                  </div>
                  <Badge
                    variant="secondary"
                    className="bg-saffron-200 text-crimson-700"
                  >
                    {technique.difficulty}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="flex-grow">
                <Tabs defaultValue="overview" className="w-full">
                  <TabsList className="grid w-full grid-cols-2 bg-saffron-100">
                    <TabsTrigger
                      value="overview"
                      className="data-[state=active]:bg-saffron-300 data-[state=active]:text-crimson-800"
                    >
                      Overview
                    </TabsTrigger>
                    <TabsTrigger
                      value="steps"
                      className="data-[state=active]:bg-saffron-300 data-[state=active]:text-crimson-800"
                    >
                      Steps
                    </TabsTrigger>
                  </TabsList>
                  <TabsContent value="overview">
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center text-maroon-800">
                          <Clock className="mr-2 h-4 w-4" />
                          Duration: {technique.duration}
                        </div>
                        <div className="flex items-center text-maroon-800">
                          <Users className="mr-2 h-4 w-4" />
                          {technique.participants} participants
                        </div>
                      </div>
                      <div>
                        <h4 className="font-semibold text-maroon-800 mb-2">
                          Benefits:
                        </h4>
                        <ul className="list-disc list-inside text-maroon-700">
                          {technique.benefits.map((benefit, i) => (
                            <li key={i}>{benefit}</li>
                          ))}
                        </ul>
                      </div>
                      <div>
                        <h4 className="font-semibold text-maroon-800 mb-2">
                          Popularity:
                        </h4>
                        <Progress
                          value={technique.participants / 10}
                          className="h-2 bg-saffron-200"
                        />
                      </div>
                    </div>
                  </TabsContent>
                  <TabsContent value="steps">
                    <ol className="list-decimal list-inside space-y-2 text-maroon-700">
                      {technique.steps.map((step, i) => (
                        <li key={i}>{step}</li>
                      ))}
                    </ol>
                  </TabsContent>
                </Tabs>
              </CardContent>
              <CardContent>
                <Button className="w-full bg-crimson-600 hover:bg-crimson-700 text-white mt-4">
                  <PlayCircle className="mr-2 h-4 w-4" /> Start Meditation
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
