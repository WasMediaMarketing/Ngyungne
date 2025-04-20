"use client";

import { useState, useEffect } from "react";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { CoursesSection } from "@/components/course/courses-section";

export default function Courses() {
  const [isLoaded, setIsLoaded] = useState(false);

  // Simulate loading state
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoaded(true);
    }, 500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-saffron-50 via-white to-saffron-50">
      <div className="container mx-auto px-4 py-8">
        <Breadcrumbs />

        {/* All Courses Section */}
        <CoursesSection />
      </div>
    </div>
  );
}
