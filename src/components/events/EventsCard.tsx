import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { CalendarDays, Clock, Heart, MapPin } from "lucide-react";
import type { IEvent } from "@/types/event.types";
import { useRouter } from "next/navigation";

interface EventCardProps {
  event: IEvent;
  isFavorite: boolean;
  onToggleFavorite: () => void;
}

export function EventCard({
  event,
  isFavorite,
  onToggleFavorite,
}: EventCardProps) {
  const router = useRouter();

  const navigateToEventDetail = () => {
    router.push(`/programs/events/${event._id}`);
  };

  return (
    <Card className="overflow-hidden h-full border-none shadow-md hover:shadow-xl transition-shadow duration-300 cursor-pointer">
      <div className="aspect-video relative" onClick={navigateToEventDetail}>
        <img
          src={event.image || "/placeholder.svg"}
          alt={event.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-t from-black/60 to-transparent"></div>
        <Badge className="absolute top-4 right-4 bg-crimson-600 text-white">
          {event.type}
        </Badge>
        <button
          className={`absolute top-4 left-4 p-1.5 rounded-full ${
            isFavorite ? "bg-red-500 text-white" : "bg-white/80 text-gray-700"
          }`}
          onClick={(e) => {
            e.stopPropagation();
            onToggleFavorite();
          }}
        >
          <Heart className={`h-4 w-4 ${isFavorite ? "fill-white" : ""}`} />
        </button>
        <div className="absolute bottom-4 left-4 text-white">
          <div className="flex items-center gap-2 text-sm">
            <CalendarDays className="h-4 w-4" />
            <span>
              {new Date(event.date).toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
              })}
            </span>
          </div>
        </div>
      </div>
      <CardHeader className="pb-2" onClick={navigateToEventDetail}>
        <h3 className="text-xl font-semibold text-crimson-700 line-clamp-1">
          {event.title}
        </h3>
        <div className="flex items-center mt-1">
          <Avatar className="h-6 w-6 mr-2">
            {event.teacher.image ? (
              <AvatarImage src={event.teacher.image} alt={event.teacher.name} />
            ) : null}
            <AvatarFallback className="bg-crimson-100 text-crimson-700 text-xs">
              {event.teacher.name
                .split(" ")
                .map((n) => n[0])
                .join("")}
            </AvatarFallback>
          </Avatar>
          <span className="text-sm text-gray-600">{event.teacher.name}</span>
        </div>
      </CardHeader>
      <CardContent className="pb-2" onClick={navigateToEventDetail}>
        <div className="flex items-center gap-2 text-sm text-gray-600 mb-1">
          <Clock className="h-4 w-4 text-gray-400" />
          <span>{event.time}</span>
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <MapPin className="h-4 w-4 text-gray-400" />
          <span>{event.location}</span>
        </div>
        <div className="mt-3 flex items-center text-sm text-gray-600">
          <span>
            {event.attending || 0} / {event.capacity || "∞"} registered
          </span>
        </div>
      </CardContent>
      <CardFooter>
        <Button
          className="w-full bg-crimson-600 hover:bg-crimson-700"
          onClick={navigateToEventDetail}
        >
          View Details
        </Button>
      </CardFooter>
    </Card>
  );
}
