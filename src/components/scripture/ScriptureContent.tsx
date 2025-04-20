import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Card } from "@/components/ui/card";
import { Book } from "lucide-react";
import type { IScripture } from "@/types/scripture.types";

interface ScriptureContentProps {
  scripture: IScripture;
}

export default function ScriptureContent({ scripture }: ScriptureContentProps) {
  return (
    <div className="space-y-8">
      <Card className="bg-white/80 border-saffron-200 p-6">
        <h2 className="text-2xl font-bold text-crimson-800 mb-4 flex items-center gap-2">
          <Book className="h-6 w-6" />
          Overview
        </h2>
        <p className="text-maroon-700 leading-relaxed whitespace-pre-line">
          {scripture.overview}
        </p>
      </Card>

      <Card className="bg-white/80 border-saffron-200 p-6">
        <h2 className="text-2xl font-bold text-crimson-800 mb-6">Verses</h2>

        <Accordion
          type="single"
          collapsible
          className="w-full"
          defaultValue="verse-0"
        >
          {scripture.verses.map((verse, index) => (
            <AccordionItem
              key={index}
              value={`verse-${index}`}
              className="border-saffron-200"
            >
              <AccordionTrigger className="text-lg text-crimson-700 hover:text-crimson-800 py-4">
                <div className="flex items-center gap-3">
                  <span className="bg-amber-100 text-amber-800 px-2 py-1 rounded-md text-sm">
                    {verse.number}
                  </span>
                  {verse.chapter && (
                    <span className="text-maroon-600">{verse.chapter}</span>
                  )}
                </div>
              </AccordionTrigger>
              <AccordionContent className="text-maroon-800 space-y-4 py-4">
                <p className="text-lg leading-relaxed">{verse.text}</p>
                {verse.commentary && (
                  <div className="bg-amber-50 p-4 rounded-md border-l-4 border-amber-300 mt-4">
                    <h4 className="font-medium text-amber-800 mb-2">
                      Commentary
                    </h4>
                    <p className="text-maroon-700">{verse.commentary}</p>
                  </div>
                )}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </Card>
    </div>
  );
}
