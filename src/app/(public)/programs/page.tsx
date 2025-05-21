"use client";

import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Calendar,
  HeartHandshake,
  Users,
  MapPin,
  Clock,
  ArrowRight,
  Loader2,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { causeApi } from "@/utils/causeApi";
import { eventApi } from "@/utils/eventApi";
import { retreatApi } from "@/utils/retreatApi";
import type { CauseUI } from "@/utils/causeApi";
import type { IEvent, IRetreat } from "@/types";

// Format date to readable string
const formatDate = (dateString: string | Date) => {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

// Calculate progress percentage
const calculateProgress = (raised: number, goal: number) => {
  return Math.floor((raised / goal) * 100);
};

export default function ProgramsPage() {
  // State for data
  const [causes, setCauses] = useState<CauseUI[]>([]);
  const [events, setEvents] = useState<IEvent[]>([]);
  const [retreats, setRetreats] = useState<IRetreat[]>([]);

  // State for loading and errors
  const [causesLoading, setCausesLoading] = useState(true);
  const [eventsLoading, setEventsLoading] = useState(true);
  const [retreatsLoading, setRetreatLoading] = useState(true);

  const [causesError, setCausesError] = useState<string | null>(null);
  const [eventsError, setEventsError] = useState<string | null>(null);
  const [retreatsError, setRetreatsError] = useState<string | null>(null);

  // Fetch causes
  useEffect(() => {
    async function fetchCauses() {
      try {
        setCausesLoading(true);
        const data = await causeApi.getCauses();
        setCauses(data);
        setCausesError(null);
      } catch (err) {
        console.error("Error fetching causes:", err);
        setCausesError("Failed to load causes. Please try again later.");
      } finally {
        setCausesLoading(false);
      }
    }

    fetchCauses();
  }, []);

  // Fetch events
  useEffect(() => {
    async function fetchEvents() {
      try {
        setEventsLoading(true);
        const data = await eventApi.getEvents();
        setEvents(data);
        setEventsError(null);
      } catch (err) {
        console.error("Error fetching events:", err);
        setEventsError("Failed to load events. Please try again later.");
      } finally {
        setEventsLoading(false);
      }
    }

    fetchEvents();
  }, []);

  // Fetch retreats
  useEffect(() => {
    async function fetchRetreats() {
      try {
        setRetreatLoading(true);
        const data = await retreatApi.getPublicRetreats();
        setRetreats(data);
        setRetreatsError(null);
      } catch (err) {
        console.error("Error fetching retreats:", err);
        setRetreatsError("Failed to load retreats. Please try again later.");
      } finally {
        setRetreatLoading(false);
      }
    }

    fetchRetreats();
  }, []);

  // Process retreat data
  const retreatTypes = retreats.reduce((acc, retreat) => {
    const type = retreat.type || "General";
    if (!acc[type]) {
      acc[type] = [];
    }
    acc[type].push(retreat);
    return acc;
  }, {} as Record<string, IRetreat[]>);

  // Get retreat type summaries
  const retreatTypeSummaries = Object.entries(retreatTypes).map(
    ([type, retreats]) => {
      const durations = retreats.map((r) => r.duration);
      const avgDuration =
        durations.length > 0
          ? durations[Math.floor(durations.length / 2)]
          : "Varies";

      return {
        title: type,
        description: `${type} retreats focusing on deep practice and spiritual growth`,
        duration: avgDuration,
        frequency: retreats.length > 3 ? "Regular" : "Occasional",
      };
    }
  );

  // Limit to 3 items for each section
  const upcomingEvents = events
    .filter((event) => new Date(event.date) > new Date())
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    .slice(0, 3);

  const featuredCauses = causes.filter((cause) => cause.isVisible).slice(0, 3);

  // Loading indicator component
  const LoadingIndicator = () => (
    <div className="flex justify-center items-center py-12">
      <Loader2 className="h-8 w-8 animate-spin text-amber-600" />
    </div>
  );

  // Error message component
  const ErrorMessage = ({ message }: { message: string }) => (
    <div className="text-center py-8">
      <p className="text-red-500">{message}</p>
      <Button
        variant="outline"
        className="mt-4"
        onClick={() => window.location.reload()}
      >
        Try Again
      </Button>
    </div>
  );

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4">Programs & Events</h1>
        <p className="text-lg text-gray-600 max-w-3xl mx-auto">
          Join our community for transformative events, retreats, and charitable
          initiatives that put Buddhist teachings into practice and foster
          connections with fellow practitioners.
        </p>
      </div>

      {/* Featured Programs */}
      <section className="mb-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <Card className="text-center">
            <CardHeader>
              <Calendar className="h-12 w-12 mx-auto text-amber-600" />
              <CardTitle className="mt-4">Events</CardTitle>
              <CardDescription>
                Public talks, ceremonies, and community gatherings
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="mb-6">
                Join us for regular events including dharma talks, special
                ceremonies, and community celebrations throughout the year.
              </p>
            </CardContent>
            <CardFooter className="flex justify-center">
              <Button asChild>
                <Link href="/programs/events">
                  View Calendar <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </CardFooter>
          </Card>

          <Card className="text-center">
            <CardHeader>
              <Users className="h-12 w-12 mx-auto text-amber-600" />
              <CardTitle className="mt-4">Retreats</CardTitle>
              <CardDescription>
                Immersive meditation experiences in supportive settings
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="mb-6">
                Deepen your practice through guided retreats ranging from
                weekend intensives to extended residential programs.
              </p>
            </CardContent>
            <CardFooter className="flex justify-center">
              <Button asChild>
                <Link href="/programs/retreats">
                  Explore Retreats <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </CardFooter>
          </Card>

          <Card className="text-center">
            <CardHeader>
              <HeartHandshake className="h-12 w-12 mx-auto text-amber-600" />
              <CardTitle className="mt-4">Causes</CardTitle>
              <CardDescription>
                Charitable initiatives and community service projects
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="mb-6">
                Support our ongoing causes that embody Buddhist principles of
                compassion, generosity, and service to others.
              </p>
            </CardContent>
            <CardFooter className="flex justify-center">
              <Button asChild>
                <Link href="/programs/causes">
                  Support Causes <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </CardFooter>
          </Card>
        </div>
      </section>

      {/* Upcoming Events */}
      <section className="mb-16">
        <h2 className="text-2xl font-bold mb-6">Upcoming Events</h2>

        {eventsLoading ? (
          <LoadingIndicator />
        ) : eventsError ? (
          <ErrorMessage message={eventsError} />
        ) : upcomingEvents.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {upcomingEvents.map((event) => (
              <Card key={event.id.toString()} className="overflow-hidden">
                <div className="w-full h-48 relative">
                  <Image
                    src={event.image || "/placeholder.svg?height=200&width=400"}
                    alt={event.title}
                    fill
                    className="object-cover"
                  />
                </div>
                <CardHeader>
                  <CardTitle>{event.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3 mb-4">
                    <div className="flex items-start">
                      <Calendar className="h-4 w-4 mr-2 mt-1 text-amber-600" />
                      <span>{formatDate(event.date)}</span>
                    </div>
                    <div className="flex items-start">
                      <MapPin className="h-4 w-4 mr-2 mt-1 text-amber-600" />
                      <span>{event.location}</span>
                    </div>
                  </div>
                  <p className="text-gray-600 line-clamp-3">
                    {event.description}
                  </p>
                </CardContent>
                <CardFooter>
                  <Button variant="outline" className="w-full" asChild>
                    <Link href={`/programs/events/${event.id}`}>
                      Learn More
                    </Link>
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <p className="text-gray-500">
              No upcoming events at this time. Check back soon!
            </p>
          </div>
        )}

        <div className="text-center mt-8">
          <Button variant="outline" size="lg" asChild>
            <Link href="/programs/events">View All Events</Link>
          </Button>
        </div>
      </section>

      {/* Retreats Section */}
      <section className="mb-16">
        <h2 className="text-2xl font-bold mb-6">Retreat Programs</h2>

        {retreatsLoading ? (
          <LoadingIndicator />
        ) : retreatsError ? (
          <ErrorMessage message={retreatsError} />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {retreatTypeSummaries.length > 0 ? (
              retreatTypeSummaries.slice(0, 3).map((retreat, index) => (
                <Card key={index}>
                  <CardHeader>
                    <CardTitle>{retreat.title}</CardTitle>
                    <CardDescription>{retreat.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex items-center">
                        <Clock className="h-4 w-4 mr-2 text-amber-600" />
                        <span>Duration: {retreat.duration}</span>
                      </div>
                      <div className="flex items-center">
                        <Calendar className="h-4 w-4 mr-2 text-amber-600" />
                        <span>Frequency: {retreat.frequency}</span>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button variant="outline" className="w-full" asChild>
                      <Link href="/programs/retreats">View Schedule</Link>
                    </Button>
                  </CardFooter>
                </Card>
              ))
            ) : (
              <div className="col-span-3 text-center py-8">
                <p className="text-gray-500">
                  No retreat programs available at this time. Check back soon!
                </p>
              </div>
            )}
          </div>
        )}
      </section>

      {/* Causes Section */}
      <section>
        <h2 className="text-2xl font-bold mb-6">Current Causes</h2>

        {causesLoading ? (
          <LoadingIndicator />
        ) : causesError ? (
          <ErrorMessage message={causesError} />
        ) : featuredCauses.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {featuredCauses.map((cause) => (
              <Card key={cause.id} className="overflow-hidden">
                <div className="w-full h-48 relative">
                  <Image
                    src={cause.image || "/placeholder.svg?height=200&width=400"}
                    alt={cause.title}
                    fill
                    className="object-cover"
                  />
                </div>
                <CardHeader>
                  <CardTitle>{cause.title}</CardTitle>
                  <CardDescription>{cause.subtitle}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>
                          Progress: ${cause.raised.toLocaleString()} of $
                          {cause.goal.toLocaleString()}
                        </span>
                        <span>
                          {calculateProgress(cause.raised, cause.goal)}%
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-amber-600 h-2 rounded-full"
                          style={{
                            width: `${calculateProgress(
                              cause.raised,
                              cause.goal
                            )}%`,
                          }}
                        ></div>
                      </div>
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button className="w-full" asChild>
                    <Link href={`/programs/causes/${cause.id}`}>
                      Support This Cause
                    </Link>
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <p className="text-gray-500">
              No active causes at this time. Check back soon!
            </p>
          </div>
        )}
      </section>
    </div>
  );
}
