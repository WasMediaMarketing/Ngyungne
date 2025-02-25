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
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const scriptures = [
  {
    title: "The Dhammapada",
    description: "A collection of sayings of the Buddha in verse form.",
    verses: [
      {
        number: 1,
        text: "All mental phenomena have mind as their forerunner, mind as their chief, and are mind-made...",
      },
      {
        number: 2,
        text: "Hatred never ceases through hatred in this world; through love alone they cease...",
      },
      // Add more verses as needed
    ],
  },
  {
    title: "The Heart Sutra",
    description: "One of the most popular sutras in Mahayana Buddhism.",
    verses: [
      {
        number: 1,
        text: "Form is emptiness, emptiness is form. Form is not other than emptiness, emptiness is not other than form...",
      },
      // Add more verses as needed
    ],
  },
  {
    title: "The Diamond Sutra",
    description:
      "A Mahayana sutra that teaches the practice of non-abiding and non-attachment.",
    verses: [
      {
        number: 1,
        text: "Thus have I heard. At one time the Buddha was staying in the Jeta Grove...",
      },
      // Add more verses as needed
    ],
  },
];

export default function Scriptures() {
  return (
    <div className="container mx-auto px-4 py-8">
      <Breadcrumbs />
      <motion.h1
        className="text-4xl font-bold mb-6 text-crimson-800"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        Scriptures
      </motion.h1>
      <motion.p
        className="text-xl mb-8 text-maroon-700"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        Study Buddhist texts and commentaries to deepen your understanding.
      </motion.p>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {scriptures.map((scripture, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
          >
            <Card className="bg-saffron-50 border-saffron-200 h-full flex flex-col">
              <CardHeader>
                <CardTitle className="text-2xl text-crimson-700">
                  {scripture.title}
                </CardTitle>
                <CardDescription className="text-maroon-600">
                  {scripture.description}
                </CardDescription>
              </CardHeader>
              <CardContent className="flex-grow">
                <Accordion type="single" collapsible className="w-full">
                  {scripture.verses.map((verse, verseIndex) => (
                    <AccordionItem
                      key={verseIndex}
                      value={`verse-${verseIndex}`}
                    >
                      <AccordionTrigger className="text-crimson-600 hover:text-crimson-700">
                        Verse {verse.number}
                      </AccordionTrigger>
                      <AccordionContent className="text-maroon-800">
                        {verse.text}
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
