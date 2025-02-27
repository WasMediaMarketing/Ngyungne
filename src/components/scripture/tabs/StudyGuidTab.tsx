"use client";

import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  BookOpenText,
  Clock,
  MessageCircleQuestion,
  Lightbulb,
} from "lucide-react";
import type { Scripture } from "@/data/scripture";

interface StudyGuideTabProps {
  scripture: Scripture;
}

export default function StudyGuideTab({ scripture }: StudyGuideTabProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <h2 className="text-xl font-semibold text-crimson-700 mb-3 flex items-center gap-2">
        <BookOpenText className="h-5 w-5" />
        Study Guide
      </h2>
      <p className="text-maroon-700 mb-6 leading-relaxed">
        This guide offers approaches for deeper engagement with{" "}
        {scripture.title}, based on traditional Buddhist methods of text study.
      </p>

      <ReadingSchedule />
      <ReflectionQuestions />
      <PracticeSuggestions />
    </motion.div>
  );
}

function ReadingSchedule() {
  return (
    <div className="mb-8">
      <h3 className="text-lg font-medium text-crimson-700 mb-3 flex items-center gap-2">
        <Clock className="h-4 w-4" />
        Reading Schedule
      </h3>
      <div className="bg-white border border-amber-200 rounded-lg overflow-hidden">
        <div className="px-4 py-3 bg-amber-50 border-b border-amber-200">
          <h4 className="font-medium text-maroon-800">4-Week Study Plan</h4>
        </div>
        <div className="p-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <WeekPlan
              week="Week 1: Introduction"
              tasks={[
                "Read the historical background",
                "Study the first 5 verses",
                "Reflect on the tradition's context",
              ]}
            />
            <WeekPlan
              week="Week 2: Core Teachings"
              tasks={[
                "Study main doctrinal verses",
                "Research key terminology",
                "Compare with other Buddhist texts",
              ]}
            />
            <WeekPlan
              week="Week 3: Deeper Analysis"
              tasks={[
                "Explore traditional commentaries",
                "Consider different interpretations",
                "Practice meditation on key passages",
              ]}
            />
            <WeekPlan
              week="Week 4: Integration"
              tasks={[
                "Connect teachings to daily life",
                "Discuss with study partners",
                "Write reflections on transformative insights",
              ]}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

interface WeekPlanProps {
  week: string;
  tasks: string[];
}

function WeekPlan({ week, tasks }: WeekPlanProps) {
  return (
    <div className="border border-amber-100 rounded-md p-3">
      <h5 className="font-medium text-crimson-600 mb-2">{week}</h5>
      <ul className="text-sm text-maroon-700 space-y-1">
        {tasks.map((task, index) => (
          <li key={index}>• {task}</li>
        ))}
      </ul>
    </div>
  );
}

function ReflectionQuestions() {
  const questions = [
    {
      title: "Understanding the Text",
      items: [
        "What is the main teaching or purpose of this scripture?",
        "How does it relate to the Four Noble Truths?",
        "What metaphors or analogies are used, and what do they represent?",
        "How does this text define key Buddhist concepts?",
      ],
    },
    {
      title: "Personal Application",
      items: [
        "How might this teaching apply to challenges in your life?",
        "What obstacles prevent you from realizing these teachings?",
        "Which verse or passage resonates most strongly with you and why?",
        "How does this text change your understanding of suffering and its cessation?",
      ],
    },
    {
      title: "Contextual Analysis",
      items: [
        "How does this text fit within its historical and cultural context?",
        "How has the interpretation of this text evolved over time?",
        "How do different Buddhist schools approach this text?",
        "What cultural adaptations has this text undergone in different regions?",
      ],
    },
  ];

  return (
    <div className="mb-8">
      <h3 className="text-lg font-medium text-crimson-700 mb-3 flex items-center gap-2">
        <MessageCircleQuestion className="h-4 w-4" />
        Reflection Questions
      </h3>
      <Accordion type="multiple" className="w-full">
        {questions.map((section, index) => (
          <AccordionItem
            key={index}
            value={`question-section-${index}`}
            className="border-amber-200"
          >
            <AccordionTrigger className="text-crimson-600 hover:text-crimson-700 py-3">
              {section.title}
            </AccordionTrigger>
            <AccordionContent className="text-maroon-700">
              <ul className="space-y-2 pl-5 list-disc">
                {section.items.map((q, qIndex) => (
                  <li key={qIndex}>{q}</li>
                ))}
              </ul>
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  );
}

function PracticeSuggestions() {
  return (
    <div>
      <h3 className="text-lg font-medium text-crimson-700 mb-3 flex items-center gap-2">
        <Lightbulb className="h-4 w-4" />
        Practice Suggestions
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card className="bg-saffron-50 border-amber-200">
          <CardHeader className="pb-2">
            <CardTitle className="text-base text-crimson-700">
              Contemplative Reading
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-maroon-700">
              Read a short passage slowly, pausing between sentences. Allow its
              meaning to sink in before proceeding. After reading, sit quietly
              for 10-15 minutes, letting the teaching permeate your awareness.
            </p>
          </CardContent>
        </Card>
        <Card className="bg-saffron-50 border-amber-200">
          <CardHeader className="pb-2">
            <CardTitle className="text-base text-crimson-700">
              Analytical Meditation
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-maroon-700">
              Choose a key concept from the text. Reflect deeply on its meaning,
              examining it from various angles. Consider how it applies to your
              life and experience. Alternate between focused contemplation and
              open awareness.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
