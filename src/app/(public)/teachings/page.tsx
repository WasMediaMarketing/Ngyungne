"use client";

import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  BookOpen,
  Heart,
  ScrollText,
  GraduationCap,
  ArrowRight,
  Loader2,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { philosophyApi } from "@/utils/philosophyApi";
import { meditationApi } from "@/utils/meditationApi";
import { courseApi } from "@/utils/courseApi";
import { createScriptureApi } from "@/utils/scriptureApi";
import type { IPhilosophyTopic } from "@/types";
import type { IMeditation } from "@/types/meditation.types";
import type { ICourse } from "@/types";
import type { IScripture } from "@/types/scripture.types";

// Initialize the scripture API
const scriptureApi = createScriptureApi();

export default function TeachingsPage() {
  // State for data
  const [philosophyTopics, setPhilosophyTopics] = useState<IPhilosophyTopic[]>(
    []
  );
  const [meditations, setMeditations] = useState<IMeditation[]>([]);
  const [courses, setCourses] = useState<ICourse[]>([]);
  const [scriptures, setScriptures] = useState<IScripture[]>([]);

  // State for loading and errors
  const [philosophyLoading, setPhilosophyLoading] = useState(true);
  const [meditationsLoading, setMeditationsLoading] = useState(true);
  const [coursesLoading, setCoursesLoading] = useState(true);
  const [scripturesLoading, setScripturesLoading] = useState(true);

  const [philosophyError, setPhilosophyError] = useState<string | null>(null);
  const [meditationsError, setMeditationsError] = useState<string | null>(null);
  const [coursesError, setCoursesError] = useState<string | null>(null);
  const [scripturesError, setScripturesError] = useState<string | null>(null);

  // Fetch philosophy topics
  useEffect(() => {
    const fetchPhilosophyTopics = async () => {
      try {
        setPhilosophyLoading(true);
        const data = await philosophyApi.getPhilosophyTopics();
        setPhilosophyTopics(data);
        setPhilosophyError(null);
      } catch (err) {
        console.error("Error fetching philosophy topics:", err);
        setPhilosophyError(
          "Failed to load philosophy topics. Please try again later."
        );
      } finally {
        setPhilosophyLoading(false);
      }
    };

    fetchPhilosophyTopics();
  }, []);

  // Fetch meditations
  useEffect(() => {
    const fetchMeditations = async () => {
      try {
        setMeditationsLoading(true);
        const data = await meditationApi.getPublicMeditations();
        setMeditations(data);
        setMeditationsError(null);
      } catch (err) {
        console.error("Error fetching meditations:", err);
        setMeditationsError(
          "Failed to load meditations. Please try again later."
        );
      } finally {
        setMeditationsLoading(false);
      }
    };

    fetchMeditations();
  }, []);

  // Fetch courses
  useEffect(() => {
    const fetchCourses = async () => {
      try {
        setCoursesLoading(true);
        const data = await courseApi.getPublicCourses();
        setCourses(data);
        setCoursesError(null);
      } catch (err) {
        console.error("Error fetching courses:", err);
        setCoursesError("Failed to load courses. Please try again later.");
      } finally {
        setCoursesLoading(false);
      }
    };

    fetchCourses();
  }, []);

  // Fetch scriptures
  useEffect(() => {
    const fetchScriptures = async () => {
      try {
        setScripturesLoading(true);
        const data = await scriptureApi.getScriptures();
        setScriptures(data);
        setScripturesError(null);
      } catch (err) {
        console.error("Error fetching scriptures:", err);
        setScripturesError(
          "Failed to load scriptures. Please try again later."
        );
      } finally {
        setScripturesLoading(false);
      }
    };

    fetchScriptures();
  }, []);

  // Teaching categories with dynamic counts
  const teachingCategories = [
    {
      title: "Buddhist Philosophy",
      description:
        "Explore the fundamental concepts and principles of Buddhist thought",
      icon: <BookOpen className="h-6 w-6 text-amber-600" />,
      count: philosophyTopics.length,
      href: "/teachings/philosophy",
    },
    {
      title: "Meditation",
      description:
        "Learn various meditation techniques and mindfulness practices",
      icon: <Heart className="h-6 w-6 text-amber-600" />,
      count: meditations.length,
      href: "/teachings/meditation",
    },
    {
      title: "Scriptures",
      description:
        "Study Buddhist texts, sutras, and commentaries from various traditions",
      icon: <ScrollText className="h-6 w-6 text-amber-600" />,
      count: scriptures.length,
      href: "/teachings/scriptures",
    },
    {
      title: "Courses",
      description:
        "Structured learning programs for practitioners of all levels",
      icon: <GraduationCap className="h-6 w-6 text-amber-600" />,
      count: courses.length,
      href: "/teachings/courses",
    },
  ];

  // Loading indicator component
  const LoadingIndicator = () => (
    <div className="flex justify-center items-center py-12">
      <Loader2 className="h-8 w-8 animate-spin text-amber-600" />
    </div>
  );

  // Error message component
  const ErrorMessage = ({ message }: { message: string }) => (
    <div className="text-center py-8">
      <p className="text-red-500">{message}</p>
      <Button
        variant="outline"
        className="mt-4"
        onClick={() => window.location.reload()}
      >
        Try Again
      </Button>
    </div>
  );

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4">Buddhist Teachings</h1>
        <p className="text-lg text-gray-600 max-w-3xl mx-auto">
          Explore authentic Buddhist teachings rooted in tradition yet relevant
          to contemporary life. Our comprehensive resources cover philosophy,
          meditation, scriptures, and structured courses.
        </p>
      </div>

      {/* Teaching Categories */}
      <section className="mb-16">
        <h2 className="text-2xl font-bold mb-6">Explore by Category</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {teachingCategories.map((category, index) => (
            <Card key={index} className="h-full flex flex-col">
              <CardHeader>
                <div className="flex items-center mb-2">{category.icon}</div>
                <CardTitle>{category.title}</CardTitle>
                <CardDescription>{category.description}</CardDescription>
              </CardHeader>
              <CardContent className="flex-grow">
                <p className="text-sm text-gray-600 mb-2">
                  {category.count} {category.count === 1 ? "item" : "items"}{" "}
                  available
                </p>
              </CardContent>
              <CardFooter>
                <Button variant="outline" className="w-full" asChild>
                  <Link href={category.href}>
                    Explore {category.title}{" "}
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </section>

      {/* Philosophy Topics */}
      <section className="mb-16">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold">Buddhist Philosophy</h2>
          <Button variant="link" asChild>
            <Link href="/teachings/philosophy">View All Philosophy Topics</Link>
          </Button>
        </div>

        {philosophyLoading ? (
          <LoadingIndicator />
        ) : philosophyError ? (
          <ErrorMessage message={philosophyError} />
        ) : philosophyTopics.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {philosophyTopics.slice(0, 3).map((topic) => (
              <Card key={topic.id} className="h-full flex flex-col">
                <CardHeader>
                  <div className="flex items-center mb-2">
                    <span className="text-2xl text-amber-600">
                      {topic.icon}
                    </span>
                  </div>
                  <CardTitle>{topic.title}</CardTitle>
                </CardHeader>
                <CardContent className="flex-grow">
                  <p className="text-gray-600 line-clamp-3">
                    {topic.description}
                  </p>
                </CardContent>
                <CardFooter>
                  <Button variant="outline" className="w-full" asChild>
                    <Link href={`/teachings/philosophy/${topic.id}`}>
                      Learn More
                    </Link>
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <p className="text-gray-500">
              No philosophy topics available at this time.
            </p>
          </div>
        )}
      </section>

      {/* Meditations */}
      <section className="mb-16">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold">Meditation Practices</h2>
          <Button variant="link" asChild>
            <Link href="/teachings/meditation">View All Meditations</Link>
          </Button>
        </div>

        {meditationsLoading ? (
          <LoadingIndicator />
        ) : meditationsError ? (
          <ErrorMessage message={meditationsError} />
        ) : meditations.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {meditations.slice(0, 3).map((meditation) => (
              <Card key={meditation._id.toString()} className="overflow-hidden">
                <div className="w-full h-48 relative">
                  <Image
                    src={
                      meditation.image ||
                      "/placeholder.svg?height=200&width=400"
                    }
                    alt={meditation.title}
                    fill
                    className="object-cover"
                  />
                </div>
                <CardContent className="pt-6">
                  <h3 className="font-semibold text-lg mb-2">
                    {meditation.title}
                  </h3>
                  <div className="space-y-1 text-sm text-gray-600">
                    <p>Duration: {meditation.duration} minutes</p>
                    <p>Level: {meditation.difficulty || "All Levels"}</p>
                    <p>Teacher: {meditation.instructor.name}</p>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button variant="outline" className="w-full" asChild>
                    <Link href={`/teachings/meditation/${meditation._id}`}>
                      Practice Now
                    </Link>
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <p className="text-gray-500">
              No meditation practices available at this time.
            </p>
          </div>
        )}
      </section>

      {/* Scriptures */}
      <section className="mb-16">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold">Sacred Scriptures</h2>
          <Button variant="link" asChild>
            <Link href="/teachings/scriptures">View All Scriptures</Link>
          </Button>
        </div>

        {scripturesLoading ? (
          <LoadingIndicator />
        ) : scripturesError ? (
          <ErrorMessage message={scripturesError} />
        ) : scriptures.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {scriptures.slice(0, 3).map((scripture) => (
              <Card key={scripture.id} className="h-full flex flex-col">
                <CardHeader>
                  <CardTitle>{scripture.title}</CardTitle>
                  <CardDescription>
                    {scripture.tradition} • {scripture.period}
                  </CardDescription>
                </CardHeader>
                <CardContent className="flex-grow">
                  <p className="text-gray-600 line-clamp-3">
                    {scripture.description}
                  </p>
                </CardContent>
                <CardFooter>
                  <Button variant="outline" className="w-full" asChild>
                    <Link href={`/teachings/scriptures/${scripture.id}`}>
                      Read Scripture
                    </Link>
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <p className="text-gray-500">
              No scriptures available at this time.
            </p>
          </div>
        )}
      </section>

      {/* Courses */}
      <section>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold">Learning Courses</h2>
          <Button variant="link" asChild>
            <Link href="/teachings/courses">View All Courses</Link>
          </Button>
        </div>

        {coursesLoading ? (
          <LoadingIndicator />
        ) : coursesError ? (
          <ErrorMessage message={coursesError} />
        ) : courses.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {courses.slice(0, 3).map((course) => (
              <Card key={course.id} className="overflow-hidden">
                <div className="w-full h-48 relative">
                  <Image
                    src={
                      course.image || "/placeholder.svg?height=200&width=400"
                    }
                    alt={course.title}
                    fill
                    className="object-cover"
                  />
                </div>
                <CardContent className="pt-6">
                  <h3 className="font-semibold text-lg mb-2">{course.title}</h3>
                  <div className="space-y-1 text-sm text-gray-600">
                    <p>Duration: {course.duration}</p>
                    <p>Level: {course.level}</p>
                    <p>Lessons: {course.lessons}</p>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button variant="outline" className="w-full" asChild>
                    <Link href={`/teachings/courses/${course.id}`}>
                      Explore Course
                    </Link>
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <p className="text-gray-500">No courses available at this time.</p>
          </div>
        )}
      </section>

      {/* Study Resources */}
      <section className="mt-16">
        <h2 className="text-2xl font-bold mb-6">Study Resources</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="flex flex-row items-center p-6">
            <div className="bg-amber-100 p-4 rounded-full mr-6">
              <ScrollText className="h-8 w-8 text-amber-600" />
            </div>
            <div>
              <h3 className="font-semibold text-lg mb-1">Practice Journal</h3>
              <p className="text-gray-600 mb-4">
                Track your meditation progress and insights with our structured
                practice journal
              </p>
              <Button size="sm" asChild>
                <Link href="/resources/journal">Access Journal</Link>
              </Button>
            </div>
          </Card>
          <Card className="flex flex-row items-center p-6">
            <div className="bg-amber-100 p-4 rounded-full mr-6">
              <GraduationCap className="h-8 w-8 text-amber-600" />
            </div>
            <div>
              <h3 className="font-semibold text-lg mb-1">Buddhist Glossary</h3>
              <p className="text-gray-600 mb-4">
                Comprehensive reference for Buddhist terms, concepts and
                principles
              </p>
              <Button size="sm" asChild>
                <Link href="/resources/glossary">View Glossary</Link>
              </Button>
            </div>
          </Card>
        </div>
      </section>
    </div>
  );
}
