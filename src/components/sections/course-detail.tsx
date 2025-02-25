"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
import { courses } from "@/data/courses";
import { Breadcrumbs } from "../breadcrumbs";

export function CourseDetail({ slug }: { slug: string }) {
  const [course, setCourse] = useState(courses.find((c) => c.slug === slug));

  useEffect(() => {
    // In a real application, you would fetch the course data from an API here
    setCourse(courses.find((c) => c.slug === slug));
  }, [slug]);

  if (!course) {
    return <div>Course not found</div>;
  }

  return (
    <div className="container mx-auto px-4">
      <Breadcrumbs />
      <motion.h1
        className="text-4xl font-bold mb-6 text-crimson-800"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {course.title}
      </motion.h1>
      <div className="grid md:grid-cols-3 gap-8">
        <motion.div
          className="md:col-span-2"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <Card className="mb-8 bg-white border-saffron-200">
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-2xl text-crimson-700">
                    {course.title}
                  </CardTitle>
                  <p className="text-maroon-600 mt-2">{course.description}</p>
                </div>
                <Badge
                  variant="secondary"
                  className="bg-saffron-100 text-crimson-700"
                >
                  {course.level}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                <div className="flex items-center text-maroon-600">
                  <Clock className="mr-2 h-4 w-4" />
                  {course.duration}
                </div>
                <div className="flex items-center text-maroon-600">
                  <BookOpen className="mr-2 h-4 w-4" />
                  {course.lessons} lessons
                </div>
                <div className="flex items-center text-maroon-600">
                  <GraduationCap className="mr-2 h-4 w-4" />
                  {course.students} students
                </div>
                <div className="flex items-center text-maroon-600">
                  <Star className="mr-2 h-4 w-4" />
                  Rating: {course.rating}/5
                </div>
              </div>
              <div className="mb-6">
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
                          <li key={lessonIndex} className="text-maroon-600">
                            {lesson}
                          </li>
                        ))}
                      </ul>
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
              <Button className="mt-6 bg-crimson-600 hover:bg-crimson-700 text-white w-full">
                Enroll in Course
              </Button>
            </CardContent>
          </Card>
        </motion.div>
        <motion.div
          className="md:col-span-1"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <Card className="bg-white border-saffron-200">
            <CardHeader>
              <CardTitle className="text-xl text-crimson-700">
                Course Image
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Image
                src={course.image || "/placeholder.svg"}
                alt={course.title}
                width={400}
                height={300}
                className="rounded-lg"
              />
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
