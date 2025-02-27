import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { CalendarDays, Clock, MapPin, Heart } from "lucide-react";
import { Event } from "@/data/events";

interface EventCardProps {
  event: Event;
  isFavorite: boolean;
  onToggleFavorite: () => void;
}

export function EventCard({
  event,
  isFavorite,
  onToggleFavorite,
}: EventCardProps) {
  return (
    <Card className="group hover:shadow-md transition-shadow overflow-hidden h-full border-0 shadow-sm">
      <div className="relative h-48">
        <img
          src={event.image || "/placeholder.svg"}
          alt={event.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
        <div className="absolute top-3 right-3 flex space-x-2">
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 rounded-full bg-white/80 hover:bg-white"
            onClick={onToggleFavorite}
          >
            <Heart
              className={`h-4 w-4 ${
                isFavorite ? "text-red-500 fill-red-500" : "text-gray-600"
              }`}
            />
          </Button>
        </div>
        <Badge className="absolute top-3 left-3 bg-crimson-600 text-white">
          {event.type}
        </Badge>
        <div className="absolute bottom-3 left-3 text-white">
          <div className="flex items-center gap-2 text-sm">
            <CalendarDays className="h-4 w-4" />
            <span>
              {event.date.toLocaleDateString("en-US", {
                weekday: "short",
                month: "short",
                day: "numeric",
              })}
            </span>
          </div>
        </div>
      </div>
      <CardHeader className="pb-2">
        <CardTitle className="text-xl text-crimson-700 group-hover:text-crimson-600 transition-colors">
          {event.title}
        </CardTitle>
        <div className="flex items-center mt-1">
          <Avatar className="h-6 w-6 mr-2">
            <AvatarFallback className="bg-crimson-100 text-crimson-700 text-xs">
              {event.teacher
                .split(" ")
                .map((n) => n[0])
                .join("")}
            </AvatarFallback>
          </Avatar>
          <span className="text-sm text-gray-600">{event.teacher}</span>
        </div>
      </CardHeader>
      <CardContent className="pb-2">
        <div className="flex items-center gap-2 text-sm text-gray-600 mb-1">
          <Clock className="h-4 w-4 text-gray-400" />
          <span>{event.time}</span>
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <MapPin className="h-4 w-4 text-gray-400" />
          <span>{event.location}</span>
        </div>
        <div className="mt-3 mb-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-600">
              {event.attending} of {event.capacity} spots filled
            </span>
            <span className="text-crimson-600 font-medium">
              {Math.round((event.attending / event.capacity) * 100)}%
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-1.5 mt-1">
            <div
              className="bg-crimson-500 h-1.5 rounded-full"
              style={{ width: `${(event.attending / event.capacity) * 100}%` }}
            ></div>
          </div>
        </div>
        <div className="flex flex-wrap gap-1 mt-2">
          {event.tags.map((tag, i) => (
            <Badge
              key={i}
              variant="outline"
              className="text-xs bg-gray-50 text-gray-600 border-gray-200"
            >
              {tag}
            </Badge>
          ))}
        </div>
      </CardContent>
      <CardFooter className="pt-2">
        <Button className="w-full bg-crimson-600 hover:bg-crimson-700">
          Register Now
        </Button>
      </CardFooter>
    </Card>
  );
}
