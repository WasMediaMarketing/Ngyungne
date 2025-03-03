"use client";
import { useEffect } from "react";
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
<<<<<<< HEAD:src/app/page.tsx

=======
import { TeachingsSection } from "@/components/sections/teachings-section";
>>>>>>> fb8c2e00904512fd1e8cac846236f53504af7a18:src/app/(site)/page.tsx
export default function Home() {
  useEffect(() => {
    fetch("/api/user/admin-init"); // You can ignore the response
  }, []);

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
