"use client";

import { useState, useEffect } from "react";
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
import {
  CalendarDays,
  MapPin,
  Clock,
  Users,
  DollarSign,
  Loader2,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { RetreatRegistrationForm } from "@/components/retreat/RetreatRegistrationForm";
import { retreatApi } from "@/utils/retreatApi";
import type { IRetreat } from "@/types";
import { format } from "date-fns";

export default function Retreats() {
  const [retreats, setRetreats] = useState<IRetreat[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedRetreat, setSelectedRetreat] = useState<IRetreat | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchRetreats() {
      try {
        setLoading(true);
        const data = await retreatApi.getPublicRetreats();
        setRetreats(data);
        setError(null);
      } catch (err) {
        console.error("Error fetching retreats:", err);
        setError("Failed to load retreats. Please try again later.");
      } finally {
        setLoading(false);
      }
    }

    fetchRetreats();
  }, []);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8 flex justify-center items-center min-h-[60vh]">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-primary" />
          <p>Loading retreats...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Breadcrumbs />
        <div className="text-center py-12">
          <h2 className="text-2xl font-bold text-red-600 mb-4">Error</h2>
          <p className="mb-6">{error}</p>
          <Button onClick={() => window.location.reload()}>Try Again</Button>
        </div>
      </div>
    );
  }

  if (retreats.length === 0) {
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
        <div className="text-center py-12">
          <h2 className="text-2xl font-medium mb-4">No Retreats Available</h2>
          <p className="text-muted-foreground">
            There are currently no retreats scheduled. Please check back later.
          </p>
        </div>
      </div>
    );
  }

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
          key={retreat._id.toString()}
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
                  {format(new Date(retreat.date), "MMMM d, yyyy")}
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
