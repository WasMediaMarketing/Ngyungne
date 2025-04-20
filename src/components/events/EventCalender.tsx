import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Calendar } from "@/components/ui/calendar";
import type { IEvent } from "@/types/event.types";

interface EventCalendarProps {
  events: IEvent[];
  selectedDate: Date | null;
  setSelectedDate: (date: Date | null) => void;
}

export function EventCalendar({
  events,
  selectedDate,
  setSelectedDate,
}: EventCalendarProps) {
  const getDatesWithEvents = () => {
    return events.map((event) => new Date(event.date));
  };

  // Handler that matches the expected type
  const handleSelect = (date: Date | undefined) => {
    setSelectedDate(date || null);
  };

  return (
    <Card className="bg-white shadow-sm border-0">
      <CardHeader>
        <CardTitle className="text-xl text-crimson-700">
          Event Calendar
        </CardTitle>
        <CardDescription>Select a date to view events</CardDescription>
      </CardHeader>
      <CardContent>
        <Calendar
          mode="single"
          selected={selectedDate || undefined}
          onSelect={handleSelect}
          className="rounded-md border border-gray-200"
          modifiers={{ hasEvent: getDatesWithEvents() }}
          modifiersStyles={{
            hasEvent: { backgroundColor: "rgba(220, 38, 38, 0.1)" },
          }}
        />

        <div className="mt-4 pt-4 border-t border-gray-100">
          <h3 className="font-medium text-gray-800 mb-3">
            Upcoming highlights
          </h3>
          <div className="space-y-3">
            {events.slice(0, 3).map((event) => (
              <div key={event._id.toString()} className="flex gap-3">
                <div className="flex-shrink-0 w-12 h-12 rounded bg-crimson-100 text-crimson-700 flex flex-col items-center justify-center text-center">
                  <span className="text-xs font-medium">
                    {new Date(event.date).toLocaleDateString("en-US", {
                      month: "short",
                    })}
                  </span>
                  <span className="text-lg font-bold">
                    {new Date(event.date).getDate()}
                  </span>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-800">
                    {event.title}
                  </h4>
                  <p className="text-xs text-gray-500">{event.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
