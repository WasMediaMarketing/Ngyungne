"use client";
import { useEffect, useRef, useState } from "react";
import { HeroSlider } from "@/components/sections/hero-slider";
import { AboutSection } from "@/components/sections/about-section";
import { CausesSection } from "@/components/sections/causes-section";
// import { ProgramsSection } from "@/components/sections/programs-section";
import { TestimonialsSection } from "@/components/sections/testimonials-section";
import { ImpactSection } from "@/components/sections/impact-section";
import BlogSection from "@/components/blog/BlogSection";
import { SupportSection } from "@/components/sections/support-section";
import { FeaturedEventsSlider } from "@/components/events/FeaturedEventsSlider";
import { events } from "@/data/events";
import { TeachingsSection } from "@/components/sections/teachings-section";
import VolunteerCTA from "@/components/volunteer/volunteerCTA";
import { causeApi, CauseUI } from "@/utils/causeApi";
import { Loader } from "@/components/common/loader";
import { eventApi } from "@/utils/eventApi";
import { IEvent } from "@/types/event.types";
export default function Home() {
  const apiCallDone = useRef(false); // useRef to track whether API has been called
  const [readingProgress, setReadingProgress] = useState(0);

  useEffect(() => {
    if (!apiCallDone.current) {
      fetch("/api/user/admin-init");
      apiCallDone.current = true;
    }
  }, []);
  const [causes, setCauses] = useState<CauseUI[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [events, setEvents] = useState<IEvent[]>([]);

  // Fetch causes on component mount
  useEffect(() => {
    const fetchCauses = async () => {
      setIsLoading(true);
      try {
        const data = await causeApi.getCauses();
        setCauses(data);
      } catch (error) {
        console.error("Failed to fetch causes:", error);
        setCauses([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCauses();
  }, []);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const data = await eventApi.getEvents();
        setEvents(data);
      } catch (error) {
        console.error("Error fetching events:", error);
      }
    };

    fetchEvents();
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
      <div className=" mx-auto px-4 sm:px-6 lg:px-8">
        {events && events.length > 0 ? (
          <FeaturedEventsSlider events={events} />
        ) : (
          <div className=" mx-auto py-12 text-center">
            <p className="text-maroon-600">
              No events available at the moment.
            </p>
          </div>
        )}
      </div>
      {isLoading ? (
        <Loader />
      ) : causes && causes.length > 0 ? (
        <CausesSection causes={causes} showAll={false} />
      ) : (
        <div className="container mx-auto py-12 text-center">
          <p className="text-maroon-600">No causes available at the moment.</p>
        </div>
      )}

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
