"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import Link from "next/link";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Clock,
  BookOpen,
  Users,
  ChevronRight,
  Filter,
  Search,
} from "lucide-react";
import { courses } from "@/data/courses";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CourseEnrollmentDialog } from "./course-enrollment-form";
import { toast } from "@/components/ui/use-toast-hook";

export function CoursesSection() {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  const [searchTerm, setSearchTerm] = useState("");
  const [activeFilter, setActiveFilter] = useState("all");
  const [activeTab, setActiveTab] = useState("grid");

  // Filter courses based on search term and level filter
  const filteredCourses = courses.filter((course) => {
    const matchesSearch =
      course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      course.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter =
      activeFilter === "all" || course.level === activeFilter;
    return matchesSearch && matchesFilter;
  });

  // Extract unique levels for filter dropdown
  const levels = [...new Set(courses.map((course) => course.level))];

  // Handle enrollment form submission
  const handleEnrollmentSubmit = (data: any) => {
    console.log("Enrollment submitted:", data);
    // Here you would typically send the data to your backend
    toast({
      title: "Enrollment Submitted",
      description: "Thank you for enrolling in this course!",
    });
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  };

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
            className="text-maroon-700 max-w-2xl mx-auto mb-8"
          >
            Deepen your understanding of Buddhist philosophy and practices
            through our comprehensive courses designed for practitioners at all
            levels.
          </motion.p>

          {/* Search and filter controls */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="flex flex-col sm:flex-row justify-center gap-4 mb-8"
          >
            <div className="relative max-w-md w-full">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-maroon-400 h-4 w-4" />
              <Input
                type="text"
                placeholder="Search courses..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 border-maroon-200 focus:border-crimson-500 focus:ring-crimson-500"
              />
            </div>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  className="flex items-center gap-2 border-maroon-200"
                >
                  <Filter className="h-4 w-4" />
                  {activeFilter === "all" ? "All Levels" : activeFilter}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem onClick={() => setActiveFilter("all")}>
                  All Levels
                </DropdownMenuItem>
                {levels.map((level) => (
                  <DropdownMenuItem
                    key={level}
                    onClick={() => setActiveFilter(level)}
                  >
                    {level}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            <Tabs
              value={activeTab}
              onValueChange={setActiveTab}
              className="hidden sm:flex"
            >
              <TabsList>
                <TabsTrigger value="grid">Grid</TabsTrigger>
                <TabsTrigger value="list">List</TabsTrigger>
              </TabsList>
            </Tabs>
          </motion.div>
        </div>

        {/* Course count */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="text-maroon-700 mb-6 text-left"
        >
          Showing {filteredCourses.length} of {courses.length} courses
        </motion.div>

        {/* Grid View */}
        {activeTab === "grid" && (
          <motion.div
            ref={ref}
            className="grid md:grid-cols-2 lg:grid-cols-3 gap-8"
            variants={containerVariants}
            initial="hidden"
            animate={inView ? "visible" : "hidden"}
          >
            {filteredCourses.map((course, index) => (
              <motion.div
                key={index}
                variants={itemVariants}
                className="h-full"
              >
                <Card className="group h-full flex flex-col hover:shadow-lg transition-all duration-300 bg-white border border-maroon-100 overflow-hidden">
                  {course?.featured && (
                    <div className="bg-crimson-600 text-white text-xs font-semibold px-3 py-1 absolute top-4 right-4 rounded-full">
                      Featured
                    </div>
                  )}
                  <CardHeader className="pb-4">
                    <div className="flex justify-between items-start gap-2">
                      <CardTitle className="text-2xl text-crimson-700 group-hover:text-crimson-800 transition-colors duration-300">
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
                  <CardContent className="flex-grow">
                    <p className="text-maroon-600 mb-6 line-clamp-3">
                      {course.description}
                    </p>
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
                        <Users className="mr-2 h-4 w-4" />
                        {course.students || "500+"} students
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="pt-2 flex gap-2">
                    <Link
                      href={`/teachings/courses/${course.slug}`}
                      passHref
                      className="flex-1"
                    >
                      <Button
                        variant="outline"
                        className="w-full gap-2 transition-all"
                      >
                        View Details
                        <ChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                      </Button>
                    </Link>
                    <CourseEnrollmentDialog
                      courseTitle={course.title}
                      onSubmit={handleEnrollmentSubmit}
                      buttonText="Enroll Now"
                      buttonClassName="flex-1 bg-crimson-600 hover:bg-crimson-700 text-white"
                    />
                  </CardFooter>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        )}

        {/* List View */}
        {activeTab === "list" && (
          <motion.div
            ref={ref}
            className="flex flex-col gap-4"
            variants={containerVariants}
            initial="hidden"
            animate={inView ? "visible" : "hidden"}
          >
            {filteredCourses.map((course, index) => (
              <motion.div key={index} variants={itemVariants}>
                <Card className="group hover:shadow-lg transition-all duration-300 bg-white border border-maroon-100 overflow-hidden">
                  <div className="flex flex-col md:flex-row">
                    <CardHeader className="md:w-1/3">
                      <div className="flex flex-col">
                        <CardTitle className="text-xl text-crimson-700">
                          {course.title}
                        </CardTitle>
                        <div className="flex items-center mt-2 gap-2">
                          <Badge
                            variant="secondary"
                            className="bg-saffron-100 text-crimson-700"
                          >
                            {course.level}
                          </Badge>
                          {course.featured && (
                            <Badge className="bg-crimson-600 text-white">
                              Featured
                            </Badge>
                          )}
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="md:w-1/2 py-6 md:py-6">
                      <p className="text-maroon-600 mb-4 line-clamp-2">
                        {course.description}
                      </p>
                      <div className="flex flex-wrap gap-x-6 gap-y-2">
                        <div className="flex items-center text-maroon-500">
                          <Clock className="mr-2 h-4 w-4" />
                          {course.duration}
                        </div>
                        <div className="flex items-center text-maroon-500">
                          <BookOpen className="mr-2 h-4 w-4" />
                          {course.lessons} lessons
                        </div>
                        <div className="flex items-center text-maroon-500">
                          <Users className="mr-2 h-4 w-4" />
                          {course.students || "500+"} students
                        </div>
                      </div>
                    </CardContent>
                    <div className="flex items-center justify-center md:w-1/6 p-6 gap-2 flex-col">
                      <Link
                        href={`/teachings/courses/${course.slug}`}
                        passHref
                        className="w-full"
                      >
                        <Button variant="outline" className="w-full">
                          Details
                        </Button>
                      </Link>
                      <CourseEnrollmentDialog
                        courseTitle={course.title}
                        onSubmit={handleEnrollmentSubmit}
                        buttonText="Enroll"
                        buttonClassName="w-full bg-crimson-600 hover:bg-crimson-700 text-white"
                      />
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        )}

        {filteredCourses.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="text-center py-12"
          >
            <h3 className="text-xl font-medium text-maroon-700 mb-2">
              No courses found
            </h3>
            <p className="text-maroon-500">
              Try adjusting your search or filter criteria
            </p>
            <Button
              variant="outline"
              className="mt-4"
              onClick={() => {
                setSearchTerm("");
                setActiveFilter("all");
              }}
            >
              Clear filters
            </Button>
          </motion.div>
        )}
      </div>
    </section>
  );
}
