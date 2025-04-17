import React from "react";
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
} from "lucide-react";

const TeachingsPage = () => {
  const teachingCategories = [
    {
      title: "Buddhist Philosophy",
      description:
        "Explore the fundamental concepts and principles of Buddhist thought",
      icon: <BookOpen className="h-6 w-6 text-amber-600" />,
      topics: [
        "Four Noble Truths",
        "Eightfold Path",
        "Dependent Origination",
        "Emptiness",
      ],
      href: "/teachings/philosophy",
    },
    {
      title: "Meditation",
      description:
        "Learn various meditation techniques and mindfulness practices",
      icon: <Heart className="h-6 w-6 text-amber-600" />,
      topics: [
        "Shamatha",
        "Vipassana",
        "Loving-Kindness",
        "Walking Meditation",
      ],
      href: "/teachings/meditation",
    },
    {
      title: "Scriptures",
      description:
        "Study Buddhist texts, sutras, and commentaries from various traditions",
      icon: <ScrollText className="h-6 w-6 text-amber-600" />,
      topics: [
        "Pali Canon",
        "Mahayana Sutras",
        "Tibetan Texts",
        "Commentaries",
      ],
      href: "/teachings/scriptures",
    },
    {
      title: "Courses",
      description:
        "Structured learning programs for practitioners of all levels",
      icon: <GraduationCap className="h-6 w-6 text-amber-600" />,
      topics: [
        "Beginner's Path",
        "Intermediate Studies",
        "Advanced Practices",
        "Teacher Training",
      ],
      href: "/teachings/courses",
    },
  ];

  const featuredTeachings = [
    {
      title: "Introduction to the Four Noble Truths",
      teacher: "Venerable Lobsang",
      duration: "45 minutes",
      level: "Beginner",
      image: "/api/placeholder/400/225",
    },
    {
      title: "The Practice of Loving-Kindness",
      teacher: "Ani Tenzin",
      duration: "60 minutes",
      level: "All Levels",
      image: "/api/placeholder/400/225",
    },
    {
      title: "Understanding Emptiness",
      teacher: "Geshe Dorje",
      duration: "75 minutes",
      level: "Intermediate",
      image: "/api/placeholder/400/225",
    },
  ];

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
                <ul className="space-y-1">
                  {category.topics.map((topic, i) => (
                    <li key={i} className="flex items-center">
                      <span className="h-1.5 w-1.5 rounded-full bg-amber-600 mr-2"></span>
                      {topic}
                    </li>
                  ))}
                </ul>
              </CardContent>
              <CardFooter>
                <Button variant="outline" className="w-full" asChild>
                  <a href={category.href}>
                    Explore {category.title}{" "}
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </a>
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </section>

      {/* Featured Teachings */}
      <section className="mb-16">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold">Featured Teachings</h2>
          <Button variant="link">View All Teachings</Button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {featuredTeachings.map((teaching, index) => (
            <Card key={index} className="overflow-hidden">
              <img
                src={teaching.image}
                alt={teaching.title}
                className="w-full h-48 object-cover"
              />
              <CardContent className="pt-6">
                <h3 className="font-semibold text-lg mb-2">{teaching.title}</h3>
                <div className="space-y-1 text-sm text-gray-600">
                  <p>Teacher: {teaching.teacher}</p>
                  <p>Duration: {teaching.duration}</p>
                  <p>Level: {teaching.level}</p>
                </div>
              </CardContent>
              <CardFooter>
                <Button variant="outline" size="sm" className="w-full">
                  Watch Teaching
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </section>

      {/* Teaching Levels */}
      <section className="mb-16">
        <h2 className="text-2xl font-bold mb-6">Teachings by Level</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            {
              level: "Beginner",
              description: "Foundational teachings for those new to Buddhism",
              topics: ["Basic Meditation", "Core Concepts", "Ethical Living"],
            },
            {
              level: "Intermediate",
              description: "Deeper studies for established practitioners",
              topics: [
                "Advanced Meditation",
                "Philosophical Inquiry",
                "Scriptural Analysis",
              ],
            },
            {
              level: "Advanced",
              description: "Profound teachings for dedicated students",
              topics: ["Tantric Practices", "Mahamudra", "Dzogchen"],
            },
          ].map((level, index) => (
            <Card key={index}>
              <CardHeader>
                <CardTitle>{level.level}</CardTitle>
                <CardDescription>{level.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-1">
                  {level.topics.map((topic, i) => (
                    <li key={i} className="flex items-center">
                      <span className="h-1.5 w-1.5 rounded-full bg-amber-600 mr-2"></span>
                      {topic}
                    </li>
                  ))}
                </ul>
              </CardContent>
              <CardFooter>
                <Button variant="outline" className="w-full">
                  Browse {level.level} Teachings
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </section>

      {/* Study Resources */}
      <section>
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
              <Button size="sm">Access Journal</Button>
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
              <Button size="sm">View Glossary</Button>
            </div>
          </Card>
        </div>
      </section>
    </div>
  );
};

export default TeachingsPage;
