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
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";

const faqItems = [
  {
    question: "What is Buddhism?",
    answer:
      "Buddhism is a path of practice and spiritual development leading to Insight into the true nature of reality. Buddhist practices like meditation are means of changing yourself in order to develop the qualities of awareness, kindness, and wisdom.",
  },
  {
    question: "How do I start practicing Buddhism?",
    answer:
      "To start practicing Buddhism, you can begin by learning about the Four Noble Truths and the Eightfold Path. Start a daily meditation practice, even if it's just for a few minutes each day. Read Buddhist texts and attend teachings at a local Buddhist center if possible.",
  },
  {
    question: "What is meditation in Buddhism?",
    answer:
      "Meditation in Buddhism is a mental and physical course of action that a person uses to separate themselves from their thoughts and feelings in order to become fully aware. It plays a crucial role in Buddhism as it is one of the key practices to achieve enlightenment.",
  },
  {
    question: "What are the Four Noble Truths?",
    answer:
      "The Four Noble Truths are the foundational principles of Buddhist teaching. They are: 1) The truth of suffering (dukkha), 2) The truth of the cause of suffering (samudaya), 3) The truth of the end of suffering (nirodha), and 4) The truth of the path that leads to the end of suffering (magga).",
  },
  {
    question: "What is karma?",
    answer:
      "Karma in Buddhism refers to the law of cause and effect. It states that our actions have consequences, and these consequences can manifest in our current life or in future lives. Good actions tend to bring positive results, while harmful actions tend to bring negative results.",
  },
];

export default function FAQ() {
  return (
    <div className="container mx-auto px-4 py-8">
      <Breadcrumbs />
      <motion.h1
        className="text-4xl font-bold mb-6 text-crimson-800"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        Frequently Asked Questions
      </motion.h1>
      <motion.p
        className="text-xl mb-8 text-maroon-700"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        Find answers to common questions about Buddhist practices and our
        programs.
      </motion.p>
      <motion.div
        className="mb-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
      >
        <Card className="bg-saffron-50 border-saffron-200">
          <CardHeader>
            <CardTitle className="text-2xl text-crimson-700">
              Search FAQs
            </CardTitle>
            <CardDescription className="text-maroon-600">
              Can't find what you're looking for? Try searching our FAQ
              database.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex space-x-2">
              <Input
                placeholder="Search for a question..."
                className="flex-grow"
              />
              <Button className="bg-crimson-600 hover:bg-crimson-700 text-white">
                <Search className="mr-2 h-4 w-4" /> Search
              </Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
      >
        <Accordion type="single" collapsible className="w-full">
          {faqItems.map((item, index) => (
            <AccordionItem key={index} value={`item-${index}`}>
              <AccordionTrigger className="text-lg text-crimson-700 hover:text-crimson-800">
                {item.question}
              </AccordionTrigger>
              <AccordionContent className="text-maroon-700">
                {item.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </motion.div>
    </div>
  );
}
