"use client";

import { useState, useRef } from "react";
import { motion, useInView } from "framer-motion";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

export function AboutSection() {
  const ref = useRef(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const isInView = useInView(ref, { once: true });
  const [isOpen, setIsOpen] = useState(false);

  // Handle dialog state changes
  const handleOpenChange = (open: boolean) => {
    setIsOpen(open);

    // Pause video when dialog closes
    if (!open && videoRef.current) {
      videoRef.current.pause();
    }
  };

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
            <video
              src="/meditation_video.mp4"
              className="w-full h-full object-cover"
              controls={false}
              muted
              loop
              autoPlay
              playsInline
            />
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-6">
              <Dialog open={isOpen} onOpenChange={handleOpenChange}>
                <DialogTrigger asChild>
                  <Button variant="secondary" className="w-full">
                    Watch Introduction Video
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-4xl">
                  <DialogHeader>
                    <DialogTitle>Introduction to Ngyungne</DialogTitle>
                  </DialogHeader>
                  <div className="aspect-video w-full">
                    <video
                      ref={videoRef}
                      src="/meditation_video.mp4"
                      className="w-full h-full object-cover rounded-md"
                      controls
                      autoPlay
                    />
                  </div>
                </DialogContent>
              </Dialog>
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
              <Link href="/about">Learn More About Ngyungne</Link>
            </Button>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
