"use client";

import { useState } from "react";
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
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CalendarDays, MapPin, Clock, Users, DollarSign } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { RetreatRegistrationForm } from "@/components/retreat/RetreatRegistrationForm";

interface Retreat {
  id: number;
  title: string;
  description: string;
  date: string;
  duration: string;
  location: string;
  participants: string;
  price: string;
  type: string;
  schedule: Array<{ time: string; activity: string }>;
}

const retreats: Retreat[] = [
  {
    id: 1,
    title: "Weekend Zen Retreat",
    description:
      "A two-day immersive experience in Zen meditation and mindfulness practices.",
    date: "June 15-16, 2025",
    duration: "2 days",
    location: "Mountain Zen Center",
    participants: "20",
    price: "$250",
    type: "Zen",
    schedule: [
      { time: "5:00 AM", activity: "Wake-up bell" },
      { time: "5:30 AM", activity: "Morning meditation" },
      { time: "7:00 AM", activity: "Breakfast" },
      { time: "9:00 AM", activity: "Dharma talk" },
      { time: "11:00 AM", activity: "Walking meditation" },
      { time: "12:00 PM", activity: "Lunch" },
      { time: "2:00 PM", activity: "Work practice" },
      { time: "4:00 PM", activity: "Afternoon meditation" },
      { time: "6:00 PM", activity: "Dinner" },
      { time: "7:30 PM", activity: "Evening meditation" },
      { time: "9:00 PM", activity: "Rest" },
    ],
  },
  {
    id: 2,
    title: "Vipassana Silent Retreat",
    description:
      "A week-long silent retreat focusing on Vipassana meditation techniques.",
    date: "July 1-7, 2025",
    duration: "7 days",
    location: "Insight Meditation Center",
    participants: "30",
    price: "$600",
    type: "Vipassana",
    schedule: [
      { time: "4:00 AM", activity: "Wake-up bell" },
      { time: "4:30 AM", activity: "Morning meditation" },
      { time: "6:30 AM", activity: "Breakfast" },
      { time: "8:00 AM", activity: "Group meditation" },
      { time: "11:00 AM", activity: "Walking meditation" },
      { time: "12:00 PM", activity: "Lunch" },
      { time: "2:00 PM", activity: "Individual meditation" },
      { time: "5:00 PM", activity: "Tea time" },
      { time: "6:00 PM", activity: "Evening discourse" },
      { time: "8:00 PM", activity: "Final meditation" },
      { time: "9:30 PM", activity: "Rest" },
    ],
  },
];

export default function Retreats() {
  const [selectedRetreat, setSelectedRetreat] = useState<Retreat | null>(null);

  return (
    <div className="container mx-auto px-4 py-8">
      <Breadcrumbs />
      <motion.h1
        className="text-4xl font-bold mb-6 text-crimson-800"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        Retreats
      </motion.h1>
      <motion.p
        className="text-xl mb-8 text-maroon-700"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        Immerse yourself in our transformative meditation retreats.
      </motion.p>
      {retreats.map((retreat, index) => (
        <motion.div
          key={retreat.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: index * 0.1 + 0.3 }}
        >
          <Card className="mb-8 bg-saffron-50 border-saffron-200">
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-2xl text-crimson-700">
                    {retreat.title}
                  </CardTitle>
                  <CardDescription className="text-maroon-600 mt-1">
                    {retreat.description}
                  </CardDescription>
                </div>
                <Badge
                  variant="secondary"
                  className="bg-saffron-200 text-crimson-700"
                >
                  {retreat.type}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div className="flex items-center text-maroon-800">
                  <CalendarDays className="mr-2 h-4 w-4" />
                  {retreat.date}
                </div>
                <div className="flex items-center text-maroon-800">
                  <Clock className="mr-2 h-4 w-4" />
                  {retreat.duration}
                </div>
                <div className="flex items-center text-maroon-800">
                  <MapPin className="mr-2 h-4 w-4" />
                  {retreat.location}
                </div>
                <div className="flex items-center text-maroon-800">
                  <Users className="mr-2 h-4 w-4" />
                  {retreat.participants} participants
                </div>
                <div className="flex items-center text-maroon-800">
                  <DollarSign className="mr-2 h-4 w-4" />
                  {retreat.price}
                </div>
              </div>
              <Tabs defaultValue="schedule" className="w-full">
                <TabsList className="bg-saffron-100">
                  <TabsTrigger
                    value="schedule"
                    className="data-[state=active]:bg-saffron-300 data-[state=active]:text-crimson-800"
                  >
                    Schedule
                  </TabsTrigger>
                  <TabsTrigger
                    value="register"
                    className="data-[state=active]:bg-saffron-300 data-[state=active]:text-crimson-800"
                  >
                    Register
                  </TabsTrigger>
                </TabsList>
                <TabsContent value="schedule">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
                    {retreat.schedule.map((item, scheduleIndex) => (
                      <div
                        key={scheduleIndex}
                        className="flex items-center justify-between bg-white p-2 rounded-md shadow-sm"
                      >
                        <span className="font-medium text-crimson-700">
                          {item.time}
                        </span>
                        <span className="text-maroon-600">{item.activity}</span>
                      </div>
                    ))}
                  </div>
                </TabsContent>
                <TabsContent value="register">
                  <div className="mt-4">
                    <p className="text-maroon-700 mb-4">
                      Ready to join this transformative retreat? Register now to
                      secure your spot.
                    </p>
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button
                          className="bg-crimson-600 hover:bg-crimson-700 text-white"
                          onClick={() => setSelectedRetreat(retreat)}
                        >
                          Register for Retreat
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="sm:max-w-[425px] md:max-w-[600px] lg:max-w-[800px] max-h-[80vh] overflow-auto">
                        <DialogHeader>
                          <DialogTitle>
                            Register for {selectedRetreat?.title}
                          </DialogTitle>
                          <DialogDescription>
                            Please fill out the form below to register for the
                            retreat.
                          </DialogDescription>
                        </DialogHeader>
                        <RetreatRegistrationForm retreat={selectedRetreat} />
                      </DialogContent>
                    </Dialog>
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </motion.div>
      ))}
    </div>
  );
}
