"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
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
import {
  Clock,
  BookOpen,
  GraduationCap,
  Star,
  CheckCircle,
  Lock,
  Download,
  Share,
  Heart,
  MessageSquare,
  User,
} from "lucide-react";
import { Breadcrumbs } from "../breadcrumbs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { courses } from "@/data/courses";

export function CourseDetail({ slug }: { slug: string }) {
  const [course, setCourse] = useState(courses.find((c) => c.slug === slug));
  const [isFavorite, setIsFavorite] = useState(false);

  useEffect(() => {
    // In a real application, you would fetch the course data from an API here
    setCourse(courses.find((c) => c.slug === slug));
  }, [slug]);

  if (!course) {
    return <div>Course not found</div>;
  }

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
    visible: { opacity: 1, y: 0 },
  };

  return (
    <div className="container mx-auto px-4 py-8 bg-slate-50 min-h-screen">
      <Breadcrumbs />

      <div className="relative mb-12 rounded-xl overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-crimson-800/90 to-crimson-900/80 z-10"></div>
        <Image
          src={course.image || "/placeholder.svg"}
          alt="Course background"
          width={1200}
          height={300}
          className="w-full h-64 object-cover"
        />
        <div className="absolute inset-0 z-20 flex flex-col justify-center px-8 md:px-16">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <Badge
              variant="secondary"
              className="bg-saffron-100 text-crimson-800 mb-4"
            >
              {course.level}
            </Badge>
            <h1 className="text-3xl md:text-4xl font-bold mb-3 text-white">
              {course.title}
            </h1>
            <p className="text-white/90 max-w-2xl mb-4">{course.description}</p>
            <div className="flex flex-wrap gap-6 text-white/90">
              <div className="flex items-center">
                <Clock className="mr-2 h-4 w-4" />
                {course.duration}
              </div>
              <div className="flex items-center">
                <BookOpen className="mr-2 h-4 w-4" />
                {course.lessons} lessons
              </div>
              <div className="flex items-center">
                <GraduationCap className="mr-2 h-4 w-4" />
                {course.students} students
              </div>
              <div className="flex items-center">
                <Star className="mr-2 h-4 w-4 text-yellow-400" />
                <span className="text-white">{course.rating}/5</span>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-8">
        <motion.div
          className="md:col-span-2"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <Tabs defaultValue="content" className="mb-8">
            <TabsList className="mb-6 bg-white border-b border-slate-200 w-full justify-start rounded-none p-0">
              <TabsTrigger
                value="content"
                className="rounded-t-lg data-[state=active]:bg-white data-[state=active]:border-b-2 data-[state=active]:border-crimson-600 data-[state=active]:text-crimson-700 py-3 px-6"
              >
                Course Content
              </TabsTrigger>
              <TabsTrigger
                value="overview"
                className="rounded-t-lg data-[state=active]:bg-white data-[state=active]:border-b-2 data-[state=active]:border-crimson-600 data-[state=active]:text-crimson-700 py-3 px-6"
              >
                Overview
              </TabsTrigger>
              <TabsTrigger
                value="reviews"
                className="rounded-t-lg data-[state=active]:bg-white data-[state=active]:border-b-2 data-[state=active]:border-crimson-600 data-[state=active]:text-crimson-700 py-3 px-6"
              >
                Reviews
              </TabsTrigger>
            </TabsList>

            <TabsContent value="content" className="mt-0">
              <Card className="bg-white border-slate-200 shadow-sm">
                <CardHeader className="pb-3">
                  <CardTitle className="text-2xl text-crimson-700">
                    Course Modules
                  </CardTitle>
                  <CardDescription>
                    {course.modules.length} modules • {course.lessons} lessons •{" "}
                    {course.duration} total
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="mb-6">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-slate-700 font-medium">
                        Your Progress
                      </span>
                      <span className="text-crimson-700 font-medium">
                        {course.progress}%
                      </span>
                    </div>
                    <Progress
                      value={course.progress}
                      className="w-full h-2 bg-slate-200"
                    />
                  </div>

                  <Accordion type="single" collapsible className="w-full">
                    {course.modules.map((module, moduleIndex) => (
                      <AccordionItem
                        key={moduleIndex}
                        value={`module-${moduleIndex}`}
                        className="border-b border-slate-200 py-1"
                      >
                        <AccordionTrigger className="text-slate-800 hover:text-crimson-700 font-medium py-3">
                          <div className="flex items-center justify-between w-full">
                            <div className="flex items-center">
                              {moduleIndex < course.modules.length / 2 ? (
                                <CheckCircle className="h-5 w-5 mr-3 text-green-500" />
                              ) : (
                                <Lock className="h-5 w-5 mr-3 text-slate-400" />
                              )}
                              <span>{module.title}</span>
                            </div>
                            <div className="flex items-center gap-3 text-sm text-slate-500">
                              <span>{module.lessons.length} lessons</span>
                              <span>•</span>
                              <span>25 min</span>
                            </div>
                          </div>
                        </AccordionTrigger>
                        <AccordionContent className="pl-11">
                          <ul className="space-y-3">
                            {module.lessons.map((lesson, lessonIndex) => (
                              <motion.li
                                key={lessonIndex}
                                variants={itemVariants}
                                className="flex items-center justify-between p-2 hover:bg-slate-50 rounded-md"
                              >
                                <div className="flex items-center">
                                  {moduleIndex < course.modules.length / 2 &&
                                  lessonIndex < module.lessons.length / 2 ? (
                                    <CheckCircle className="h-4 w-4 mr-2 text-green-500" />
                                  ) : (
                                    <Lock className="h-4 w-4 mr-2 text-slate-400" />
                                  )}
                                  <span
                                    className={
                                      moduleIndex < course.modules.length / 2 &&
                                      lessonIndex < module.lessons.length / 2
                                        ? "text-slate-700"
                                        : "text-slate-500"
                                    }
                                  >
                                    {lesson}
                                  </span>
                                </div>
                                <span className="text-xs text-slate-500">
                                  10 min
                                </span>
                              </motion.li>
                            ))}
                          </ul>
                        </AccordionContent>
                      </AccordionItem>
                    ))}
                  </Accordion>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="overview" className="mt-0">
              <Card className="bg-white border-slate-200 shadow-sm">
                <CardHeader>
                  <CardTitle className="text-2xl text-crimson-700">
                    Course Overview
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="prose max-w-none text-slate-700">
                    <p>
                      This comprehensive course will take you through all the
                      essentials of {course.title}. You'll learn through
                      hands-on projects and practical examples that reinforce
                      the theoretical concepts.
                    </p>

                    <h3 className="text-xl font-medium text-slate-800 mt-6">
                      What you'll learn
                    </h3>
                    <ul className="grid grid-cols-1 md:grid-cols-2 gap-2 mt-3">
                      <li className="flex items-start">
                        <CheckCircle className="h-5 w-5 mr-2 text-green-500 flex-shrink-0 mt-0.5" />
                        <span>Master the fundamentals of {course.title}</span>
                      </li>
                      <li className="flex items-start">
                        <CheckCircle className="h-5 w-5 mr-2 text-green-500 flex-shrink-0 mt-0.5" />
                        <span>Build real-world projects from scratch</span>
                      </li>
                      <li className="flex items-start">
                        <CheckCircle className="h-5 w-5 mr-2 text-green-500 flex-shrink-0 mt-0.5" />
                        <span>Understand advanced techniques and patterns</span>
                      </li>
                      <li className="flex items-start">
                        <CheckCircle className="h-5 w-5 mr-2 text-green-500 flex-shrink-0 mt-0.5" />
                        <span>Apply best practices in your daily work</span>
                      </li>
                    </ul>

                    <h3 className="text-xl font-medium text-slate-800 mt-6">
                      Prerequisites
                    </h3>
                    <p>
                      Basic understanding of programming concepts is recommended
                      but not required. This course is designed to be accessible
                      to beginners while also offering value to intermediate
                      learners.
                    </p>

                    <h3 className="text-xl font-medium text-slate-800 mt-6">
                      Target audience
                    </h3>
                    <p>
                      This course is perfect for beginners looking to build a
                      solid foundation, as well as intermediate learners wanting
                      to enhance their skills with real-world applications and
                      best practices.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="reviews" className="mt-0">
              <Card className="bg-white border-slate-200 shadow-sm">
                <CardHeader>
                  <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
                    <div>
                      <CardTitle className="text-2xl text-crimson-700">
                        Student Reviews
                      </CardTitle>
                      <CardDescription>
                        See what our students are saying about this course
                      </CardDescription>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="text-4xl font-bold text-crimson-700">
                        {course.rating}
                      </div>
                      <div className="flex flex-col">
                        <div className="flex">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={`h-5 w-5 ${
                                i < Math.floor(course.rating)
                                  ? "text-yellow-400"
                                  : "text-slate-300"
                              }`}
                            />
                          ))}
                        </div>
                        <div className="text-sm text-slate-500">
                          Based on 142 reviews
                        </div>
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    {[
                      {
                        name: "Alex Johnson",
                        avatar: "/avatars/alex.jpg",
                        rating: 5,
                        date: "2 weeks ago",
                        comment:
                          "This course exceeded my expectations! The instructor explains complex concepts in a way that's easy to understand, and the project-based approach helped me apply what I learned immediately.",
                      },
                      {
                        name: "Sarah Miller",
                        avatar: "/avatars/sarah.jpg",
                        rating: 4,
                        date: "1 month ago",
                        comment:
                          "Great course content and structure. I especially enjoyed the hands-on projects. Would have given 5 stars if there were more advanced topics covered.",
                      },
                    ].map((review, index) => (
                      <motion.div
                        key={index}
                        variants={itemVariants}
                        className="border-b border-slate-200 pb-6 last:border-0 last:pb-0"
                      >
                        <div className="flex justify-between mb-3">
                          <div className="flex items-center gap-3">
                            <Avatar>
                              <AvatarImage src={review.avatar} />
                              <AvatarFallback>
                                {review.name.charAt(0)}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <div className="font-medium text-slate-800">
                                {review.name}
                              </div>
                              <div className="text-sm text-slate-500">
                                {review.date}
                              </div>
                            </div>
                          </div>
                          <div className="flex">
                            {[...Array(5)].map((_, i) => (
                              <Star
                                key={i}
                                className={`h-4 w-4 ${
                                  i < review.rating
                                    ? "text-yellow-400"
                                    : "text-slate-300"
                                }`}
                              />
                            ))}
                          </div>
                        </div>
                        <p className="text-slate-700">{review.comment}</p>
                      </motion.div>
                    ))}
                  </div>

                  <Button
                    variant="outline"
                    className="mt-6 w-full border-slate-300 text-slate-700 hover:bg-slate-50"
                  >
                    Load More Reviews
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </motion.div>

        <motion.div
          className="md:col-span-1"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <div className="space-y-6 sticky top-8">
            <Card className="bg-white border-slate-200 shadow-sm overflow-hidden">
              <div className="relative">
                <Image
                  src={course.image || "/placeholder.svg"}
                  alt={course.title}
                  width={400}
                  height={225}
                  className="w-full h-48 object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
                <Button
                  variant="outline"
                  size="icon"
                  className={`absolute top-3 right-3 bg-white/90 border-none ${
                    isFavorite ? "text-red-500" : "text-slate-600"
                  } hover:bg-white`}
                  onClick={() => setIsFavorite(!isFavorite)}
                >
                  <Heart
                    className={`h-5 w-5 ${isFavorite ? "fill-current" : ""}`}
                  />
                </Button>
              </div>
              <CardContent className="p-6">
                <div className="flex justify-between items-center mb-4">
                  <div className="text-2xl font-bold text-crimson-700">
                    $49.99
                  </div>
                  <Badge
                    variant="outline"
                    className="text-green-600 bg-green-50 border-green-200"
                  >
                    30% OFF
                  </Badge>
                </div>

                <Button className="w-full mb-3 bg-crimson-600 hover:bg-crimson-700 text-white">
                  Enroll Now
                </Button>
                <Button
                  variant="outline"
                  className="w-full mb-6 border-slate-300 text-slate-700 hover:bg-slate-50"
                >
                  Try Free Preview
                </Button>

                <div className="space-y-4 text-sm">
                  <div className="flex justify-between">
                    <span className="text-slate-600">Full lifetime access</span>
                    <CheckCircle className="h-5 w-5 text-green-500" />
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-600">
                      Access on mobile & desktop
                    </span>
                    <CheckCircle className="h-5 w-5 text-green-500" />
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-600">
                      Certificate of completion
                    </span>
                    <CheckCircle className="h-5 w-5 text-green-500" />
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-600">Premium support</span>
                    <CheckCircle className="h-5 w-5 text-green-500" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white border-slate-200 shadow-sm">
              <CardHeader>
                <CardTitle className="text-lg text-crimson-700">
                  Instructor
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-4 mb-4">
                  <Avatar className="h-12 w-12">
                    <AvatarImage src="/avatars/instructor.jpg" />
                    <AvatarFallback>
                      <User className="h-6 w-6" />
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="font-medium text-slate-800">
                      Dr. Emily Chen
                    </div>
                    <div className="text-sm text-slate-500">
                      Senior Instructor
                    </div>
                  </div>
                </div>
                <p className="text-sm text-slate-600 mb-4">
                  Dr. Chen has over 10 years of industry experience and has
                  taught over 50,000 students worldwide.
                </p>
                <div className="flex items-center text-sm text-slate-600 space-x-4">
                  <div className="flex items-center">
                    <Star className="mr-1 h-4 w-4 text-yellow-400" />
                    <span>4.9 Instructor Rating</span>
                  </div>
                  <div className="flex items-center">
                    <MessageSquare className="mr-1 h-4 w-4" />
                    <span>2,453 Reviews</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white border-slate-200 shadow-sm">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg text-crimson-700">
                  Share this Course
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex justify-between">
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1 mr-2 border-slate-300 text-slate-700"
                  >
                    <Share className="mr-2 h-4 w-4" />
                    Share
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1 ml-2 border-slate-300 text-slate-700"
                  >
                    <Download className="mr-2 h-4 w-4" />
                    Download
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
