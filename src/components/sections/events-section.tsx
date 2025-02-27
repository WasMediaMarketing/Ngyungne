"use client";

import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar, Clock, MapPin } from "lucide-react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

const events = [
  {
    title: "Morning Meditation Session",
    date: "Every Monday",
    time: "6:00 AM - 7:30 AM",
    location: "Main Temple Hall",
    teacher: "Ven. Khen Ripoche",
    image: "https://www.dharmaideal.org/api/image/1734338085080.jpeg",
  },
  {
    title: "Buddhist Philosophy Class",
    date: "Every Wednesday",
    time: "7:00 PM - 8:30 PM",
    location: "Teaching Hall",
    teacher: "H.E. Choknyi Rinpoche",
    image: "https://www.dharmaideal.org/api/image/1734338085080.jpeg",
  },
  {
    title: "Weekend Retreat",
    date: "Dec 15-17, 2024",
    time: "Full Day",
    location: "Retreat Center",
    teacher: "Ven. Dolpo Tulku Rinpoche",
    image: "https://www.dharmaideal.org/api/image/1734338085080.jpeg",
  },
];

export function EventsSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  return (
    <section id="events" className="py-20">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Upcoming Events</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Join us for teachings, meditation sessions, and retreats with our
            esteemed teachers.
          </p>
        </div>

        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.8 }}
        >
          <Swiper
            modules={[Navigation, Pagination]}
            navigation
            pagination={{ clickable: true }}
            breakpoints={{
              640: { slidesPerView: 1 },
              768: { slidesPerView: 2 },
              1024: { slidesPerView: 3 },
            }}
            spaceBetween={30}
          >
            {events.map((event, index) => (
              <SwiperSlide key={index}>
                <Card>
                  <div className="aspect-video relative">
                    <img
                      src={event.image || "/placeholder.svg"}
                      alt={event.title}
                      className="w-full h-full object-cover rounded-t-lg"
                    />
                  </div>
                  <CardHeader>
                    <CardTitle>{event.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex items-center gap-2 text-gray-600">
                        <Calendar className="h-4 w-4" />
                        <span>{event.date}</span>
                      </div>
                      <div className="flex items-center gap-2 text-gray-600">
                        <Clock className="h-4 w-4" />
                        <span>{event.time}</span>
                      </div>
                      <div className="flex items-center gap-2 text-gray-600">
                        <MapPin className="h-4 w-4" />
                        <span>{event.location}</span>
                      </div>
                      <p className="font-medium">Teacher: {event.teacher}</p>
                      <Button className="w-full mt-2">Register Now</Button>
                    </div>
                  </CardContent>
                </Card>
              </SwiperSlide>
            ))}
          </Swiper>
        </motion.div>
      </div>
    </section>
  );
}
