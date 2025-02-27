"use client";

import { useState, useEffect } from "react";
import { Calendar } from "@/components/ui/calendar";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter,
  CardDescription,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { motion, AnimatePresence } from "framer-motion";
import { Breadcrumbs } from "@/components/breadcrumbs";
import {
  ChevronLeft,
  ChevronRight,
  Calendar as CalendarIcon,
  MapPin,
  Clock,
  Share2,
  Download,
  Plus,
  Moon,
} from "lucide-react";
import { format, addMonths, subMonths, isToday, isAfter } from "date-fns";

interface BuddhistEvent {
  id: string;
  date: Date;
  title: string;
  type: "teaching" | "practice" | "festival" | "moon";
  description: string;
  location?: string;
  time?: string;
  teacher?: string;
  traditions?: string[];
}

export default function BuddhistCalendarPage() {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(
    new Date()
  );
  const [currentMonth, setCurrentMonth] = useState<Date>(new Date());
  const [activeTab, setActiveTab] = useState<string>("calendar");

  // Expanded Buddhist events with more detail
  const buddhistEvents: BuddhistEvent[] = [
    {
      id: "event-1",
      date: new Date(2024, 1, 15),
      title: "Losar - Tibetan New Year",
      type: "festival",
      description:
        "Celebration of Tibetan New Year with special prayers and offerings. This marks the beginning of the lunar new year according to the Tibetan calendar and is celebrated for 15 days.",
      location: "Dharamsala, India (Virtual Streaming Available)",
      time: "5:00 AM - 6:30 PM",
      traditions: ["Tibetan", "Vajrayana"],
    },
    {
      id: "event-2",
      date: new Date(2024, 2, 1),
      title: "Full Moon Meditation",
      type: "moon",
      description:
        "Special group meditation session during the full moon. In Buddhist traditions, full moon days (Poya) are considered especially auspicious for practice.",
      location: "Online Zoom Session",
      time: "7:00 PM - 9:00 PM",
      teacher: "Venerable Thubten Chodron",
      traditions: ["Theravada", "Mahayana"],
    },
    {
      id: "event-3",
      date: new Date(2024, 2, 15),
      title: "Dhamma Talk: The Four Noble Truths",
      type: "teaching",
      description:
        "An in-depth exploration of the Four Noble Truths - the Buddha's first and most essential teaching on suffering and the path to liberation.",
      location: "Community Meditation Center",
      time: "6:30 PM - 8:00 PM",
      teacher: "Ajahn Brahm",
      traditions: ["Theravada"],
    },
    {
      id: "event-4",
      date: new Date(2024, 3, 8),
      title: "Day of Mindfulness Retreat",
      type: "practice",
      description:
        "A full day of mindfulness practice including sitting meditation, walking meditation, mindful eating, and dharma discussion.",
      location: "Peaceful Heart Retreat Center",
      time: "9:00 AM - 5:00 PM",
      teacher: "Dr. Sarah Williams",
      traditions: ["Zen", "Secular"],
    },
    {
      id: "event-5",
      date: new Date(),
      title: "Today's Wisdom: Daily Reflection",
      type: "teaching",
      description:
        "A guided session focusing on applying Buddhist wisdom to daily life challenges. Today's topic: Cultivating Patience in Difficult Times.",
      location: "Online Streaming",
      time: "12:00 PM - 12:30 PM",
      teacher: "Jack Kornfield",
      traditions: ["Insight", "Secular"],
    },
  ];

  // Get events for a specific date
  const getEventsForDate = (date: Date) => {
    return buddhistEvents.filter(
      (event) => event.date.toDateString() === date.toDateString()
    );
  };

  // Get the number of events for a specific date
  const getEventCountForDate = (date: Date) => {
    return getEventsForDate(date).length;
  };

  // Get all upcoming events
  const getUpcomingEvents = () => {
    const today = new Date();
    return buddhistEvents
      .filter((event) => isAfter(event.date, today) || isToday(event.date))
      .sort((a, b) => a.date.getTime() - b.date.getTime());
  };

  // Get events by type
  const getEventsByType = (type: BuddhistEvent["type"]) => {
    return buddhistEvents.filter((event) => event.type === type);
  };

  // Navigate to previous month
  const goToPreviousMonth = () => {
    setCurrentMonth((prev) => subMonths(prev, 1));
  };

  // Navigate to next month
  const goToNextMonth = () => {
    setCurrentMonth((prev) => addMonths(prev, 1));
  };

  // Reset to current month
  const goToCurrentMonth = () => {
    setCurrentMonth(new Date());
    setSelectedDate(new Date());
  };

  // Get badge color based on event type
  const getBadgeVariant = (type: BuddhistEvent["type"]) => {
    switch (type) {
      case "teaching":
        return "secondary";
      case "practice":
        return "default";
      case "festival":
        return "destructive";
      case "moon":
        return "outline";
      default:
        return "default";
    }
  };

  // Get icon for event type
  const getEventIcon = (type: BuddhistEvent["type"]) => {
    switch (type) {
      case "moon":
        return <Moon className="h-4 w-4" />;
      default:
        return null;
    }
  };

  // Update selected date when month changes
  useEffect(() => {
    if (selectedDate && currentMonth.getMonth() !== selectedDate.getMonth()) {
      const newDate = new Date(currentMonth);
      newDate.setDate(1);
      setSelectedDate(newDate);
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
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle>Calendar View</CardTitle>
                  <div className="flex items-center space-x-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={goToPreviousMonth}
                    >
                      <ChevronLeft className="h-4 w-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={goToCurrentMonth}
                    >
                      Today
                    </Button>
                    <Button size="sm" variant="outline" onClick={goToNextMonth}>
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </div>
                </CardHeader>

                <CardContent>
                  <div className="space-y-6">
                    <div className="text-center font-medium text-lg">
                      {format(currentMonth, "MMMM yyyy")}
                    </div>

                    <Calendar
                      mode="single"
                      selected={selectedDate}
                      onSelect={setSelectedDate}
                      month={currentMonth}
                      onMonthChange={setCurrentMonth}
                      className="rounded-md border"
                      components={{
                        Day: ({ date }) => {
                          const count = getEventCountForDate(date);
                          return (
                            <div className="relative h-full w-full p-2 flex items-center justify-center">
                              {date.getDate()}
                              {count > 0 && (
                                <span className="absolute bottom-1 right-1 rounded-full bg-primary w-4 h-4 text-[10px] flex items-center justify-center text-primary-foreground">
                                  {count}
                                </span>
                              )}
                            </div>
                          );
                        },
                      }}
                      modifiers={{
                        today: (date) => isToday(date),
                        event: (date) => getEventCountForDate(date) > 0,
                      }}
                      modifiersStyles={{
                        today: {
                          fontWeight: "bold",
                          border: "1px solid var(--primary)",
                        },
                        event: {
                          fontWeight: "bold",
                          backgroundColor: "var(--primary-light)",
                        },
                      }}
                    />

                    <div className="flex gap-2 flex-wrap">
                      <Badge
                        variant="outline"
                        className="flex items-center gap-1"
                      >
                        <Moon className="h-3 w-3" /> Full Moon
                      </Badge>
                      <Badge variant="destructive">🎉 Festival</Badge>
                      <Badge variant="secondary">📚 Teaching</Badge>
                      <Badge>🧘‍♂️ Practice</Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          ) : (
            <div className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle>Upcoming Events</CardTitle>
                  <CardDescription>
                    All scheduled events in chronological order
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {getUpcomingEvents().length > 0 ? (
                      getUpcomingEvents().map((event) => (
                        <Card key={event.id} className="overflow-hidden">
                          <div className="flex flex-col sm:flex-row">
                            <div className="bg-primary/10 sm:w-32 p-4 flex flex-col items-center justify-center text-center">
                              <span className="text-2xl font-bold">
                                {format(event.date, "dd")}
                              </span>
                              <span className="text-sm">
                                {format(event.date, "MMM yyyy")}
                              </span>
                            </div>
                            <CardContent className="flex-1 p-4">
                              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2">
                                <div>
                                  <h3 className="font-bold text-lg">
                                    {event.title}
                                  </h3>
                                  <div className="flex items-center gap-2 text-primary/60 text-sm mt-1">
                                    {event.time && (
                                      <span className="flex items-center">
                                        <Clock className="h-3 w-3 mr-1" />{" "}
                                        {event.time}
                                      </span>
                                    )}
                                    {event.location && (
                                      <span className="flex items-center">
                                        <MapPin className="h-3 w-3 mr-1" />{" "}
                                        {event.location}
                                      </span>
                                    )}
                                  </div>
                                </div>
                                <Badge
                                  variant={getBadgeVariant(event.type)}
                                  className="self-start"
                                >
                                  {event.type}
                                </Badge>
                              </div>
                              <p className="text-primary/70 text-sm mt-2">
                                {event.description}
                              </p>
                              {event.traditions && (
                                <div className="flex flex-wrap gap-1 mt-2">
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
                          </div>
                        </Card>
                      ))
                    ) : (
                      <p className="text-center text-primary/60">
                        No upcoming events found
                      </p>
                    )}
                  </div>
                </CardContent>
              </Card>
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
                            {getEventIcon(event.type)} {event.type}
                          </Badge>
                        </div>
                        <CardDescription>
                          {format(event.date, "EEEE, MMMM do, yyyy")}
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
                          ? format(selectedDate, "MMMM do, yyyy")
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
                          Select another date or add a new event
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
