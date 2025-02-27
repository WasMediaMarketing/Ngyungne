import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { CalendarDays, Clock, Heart, MapPin, Users } from "lucide-react";
import { Event } from "@/data/events";
import { useRouter } from "next/navigation";

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
  const router = useRouter();

  const navigateToEventDetail = () => {
    router.push(`/programs/events/${event.id}`);
  };

  return (
    <Card className="border-none shadow-sm hover:shadow-md transition-shadow duration-300 overflow-hidden cursor-pointer">
      <div className="flex flex-col sm:flex-row">
        <div
          className="sm:w-48 aspect-video sm:aspect-auto relative"
          onClick={navigateToEventDetail}
        >
          <img
            src={event.image || "/placeholder.svg"}
            alt={event.title}
            className="w-full h-full object-cover"
          />
          <Badge className="absolute top-2 right-2 bg-crimson-600 text-white text-xs">
            {event.type}
          </Badge>
          <button
            className={`absolute top-2 left-2 p-1.5 rounded-full ${
              isFavorite ? "bg-red-500 text-white" : "bg-white/80 text-gray-700"
            }`}
            onClick={(e) => {
              e.stopPropagation();
              onToggleFavorite();
            }}
          >
            <Heart className={`h-3 w-3 ${isFavorite ? "fill-white" : ""}`} />
          </button>
        </div>

        <div className="flex-1 p-4" onClick={navigateToEventDetail}>
          <div className="flex justify-between items-start">
            <div>
              <h3 className="font-semibold text-crimson-700 mb-1">
                {event.title}
              </h3>
              <div className="flex items-center text-sm text-gray-600">
                <Avatar className="h-5 w-5 mr-1">
                  <AvatarFallback className="bg-crimson-100 text-crimson-700 text-xs">
                    {event.teacher
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </AvatarFallback>
                </Avatar>
                <span>{event.teacher}</span>
              </div>
            </div>
            <div className="text-right">
              <div className="flex items-center text-sm text-gray-600 mb-1">
                <CalendarDays className="h-4 w-4 mr-1" />
                <span>
                  {event.date.toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  })}
                </span>
              </div>
              <div className="flex items-center text-sm text-gray-600">
                <Clock className="h-4 w-4 mr-1" />
                <span>{event.time}</span>
              </div>
            </div>
          </div>

          <div className="mt-3 flex flex-wrap justify-between items-center">
            <div className="flex items-center text-sm text-gray-600 mb-2 sm:mb-0">
              <MapPin className="h-4 w-4 mr-1" />
              <span>{event.location}</span>
            </div>

            <div className="flex items-center text-sm text-gray-600">
              <Users className="h-4 w-4 mr-1" />
              <span>
                {event.attending} / {event.capacity} registered
              </span>
            </div>
          </div>

          <div className="mt-4 flex justify-end">
            <Button
              size="sm"
              className="bg-crimson-600 hover:bg-crimson-700"
              onClick={navigateToEventDetail}
            >
              View Details
            </Button>
          </div>
        </div>
      </div>
    </Card>
  );
}
