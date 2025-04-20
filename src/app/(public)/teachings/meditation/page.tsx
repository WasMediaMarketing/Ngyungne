"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  PlayCircle,
  Clock,
  Users,
  Heart,
  Brain,
  Star,
  Calendar,
  ArrowRight,
  RefreshCw,
  MessageCircleQuestion,
  Search,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { meditationApi } from "@/utils/meditationApi";
import { toast } from "sonner";
import type { IMeditation } from "@/types/meditation.types";

export default function Meditation() {
  const [meditations, setMeditations] = useState<IMeditation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedDifficulty, setSelectedDifficulty] = useState("");
  const [categories, setCategories] = useState<string[]>([]);
  const [difficulties, setDifficulties] = useState<string[]>([
    "Beginner",
    "Intermediate",
    "Advanced",
  ]);

  useEffect(() => {
    const fetchMeditations = async () => {
      try {
        setLoading(true);
        const data = await meditationApi.getPublicMeditations();
        setMeditations(data);

        // Extract unique categories
        const uniqueCategories = Array.from(
          new Set(data.map((item) => item.category))
        );
        setCategories(uniqueCategories);
      } catch (err) {
        console.error("Error fetching meditations:", err);
        setError("Failed to load meditations. Please try again later.");
        toast.error("Failed to load meditations");
      } finally {
        setLoading(false);
      }
    };

    fetchMeditations();
  }, []);

  // Filter meditations based on search query, category, and difficulty
  const filteredMeditations = meditations.filter((meditation) => {
    const matchesSearch =
      searchQuery === "" ||
      meditation.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      meditation.description
        .toLowerCase()
        .includes(searchQuery.toLowerCase()) ||
      (meditation.tags &&
        meditation.tags.some((tag) =>
          tag.toLowerCase().includes(searchQuery.toLowerCase())
        ));

    const matchesCategory =
      selectedCategory === "" || meditation.category === selectedCategory;
    const matchesDifficulty =
      selectedDifficulty === "" || meditation.difficulty === selectedDifficulty;

    return matchesSearch && matchesCategory && matchesDifficulty;
  });

  const handleStartMeditation = (meditation: IMeditation) => {
    // In a real app, this would start the meditation playback
    toast.info(`Starting ${meditation.title} meditation...`);
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-16 flex flex-col items-center justify-center min-h-[50vh]">
        <RefreshCw className="h-12 w-12 animate-spin text-primary mb-4" />
        <p className="text-lg text-muted-foreground">Loading meditations...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <MessageCircleQuestion className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
        <h1 className="text-2xl font-bold mb-4">Something went wrong</h1>
        <p className="mb-8 text-muted-foreground">{error}</p>
        <Button onClick={() => window.location.reload()}>
          <RefreshCw className="h-4 w-4 mr-2" />
          Try Again
        </Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 bg-gradient-to-br from-amber-50 to-white min-h-screen">
      <Breadcrumbs />
      <motion.div
        className="text-center mb-12"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <h1 className="text-5xl font-bold mb-4 text-amber-900 bg-clip-text text-transparent bg-gradient-to-r from-amber-700 to-rose-700">
          Meditation Journey
        </h1>
        <p className="text-xl mb-6 text-amber-800 max-w-2xl mx-auto">
          Discover guided meditation sessions and techniques to cultivate
          mindfulness, reduce stress, and enhance your well-being.
        </p>
        <div className="flex justify-center space-x-4 mb-8">
          <Button className="bg-amber-600 hover:bg-amber-700 text-white">
            <Calendar className="mr-2 h-4 w-4" /> Schedule Session
          </Button>
          <Button
            variant="outline"
            className="border-amber-600 text-amber-700 hover:bg-amber-100"
          >
            <Users className="mr-2 h-4 w-4" /> Join Group Meditation
          </Button>
        </div>
      </motion.div>

      {/* Search and Filter */}
      <motion.div
        className="mb-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-grow">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search meditations..."
              className="pl-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="flex gap-2">
            <Select
              value={selectedCategory}
              onValueChange={setSelectedCategory}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="All Categories" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {categories.map((category) => (
                  <SelectItem key={category} value={category}>
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select
              value={selectedDifficulty}
              onValueChange={setSelectedDifficulty}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="All Difficulties" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Difficulties</SelectItem>
                {difficulties.map((difficulty) => (
                  <SelectItem key={difficulty} value={difficulty}>
                    {difficulty}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </motion.div>

      {filteredMeditations.length === 0 ? (
        <div className="text-center py-16">
          <MessageCircleQuestion className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
          <h2 className="text-2xl font-bold mb-2">No meditations found</h2>
          <p className="text-muted-foreground mb-6">
            Try adjusting your search or filters
          </p>
          <Button
            onClick={() => {
              setSearchQuery("");
              setSelectedCategory("");
              setSelectedDifficulty("");
            }}
          >
            Clear Filters
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredMeditations.map((meditation, index) => {
            const IconComponent =
              meditation.category === "Morning"
                ? Brain
                : meditation.category === "Sleep"
                ? Clock
                : meditation.category === "Focus"
                ? Star
                : Heart;

            return (
              <motion.div
                key={meditation._id.toString()}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Card
                  className={`h-full flex flex-col shadow-lg hover:shadow-xl transition-shadow bg-${
                    meditation.category === "Morning"
                      ? "blue"
                      : meditation.category === "Sleep"
                      ? "indigo"
                      : meditation.category === "Focus"
                      ? "emerald"
                      : "rose"
                  }-50 border-${
                    meditation.category === "Morning"
                      ? "blue"
                      : meditation.category === "Sleep"
                      ? "indigo"
                      : meditation.category === "Focus"
                      ? "emerald"
                      : "rose"
                  }-200`}
                >
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div className="flex items-center">
                        <div className="mr-3 p-2 rounded-full bg-white/80">
                          <IconComponent className="h-6 w-6 text-amber-700" />
                        </div>
                        <div>
                          <CardTitle className="text-2xl text-amber-900">
                            {meditation.title}
                          </CardTitle>
                          <CardDescription className="text-amber-800 mt-1">
                            {meditation.description}
                          </CardDescription>
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-2 mt-2">
                      <Badge
                        variant="secondary"
                        className="bg-amber-200 text-amber-800"
                      >
                        {meditation.difficulty || "Beginner"}
                      </Badge>
                      {meditation.tags &&
                        meditation.tags.slice(0, 2).map((tag, i) => (
                          <Badge
                            key={i}
                            variant="outline"
                            className="border-amber-400 text-amber-700"
                          >
                            {tag}
                          </Badge>
                        ))}
                    </div>
                  </CardHeader>
                  <CardContent className="flex-grow">
                    <Tabs defaultValue="overview" className="w-full">
                      <TabsList className="grid w-full grid-cols-2 bg-white/50">
                        <TabsTrigger
                          value="overview"
                          className="data-[state=active]:bg-amber-300 data-[state=active]:text-amber-900"
                        >
                          Overview
                        </TabsTrigger>
                        <TabsTrigger
                          value="steps"
                          className="data-[state=active]:bg-amber-300 data-[state=active]:text-amber-900"
                        >
                          Steps
                        </TabsTrigger>
                      </TabsList>
                      <TabsContent value="overview">
                        <div className="space-y-4">
                          <div className="flex justify-between items-center">
                            <div className="flex items-center text-amber-800">
                              <Clock className="mr-2 h-4 w-4" />
                              {meditation.duration} minutes
                            </div>
                          </div>
                          <div className="flex items-center text-amber-800 text-sm">
                            <Users className="mr-2 h-4 w-4" />
                            {meditation.sessions?.toLocaleString() || 0}{" "}
                            sessions completed
                          </div>
                          {meditation.benefits &&
                            meditation.benefits.length > 0 && (
                              <div>
                                <h4 className="font-semibold text-amber-800 mb-2">
                                  Benefits:
                                </h4>
                                <ul className="space-y-1">
                                  {meditation.benefits
                                    .slice(0, 3)
                                    .map((benefit, i) => (
                                      <li
                                        key={i}
                                        className="flex items-center text-amber-700"
                                      >
                                        <div className="rounded-full bg-amber-200 p-1 mr-2">
                                          <ArrowRight className="h-3 w-3 text-amber-700" />
                                        </div>
                                        {benefit}
                                      </li>
                                    ))}
                                </ul>
                              </div>
                            )}
                        </div>
                      </TabsContent>
                      <TabsContent value="steps" className="space-y-2 py-2">
                        {meditation.steps && meditation.steps.length > 0 ? (
                          meditation.steps.slice(0, 3).map((step, i) => (
                            <div key={i} className="flex items-start">
                              <div className="bg-amber-200 text-amber-800 rounded-full w-6 h-6 flex items-center justify-center mr-3 mt-0.5 flex-shrink-0">
                                {i + 1}
                              </div>
                              <p className="text-amber-700">{step}</p>
                            </div>
                          ))
                        ) : (
                          <p className="text-amber-700 italic">
                            No steps available for this meditation.
                          </p>
                        )}
                      </TabsContent>
                    </Tabs>
                  </CardContent>
                  <CardFooter className="pt-0">
                    <div className="w-full space-y-2">
                      <Button
                        className="w-full bg-amber-600 hover:bg-amber-700 text-white"
                        onClick={() => handleStartMeditation(meditation)}
                      >
                        <PlayCircle className="mr-2 h-4 w-4" /> Start Meditation
                      </Button>

                      <Button
                        variant="outline"
                        className="w-full border-amber-600 text-amber-700 hover:bg-amber-100"
                        asChild
                      >
                        <Link href={`/teachings/meditation/${meditation._id}`}>
                          View Details
                        </Link>
                      </Button>
                    </div>
                  </CardFooter>
                </Card>
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
}
