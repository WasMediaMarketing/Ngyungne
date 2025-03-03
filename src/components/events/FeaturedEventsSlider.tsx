"use client";
import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay } from "swiper/modules";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { CalendarDays, Clock, MapPin, ArrowRight } from "lucide-react";
import Link from "next/link";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { Event } from "@/data/events";

interface FeaturedEventsSliderProps {
  events: Event[];
}

export function FeaturedEventsSlider({ events }: FeaturedEventsSliderProps) {
  const featuredRef = useRef(null);
  const isInView = useInView(featuredRef, { once: true });

  return (
    <section className="py-12 bg-white">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-bold text-crimson-800">
            Featured Events
          </h2>
          {/* <Button variant="link" className="text-crimson-600">
            View All Featured <ArrowRight className="ml-2 h-4 w-4" />
          </Button> */}
        </div>

        <motion.div
          ref={featuredRef}
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.8 }}
          className="mb-12"
        >
          <Swiper
            modules={[Navigation, Pagination, Autoplay]}
            navigation
            pagination={{ clickable: true }}
            autoplay={{ delay: 5000, disableOnInteraction: false }}
            breakpoints={{
              640: { slidesPerView: 1 },
              768: { slidesPerView: 2 },
              1024: { slidesPerView: 3 },
            }}
            spaceBetween={30}
            className="pb-12"
          >
            {events.map((event) => (
              <SwiperSlide key={event.id}>
                <Link href={`/programs/events/${event.id}`}>
                  <Card className="overflow-hidden h-full border-none shadow-md hover:shadow-xl transition-shadow duration-300">
                    <div className="aspect-video relative">
                      <img
                        src={event.image || "/placeholder.svg"}
                        alt={event.title}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-t from-black/60 to-transparent"></div>
                      <Badge className="absolute top-4 right-4 bg-crimson-600 text-white">
                        {event.type}
                      </Badge>
                      <div className="absolute bottom-4 left-4 text-white">
                        <div className="flex items-center gap-2 text-sm">
                          <CalendarDays className="h-4 w-4" />
                          <span>
                            {event.date.toLocaleDateString("en-US", {
                              month: "short",
                              day: "numeric",
                            })}
                          </span>
                        </div>
                      </div>
                    </div>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-xl text-crimson-700 line-clamp-1">
                        {event.title}
                      </CardTitle>
                      <div className="flex items-center mt-1">
                        <Avatar className="h-6 w-6 mr-2">
                          <AvatarImage src="/avatar.png" />
                          <AvatarFallback className="bg-crimson-100 text-crimson-700 text-xs">
                            {event.teacher
                              .split(" ")
                              .map((n) => n[0])
                              .join("")}
                          </AvatarFallback>
                        </Avatar>
                        <span className="text-sm text-gray-600">
                          {event.teacher}
                        </span>
                      </div>
                    </CardHeader>
                    <CardContent className="pb-2">
                      <div className="flex items-center gap-2 text-sm text-gray-600 mb-1">
                        <Clock className="h-4 w-4 text-gray-400" />
                        <span>{event.time}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <MapPin className="h-4 w-4 text-gray-400" />
                        <span>{event.location}</span>
                      </div>
                      <div className="mt-3 flex items-center text-sm text-gray-600">
                        <div className="flex -space-x-2 mr-2">
                          {[...Array(3)].map((_, i) => (
                            <Avatar
                              key={i}
                              className="h-6 w-6 border-2 border-white"
                            >
                              <AvatarFallback className="bg-gray-200 text-gray-600 text-xs">
                                {String.fromCharCode(65 + i)}
                              </AvatarFallback>
                            </Avatar>
                          ))}
                        </div>
                        <span>{event.attending} attending</span>
                      </div>
                    </CardContent>
                    <CardFooter>
                      <Button className="w-full bg-crimson-600 hover:bg-crimson-700">
                        Register Now
                      </Button>
                    </CardFooter>
                  </Card>
                </Link>
              </SwiperSlide>
            ))}
          </Swiper>
        </motion.div>
      </div>
    </section>
  );
}
