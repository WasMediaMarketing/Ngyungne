"use client";

import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Globe, Book } from "lucide-react";
import type { Scripture } from "@/data/scripture";

interface TranslationsTabProps {
  scripture: Scripture;
}

export default function TranslationsTab({ scripture }: TranslationsTabProps) {
  // This is a placeholder. In a real application, you would fetch actual translation data.
  const translations = [
    { language: "English", translator: "Thanissaro Bhikkhu", year: 1997 },
    { language: "German", translator: "Karl Eugen Neumann", year: 1921 },
    { language: "French", translator: "Mohan Wijayaratna", year: 1988 },
    { language: "Spanish", translator: "Carmen Dragonetti", year: 2002 },
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <h2 className="text-xl font-semibold text-crimson-700 mb-3 flex items-center gap-2">
        <Globe className="h-5 w-5" />
        Translations
      </h2>
      <p className="text-maroon-700 mb-6 leading-relaxed">
        {scripture.title} has been translated into numerous languages, making
        its wisdom accessible to people around the world. Below are some notable
        translations:
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {translations.map((translation, index) => (
          <Card key={index} className="bg-saffron-50 border-amber-200">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg text-crimson-700 flex items-center gap-2">
                <Book className="h-4 w-4" />
                {translation.language} Translation
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-maroon-700">
                Translated by {translation.translator} in {translation.year}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="mt-8">
        <h3 className="text-lg font-medium text-crimson-700 mb-3">
          Translation Challenges
        </h3>
        <p className="text-maroon-700 mb-4">
          Translating ancient Buddhist texts like {scripture.title} presents
          unique challenges:
        </p>
        <ul className="list-disc pl-5 space-y-2 text-maroon-700">
          <li>Preserving the nuanced meanings of Pali or Sanskrit terms</li>
          <li>Balancing literal accuracy with readability</li>
          <li>Conveying cultural and historical context</li>
          <li>Addressing ambiguities in the original text</li>
        </ul>
      </div>
    </motion.div>
  );
}
