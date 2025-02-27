"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Breadcrumbs } from "@/components/breadcrumbs";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Clock,
  BookOpen,
  GraduationCap,
  Star,
  Users,
  Heart,
  Bookmark,
  CheckCircle,
  ChevronDown,
  Play,
  FileText,
  Award,
} from "lucide-react";
import { CoursesSection } from "@/components/sections/courses-section";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

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

        {/* Hero Section */}
        <div className="mb-16">
          <motion.div
            className="grid md:grid-cols-2 gap-8 items-center"
            initial="hidden"
            animate="visible"
            variants={containerVariants}
          >
            <motion.div variants={itemVariants}>
              <Badge className="bg-crimson-100 text-crimson-700 mb-4">
                Learning Path
              </Badge>
              <h1 className="text-4xl md:text-5xl font-bold mb-4 text-crimson-800">
                Deepen Your Buddhist Practice
              </h1>
              <p className="text-lg text-maroon-700 mb-6">
                Explore our comprehensive curriculum of Buddhist teachings,
                designed to support your spiritual growth through structured
                learning.
              </p>
              <div className="flex flex-wrap gap-4 mb-8">
                <div className="flex items-center">
                  <GraduationCap className="text-crimson-600 mr-2" />
                  <span className="text-maroon-700">
                    {popularCourses.length}+ Courses
                  </span>
                </div>
                <div className="flex items-center">
                  <Users className="text-crimson-600 mr-2" />
                  <span className="text-maroon-700">1,000+ Students</span>
                </div>
                <div className="flex items-center">
                  <Star className="text-crimson-600 mr-2" />
                  <span className="text-maroon-700">4.8 Average Rating</span>
                </div>
              </div>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button className="bg-crimson-600 hover:bg-crimson-700 text-white">
                  Browse All Courses
                </Button>
                <Button
                  variant="outline"
                  className="border-crimson-600 text-crimson-600 hover:bg-crimson-50"
                >
                  Take Free Assessment
                </Button>
              </div>
            </motion.div>

            <motion.div variants={itemVariants} className="hidden md:block">
              <div className="relative">
                <div className="absolute -top-6 -left-6 w-32 h-32 bg-crimson-100 rounded-full z-0" />
                <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-saffron-100 rounded-full z-0" />
                <Card className="border-maroon-100 p-2 z-10 relative bg-white/90 backdrop-blur">
                  <img
                    src="/placeholder.svg"
                    alt="Buddhist teaching"
                    className="rounded-md w-full object-cover h-64"
                  />
                </Card>
              </div>
            </motion.div>
          </motion.div>
        </div>

        {/* All Courses Section */}
        <CoursesSection />
      </div>
    </div>
  );
}
