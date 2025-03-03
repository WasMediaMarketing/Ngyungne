"use client";
import { useEffect } from "react";
import { HeroSlider } from "@/components/sections/hero-slider";
import { AboutSection } from "@/components/sections/about-section";
import { CausesSection } from "@/components/sections/causes-section";
import { ProgramsSection } from "@/components/sections/programs-section";
import { TestimonialsSection } from "@/components/sections/testimonials-section";
import { ImpactSection } from "@/components/sections/impact-section";
import { BlogSection } from "@/components/blog/blog-section";
import { SupportSection } from "@/components/sections/support-section";
import { FeaturedEventsSlider } from "@/components/events/FeaturedEventsSlider";
import { events } from "@/data/events";

export default function Home() {
  useEffect(() => {
    fetch("/api/user/admin-init"); // You can ignore the response
  }, []);

  return (
    <div className="w-full">
      <HeroSlider />
      <AboutSection />
      <ProgramsSection />
      <FeaturedEventsSlider events={events.filter((event) => event.featured)} />
      <CausesSection />
      <TestimonialsSection />
      <ImpactSection />
      <BlogSection />
      <SupportSection />
    </div>
  );
}
