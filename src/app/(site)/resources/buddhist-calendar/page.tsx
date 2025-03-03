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
  Search,
} from "lucide-react";
import { getBuddhistDate, isUposathaDay } from "@/utils/buddhistCalender";
import { BuddhistCalendarView } from "@/components/buddhist-calender/BuddhistCalenderView";
import { BuddhistEventListView } from "@/components/buddhist-calender/BuddhistEventList";
import { AddEventDialog } from "@/components/buddhist-calender/AddEventDialog";
import { SearchEvents } from "@/components/buddhist-calender/SeachEvents";
import type { BuddhistEvent, EventType } from "@/types/buddhist-event";
import { Input } from "@/components/ui/input";

// Sample events
const initialBuddhistEvents: BuddhistEvent[] = [
  {
    id: "1",
    title: "Vesak Day",
    description: "Celebration of Buddha's birth, enlightenment, and passing",
    date: new Date(2025, 4, 12), // May 12, 2025
    type: "festival",
    traditions: ["Theravada", "Mahayana"],
    location: "Global Buddhist Temples",
    time: "All Day",
  },
  {
    id: "2",
    title: "Meditation Retreat",
    description: "Three-day mindfulness and meditation retreat",
    date: new Date(2025, 2, 18), // March 18, 2025
    type: "practice",
    traditions: ["Theravada"],
    location: "Forest Monastery",
    time: "8:00 AM - 6:00 PM",
    teacher: "Ajahn Brahm",
  },
  {
    id: "3",
    title: "Dharma Talk",
    description: "Weekly lecture on Buddhist principles",
    date: new Date(2025, 2, 5), // March 5, 2025
    type: "teaching",
    traditions: ["Zen"],
    location: "Zen Center",
    time: "7:00 PM - 9:00 PM",
    teacher: "Thich Nhat Hanh",
  },
  {
    id: "4",
    title: "Full Moon Ceremony",
    description: "Monthly ceremony celebrating the full moon",
    date: new Date(2025, 2, 15), // March 15, 2025
    type: "moon",
    traditions: ["Theravada", "Zen"],
    location: "Main Temple Hall",
    time: "7:30 PM - 9:00 PM",
  },
];

const getBadgeVariant = (type: EventType) => {
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
  const [buddhistEvents, setBuddhistEvents] = useState<BuddhistEvent[]>(
    initialBuddhistEvents
  );
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(
    new Date()
  );
  const [currentMonth, setCurrentMonth] = useState<Date>(new Date());
  const [activeTab, setActiveTab] = useState<string>("calendar");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [activeFilters, setActiveFilters] = useState<EventType[]>([]);
  const [searchTerm, setSearchTerm] = useState("");

  const addEvent = (event: BuddhistEvent) => {
    setBuddhistEvents([...buddhistEvents, event]);
  };

  const getEventsForDate = (date: Date) => {
    return buddhistEvents.filter((event) =>
      dayjs(event.date).isSame(date, "day")
    );
  };

  const getEventCountForDate = (date: Date) => {
    const filtered =
      activeFilters.length > 0
        ? buddhistEvents.filter((event) => activeFilters.includes(event.type))
        : buddhistEvents;

    return (
      filtered.filter((event) => dayjs(event.date).isSame(date, "day")).length +
      (isUposathaDay(date) ? 1 : 0)
    );
  };

  const getUpcomingEvents = () => {
    const today = new Date();
    let filtered = buddhistEvents
      .filter(
        (event) =>
          dayjs(event.date).isAfter(today) ||
          dayjs(event.date).isSame(today, "day")
      )
      .sort((a, b) => a.date.getTime() - b.date.getTime());

    // Apply type filters if any are active
    if (activeFilters.length > 0) {
      filtered = filtered.filter((event) => activeFilters.includes(event.type));
    }

    // Apply search term if present
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(
        (event) =>
          event.title.toLowerCase().includes(term) ||
          event.description.toLowerCase().includes(term) ||
          (event.location && event.location.toLowerCase().includes(term)) ||
          (event.teacher && event.teacher.toLowerCase().includes(term))
      );
    }

    return filtered;
  };

  const getEventsByType = (type: EventType) => {
    return buddhistEvents.filter((event) => event.type === type);
  };

  const toggleFilter = (type: EventType) => {
    if (activeFilters.includes(type)) {
      setActiveFilters(activeFilters.filter((t) => t !== type));
    } else {
      setActiveFilters([...activeFilters, type]);
    }
  };

  const isFilterActive = (type: EventType) => {
    return activeFilters.includes(type);
  };

  const exportCalendar = () => {
    // Create iCalendar format
    let icalContent = [
      "BEGIN:VCALENDAR",
      "VERSION:2.0",
      "PRODID:-//Anthropic//Buddhist Calendar//EN",
    ];

    buddhistEvents.forEach((event) => {
      const eventDate = dayjs(event.date);
      const formattedDate = eventDate.format("YYYYMMDD");

      icalContent.push("BEGIN:VEVENT");
      icalContent.push(`SUMMARY:${event.title}`);
      icalContent.push(`DESCRIPTION:${event.description}`);
      icalContent.push(`DTSTART:${formattedDate}`);
      icalContent.push(`DTEND:${formattedDate}`);
      if (event.location) icalContent.push(`LOCATION:${event.location}`);
      icalContent.push("END:VEVENT");
    });

    icalContent.push("END:VCALENDAR");

    // Create a downloadable file
    const blob = new Blob([icalContent.join("\n")], { type: "text/calendar" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "buddhist-calendar.ics";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
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

        <div className="w-full relative">
          <div className="relative flex w-full max-w-sm items-center">
            <Search className="absolute left-2 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search events..."
              className="pl-8 w-full"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
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
                activeFilters={activeFilters}
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
                        <Button
                          size="sm"
                          className="flex-1"
                          onClick={() => setDialogOpen(true)}
                        >
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
                          {selectedDate && isUposathaDay(selectedDate)
                            ? "This is an Uposatha day. Consider practicing mindfulness or meditation."
                            : "Select another date or add a new event"}
                        </p>
                      </div>
                    </CardContent>
                    <CardFooter>
                      <Button
                        className="w-full"
                        onClick={() => setDialogOpen(true)}
                      >
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
                    variant={isFilterActive("teaching") ? "default" : "outline"}
                    className="w-full justify-start"
                    size="sm"
                    onClick={() => toggleFilter("teaching")}
                  >
                    <Badge className="mr-2">
                      {getEventsByType("teaching").length}
                    </Badge>
                    Teaching Events
                  </Button>
                  <Button
                    variant={isFilterActive("festival") ? "default" : "outline"}
                    className="w-full justify-start"
                    size="sm"
                    onClick={() => toggleFilter("festival")}
                  >
                    <Badge variant="destructive" className="mr-2">
                      {getEventsByType("festival").length}
                    </Badge>
                    Festival Events
                  </Button>
                  <Button
                    variant={isFilterActive("practice") ? "default" : "outline"}
                    className="w-full justify-start"
                    size="sm"
                    onClick={() => toggleFilter("practice")}
                  >
                    <Badge variant="secondary" className="mr-2">
                      {getEventsByType("practice").length}
                    </Badge>
                    Practice Sessions
                  </Button>
                  <Button
                    variant={isFilterActive("moon") ? "default" : "outline"}
                    className="w-full justify-start"
                    size="sm"
                    onClick={() => toggleFilter("moon")}
                  >
                    <Badge variant="outline" className="mr-2">
                      {getEventsByType("moon").length}
                    </Badge>
                    Moon Ceremonies
                  </Button>
                </div>
              </CardContent>
              <CardFooter>
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={exportCalendar}
                >
                  <Download className="h-4 w-4 mr-1" /> Export Calendar
                </Button>
              </CardFooter>
            </Card>
          </div>
        </div>
      </motion.div>

      <AddEventDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        onSave={addEvent}
        selectedDate={selectedDate}
      />
    </div>
  );
}
