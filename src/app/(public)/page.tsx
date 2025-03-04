"use client";
import { useEffect, useRef } from "react";
import { HeroSlider } from "@/components/sections/hero-slider";
import { AboutSection } from "@/components/sections/about-section";
import { CausesSection } from "@/components/sections/causes-section";
// import { ProgramsSection } from "@/components/sections/programs-section";
import { TestimonialsSection } from "@/components/sections/testimonials-section";
import { ImpactSection } from "@/components/sections/impact-section";
import { BlogSection } from "@/components/blog/blog-section";
import { SupportSection } from "@/components/sections/support-section";
import { FeaturedEventsSlider } from "@/components/events/FeaturedEventsSlider";
import { events } from "@/data/events";
import { TeachingsSection } from "@/components/sections/teachings-section";
export default function Home() {
  const apiCallDone = useRef(false); // useRef to track whether API has been called

  useEffect(() => {
    if (!apiCallDone.current) {
      fetch("/api/user/admin-init");
      apiCallDone.current = true;
    }
  }, []);

  console.log("API call done:", apiCallDone.current);

  return (
    <div className="w-full">
      <HeroSlider />
      <AboutSection />
      {/* <ProgramsSection /> */}
      <TeachingsSection />
      <FeaturedEventsSlider events={events.filter((event) => event.featured)} />
      <CausesSection />
      <TestimonialsSection />
      <ImpactSection />
      <BlogSection />
      <SupportSection />
    </div>
  );
}
