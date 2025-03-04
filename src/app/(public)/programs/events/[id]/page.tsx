"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { EventDetail } from "@/components/events/EventDetail";
import { events } from "@/data/events";

// This is a Next.js page component for the /programs/events/[id] route
export default function Page({ params }: { params: { id: string } }) {
  const router = useRouter();
  const eventId = params.id;

  const [favoriteEvents, setFavoriteEvents] = useState<number[]>([]);

  // Find the current event
  const event = events.find((e) => e.id === Number(eventId));

  // Find related events (same type or matching tags)
  const relatedEvents = event
    ? events.filter(
        (e) =>
          e.id !== event.id &&
          (e.type === event.type ||
            e.tags.some((tag) => event.tags.includes(tag)))
      )
    : [];

  // Load favorites from localStorage
  useEffect(() => {
    const savedFavorites = localStorage.getItem("favoriteEvents");
    if (savedFavorites) {
      setFavoriteEvents(JSON.parse(savedFavorites));
    }
  }, []);

  // Toggle favorite status
  const toggleFavorite = (id: number) => {
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

  if (!event) {
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
      isFavorite={favoriteEvents.includes(event.id)}
      onToggleFavorite={() => toggleFavorite(event.id)}
      relatedEvents={relatedEvents}
      onBack={handleBack}
    />
  );
}
