"use client";

import { useRef, useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay } from "swiper/modules";
import type { Swiper as SwiperType } from "swiper";
import { ChevronLeft, ChevronRight } from "lucide-react";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import Link from "next/link";
import { sliderApi } from "@/utils/sliderApi";
import type { ISlider } from "@/types/slider.types";

export function HeroSlider() {
  const swiperRef = useRef<SwiperType>();
  const [slides, setSlides] = useState<ISlider[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSlides = async () => {
      try {
        setLoading(true);
        const data = await sliderApi.getPublicSliders();
        // Sort by order field
        const sortedSlides = data.sort(
          (a, b) => (a.order || 0) - (b.order || 0)
        );
        setSlides(sortedSlides);
      } catch (err) {
        console.error("Error fetching slides:", err);
        setError("Failed to load slides");
      } finally {
        setLoading(false);
      }
    };

    fetchSlides();
  }, []);

  // If no slides are available, use fallback data
  const fallbackSlides = [
    {
      title: "Ven. Khen Ripoche Sonam Gyurme",
      date: "Dec 8, 2024",
      time: "08:30 AM-10:00 AM",
      subject: "Meditation",
      image:
        "https://cdn.pixabay.com/photo/2024/04/29/10/29/buddha-8727582_1280.png",
    },
    {
      title: "H.E. Choknyi Rinpoche",
      date: "Dec 8, 2024",
      time: "01:00 PM-02:30 PM",
      subject: "Teaching",
      image:
        "https://cdn.pixabay.com/photo/2024/04/29/10/29/buddha-8727582_1280.png",
    },
    {
      title: "Ven. Dolpo Tulku Rinpoche",
      date: "Dec 8, 2024",
      time: "07:00 PM-08:30 PM",
      subject: "Teaching",
      image:
        "https://cdn.pixabay.com/photo/2024/04/29/10/29/buddha-8727582_1280.png",
    },
  ];

  // Use actual slides if available, otherwise use fallback
  const displaySlides = slides.length > 0 ? slides : fallbackSlides;

  if (loading) {
    return (
      <section className="relative min-h-[80vh] bg-gray-100 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="relative min-h-[80vh] bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-500 mb-4">{error}</p>
          <Button onClick={() => window.location.reload()}>Retry</Button>
        </div>
      </section>
    );
  }

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
        onSwiper={(swiper) => {
          swiperRef.current = swiper;
        }}
      >
        {displaySlides.map((slide, index) => {
          // For API slides
          if ("media" in slide) {
            const mediaUrl =
              slide.media.sourceType === "file"
                ? slide.media.file
                : slide.media.url;

            return (
              <SwiperSlide key={index}>
                <div className="relative h-full">
                  {slide.media.type === "image" ? (
                    <Image
                      src={mediaUrl || "/placeholder.svg"}
                      alt={slide.title || ""}
                      fill
                      className="object-cover"
                      priority={index === 0}
                    />
                  ) : (
                    <video
                      src={mediaUrl || ""}
                      className="w-full h-full object-cover"
                      autoPlay
                      muted
                      loop
                      playsInline
                    />
                  )}
                  <div className="absolute inset-0 bg-black/50" />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center text-white px-4">
                      <h2 className="text-4xl md:text-6xl font-bold mb-4">
                        {slide.title}
                      </h2>
                      <p className="text-xl mb-6">{slide.description}</p>
                      {slide.buttonText && slide.buttonUrl && (
                        <Button
                          size="lg"
                          variant="default"
                          className="bg-primary hover:bg-primary/90"
                          asChild
                        >
                          <Link href={slide.buttonUrl}>{slide.buttonText}</Link>
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              </SwiperSlide>
            );
          }
          // For fallback slides
          else {
            return (
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
                        <Link href="/programs/events">View Details</Link>
                      </Button>
                    </div>
                  </div>
                </div>
              </SwiperSlide>
            );
          }
        })}
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
