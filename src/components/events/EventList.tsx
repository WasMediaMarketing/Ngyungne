import { useState } from "react";
import { motion } from "framer-motion";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { CalendarIcon } from "lucide-react";
import { EventCard } from "@/components/events/EventsCard";
import { EventListItem } from "@/components/events/EventListItem";
import { Event } from "@/data/events";

interface EventsListProps {
  events: Event[];
  favoriteEvents: number[];
  toggleFavorite: (eventId: number) => void;
  selectedDate: Date | null;
}

export function EventsList({
  events,
  favoriteEvents,
  toggleFavorite,
  selectedDate,
}: EventsListProps) {
  const [viewType, setViewType] = useState<"grid" | "list">("grid");

  return (
    <>
      <Tabs
        defaultValue={viewType}
        onValueChange={(value) => setViewType(value as "grid" | "list")}
        className="mb-6"
      >
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold text-crimson-800">
            {events.length}{" "}
            {selectedDate ? "Events on Selected Date" : "Upcoming Events"}
          </h2>
          <TabsList className="bg-white border border-gray-200">
            <TabsTrigger
              value="grid"
              className="data-[state=active]:bg-gray-100"
            >
              Grid
            </TabsTrigger>
            <TabsTrigger
              value="list"
              className="data-[state=active]:bg-gray-100"
            >
              List
            </TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="grid">
          {events.length > 0 ? (
            <div className="grid md:grid-cols-2 gap-6">
              {events.map((event, index) => (
                <motion.div
                  key={event.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                >
                  <EventCard
                    event={event}
                    isFavorite={favoriteEvents.includes(event.id)}
                    onToggleFavorite={() => toggleFavorite(event.id)}
                  />
                </motion.div>
              ))}
            </div>
          ) : (
            <NoEventsFound />
          )}
        </TabsContent>

        <TabsContent value="list">
          {events.length > 0 ? (
            <div className="space-y-4">
              {events.map((event, index) => (
                <motion.div
                  key={event.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                >
                  <EventListItem
                    event={event}
                    isFavorite={favoriteEvents.includes(event.id)}
                    onToggleFavorite={() => toggleFavorite(event.id)}
                  />
                </motion.div>
              ))}
            </div>
          ) : (
            <NoEventsFound />
          )}
        </TabsContent>
      </Tabs>
    </>
  );
}

function NoEventsFound() {
  return (
    <div className="text-center py-12 bg-gray-50 rounded-lg">
      <CalendarIcon className="mx-auto h-12 w-12 text-gray-400 mb-4" />
      <h3 className="text-lg font-medium text-gray-900 mb-1">
        No events found
      </h3>
      <p className="text-gray-500 mb-4">
        Try adjusting your search or filters to find events
      </p>
      <Button
        variant="outline"
        className="border-crimson-200 text-crimson-600"
        onClick={() => {
          // Reset filters logic here
        }}
      >
        Reset all filters
      </Button>
    </div>
  );
}
