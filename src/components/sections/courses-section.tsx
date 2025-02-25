"use client";

import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Clock, BookOpen, Star } from "lucide-react";
import { courses } from "@/data/courses";

export function CoursesSection() {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  return (
    <section
      id="courses"
      className="py-20 bg-gradient-to-b from-saffron-50 to-white"
    >
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
            className="inline-block bg-crimson-100 px-4 py-2 rounded-full mb-4"
          >
            <span className="text-crimson-700 font-medium">Our Courses</span>
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-4xl font-bold text-crimson-800 mb-4"
          >
            Structured Learning Programs
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="text-maroon-700 max-w-2xl mx-auto"
          >
            Deepen your understanding of Buddhist philosophy and practices
            through our comprehensive courses.
          </motion.p>
        </div>

        <div ref={ref} className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {courses.map((course, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: index * 0.1 + 0.6 }}
            >
              <Card className="group hover:shadow-lg transition-shadow duration-300 bg-white">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <CardTitle className="text-2xl text-crimson-700">
                      {course.title}
                    </CardTitle>
                    <Badge
                      variant="secondary"
                      className="bg-saffron-100 text-crimson-700"
                    >
                      {course.level}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-maroon-600 mb-6">{course.description}</p>
                  <div className="grid grid-cols-2 gap-4 mb-6">
                    <div className="flex items-center text-maroon-500">
                      <Clock className="mr-2 h-4 w-4" />
                      {course.duration}
                    </div>
                    <div className="flex items-center text-maroon-500">
                      <BookOpen className="mr-2 h-4 w-4" />
                      {course.lessons} lessons
                    </div>
                    <div className="flex items-center text-maroon-500">
                      <Star className="mr-2 h-4 w-4" />
                      Rating: {course.rating}/5
                    </div>
                  </div>
                  <Link href={`/teachings/courses/${course.slug}`} passHref>
                    <Button className="w-full bg-crimson-600 hover:bg-crimson-700 text-white">
                      View Course
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
