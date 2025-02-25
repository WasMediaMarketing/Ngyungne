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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const philosophyTopics = [
  {
    title: "The Four Noble Truths",
    description:
      "Understanding suffering, its origin, cessation, and the path to its cessation.",
    content:
      "The Four Noble Truths are the foundation of Buddhist philosophy...",
  },
  {
    title: "The Eightfold Path",
    description:
      "A practical guideline for ethical and mental development to end suffering.",
    content:
      "The Eightfold Path consists of right view, right resolve, right speech...",
  },
  {
    title: "Karma and Rebirth",
    description:
      "The law of moral causation and its effects on the cycle of rebirth.",
    content: "Karma is the law that every cause has an effect. Our actions...",
  },
];

export default function BuddhistPhilosophy() {
  return (
    <div className="container mx-auto px-4 py-8">
      <Breadcrumbs />
      <motion.h1
        className="text-4xl font-bold mb-6 text-crimson-800"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        Buddhist Philosophy
      </motion.h1>
      <motion.p
        className="text-xl mb-8 text-maroon-700"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        Explore the fundamental concepts and teachings of Buddhism.
      </motion.p>
      <Tabs defaultValue="four-noble-truths" className="w-full">
        <TabsList className="grid w-full grid-cols-3 bg-saffron-100">
          {philosophyTopics.map((topic, index) => (
            <TabsTrigger
              key={index}
              value={topic.title.toLowerCase().replace(/\s+/g, "-")}
              className="data-[state=active]:bg-saffron-300 data-[state=active]:text-crimson-800"
            >
              {topic.title}
            </TabsTrigger>
          ))}
        </TabsList>
        {philosophyTopics.map((topic, index) => (
          <TabsContent
            key={index}
            value={topic.title.toLowerCase().replace(/\s+/g, "-")}
          >
            <Card className="bg-saffron-50 border-saffron-200">
              <CardHeader>
                <CardTitle className="text-2xl text-crimson-700">
                  {topic.title}
                </CardTitle>
                <CardDescription className="text-maroon-600">
                  {topic.description}
                </CardDescription>
              </CardHeader>
              <CardContent className="text-maroon-800">
                <p>{topic.content}</p>
              </CardContent>
            </Card>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}
