"use client";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Calendar,
  Clock,
  MapPin,
  Users,
  Heart,
  Share2,
  ChevronLeft,
  CalendarDays,
  User,
  Tag,
} from "lucide-react";
import type { IEvent } from "@/types/event.types";
import { EventRegistrationForm } from "./EventRegistrationForm";
import { ShareDialog } from "./ShareDialog";

interface EventDetailProps {
  event: IEvent;
  isFavorite: boolean;
  onToggleFavorite: () => void;
  relatedEvents: IEvent[];
  onBack: () => void;
  onRegister?: () => void;
}

export function EventDetail({
  event,
  isFavorite,
  onToggleFavorite,
  relatedEvents,
  onBack,
  onRegister,
}: EventDetailProps) {
  const [activeTab, setActiveTab] = useState("details");
  const [isScrolled, setIsScrolled] = useState(false);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isRegistered, setIsRegistered] = useState(false);
  const [isShareDialogOpen, setIsShareDialogOpen] = useState(false);

  // Handle scroll for sticky header
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 100);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Calculate if event is sold out or has limited spots
  const spotsLeft = (event.capacity || 0) - (event.attending || 0);
  const isSoldOut = spotsLeft <= 0;
  const isAlmostSoldOut = spotsLeft <= 5;

  const handleSuccessfulRegistration = () => {
    setIsRegistered(true);
    setIsFormOpen(false);
    if (onRegister) {
      onRegister();
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Sticky Header - Only shows when scrolled */}
      <div
        className={`fixed top-0 left-0 w-full bg-white z-10 shadow-md transition-transform duration-300 ${
          isScrolled ? "translate-y-0" : "-translate-y-full"
        }`}
      >
        <div className="container mx-auto px-4 py-3 flex justify-between items-center">
          <div className="flex items-center">
            <Button
              variant="ghost"
              size="icon"
              className="mr-2"
              onClick={onBack}
            >
              <ChevronLeft className="h-5 w-5" />
            </Button>
            <h3 className="font-medium truncate max-w-xs md:max-w-md">
              {event.title}
            </h3>
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              className={isFavorite ? "text-red-500" : ""}
              onClick={onToggleFavorite}
            >
              <Heart
                className={`h-4 w-4 mr-1 ${isFavorite ? "fill-red-500" : ""}`}
              />
              {isFavorite ? "Saved" : "Save"}
            </Button>
            {!isSoldOut && (
              <Button
                size="sm"
                className="bg-crimson-600 hover:bg-crimson-700"
                onClick={() => setIsFormOpen(true)}
              >
                Register
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Hero Section */}
      <div className="relative bg-gray-900 h-64 md:h-96">
        <Button
          variant="ghost"
          size="icon"
          className="absolute top-4 left-4 z-10 bg-black/20 text-white hover:bg-black/40"
          onClick={onBack}
        >
          <ChevronLeft className="h-5 w-5" />
        </Button>
        <img
          src={event.image || "/placeholder.svg"}
          alt={event.title}
          className="w-full h-full object-cover opacity-70"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent"></div>
        <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
          <Badge className="mb-3 bg-crimson-600">{event.type}</Badge>
          <h1 className="text-2xl md:text-4xl font-bold mb-2">{event.title}</h1>
          <div className="flex flex-wrap items-center gap-4 text-sm md:text-base">
            <div className="flex items-center gap-1">
              <CalendarDays className="h-4 w-4" />
              <span>
                {new Date(event.date).toLocaleDateString("en-US", {
                  weekday: "long",
                  month: "long",
                  day: "numeric",
                  year: "numeric",
                })}
              </span>
            </div>
            <div className="flex items-center gap-1">
              <Clock className="h-4 w-4" />
              <span>{event.time}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6">
        <div className="grid md:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="md:col-span-2">
            <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
              <Tabs
                value={activeTab}
                onValueChange={setActiveTab}
                className="w-full"
              >
                <TabsList className="grid w-full grid-cols-3 mb-6">
                  <TabsTrigger value="details">Details</TabsTrigger>
                  <TabsTrigger value="teacher">Teacher</TabsTrigger>
                  <TabsTrigger value="schedule">Schedule</TabsTrigger>
                </TabsList>

                <TabsContent value="details" className="space-y-6">
                  <div>
                    <h2 className="text-xl font-semibold mb-4">
                      About This Event
                    </h2>
                    <p className="text-gray-700 whitespace-pre-line">
                      {event.description}
                    </p>

                    {event.tags && event.tags.length > 0 && (
                      <div className="mt-6">
                        <h3 className="font-medium mb-2">Tags</h3>
                        <div className="flex flex-wrap gap-2">
                          {event.tags.map((tag) => (
                            <Badge
                              key={tag}
                              variant="outline"
                              className="bg-gray-50"
                            >
                              <Tag className="h-3 w-3 mr-1" />
                              {tag}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </TabsContent>

                <TabsContent value="teacher">
                  <div className="flex flex-col sm:flex-row gap-6 items-start sm:items-center mb-6">
                    <Avatar className="w-20 h-20">
                      {event.teacher.image && (
                        <AvatarImage
                          src={event.teacher.image}
                          alt={event.teacher.name}
                        />
                      )}
                      <AvatarFallback className="bg-crimson-100 text-crimson-700 text-xl">
                        {event.teacher.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <h2 className="text-xl font-semibold">
                        {event.teacher.name}
                      </h2>
                      {event.teacher.speciality && (
                        <p className="text-gray-600">
                          {event.teacher.speciality}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="space-y-4">
                    {event.teacher.description && (
                      <>
                        <h3 className="font-medium">About the Teacher</h3>
                        <p className="text-gray-700">
                          {event.teacher.description}
                        </p>
                      </>
                    )}

                    {event.teacher.credentials &&
                      event.teacher.credentials.length > 0 && (
                        <div>
                          <h3 className="font-medium mb-2">Credentials</h3>
                          <ul className="space-y-1 text-gray-700">
                            {event.teacher.credentials.map(
                              (credential, index) => (
                                <li key={index} className="flex gap-2">
                                  <div className="mt-1 flex-shrink-0 text-crimson-600">
                                    •
                                  </div>
                                  <div>{credential}</div>
                                </li>
                              )
                            )}
                          </ul>
                        </div>
                      )}

                    {event.teacher.link && (
                      <div className="mt-4">
                        <a
                          href={event.teacher.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-crimson-600 hover:underline"
                        >
                          Visit teacher's profile
                        </a>
                      </div>
                    )}
                  </div>
                </TabsContent>

                <TabsContent value="schedule">
                  <div>
                    <h2 className="text-xl font-semibold mb-4">
                      Event Schedule
                    </h2>
                    {event.schedule &&
                    Object.keys(event.schedule).length > 0 ? (
                      <div className="space-y-4">
                        {Object.entries(event.schedule).map(
                          ([time, item], index) => (
                            <div key={index} className="flex gap-4">
                              <div className="w-24 text-center">
                                <div
                                  className={`${
                                    index === 0
                                      ? "bg-crimson-100 text-crimson-700"
                                      : "bg-gray-100 text-gray-700"
                                  } rounded-md py-1 px-2 text-sm font-medium`}
                                >
                                  {time}
                                </div>
                              </div>
                              <div>
                                <p className="font-medium">{item.title}</p>
                                {item.description && (
                                  <p className="text-sm text-gray-600">
                                    {item.description}
                                  </p>
                                )}
                              </div>
                            </div>
                          )
                        )}
                      </div>
                    ) : (
                      <p className="text-gray-600">
                        No detailed schedule available for this event.
                      </p>
                    )}
                  </div>
                </TabsContent>
              </Tabs>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Event Details Card */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="font-semibold">Event Details</h3>
                  <Button
                    variant="ghost"
                    size="icon"
                    className={isFavorite ? "text-red-500" : ""}
                    onClick={onToggleFavorite}
                  >
                    <Heart
                      className={`h-5 w-5 ${isFavorite ? "fill-red-500" : ""}`}
                    />
                  </Button>
                </div>

                <div className="space-y-3 pt-2">
                  <div className="flex items-start gap-3">
                    <Calendar className="h-5 w-5 text-gray-500 mt-0.5" />
                    <div>
                      <div className="font-medium">Date</div>
                      <div className="text-gray-600">
                        {new Date(event.date).toLocaleDateString("en-US", {
                          weekday: "long",
                          month: "long",
                          day: "numeric",
                          year: "numeric",
                        })}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <Clock className="h-5 w-5 text-gray-500 mt-0.5" />
                    <div>
                      <div className="font-medium">Time</div>
                      <div className="text-gray-600">{event.time}</div>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <MapPin className="h-5 w-5 text-gray-500 mt-0.5" />
                    <div>
                      <div className="font-medium">Location</div>
                      <div className="text-gray-600">{event.location}</div>
                      {event.location !== "Online" && (
                        <Button
                          variant="link"
                          className="h-auto p-0 text-crimson-600"
                        >
                          View on map
                        </Button>
                      )}
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <User className="h-5 w-5 text-gray-500 mt-0.5" />
                    <div>
                      <div className="font-medium">Teacher</div>
                      <div className="text-gray-600">{event.teacher.name}</div>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <Users className="h-5 w-5 text-gray-500 mt-0.5" />
                    <div>
                      <div className="font-medium">Attendance</div>
                      <div className="text-gray-600">
                        {event.attending || 0} / {event.capacity || "∞"}{" "}
                        registered
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
                        <div
                          className="bg-crimson-600 h-2 rounded-full"
                          style={{
                            width: `${
                              ((event.attending || 0) / (event.capacity || 1)) *
                              100
                            }%`,
                          }}
                        ></div>
                      </div>
                      {isAlmostSoldOut && !isSoldOut && (
                        <div className="text-sm text-amber-600 mt-1">
                          Only {spotsLeft} spots left!
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <div className="pt-2">
                  {isSoldOut ? (
                    <Button
                      className="w-full bg-gray-600 hover:bg-gray-700"
                      disabled
                    >
                      Registration Closed
                    </Button>
                  ) : isRegistered ? (
                    <Button
                      className="w-full bg-green-600 hover:bg-green-700"
                      disabled
                    >
                      Registration Complete
                    </Button>
                  ) : (
                    <Button
                      className="w-full bg-crimson-600 hover:bg-crimson-700"
                      onClick={() => setIsFormOpen(true)}
                    >
                      Register Now
                    </Button>
                  )}

                  <div className="flex mt-3 gap-2">
                    <Button
                      variant="outline"
                      className="flex-1"
                      onClick={onToggleFavorite}
                    >
                      <Heart
                        className={`h-4 w-4 mr-1 ${
                          isFavorite ? "fill-red-500 text-red-500" : ""
                        }`}
                      />
                      Save
                    </Button>
                    <Button
                      variant="outline"
                      className="flex-1"
                      onClick={() => setIsShareDialogOpen(true)}
                    >
                      <Share2 className="h-4 w-4 mr-1" />
                      Share
                    </Button>
                  </div>
                </div>
              </div>
            </div>

            {/* Related Events */}
            {relatedEvents.length > 0 && (
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h3 className="font-semibold mb-4">Similar Events</h3>
                <div className="space-y-4">
                  {relatedEvents.slice(0, 3).map((relatedEvent) => (
                    <div
                      key={relatedEvent._id.toString()}
                      className="flex gap-3 pb-4 border-b last:border-b-0 last:pb-0"
                    >
                      <div className="w-16 h-16 flex-shrink-0 rounded-md overflow-hidden">
                        <img
                          src={relatedEvent.image || "/placeholder.svg"}
                          alt={relatedEvent.title}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium text-sm line-clamp-2">
                          {relatedEvent.title}
                        </h4>
                        <div className="text-xs text-gray-600 mt-1 flex items-center">
                          <CalendarDays className="h-3 w-3 mr-1" />
                          {new Date(relatedEvent.date).toLocaleDateString(
                            "en-US",
                            {
                              month: "short",
                              day: "numeric",
                            }
                          )}
                        </div>
                        <div className="text-xs text-gray-600 mt-1 flex items-center">
                          <MapPin className="h-3 w-3 mr-1" />
                          {relatedEvent.location}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                {relatedEvents.length > 3 && (
                  <Button
                    variant="link"
                    className="w-full text-crimson-600 mt-2"
                  >
                    View all similar events
                  </Button>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Registration Form Dialog */}
      <EventRegistrationForm
        event={event}
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        onSuccessfulRegistration={handleSuccessfulRegistration}
      />
      <ShareDialog
        open={isShareDialogOpen}
        onClose={() => setIsShareDialogOpen(false)}
        title={event.title}
        url={typeof window !== "undefined" ? window.location.href : ""}
      />
    </div>
  );
}
