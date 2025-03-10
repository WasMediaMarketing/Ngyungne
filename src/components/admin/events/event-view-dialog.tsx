"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { format } from "date-fns";
import Image from "next/image";
import {
  Calendar,
  Clock,
  MapPin,
  Users,
  Tag,
  ExternalLink,
} from "lucide-react";
import type { IEvent } from "@/types";

interface EventViewDialogProps {
  event: IEvent;
  open: boolean;
  onClose: () => void;
}

export default function EventViewDialog({
  event,
  open,
  onClose,
}: EventViewDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl">Event Details</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Event Header with Image */}
          <div className="relative">
            <div className="relative h-48 w-full rounded-lg overflow-hidden">
              <Image
                src={event.image || "/placeholder.svg?height=400&width=800"}
                alt={event.title}
                fill
                className="object-cover"
              />
            </div>
            {event.featured && (
              <Badge className="absolute top-2 right-2 bg-amber-500">
                Featured
              </Badge>
            )}
          </div>

          {/* Event Title and Type */}
          <div>
            <h2 className="text-2xl font-bold">{event.title}</h2>
            <div className="flex items-center mt-2">
              <Badge variant="outline" className="capitalize">
                {event.type}
              </Badge>
            </div>
          </div>

          {/* Event Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <div className="flex items-center text-muted-foreground">
                <Calendar className="h-4 w-4 mr-2" />
                <span>{format(new Date(event.date), "MMMM d, yyyy")}</span>
              </div>
              <div className="flex items-center text-muted-foreground">
                <Clock className="h-4 w-4 mr-2" />
                <span>{event.time}</span>
              </div>
              <div className="flex items-center text-muted-foreground">
                <MapPin className="h-4 w-4 mr-2" />
                <span>{event.location}</span>
              </div>
              <div className="flex items-center text-muted-foreground">
                <Users className="h-4 w-4 mr-2" />
                <span>
                  {event.attending || 0} attending /{" "}
                  {event.capacity || "Unlimited"} capacity
                </span>
              </div>
            </div>

            <div>
              <h3 className="font-medium mb-2">Tags</h3>
              <div className="flex flex-wrap gap-1">
                {event.tags?.map((tag, index) => (
                  <Badge key={index} variant="secondary">
                    <Tag className="h-3 w-3 mr-1" />
                    {tag}
                  </Badge>
                ))}
                {(!event.tags || event.tags.length === 0) && (
                  <span className="text-muted-foreground text-sm">No tags</span>
                )}
              </div>
            </div>
          </div>

          {/* Event Description */}
          <div>
            <h3 className="font-medium mb-2">Description</h3>
            <p className="text-muted-foreground whitespace-pre-line">
              {event.description}
            </p>
          </div>

          <Separator />

          {/* Teacher Information */}
          <div>
            <h3 className="font-medium mb-4">Teacher</h3>
            <div className="flex items-start gap-4">
              {event.teacher?.image && (
                <div className="relative h-20 w-20 rounded-full overflow-hidden flex-shrink-0">
                  <Image
                    src={
                      event.teacher.image ||
                      "/placeholder.svg?height=200&width=200"
                    }
                    alt={event.teacher.name}
                    fill
                    className="object-cover"
                  />
                </div>
              )}
              <div className="flex-1">
                <h4 className="font-semibold text-lg">{event.teacher.name}</h4>
                {event.teacher.speciality && (
                  <p className="text-sm text-muted-foreground">
                    {event.teacher.speciality}
                  </p>
                )}
                {event.teacher.description && (
                  <p className="mt-2 text-muted-foreground">
                    {event.teacher.description}
                  </p>
                )}
                {event.teacher.credentials &&
                  event.teacher.credentials.length > 0 && (
                    <div className="mt-2">
                      <h5 className="text-sm font-medium">Credentials:</h5>
                      <ul className="list-disc list-inside text-sm text-muted-foreground">
                        {event.teacher.credentials.map((credential, index) => (
                          <li key={index}>{credential}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                {event.teacher.link && (
                  <a
                    href={event.teacher.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center mt-2 text-sm text-primary hover:underline"
                  >
                    <ExternalLink className="h-3 w-3 mr-1" />
                    Teacher's Profile
                  </a>
                )}
              </div>
            </div>
          </div>

          {/* Event Schedule */}
          {event.schedule && Object.keys(event.schedule).length > 0 && (
            <>
              <Separator />
              <div>
                <h3 className="font-medium mb-4">Event Schedule</h3>
                <div className="space-y-4">
                  {Object.entries(event.schedule).map(([time, item], index) => (
                    <div key={index} className="flex">
                      <div className="w-24 flex-shrink-0 font-medium">
                        {time}
                      </div>
                      <div>
                        <h4 className="font-medium">{item.title}</h4>
                        <p className="text-sm text-muted-foreground">
                          {item.description}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
