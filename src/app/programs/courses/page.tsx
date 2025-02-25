"use client";

import { motion } from "framer-motion";
import { Breadcrumbs } from "@/components/breadcrumbs";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
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
import { Clock, BookOpen, GraduationCap, Star } from "lucide-react";

const courses = [
  {
    title: "Foundations of Buddhism",
    description:
      "An introductory course covering the core principles and practices of Buddhism.",
    duration: "8 weeks",
    lessons: 16,
    level: "Beginner",
    rating: 4.8,
    progress: 0,
    modules: [
      {
        title: "The Life of the Buddha",
        lessons: [
          "Historical Context",
          "Siddhartha's Early Life",
          "The Great Renunciation",
          "Enlightenment and Teaching",
        ],
      },
      {
        title: "The Four Noble Truths",
        lessons: [
          "Understanding Suffering (Dukkha)",
          "The Cause of Suffering",
          "The Cessation of Suffering",
          "The Path to the Cessation of Suffering",
        ],
      },
      {
        title: "The Eightfold Path",
        lessons: [
          "Right View and Right Intention",
          "Right Speech and Right Action",
          "Right Livelihood and Right Effort",
          "Right Mindfulness and Right Concentration",
        ],
      },
    ],
  },
  {
    title: "Meditation Mastery",
    description:
      "Deepen your meditation practice with advanced techniques and guided sessions.",
    duration: "6 weeks",
    lessons: 12,
    level: "Intermediate",
    rating: 4.9,
    progress: 50,
    modules: [
      {
        title: "Mindfulness Meditation",
        lessons: [
          "Introduction to Mindfulness",
          "Body Scan Meditation",
          "Breath Awareness Techniques",
          "Mindful Walking Practice",
        ],
      },
      {
        title: "Vipassana Meditation",
        lessons: [
          "Understanding Vipassana",
          "Observing Sensations",
          "Developing Equanimity",
          "Insight and Wisdom",
        ],
      },
      {
        title: "Loving-Kindness Meditation",
        lessons: [
          "Cultivating Compassion",
          "Metta for Self and Others",
          "Overcoming Negative Emotions",
          "Integrating Loving-Kindness into Daily Life",
        ],
      },
    ],
  },
];

export default function Courses() {
  return (
    <div className="container mx-auto px-4 py-8">
      <Breadcrumbs />
      <motion.h1
        className="text-4xl font-bold mb-6 text-crimson-800"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        Courses
      </motion.h1>
      <motion.p
        className="text-xl mb-8 text-maroon-700"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        Expand your knowledge and deepen your practice with our structured
        learning programs.
      </motion.p>
      {courses.map((course, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: index * 0.1 + 0.3 }}
        >
          <Card className="mb-8 bg-saffron-50 border-saffron-200">
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-2xl text-crimson-700">
                    {course.title}
                  </CardTitle>
                  <CardDescription className="text-maroon-600 mt-1">
                    {course.description}
                  </CardDescription>
                </div>
                <Badge
                  variant="secondary"
                  className="bg-saffron-200 text-crimson-700"
                >
                  {course.level}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                <div className="flex items-center text-maroon-800">
                  <Clock className="mr-2 h-4 w-4" />
                  Duration: {course.duration}
                </div>
                <div className="flex items-center text-maroon-800">
                  <BookOpen className="mr-2 h-4 w-4" />
                  {course.lessons} lessons
                </div>
                <div className="flex items-center text-maroon-800">
                  <Star className="mr-2 h-4 w-4" />
                  Rating: {course.rating}/5
                </div>
              </div>
              <div className="mb-4">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-maroon-700">Course Progress</span>
                  <span className="text-maroon-700">{course.progress}%</span>
                </div>
                <Progress value={course.progress} className="w-full" />
              </div>
              <Accordion type="single" collapsible className="w-full">
                {course.modules.map((module, moduleIndex) => (
                  <AccordionItem
                    key={moduleIndex}
                    value={`module-${moduleIndex}`}
                  >
                    <AccordionTrigger className="text-crimson-700 hover:text-crimson-800">
                      {module.title}
                    </AccordionTrigger>
                    <AccordionContent>
                      <ul className="list-disc list-inside space-y-2">
                        {module.lessons.map((lesson, lessonIndex) => (
                          <li key={lessonIndex} className="text-maroon-700">
                            {lesson}
                          </li>
                        ))}
                      </ul>
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
              <Button className="mt-4 bg-crimson-600 hover:bg-crimson-700 text-white">
                Enroll in Course
              </Button>
            </CardContent>
          </Card>
        </motion.div>
      ))}
    </div>
  );
}
