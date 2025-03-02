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

  return (
    <Card>
      <CardHeader>
        <CardTitle>Upcoming Events</CardTitle>
        <CardDescription>
          All scheduled events in chronological order
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {events.length > 0 ? (
            events.map((event) => (
              <Card key={event.id} className="overflow-hidden">
                <div className="flex flex-col sm:flex-row">
                  <div className="bg-primary/10 sm:w-32 p-4 flex flex-col items-center justify-center text-center">
                    <span className="text-2xl font-bold">
                      {dayjs(event.date).format("DD")}
                    </span>
                    <span className="text-sm">
                      {dayjs(event.date).format("MMM YYYY")}
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
                              <Clock className="h-3 w-3 mr-1" /> {event.time}
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
  );
}
