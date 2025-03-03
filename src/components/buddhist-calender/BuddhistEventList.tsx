import React from "react";
import dayjs from "dayjs";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Clock, MapPin } from "lucide-react";
import { getBuddhistDate } from "@/utils/buddhistCalender";
import type { BuddhistEvent } from "@/types/buddhist-event";

interface BuddhistEventListViewProps {
  events: BuddhistEvent[];
}

export function BuddhistEventListView({ events }: BuddhistEventListViewProps) {
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

  // Group events by month
  const groupedEvents = events.reduce((groups, event) => {
    const monthYear = dayjs(event.date).format("MMMM YYYY");
    if (!groups[monthYear]) {
      groups[monthYear] = [];
    }
    groups[monthYear].push(event);
    return groups;
  }, {} as Record<string, BuddhistEvent[]>);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Upcoming Events</CardTitle>
        <CardDescription>
          {events.length > 0
            ? `Showing ${events.length} event${events.length > 1 ? "s" : ""}`
            : "No events found"}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-8">
          {Object.entries(groupedEvents).map(([monthYear, monthEvents]) => (
            <div key={monthYear} className="space-y-4">
              <h3 className="text-lg font-medium border-b pb-2">{monthYear}</h3>
              <div className="space-y-4">
                {monthEvents.map((event) => (
                  <Card key={event.id} className="overflow-hidden">
                    <div className="flex flex-col sm:flex-row">
                      <div className="bg-primary/10 sm:w-32 p-4 flex flex-col items-center justify-center text-center">
                        <span className="text-2xl font-bold">
                          {dayjs(event.date).format("DD")}
                        </span>
                        <span className="text-sm">
                          {dayjs(event.date).format("ddd")}
                        </span>
                        <span className="text-xs text-gray-500">
                          {getBuddhistDate(event.date)}
                        </span>
                      </div>
                      <CardContent className="flex-1 p-4">
                        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2">
                          <div>
                            <h3 className="font-bold text-lg">{event.title}</h3>
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
                ))}
              </div>
            </div>
          ))}

          {events.length === 0 && (
            <div className="py-8 text-center">
              <h3 className="text-lg font-medium">No upcoming events found</h3>
              <p className="text-primary/60 mt-1">
                Try adjusting your search or filters
              </p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
