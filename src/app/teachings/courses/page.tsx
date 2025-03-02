"use client";

import { useState, useEffect } from "react";
import { Breadcrumbs } from "@/components/breadcrumbs";

import { CoursesSection } from "@/components/course/courses-section";

// Simulated popular and featured courses
const popularCourses = [
  {
    id: 1,
    title: "Introduction to Mindfulness Meditation",
    instructor: "Ajahn Brahm",
    level: "Beginner",
    progress: 65,
    image: "/images/courses/mindfulness.jpg",
  },
  {
    id: 2,
    title: "The Four Noble Truths",
    instructor: "Thich Nhat Hanh",
    level: "Intermediate",
    progress: 30,
    image: "/images/courses/four-noble-truths.jpg",
  },
  {
    id: 3,
    title: "Buddhist Ethics in Daily Life",
    instructor: "Sharon Salzberg",
    level: "All Levels",
    progress: 0,
    image: "/images/courses/ethics.jpg",
  },
];

const testimonials = [
  {
    id: 1,
    name: "Sarah Johnson",
    avatar: "SJ",
    role: "Meditation Practitioner",
    quote:
      "These courses have transformed my practice. The structured approach and depth of wisdom are unparalleled.",
    course: "Introduction to Mindfulness Meditation",
    rating: 5,
  },
  {
    id: 2,
    name: "Michael Chen",
    avatar: "MC",
    role: "Psychology Student",
    quote:
      "As someone studying psychology, I found the Buddhist perspective on mind incredibly valuable and complementary to my academic studies.",
    course: "Buddhist Psychology",
    rating: 5,
  },
  {
    id: 3,
    name: "Amara Patel",
    avatar: "AP",
    role: "Yoga Teacher",
    quote:
      "The teachings are presented in such an accessible way while maintaining their profound nature. Highly recommended for all spiritual seekers.",
    course: "The Four Noble Truths",
    rating: 4,
  },
];

export default function Courses() {
  const [activeTabs, setActiveTabs] = useState("featured");
  const [currentTestimonial, setCurrentTestimonial] = useState(0);
  const [isLoaded, setIsLoaded] = useState(false);

  // Simulate loading state
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoaded(true);
    }, 500);
    return () => clearTimeout(timer);
  }, []);

  // Auto rotate testimonials
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
    }, 8000);
    return () => clearInterval(interval);
  }, []);

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.3,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  };

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
