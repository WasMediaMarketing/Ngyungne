import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { BookOpenText, Bookmark, Share2 } from "lucide-react";
import { Scripture } from "@/data/scripture";

interface VersesTabProps {
  scripture: Scripture;
}

export default function VersesTab({ scripture }: VersesTabProps) {
  const [selectedChapter, setSelectedChapter] = useState<string | null>(null);

  const chapters = Array.from(new Set(scripture.verses.map((v) => v.chapter)));

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold text-crimson-700 flex items-center gap-2">
          <BookOpenText className="h-5 w-5" />
          All Verses
        </h2>
        <Button
          variant="outline"
          size="sm"
          className="text-crimson-600 border-crimson-200"
        >
          <BookOpenText className="mr-2 h-4 w-4" />
          <span>Read Mode</span>
        </Button>
      </div>

      {/* Filter by Chapter */}
      <div className="bg-saffron-50 p-4 rounded-lg mb-6">
        <h3 className="text-maroon-700 font-medium mb-2">Filter by Chapter</h3>
        <div className="flex flex-wrap gap-2">
          {chapters.map((chapter, idx) => (
            <Button
              key={idx}
              variant="outline"
              size="sm"
              className={`bg-white text-sm text-maroon-600 border-amber-200 hover:bg-amber-100 ${
                selectedChapter === chapter ? "bg-amber-200" : ""
              }`}
              onClick={() =>
                setSelectedChapter(selectedChapter === chapter ? null : chapter)
              }
            >
              {chapter}
            </Button>
          ))}
        </div>
      </div>

      {/* Verses accordion */}
      <Accordion type="single" collapsible className="w-full">
        {scripture.verses
          .filter(
            (verse) => !selectedChapter || verse.chapter === selectedChapter
          )
          .map((verse, index) => (
            <AccordionItem
              key={index}
              value={`verse-${index}`}
              className="border-saffron-200 mb-2 bg-white rounded-lg shadow-sm"
            >
              <AccordionTrigger className="text-crimson-600 hover:text-crimson-700 px-4 py-3 hover:no-underline">
                <div className="flex items-center justify-between w-full">
                  <div className="flex items-center gap-2">
                    <span className="bg-amber-100 text-amber-800 text-xs font-medium px-2.5 py-1 rounded-full">
                      {verse.number}
                    </span>
                    <span className="text-maroon-800 font-medium text-left">
                      {verse.chapter}
                    </span>
                  </div>
                </div>
              </AccordionTrigger>
              <AccordionContent className="px-4 pb-4 text-maroon-800 space-y-3">
                <div className="bg-saffron-50 p-4 rounded-md">
                  <p className="italic text-maroon-700 leading-relaxed">
                    {verse.text}
                  </p>
                </div>

                {verse.commentary && (
                  <div className="bg-white p-4 rounded-md border border-amber-200">
                    <h4 className="font-medium text-amber-800 mb-2">
                      Commentary
                    </h4>
                    <p className="text-maroon-600">{verse.commentary}</p>
                  </div>
                )}

                <div className="flex gap-2 mt-3">
                  <Button
                    size="sm"
                    variant="ghost"
                    className="text-crimson-600"
                  >
                    <Bookmark className="h-4 w-4 mr-1" />
                    Save
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    className="text-crimson-600"
                  >
                    <Share2 className="h-4 w-4 mr-1" />
                    Share
                  </Button>
                </div>
              </AccordionContent>
            </AccordionItem>
          ))}
      </Accordion>
    </motion.div>
  );
}
