import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { CalendarIcon, Search, X, MapPin, Clock } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import dayjs from "dayjs";
import { getBuddhistDate } from "@/utils/buddhistCalender";
import type { BuddhistEvent } from "@/types/buddhist-event";

type SearchEventsProps = {
  events: BuddhistEvent[];
  onSelectEvent?: (event: BuddhistEvent) => void;
  onClearSearch?: () => void;
};

const getBadgeVariant = (type: string) => {
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

export function SearchEvents({
  events,
  onSelectEvent,
  onClearSearch,
}: SearchEventsProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState<BuddhistEvent[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  useEffect(() => {
    if (searchTerm.length >= 2) {
      const term = searchTerm.toLowerCase();
      const results = events.filter(
        (event) =>
          event.title.toLowerCase().includes(term) ||
          event.description.toLowerCase().includes(term) ||
          (event.location && event.location.toLowerCase().includes(term)) ||
          (event.teacher && event.teacher.toLowerCase().includes(term)) ||
          (event.traditions &&
            event.traditions.some((tradition) =>
              tradition.toLowerCase().includes(term)
            ))
      );
      setSearchResults(results);
      setIsSearching(true);
    } else {
      setSearchResults([]);
      setIsSearching(false);
    }
  }, [searchTerm, events]);

  const handleClear = () => {
    setSearchTerm("");
    setSearchResults([]);
    setIsSearching(false);
    if (onClearSearch) onClearSearch();
  };

  const handleSelectEvent = (event: BuddhistEvent) => {
    if (onSelectEvent) {
      onSelectEvent(event);
      setSearchTerm("");
      setIsSearching(false);
    }
  };

  return (
    <div className="w-full relative">
      <div className="relative flex w-full items-center">
        <Search className="absolute left-2 h-4 w-4 text-muted-foreground" />
        <Input
          type="search"
          placeholder="Search events by title, description, location..."
          className="pl-8 pr-8 w-full"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        {searchTerm && (
          <Button
            variant="ghost"
            size="sm"
            className="absolute right-0 h-full rounded-l-none"
            onClick={handleClear}
          >
            <X className="h-4 w-4" />
          </Button>
        )}
      </div>

      <AnimatePresence>
        {isSearching && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute z-10 w-full mt-1 shadow-lg rounded-md bg-background border"
          >
            <Card className="overflow-hidden">
              <CardContent className="p-0">
                {searchResults.length > 0 ? (
                  <div className="max-h-64 overflow-y-auto">
                    {searchResults.map((event) => (
                      <motion.div
                        key={event.id}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="p-2 hover:bg-accent cursor-pointer border-b last:border-b-0"
                        onClick={() => handleSelectEvent(event)}
                      >
                        <div className="flex justify-between items-start">
                          <span className="font-medium">{event.title}</span>
                          <Badge variant={getBadgeVariant(event.type)}>
                            {event.type}
                          </Badge>
                        </div>
                        <div className="flex items-center text-xs text-muted-foreground mt-1">
                          <CalendarIcon className="h-3 w-3 mr-1" />
                          <span>
                            {dayjs(event.date).format("MMM D, YYYY")} /{" "}
                            {getBuddhistDate(event.date)}
                          </span>
                        </div>
                        {event.location && (
                          <div className="flex items-center text-xs text-muted-foreground mt-1">
                            <MapPin className="h-3 w-3 mr-1" />
                            <span>{event.location}</span>
                          </div>
                        )}
                        {event.time && (
                          <div className="flex items-center text-xs text-muted-foreground mt-1">
                            <Clock className="h-3 w-3 mr-1" />
                            <span>{event.time}</span>
                          </div>
                        )}
                      </motion.div>
                    ))}
                  </div>
                ) : (
                  <div className="p-4 text-center text-muted-foreground">
                    No events found matching "{searchTerm}"
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
