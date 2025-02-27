"use client";

import { motion } from "framer-motion";
import { useRef } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Quote } from "lucide-react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

const testimonials = [
  {
    quote:
      "The teachings have transformed my understanding of Buddhism and daily practice.",
    author: "Sarah Chen",
    title: "Student",
    image:
      "https://sonamgear.com/uploads/product_images/bda50ca15f25e3045208f54062357663.jpg",
  },
  {
    quote:
      "The meditation retreat was a life-changing experience. I learned so much about mindfulness.",
    author: "David Miller",
    title: "Practitioner",
    image:
      "https://sonamgear.com/uploads/product_images/de54e474acc117695a015ff28a2d5830.jpg",
  },
  {
    quote:
      "The community here is wonderful. Everyone is so supportive and welcoming.",
    author: "Maria Garcia",
    title: "Community Member",
    image:
      "https://sonamgear.com/uploads/product_images/bda50ca15f25e3045208f54062357663.jpg",
  },
  {
    quote:
      "The Tibetan language course opened up a new world of Buddhist texts for me.",
    author: "John Smith",
    title: "Language Student",
    image:
      "https://sonamgear.com/uploads/product_images/de54e474acc117695a015ff28a2d5830.jpg",
  },
];

export function TestimonialsSection() {
  const swiperRef = useRef(null);

  return (
    <section className="py-20">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Badge variant="secondary" className="mb-4">
              Testimonials
            </Badge>
            <h2 className="text-3xl font-bold mb-4">What Our Students Say</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Hear from our community members about their experiences with our
              teachings and programs.
            </p>
          </motion.div>
        </div>

        <Swiper
          ref={swiperRef}
          modules={[Navigation, Pagination, Autoplay]}
          spaceBetween={30}
          slidesPerView={1}
          breakpoints={{
            640: { slidesPerView: 2 },
            1024: { slidesPerView: 3 },
          }}
          pagination={{ clickable: true }}
          autoplay={{ delay: 5000 }}
          className="testimonials-swiper"
        >
          {testimonials.map((testimonial, index) => (
            <SwiperSlide key={index}>
              <Card className="h-full">
                <CardContent className="p-6">
                  <Quote className="h-8 w-8 text-primary mb-4" />
                  <p className="text-lg mb-6">"{testimonial.quote}"</p>
                  <div className="flex items-center gap-4">
                    <img
                      src={testimonial.image || "/placeholder.svg"}
                      alt={testimonial.author}
                      className="w-12 h-12 rounded-full object-cover"
                    />
                    <div>
                      <h4 className="font-medium">{testimonial.author}</h4>
                      <p className="text-sm text-muted-foreground">
                        {testimonial.title}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </section>
  );
}
