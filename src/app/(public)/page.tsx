"use client";
import { useEffect, useRef, useState } from "react";
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
import VolunteerCTA from "@/components/volunteer/volunteerCTA";
export default function Home() {
  const apiCallDone = useRef(false); // useRef to track whether API has been called
  const [readingProgress, setReadingProgress] = useState(0);

  useEffect(() => {
    if (!apiCallDone.current) {
      fetch("/api/user/admin-init");
      apiCallDone.current = true;
    }
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const docHeight =
        document.documentElement.scrollHeight - window.innerHeight;
      const progress = (scrollTop / docHeight) * 100;
      setReadingProgress(progress);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="w-full">
      <div
        className="fixed top-0 left-0 h-1 bg-gradient-to-r from-amber-400 to-crimson-500 z-50 transition-all duration-300 ease-out"
        style={{ width: `${readingProgress}%` }}
      ></div>
      <HeroSlider />
      <AboutSection />
      {/* <ProgramsSection /> */}
      <TeachingsSection />
      <FeaturedEventsSlider events={events.filter((event) => event.featured)} />
      <CausesSection />
      <TestimonialsSection />
      <ImpactSection />
      <div className="max-w-7xl mx-auto">
        <VolunteerCTA />
      </div>
      <BlogSection />
      <SupportSection />
    </div>
  );
}
