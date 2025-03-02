"use client";

import { useState, useEffect } from "react";
import dayjs from "dayjs";
import { motion, AnimatePresence } from "framer-motion";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Breadcrumbs } from "@/components/breadcrumbs";
import {
  CalendarIcon,
  Plus,
  Share2,
  Download,
  Clock,
  MapPin,
} from "lucide-react";
import { getBuddhistDate, isUposathaDay } from "@/utils/buddhistCalender";
import { BuddhistCalendarView } from "@/components/buddhist-calender/BuddhistCalenderView";
import { BuddhistEventListView } from "@/components/buddhist-calender/BuddhistEventList";
import type { BuddhistEvent } from "@/types/buddhist-event";

const buddhistEvents: BuddhistEvent[] = [
  // ... (keep the existing events, but update dates to be more recent)
];

const getBadgeVariant = (type: BuddhistEvent["type"]) => {
  switch (type) {
    case "teaching":
      return "default";
    case "festival":
      return "destructive";
    case "practice":
      return "secondary";
    case "moon":
      return "outline";
    default:
      return "default";
  }
};

export default function BuddhistCalendarPage() {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(
    new Date()
  );
  const [currentMonth, setCurrentMonth] = useState<Date>(new Date());
  const [activeTab, setActiveTab] = useState<string>("calendar");

  const getEventsForDate = (date: Date) => {
    return buddhistEvents.filter((event) =>
      dayjs(event.date).isSame(date, "day")
    );
  };

  const getEventCountForDate = (date: Date) => {
    return getEventsForDate(date).length + (isUposathaDay(date) ? 1 : 0);
  };

  const getUpcomingEvents = () => {
    const today = new Date();
    return buddhistEvents
      .filter(
        (event) =>
          dayjs(event.date).isAfter(today) ||
          dayjs(event.date).isSame(today, "day")
      )
      .sort((a, b) => a.date.getTime() - b.date.getTime());
  };

  const getEventsByType = (type: BuddhistEvent["type"]) => {
    return buddhistEvents.filter((event) => event.type === type);
  };

  useEffect(() => {
    if (selectedDate && !dayjs(currentMonth).isSame(selectedDate, "month")) {
      setCurrentMonth(dayjs(selectedDate).startOf("month").toDate());
    }
  }, [currentMonth, selectedDate]);

  return (
    <div className="container mx-auto px-4 py-8">
      <Breadcrumbs />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-6"
      >
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">
              Buddhist Calendar
            </h1>
            <p className="text-primary/60 mt-1">
              Explore events, teachings, and practices
            </p>
          </div>

          <div className="w-full sm:w-auto">
            <Tabs
              defaultValue={activeTab}
              onValueChange={setActiveTab}
              className="w-full sm:w-[300px]"
            >
              <TabsList className="grid grid-cols-2 w-full">
                <TabsTrigger value="calendar">Calendar</TabsTrigger>
                <TabsTrigger value="list">List View</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {activeTab === "calendar" ? (
            <div className="lg:col-span-2">
              <BuddhistCalendarView
                currentMonth={currentMonth}
                selectedDate={selectedDate}
                onSelectDate={setSelectedDate}
                onMonthChange={setCurrentMonth}
                getEventCountForDate={getEventCountForDate}
              />
            </div>
          ) : (
            <div className="lg:col-span-2">
              <BuddhistEventListView events={getUpcomingEvents()} />
            </div>
          )}

          <div className="lg:row-span-1">
            <AnimatePresence mode="wait">
              {selectedDate && getEventsForDate(selectedDate).length > 0 ? (
                <motion.div
                  key="event-details"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.2 }}
                >
                  {getEventsForDate(selectedDate).map((event) => (
                    <Card key={event.id} className="mb-4">
                      <CardHeader className="pb-2">
                        <div className="flex justify-between items-start">
                          <CardTitle>{event.title}</CardTitle>
                          <Badge variant={getBadgeVariant(event.type)}>
                            {event.type}
                          </Badge>
                        </div>
                        <CardDescription>
                          {dayjs(event.date).format("dddd, MMMM D, YYYY")} /{" "}
                          {getBuddhistDate(event.date)}
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <p className="text-primary/80">{event.description}</p>

                        {(event.location || event.time || event.teacher) && (
                          <div className="bg-primary/5 p-3 rounded-md space-y-2">
                            {event.time && (
                              <div className="flex items-center gap-2">
                                <Clock className="h-4 w-4 text-primary/70" />
                                <span className="text-sm">{event.time}</span>
                              </div>
                            )}
                            {event.location && (
                              <div className="flex items-center gap-2">
                                <MapPin className="h-4 w-4 text-primary/70" />
                                <span className="text-sm">
                                  {event.location}
                                </span>
                              </div>
                            )}
                            {event.teacher && (
                              <div className="flex items-center gap-2">
                                <span className="font-medium text-sm">
                                  Teacher:
                                </span>
                                <span className="text-sm">{event.teacher}</span>
                              </div>
                            )}
                          </div>
                        )}

                        {event.traditions && (
                          <div className="flex flex-wrap gap-1">
                            <span className="text-sm font-medium mr-1">
                              Traditions:
                            </span>
                            {event.traditions.map((tradition) => (
                              <Badge
                                key={tradition}
                                variant="outline"
                                className="text-xs"
                              >
                                {tradition}
                              </Badge>
                            ))}
                          </div>
                        )}
                      </CardContent>
                      <CardFooter className="gap-2 flex-wrap">
                        <Button size="sm" className="flex-1">
                          <Plus className="h-4 w-4 mr-1" /> Add to Calendar
                        </Button>
                        <Button size="sm" variant="outline" className="flex-1">
                          <Share2 className="h-4 w-4 mr-1" /> Share
                        </Button>
                      </CardFooter>
                    </Card>
                  ))}
                </motion.div>
              ) : (
                <motion.div
                  key="no-events"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  <Card>
                    <CardHeader>
                      <CardTitle>Events</CardTitle>
                      <CardDescription>
                        {selectedDate
                          ? `${dayjs(selectedDate).format(
                              "MMMM D, YYYY"
                            )} / ${getBuddhistDate(selectedDate)}`
                          : "Select a date"}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="py-8 text-center">
                        <CalendarIcon className="mx-auto h-12 w-12 text-primary/30" />
                        <h3 className="mt-2 text-lg font-medium">
                          No events scheduled
                        </h3>
                        <p className="mt-1 text-primary/60">
                          {isUposathaDay(selectedDate as Date)
                            ? "This is an Uposatha day. Consider practicing mindfulness or meditation."
                            : "Select another date or add a new event"}
                        </p>
                      </div>
                    </CardContent>
                    <CardFooter>
                      <Button className="w-full">
                        <Plus className="h-4 w-4 mr-1" /> Add New Event
                      </Button>
                    </CardFooter>
                  </Card>
                </motion.div>
              )}
            </AnimatePresence>

            <Card className="mt-4">
              <CardHeader>
                <CardTitle>Calendar Filters</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <Button
                    variant="outline"
                    className="w-full justify-start"
                    size="sm"
                  >
                    <Badge className="mr-2">
                      {getEventsByType("teaching").length}
                    </Badge>
                    Teaching Events
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full justify-start"
                    size="sm"
                  >
                    <Badge variant="destructive" className="mr-2">
                      {getEventsByType("festival").length}
                    </Badge>
                    Festival Events
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full justify-start"
                    size="sm"
                  >
                    <Badge variant="default" className="mr-2">
                      {getEventsByType("practice").length}
                    </Badge>
                    Practice Sessions
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full justify-start"
                    size="sm"
                  >
                    <Badge variant="outline" className="mr-2">
                      {getEventsByType("moon").length}
                    </Badge>
                    Moon Ceremonies
                  </Button>
                </div>
              </CardContent>
              <CardFooter>
                <Button variant="outline" className="w-full">
                  <Download className="h-4 w-4 mr-1" /> Export Calendar
                </Button>
              </CardFooter>
            </Card>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
