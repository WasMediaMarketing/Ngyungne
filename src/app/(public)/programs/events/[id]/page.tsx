"use client";
import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { EventDetail } from "@/components/events/EventDetail";
import { eventApi } from "@/utils/eventApi";
import type { IEvent } from "@/types/event.types";
import { Loader2 } from "lucide-react";
import { Loader } from "@/components/common/loader";

export default function Page() {
  const router = useRouter();
  const params = useParams();
  const eventId = params.id as string;
  const [event, setEvent] = useState<IEvent | null>(null);
  const [relatedEvents, setRelatedEvents] = useState<IEvent[]>([]);
  const [favoriteEvents, setFavoriteEvents] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch event and related events
  useEffect(() => {
    const fetchEventData = async () => {
      if (!eventId) return;

      setLoading(true);
      try {
        // Fetch the current event
        const eventData = await eventApi.getEventById(eventId);

        if (eventData) {
          setEvent(eventData);

          // Fetch all events to find related ones
          const allEvents = await eventApi.getEvents();

          // Find related events (same type or matching tags)
          const related = allEvents.filter((e) => {
            // Make sure we have valid IDs before comparing
            if (!e._id || !eventId) return false;

            return (
              e._id.toString() !== eventId &&
              (e.type === eventData.type ||
                (e.tags &&
                  eventData.tags &&
                  e.tags.some((tag) => eventData.tags?.includes(tag))))
            );
          });

          setRelatedEvents(related);
        }
      } catch (error) {
        console.error("Error fetching event data:", error);
      } finally {
        setLoading(false);
      }
    };

    if (eventId) {
      fetchEventData();
    }
  }, [eventId]);

  // Load favorites from localStorage
  useEffect(() => {
    const savedFavorites = localStorage.getItem("favoriteEvents");
    if (savedFavorites) {
      setFavoriteEvents(JSON.parse(savedFavorites));
    }
  }, []);

  // Toggle favorite status
  const toggleFavorite = (id: string) => {
    const newFavorites = favoriteEvents.includes(id)
      ? favoriteEvents.filter((favId) => favId !== id)
      : [...favoriteEvents, id];

    setFavoriteEvents(newFavorites);
    localStorage.setItem("favoriteEvents", JSON.stringify(newFavorites));
  };

  // Handle back navigation
  const handleBack = () => {
    router.back();
  };
  if (loading) {
    return <Loader />;
  }

  if (!event || !event._id) {
    return (
      <div className="container mx-auto px-4 py-12 text-center">
        <h2 className="text-2xl font-bold text-crimson-800 mb-4">
          Event Not Found
        </h2>
        <p className="mb-6 text-gray-600">
          The event you're looking for doesn't exist or has been removed.
        </p>
        <button
          onClick={handleBack}
          className="px-4 py-2 bg-crimson-600 text-white rounded-md hover:bg-crimson-700"
        >
          Back to Events
        </button>
      </div>
    );
  }

  return (
    <EventDetail
      event={event}
      isFavorite={favoriteEvents.includes(event._id.toString())}
      onToggleFavorite={() => toggleFavorite(event._id.toString())}
      relatedEvents={relatedEvents}
      onBack={handleBack}
    />
  );
}
