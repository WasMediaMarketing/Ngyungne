"use client";

import { useState } from "react";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { Breadcrumbs } from "@/components/breadcrumbs";

interface BuddhistEvent {
  date: Date;
  title: string;
  type: "teaching" | "practice" | "festival" | "moon";
  description: string;
}

export default function BuddhistCalendarPage() {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(
    new Date()
  );
  const [view, setView] = useState<"month" | "year">("month");

  const buddhistEvents: BuddhistEvent[] = [
    {
      date: new Date(2024, 1, 15),
      title: "Losar - Tibetan New Year",
      type: "festival",
      description:
        "Celebration of Tibetan New Year with special prayers and offerings.",
    },
    {
      date: new Date(2024, 2, 1),
      title: "Full Moon Practice",
      type: "moon",
      description: "Special practice session during the full moon.",
    },
    // Add more events
  ];

  const getEventForDate = (date: Date) => {
    return buddhistEvents.find(
      (event) => event.date.toDateString() === date.toDateString()
    );
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <Breadcrumbs />
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="grid md:grid-cols-3 gap-8"
      >
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Buddhist Calendar</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex gap-2">
                <Button
                  variant={view === "month" ? "default" : "outline"}
                  onClick={() => setView("month")}
                >
                  Month
                </Button>
                <Button
                  variant={view === "year" ? "default" : "outline"}
                  onClick={() => setView("year")}
                >
                  Year
                </Button>
              </div>

              <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={setSelectedDate}
                className="rounded-md border"
                modifiers={{
                  event: (date) =>
                    buddhistEvents.some(
                      (event) =>
                        event.date.toDateString() === date.toDateString()
                    ),
                }}
                modifiersStyles={{
                  event: {
                    fontWeight: "bold",
                    backgroundColor: "var(--primary)",
                    color: "white",
                    borderRadius: "50%",
                  },
                }}
              />

              <div className="flex gap-2 flex-wrap">
                <Badge variant="outline">🌕 Full Moon</Badge>
                <Badge variant="outline">🎉 Festival</Badge>
                <Badge variant="outline">📚 Teaching</Badge>
                <Badge variant="outline">🧘‍♂️ Practice</Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Events</CardTitle>
          </CardHeader>
          <CardContent>
            {selectedDate && getEventForDate(selectedDate) ? (
              <div className="space-y-4">
                <h3 className="font-bold text-lg">
                  {getEventForDate(selectedDate)?.title}
                </h3>
                <p className="text-primary/60">
                  {getEventForDate(selectedDate)?.description}
                </p>
                <Button className="w-full">Add to Calendar</Button>
              </div>
            ) : (
              <p className="text-primary/60">No events on this date</p>
            )}
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
