import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CalendarDays, Clock, MapPin, User, Heart, Tag } from "lucide-react";
import { Event } from "@/data/events";

interface EventListItemProps {
  event: Event;
  isFavorite: boolean;
  onToggleFavorite: () => void;
}

export function EventListItem({
  event,
  isFavorite,
  onToggleFavorite,
}: EventListItemProps) {
  return (
    <Card className="overflow-hidden bg-white border-0 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex flex-col md:flex-row">
        <div className="md:w-1/3 relative">
          <img
            src={event.image || "/placeholder.svg"}
            alt={event.title}
            className="w-full h-48 md:h-full object-cover"
          />
          <Badge className="absolute top-3 left-3 bg-crimson-600 text-white">
            {event.type}
          </Badge>
        </div>
        <div className="md:w-2/3 flex flex-col">
          <CardHeader className="pb-2">
            <div className="flex justify-between items-start">
              <CardTitle className="text-xl text-crimson-700">
                {event.title}
              </CardTitle>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 rounded-full"
                onClick={onToggleFavorite}
              >
                <Heart
                  className={`h-4 w-4 ${
                    isFavorite ? "text-red-500 fill-red-500" : "text-gray-600"
                  }`}
                />
              </Button>
            </div>
            <CardDescription className="line-clamp-2 mt-1">
              {event.description}
            </CardDescription>
          </CardHeader>
          <CardContent className="pb-2 flex-grow">
            <div className="grid grid-cols-2 gap-x-8 gap-y-2">
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <CalendarDays className="h-4 w-4 text-gray-400" />
                <span>
                  {event.date.toLocaleDateString("en-US", {
                    weekday: "short",
                    month: "short",
                    day: "numeric",
                  })}
                </span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Clock className="h-4 w-4 text-gray-400" />
                <span>{event.time}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <MapPin className="h-4 w-4 text-gray-400" />
                <span>{event.location}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <User className="h-4 w-4 text-gray-400" />
                <span>{event.teacher}</span>
              </div>
            </div>
            <div className="flex items-center justify-between mt-4 text-sm">
              <div className="flex items-center gap-1">
                <Tag className="h-3 w-3 text-gray-400" />
                <div className="flex gap-1.5">
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
              </div>
              <span className="text-crimson-600">
                {event.capacity - event.attending} spots left
              </span>
            </div>
          </CardContent>
          <CardFooter className="pt-0 flex justify-between items-center">
            <div className="text-sm text-gray-500">
              {event.attending} attending
            </div>
            <Button className="bg-crimson-600 hover:bg-crimson-700">
              Register Now
            </Button>
          </CardFooter>
        </div>
      </div>
    </Card>
  );
}
