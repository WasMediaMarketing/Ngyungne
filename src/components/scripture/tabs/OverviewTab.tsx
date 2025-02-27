"use client";

import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Book, HeartHandshake, Lightbulb, Quote } from "lucide-react";
import type { Scripture } from "@/data/scripture";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      type: "spring",
      stiffness: 100,
    },
  },
};

interface OverviewTabProps {
  scripture: Scripture;
}

export default function OverviewTab({ scripture }: OverviewTabProps) {
  return (
    <motion.div variants={containerVariants} initial="hidden" animate="visible">
      <AboutSection scripture={scripture} />
      <SignificanceSection scripture={scripture} />
      <KeyConceptsSection />
      <NotableQuotesSection scripture={scripture} />
    </motion.div>
  );
}

function AboutSection({ scripture }: { scripture: Scripture }) {
  return (
    <motion.div variants={itemVariants}>
      <h2 className="text-xl font-semibold text-crimson-700 mb-3 flex items-center gap-2">
        <Book className="h-5 w-5" />
        About this Scripture
      </h2>
      <p className="text-maroon-700 mb-6 leading-relaxed">
        {scripture.overview}
      </p>
    </motion.div>
  );
}

function SignificanceSection({ scripture }: { scripture: Scripture }) {
  return (
    <motion.div variants={itemVariants}>
      <h2 className="text-xl font-semibold text-crimson-700 mb-3 flex items-center gap-2">
        <HeartHandshake className="h-5 w-5" />
        Significance
      </h2>
      <p className="text-maroon-700 mb-6 leading-relaxed">
        {scripture.significance}
      </p>
    </motion.div>
  );
}

function KeyConceptsSection() {
  const concepts = [
    {
      title: "Impermanence (Anicca)",
      description:
        "The understanding that all phenomena are in constant flux and nothing remains static.",
    },
    {
      title: "Non-self (Anatta)",
      description:
        "The doctrine that there is no unchanging, permanent self or soul in living beings.",
    },
    {
      title: "Suffering (Dukkha)",
      description:
        "The unsatisfactory nature of existence, ranging from obvious suffering to subtle dissatisfaction.",
    },
    {
      title: "Interdependence",
      description:
        "All phenomena arise in dependence upon multiple causes and conditions.",
    },
  ];

  return (
    <motion.div variants={itemVariants}>
      <h2 className="text-xl font-semibold text-crimson-700 mb-3 flex items-center gap-2">
        <Lightbulb className="h-5 w-5" />
        Key Concepts
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        {concepts.map((concept, index) => (
          <Card key={index} className="bg-amber-50 border-amber-200">
            <CardHeader className="px-4 py-3 pb-0">
              <CardTitle className="text-lg text-crimson-700">
                {concept.title}
              </CardTitle>
            </CardHeader>
            <CardContent className="px-4 py-3">
              <p className="text-maroon-700 text-sm">{concept.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </motion.div>
  );
}

function NotableQuotesSection({ scripture }: { scripture: Scripture }) {
  return (
    <motion.div variants={itemVariants}>
      <h2 className="text-xl font-semibold text-crimson-700 mb-3 flex items-center gap-2">
        <Quote className="h-5 w-5" />
        Notable Quotes
      </h2>
      <div className="space-y-4 mb-6">
        {scripture.verses.slice(0, 2).map((verse, index) => (
          <div
            key={index}
            className="bg-saffron-50 border-l-4 border-crimson-500 p-4 rounded-r-md shadow-sm"
          >
            <p className="italic text-maroon-700 mb-2">"{verse.text}"</p>
            <p className="text-sm text-maroon-600">
              — {scripture.title}, {verse.chapter}, Verse {verse.number}
            </p>
          </div>
        ))}
      </div>
    </motion.div>
  );
}
