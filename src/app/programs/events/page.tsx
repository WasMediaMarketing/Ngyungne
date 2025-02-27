"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { FeaturedEventsSlider } from "@/components/events/FeaturedEventsSlider";
import { EventsSearchAndFilter } from "@/components/events/EventsSearchAndFilter";
import { EventsList } from "@/components/events/EventList";
import { EventCalendar } from "@/components/events/EventCalender";
import { events, Event } from "@/data/events";

export default function EventsPage() {
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [selectedDate, setSelectedDate] = useState<Date | null>(new Date());
  const [filteredEvents, setFilteredEvents] = useState<Event[]>(events);
  const [activeFilter, setActiveFilter] = useState<string>("all");
  const [favoriteEvents, setFavoriteEvents] = useState<number[]>([]);

  useEffect(() => {
    let result = events;

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        (event) =>
          event.title.toLowerCase().includes(query) ||
          event.description.toLowerCase().includes(query) ||
          event.teacher.toLowerCase().includes(query) ||
          event.tags.some((tag) => tag.toLowerCase().includes(query))
      );
    }

    if (selectedDate) {
      result = result.filter(
        (event) =>
          event.date.getDate() === selectedDate.getDate() &&
          event.date.getMonth() === selectedDate.getMonth() &&
          event.date.getFullYear() === selectedDate.getFullYear()
      );
    }

    if (activeFilter !== "all") {
      result = result.filter(
        (event) => event.type.toLowerCase() === activeFilter.toLowerCase()
      );
    }

    setFilteredEvents(result);
  }, [searchQuery, selectedDate, activeFilter]);

  const toggleFavorite = (eventId: number) => {
    setFavoriteEvents((prev) =>
      prev.includes(eventId)
        ? prev.filter((id) => id !== eventId)
        : [...prev, eventId]
    );
  };

  const resetDateFilter = () => {
    setSelectedDate(null);
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      <Breadcrumbs />
      <FeaturedEventsSlider events={events.filter((event) => event.featured)} />

      <div className="container mx-auto px-4 py-12">
        <EventsSearchAndFilter
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          activeFilter={activeFilter}
          setActiveFilter={setActiveFilter}
          selectedDate={selectedDate}
          resetDateFilter={resetDateFilter}
        />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <motion.div
            className="lg:col-span-2"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <EventsList
              events={filteredEvents}
              favoriteEvents={favoriteEvents}
              toggleFavorite={toggleFavorite}
              selectedDate={selectedDate}
            />
          </motion.div>

          <motion.div
            className="lg:col-span-1 space-y-8"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <EventCalendar
              events={events}
              selectedDate={selectedDate}
              setSelectedDate={setSelectedDate}
            />
          </motion.div>
        </div>
      </div>
    </div>
  );
}
