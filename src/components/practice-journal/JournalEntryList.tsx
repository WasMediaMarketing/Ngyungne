"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { JournalEntry } from "@/types/practice-journal";
import { practiceTypes } from "@/data/practice-types";
import {
  Star,
  ChevronRight,
  Sparkles,
  Search,
  Calendar,
  BarChart3,
  List,
} from "lucide-react";
import Link from "next/link";

interface JournalEntryListProps {
  entries: JournalEntry[];
}

export default function JournalEntryList({ entries }: JournalEntryListProps) {
  const getTypeIcon = (type: string) => {
    const practiceType = practiceTypes.find((p) => p.value === type);
    return practiceType ? practiceType.icon : "📝";
  };

  const getTypeColor = (type: string) => {
    const practiceType = practiceTypes.find((p) => p.value === type);
    return practiceType ? practiceType.color : "bg-gray-100 text-gray-700";
  };

  return (
    <Tabs defaultValue="list" className="space-y-6">
      <TabsList className="mb-4">
        <TabsTrigger value="list" className="flex items-center">
          <List className="mr-2 h-4 w-4" />
          List View
        </TabsTrigger>
        <TabsTrigger value="calendar" className="flex items-center">
          <Calendar className="mr-2 h-4 w-4" />
          Calendar
        </TabsTrigger>
        <TabsTrigger value="stats" className="flex items-center">
          <BarChart3 className="mr-2 h-4 w-4" />
          Analytics
        </TabsTrigger>
      </TabsList>

      <TabsContent value="list" className="space-y-4">
        <AnimatePresence>
          {entries.length > 0 ? (
            entries.map((entry, index) => (
              <motion.div
                key={entry.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <Card
                  className="overflow-hidden hover:shadow-md transition-shadow border-l-4 cursor-pointer hover:bg-slate-50"
                  style={{
                    borderLeftColor: getTypeColor(entry.type).split(" ")[1],
                  }}
                >
                  <CardContent className="p-0">
                    <Link href={`/resources/practice-journal/${entry.id}`}>
                      <div className="p-6 grid md:grid-cols-12 gap-4">
                        <div className="md:col-span-1 flex md:flex-col items-center md:items-start justify-start">
                          <div
                            className={`${getTypeColor(
                              entry.type
                            )} h-14 w-14 rounded-lg flex items-center justify-center text-2xl shadow-sm`}
                          >
                            {getTypeIcon(entry.type)}
                          </div>
                        </div>

                        <div className="md:col-span-9">
                          <div className="flex flex-wrap items-center gap-2 mb-2">
                            <h3 className="font-semibold text-primary text-lg">
                              {entry.type}
                            </h3>
                            <Badge variant="outline" className="ml-2">
                              {entry.duration} min
                            </Badge>
                            <span className="text-primary/60 text-sm">
                              {new Date(entry.date).toLocaleDateString(
                                "en-US",
                                {
                                  weekday: "short",
                                  year: "numeric",
                                  month: "short",
                                  day: "numeric",
                                }
                              )}
                            </span>
                          </div>

                          <p className="text-primary/80 mb-3 line-clamp-2">
                            {entry.notes}
                          </p>

                          {entry.insights && entry.insights.length > 0 && (
                            <div className="flex flex-wrap gap-2 mt-2">
                              {entry.insights.slice(0, 2).map((insight, i) => (
                                <Badge
                                  key={i}
                                  variant="secondary"
                                  className="text-xs bg-primary/5"
                                >
                                  <Sparkles className="mr-1 h-3 w-3 text-primary/60" />
                                  {insight.length > 40
                                    ? insight.substring(0, 40) + "..."
                                    : insight}
                                </Badge>
                              ))}
                              {entry.insights.length > 2 && (
                                <Badge
                                  variant="secondary"
                                  className="text-xs bg-primary/5"
                                >
                                  +{entry.insights.length - 2} more
                                </Badge>
                              )}
                            </div>
                          )}
                        </div>

                        <div className="md:col-span-2 flex justify-end items-start">
                          <div className="flex flex-col items-end">
                            <div className="flex mb-2">
                              {Array.from({ length: 5 }).map((_, i) => (
                                <Star
                                  key={i}
                                  className={`h-4 w-4 ${
                                    i < entry.mood
                                      ? "text-yellow-400 fill-yellow-400"
                                      : "text-gray-200"
                                  }`}
                                />
                              ))}
                            </div>
                            <ChevronRight className="text-primary/40 h-5 w-5 mt-2" />
                          </div>
                        </div>
                      </div>
                    </Link>
                  </CardContent>
                </Card>
              </motion.div>
            ))
          ) : (
            <div className="text-center py-12 text-primary/60 rounded-lg bg-slate-50">
              <Search className="h-12 w-12 mx-auto mb-4 text-primary/40" />
              <h3 className="text-lg font-medium mb-1">No entries found</h3>
              <p>Try adjusting your search or filters</p>
            </div>
          )}
        </AnimatePresence>
      </TabsContent>

      <TabsContent value="calendar">
        <div className="h-80 flex items-center justify-center bg-primary/5 rounded-md text-primary/60">
          <div className="text-center">
            <Calendar className="h-16 w-16 mx-auto mb-4 text-primary/30" />
            <p className="font-medium mb-2">Calendar view coming soon</p>
            <p className="text-sm max-w-md mx-auto">
              Visualize your practice patterns over time and identify trends in
              your spiritual journey
            </p>
          </div>
        </div>
      </TabsContent>

      <TabsContent value="stats">
        <div className="h-80 flex items-center justify-center bg-primary/5 rounded-md text-primary/60">
          <div className="text-center">
            <BarChart3 className="h-16 w-16 mx-auto mb-4 text-primary/30" />
            <p className="font-medium mb-2">Detailed analytics coming soon</p>
            <p className="text-sm max-w-md mx-auto">
              Gain insights into your practice habits, track your progress, and
              discover correlations between practices and well-being
            </p>
          </div>
        </div>
      </TabsContent>
    </Tabs>
  );
}
