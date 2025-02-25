"use client";

import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";

export function AboutSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  return (
    <section id="about" className="py-20 relative overflow-hidden">
      <div className="absolute inset-0 mandala-bg" />
      <div className="container mx-auto px-4 relative">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.8 }}
          className="grid md:grid-cols-2 gap-12 items-center"
        >
          <div className="relative h-[500px] rounded-lg overflow-hidden">
            <Image
              src="https://www.dharmaideal.org/api/image/1736165623116.jpeg"
              alt="About Ngyungne"
              fill
              className="object-cover"
            />
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-6">
              <Button variant="secondary" className="w-full">
                Watch Introduction Video
              </Button>
            </div>
          </div>
          <div className="space-y-6">
            <div className="inline-block bg-accent/10 px-4 py-2 rounded-full">
              <span className="text-accent font-medium">About Ngyungne</span>
            </div>
            <h2 className="text-4xl font-bold text-primary">
              Discover the Ancient Practice of Ngyungne
            </h2>
            <p className="text-primary/80 text-lg">
              Ngyungne is a special fasting and purification practice associated
              with Avalokiteshvara, the Buddha of Compassion. This profound
              practice has been passed down through an unbroken lineage of
              masters.
            </p>
            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-2">
                <div className="text-3xl font-bold text-secondary">1000+</div>
                <p className="text-primary/60">Years of Tradition</p>
              </div>
              <div className="space-y-2">
                <div className="text-3xl font-bold text-secondary">10000+</div>
                <p className="text-primary/60">Practitioners Worldwide</p>
              </div>
              <div className="space-y-2">
                <div className="text-3xl font-bold text-secondary">100+</div>
                <p className="text-primary/60">Qualified Teachers</p>
              </div>
              <div className="space-y-2">
                <div className="text-3xl font-bold text-secondary">50+</div>
                <p className="text-primary/60">Countries Reached</p>
              </div>
            </div>
            <Button size="lg" className="bg-primary hover:bg-primary/90">
              Learn More About Ngyungne
            </Button>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
