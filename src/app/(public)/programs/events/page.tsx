"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { FeaturedEventsSlider } from "@/components/events/FeaturedEventsSlider";
import { EventsSearchAndFilter } from "@/components/events/EventsSearchAndFilter";
import { EventsList } from "@/components/events/EventList";
import { EventCalendar } from "@/components/events/EventCalender";
import { eventApi } from "@/utils/eventApi";
import type { IEvent } from "@/types/event.types";
import { Loader2 } from "lucide-react";
import { Loader } from "@/components/common/loader";

export default function EventsPage() {
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [selectedDate, setSelectedDate] = useState<Date | null>(new Date());
  const [events, setEvents] = useState<IEvent[]>([]);
  const [filteredEvents, setFilteredEvents] = useState<IEvent[]>([]);
  const [activeFilter, setActiveFilter] = useState<string>("all");
  const [favoriteEvents, setFavoriteEvents] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch events
  useEffect(() => {
    const fetchEvents = async () => {
      setLoading(true);
      try {
        const data = await eventApi.getEvents();
        setEvents(data);
        setFilteredEvents(data);
      } catch (error) {
        console.error("Error fetching events:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);
  console.log("events", events);

  // Load favorites from localStorage
  useEffect(() => {
    const savedFavorites = localStorage.getItem("favoriteEvents");
    if (savedFavorites) {
      setFavoriteEvents(JSON.parse(savedFavorites));
    }
  }, []);

  // Filter events based on search, date, and type
  useEffect(() => {
    let result = events;

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        (event) =>
          event.title.toLowerCase().includes(query) ||
          event.description.toLowerCase().includes(query) ||
          event.teacher.name.toLowerCase().includes(query) ||
          (event.tags &&
            event.tags.some((tag) => tag.toLowerCase().includes(query)))
      );
    }

    if (selectedDate) {
      result = result.filter((event) => {
        const eventDate = new Date(event.date);
        return (
          eventDate.getDate() === selectedDate.getDate() &&
          eventDate.getMonth() === selectedDate.getMonth() &&
          eventDate.getFullYear() === selectedDate.getFullYear()
        );
      });
    }

    if (activeFilter !== "all") {
      result = result.filter(
        (event) => event.type.toLowerCase() === activeFilter.toLowerCase()
      );
    }

    setFilteredEvents(result);
  }, [searchQuery, selectedDate, activeFilter, events]);

  const toggleFavorite = (eventId: string) => {
    const newFavorites = favoriteEvents.includes(eventId)
      ? favoriteEvents.filter((id) => id !== eventId)
      : [...favoriteEvents, eventId];

    setFavoriteEvents(newFavorites);
    localStorage.setItem("favoriteEvents", JSON.stringify(newFavorites));
  };

  const resetDateFilter = () => {
    setSelectedDate(null);
  };

  if (loading) {
    return <Loader />;
  }
  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="px-6">
        <Breadcrumbs />
      </div>
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
