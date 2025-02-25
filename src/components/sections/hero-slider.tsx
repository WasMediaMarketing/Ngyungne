"use client";

import { useRef } from "react";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay } from "swiper/modules";
import type { Swiper as SwiperType } from "swiper";
import { ChevronLeft, ChevronRight } from "lucide-react";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

const slides = [
  {
    title: "Ven. Khen Ripoche Sonam Gyurme",
    date: "Dec 8, 2024",
    time: "08:30 AM-10:00 AM",
    subject: "Meditation",
    image: "https://www.dharmaideal.org/api/image/1736165623116.jpeg",
  },
  {
    title: "H.E. Choknyi Rinpoche",
    date: "Dec 8, 2024",
    time: "01:00 PM-02:30 PM",
    subject: "Teaching",
    image: "https://www.dharmaideal.org/api/image/1736165623116.jpeg",
  },
  {
    title: "Ven. Dolpo Tulku Rinpoche",
    date: "Dec 8, 2024",
    time: "07:00 PM-08:30 PM",
    subject: "Teaching",
    image: "https://www.dharmaideal.org/api/image/1736165623116.jpeg",
  },
];

export function HeroSlider() {
  const swiperRef = useRef<SwiperType>(null);

  return (
    <section className="relative min-h-[80vh]">
      <Swiper
        modules={[Navigation, Pagination, Autoplay]}
        navigation={{
          enabled: true,
        }}
        pagination={{
          clickable: true,
        }}
        autoplay={{ delay: 5000 }}
        loop
        className="h-[80vh]"
        onBeforeInit={(swiper) => {
          swiperRef.current = swiper;
        }}
      >
        {slides.map((slide, index) => (
          <SwiperSlide key={index}>
            <div className="relative h-full">
              <Image
                src={slide.image || "/placeholder.svg"}
                alt={slide.title}
                fill
                className="object-cover"
                priority={index === 0}
              />
              <div className="absolute inset-0 bg-black/50" />
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center text-white px-4">
                  <h2 className="text-4xl md:text-6xl font-bold mb-4">
                    {slide.title}
                  </h2>
                  <p className="text-xl mb-2">{slide.subject}</p>
                  <p className="text-lg mb-6">
                    {slide.date} | {slide.time}
                  </p>
                  <Button
                    size="lg"
                    variant="default"
                    className="bg-primary hover:bg-primary/90"
                  >
                    Register Now
                  </Button>
                </div>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
      <div className="absolute left-4 top-1/2 transform -translate-y-1/2 z-10">
        <Button
          variant="outline"
          size="icon"
          className="bg-black/50 hover:bg-black/70 text-white rounded-full"
          onClick={() => swiperRef.current?.slidePrev()}
        >
          <ChevronLeft className="h-6 w-6" />
        </Button>
      </div>
      <div className="absolute right-4 top-1/2 transform -translate-y-1/2 z-10">
        <Button
          variant="outline"
          size="icon"
          className="bg-black/50 hover:bg-black/70 text-white rounded-full"
          onClick={() => swiperRef.current?.slideNext()}
        >
          <ChevronRight className="h-6 w-6" />
        </Button>
      </div>
      <style jsx global>{`
        .swiper-pagination-bullet {
          background-color: #ffffff;
          opacity: 0.5;
        }
        .swiper-pagination-bullet-active {
          background-color: #ffffff;
          opacity: 1;
        }
        .swiper-button-prev,
        .swiper-button-next {
          display: none;
        }
      `}</style>
    </section>
  );
}
