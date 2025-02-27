"use client";

import { motion } from "framer-motion";
import { History } from "lucide-react";
import type { Scripture } from "@/data/scripture";

interface HistoricalTabProps {
  scripture: Scripture;
}

export default function HistoricalTab({ scripture }: HistoricalTabProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <h2 className="text-xl font-semibold text-crimson-700 mb-3 flex items-center gap-2">
        <History className="h-5 w-5" />
        Historical Context
      </h2>
      <p className="text-maroon-700 mb-6 leading-relaxed">
        {scripture.historicalContext}
      </p>

      {/* Historical timeline */}
      <h3 className="text-lg font-medium text-crimson-700 mb-3">Timeline</h3>
      <div className="relative border-l-2 border-amber-300 pl-6 pb-6 space-y-6">
        <TimelineItem
          date="5th Century BCE"
          event="Life of Gautama Buddha, whose teachings form the foundation of all Buddhist scriptures."
        />
        <TimelineItem
          date="4th Century BCE - 1st Century CE"
          event="Oral transmission of the Buddha's teachings by generations of monks."
        />
        <TimelineItem
          date={scripture.period}
          event={`Compilation of ${scripture.title} in written form.`}
        />
        <TimelineItem
          date="5th Century CE onwards"
          event="Spread of the text throughout Asia, with translations into various languages."
        />
      </div>

      {/* Geographic origins */}
      <h3 className="text-lg font-medium text-crimson-700 mb-3 mt-8">
        Geographic Origins
      </h3>
      <div className="bg-saffron-50 p-4 rounded-lg mb-6">
        <p className="text-maroon-700 mb-4">
          Originally composed in the Indian subcontinent, {scripture.title}{" "}
          spread throughout Asia alongside Buddhism. The text was particularly
          influential in{" "}
          {scripture.tradition === "Theravada"
            ? "Sri Lanka, Thailand, and Southeast Asia"
            : "China, Tibet, Japan, and Korea"}
          .
        </p>
        <div className="h-48 bg-amber-200 rounded-md flex items-center justify-center">
          <p className="text-amber-800">Interactive map would appear here</p>
        </div>
      </div>
    </motion.div>
  );
}

interface TimelineItemProps {
  date: string;
  event: string;
}

function TimelineItem({ date, event }: TimelineItemProps) {
  return (
    <div className="relative">
      <div className="absolute -left-8 top-1 h-4 w-4 rounded-full bg-crimson-600"></div>
      <h4 className="text-maroon-800 font-medium">{date}</h4>
      <p className="text-maroon-600">{event}</p>
    </div>
  );
}
