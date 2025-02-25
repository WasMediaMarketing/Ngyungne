"use client";

import { motion } from "framer-motion";
import { Breadcrumbs } from "@/components/breadcrumbs";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Badge } from "@/components/ui/badge";
import { CalendarDays, MapPin, Clock } from "lucide-react";

const events = [
  {
    title: "Introduction to Mindfulness",
    description:
      "Learn the basics of mindfulness meditation in this beginner-friendly workshop.",
    date: new Date(2025, 2, 15),
    time: "10:00 AM - 12:00 PM",
    location: "Dharma Center, 123 Zen St.",
    type: "Workshop",
  },
  {
    title: "Full Moon Meditation Retreat",
    description:
      "Join us for a special meditation session under the full moon.",
    date: new Date(2025, 2, 20),
    time: "8:00 PM - 10:00 PM",
    location: "Peaceful Gardens, 456 Lotus Ln.",
    type: "Retreat",
  },
  {
    title: "Buddhist Philosophy Discussion Group",
    description:
      "Explore and discuss key concepts of Buddhist philosophy with like-minded individuals.",
    date: new Date(2025, 2, 25),
    time: "7:00 PM - 8:30 PM",
    location: "Virtual Meeting",
    type: "Discussion",
  },
];

export default function Events() {
  return (
    <div className="container mx-auto px-4 py-8">
      <Breadcrumbs />
      <motion.h1
        className="text-4xl font-bold mb-6 text-crimson-800"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        Events
      </motion.h1>
      <motion.p
        className="text-xl mb-8 text-maroon-700"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        Join our upcoming events and deepen your practice in community.
      </motion.p>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <motion.div
          className="lg:col-span-2"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <div className="grid gap-6">
            {events.map((event, index) => (
              <Card key={index} className="bg-saffron-50 border-saffron-200">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-2xl text-crimson-700">
                        {event.title}
                      </CardTitle>
                      <CardDescription className="text-maroon-600 mt-1">
                        {event.description}
                      </CardDescription>
                    </div>
                    <Badge
                      variant="secondary"
                      className="bg-saffron-200 text-crimson-700"
                    >
                      {event.type}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-col space-y-2 text-maroon-800">
                    <div className="flex items-center">
                      <CalendarDays className="mr-2 h-4 w-4" />
                      {event.date.toLocaleDateString("en-US", {
                        weekday: "long",
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </div>
                    <div className="flex items-center">
                      <Clock className="mr-2 h-4 w-4" />
                      {event.time}
                    </div>
                    <div className="flex items-center">
                      <MapPin className="mr-2 h-4 w-4" />
                      {event.location}
                    </div>
                  </div>
                  <Button className="mt-4 bg-crimson-600 hover:bg-crimson-700 text-white">
                    Register Now
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </motion.div>
        <motion.div
          className="lg:col-span-1"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <Card className="bg-saffron-50 border-saffron-200">
            <CardHeader>
              <CardTitle className="text-2xl text-crimson-700">
                Event Calendar
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Calendar
                mode="single"
                selected={new Date()}
                className="rounded-md border border-saffron-200"
              />
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
