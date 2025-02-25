import { HeroSlider } from "@/components/sections/hero-slider";
import { AboutSection } from "@/components/sections/about-section";
// import { TeachingsSection } from "@/components/sections/teachings-section";
import { EventsSection } from "@/components/sections/events-section";
import { CausesSection } from "@/components/sections/causes-section";
import { ProgramsSection } from "@/components/sections/programs-section";
import { TestimonialsSection } from "@/components/sections/testimonials-section";
import { ImpactSection } from "@/components/sections/impact-section";
import { BlogSection } from "@/components/sections/blog-section";
import { SupportSection } from "@/components/sections/support-section";

export default function Home() {
  return (
    <div className="w-full">
      <HeroSlider />
      <AboutSection />
      <ProgramsSection />
      {/* <TeachingsSection /> */}
      <EventsSection />
      <CausesSection />
      <TestimonialsSection />
      <ImpactSection />
      <BlogSection />
      <SupportSection />
    </div>
  );
}
