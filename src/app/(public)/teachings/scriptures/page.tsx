"use client";

import { motion } from "framer-motion";
import { Breadcrumbs } from "@/components/breadcrumbs";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useEffect, useState } from "react";
import {
  ScrollText,
  Search,
  Book,
  Bookmark,
  HeartHandshake,
  BookOpenText,
  History,
  MessageCircleQuestion,
  RefreshCw,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { createScriptureApi } from "@/utils/scriptureApi";
import type { IScripture } from "@/types/scripture.types";
import { toast } from "sonner";

const scriptureApi = createScriptureApi();

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
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      type: "spring",
      stiffness: 100,
    },
  },
};

export default function Scriptures() {
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("all");
  const [viewMode, setViewMode] = useState("grid");
  const [scriptures, setScriptures] = useState<IScripture[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch scriptures from API
  useEffect(() => {
    fetchScriptures();
  }, []);

  const fetchScriptures = async () => {
    try {
      setLoading(true);
      const data = await scriptureApi.getScriptures();
      setScriptures(data);
      setError(null);
    } catch (err) {
      console.error("Error fetching scriptures:", err);
      setError("Failed to load scriptures. Please try again later.");
      toast.error("Failed to load scriptures");
    } finally {
      setLoading(false);
    }
  };

  // Filter scriptures based on search term and active tab
  const filteredScriptures = scriptures.filter((scripture) => {
    const matchesSearch =
      scripture.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      scripture.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      scripture.verses.some((verse) =>
        verse.text.toLowerCase().includes(searchTerm.toLowerCase())
      );

    const matchesTab =
      activeTab === "all" ||
      scripture.tradition.toLowerCase() === activeTab.toLowerCase();

    return matchesSearch && matchesTab;
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-amber-50 to-amber-100 flex items-center justify-center">
        <div className="flex flex-col items-center">
          <RefreshCw className="h-12 w-12 text-crimson-500 animate-spin mb-4" />
          <h2 className="text-xl font-medium text-crimson-700">
            Loading scriptures...
          </h2>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-amber-50 to-amber-100 flex items-center justify-center p-4">
        <div className="text-center max-w-md">
          <MessageCircleQuestion className="mx-auto h-16 w-16 text-crimson-300 mb-4" />
          <h2 className="text-2xl font-bold text-crimson-800 mb-2">
            Something went wrong
          </h2>
          <p className="text-maroon-600 mb-6">{error}</p>
          <Button
            onClick={fetchScriptures}
            className="bg-crimson-600 hover:bg-crimson-700"
          >
            <RefreshCw className="mr-2 h-4 w-4" />
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50 to-amber-100">
      <div className="container mx-auto px-4 py-12">
        <Breadcrumbs />

        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
        >
          <motion.div
            className="inline-block p-4 bg-saffron-100 rounded-full mb-4"
            whileHover={{ scale: 1.1 }}
            transition={{ duration: 0.3 }}
          >
            <ScrollText className="h-12 w-12 text-crimson-700" />
          </motion.div>
          <motion.h1
            className="text-5xl font-bold mb-4 text-crimson-800 tracking-tight"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            Buddhist Scriptures
          </motion.h1>
          <motion.p
            className="text-xl mb-8 text-maroon-700 max-w-3xl mx-auto leading-relaxed"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            Explore the sacred texts that have preserved Buddha's wisdom for
            over two millennia, offering profound insights into the nature of
            mind, reality, and the path to enlightenment.
          </motion.p>

          {/* Search and filter controls */}
          <motion.div
            className="flex flex-col sm:flex-row justify-center items-center gap-4 mb-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7 }}
          >
            <div className="relative w-full max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <Input
                type="text"
                placeholder="Search scriptures..."
                className="pl-10 bg-white/90 border-saffron-200 focus:border-crimson-500"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <div className="flex items-center space-x-2">
              <Button
                variant={viewMode === "grid" ? "default" : "outline"}
                size="sm"
                onClick={() => setViewMode("grid")}
                className={
                  viewMode === "grid"
                    ? "bg-crimson-600 hover:bg-crimson-700"
                    : ""
                }
              >
                Grid
              </Button>
              <Button
                variant={viewMode === "list" ? "default" : "outline"}
                size="sm"
                onClick={() => setViewMode("list")}
                className={
                  viewMode === "list"
                    ? "bg-crimson-600 hover:bg-crimson-700"
                    : ""
                }
              >
                List
              </Button>
            </div>
          </motion.div>

          {/* Tradition tabs */}
          <motion.div
            className="mb-10"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
          >
            <Tabs
              defaultValue="all"
              value={activeTab}
              onValueChange={setActiveTab}
            >
              <TabsList className="bg-saffron-100 p-1 rounded-lg inline-flex">
                <TabsTrigger
                  value="all"
                  className="data-[state=active]:bg-saffron-300 data-[state=active]:text-crimson-800"
                >
                  All Traditions
                </TabsTrigger>
                <TabsTrigger
                  value="theravada"
                  className="data-[state=active]:bg-saffron-300 data-[state=active]:text-crimson-800"
                >
                  Theravada
                </TabsTrigger>
                <TabsTrigger
                  value="mahayana"
                  className="data-[state=active]:bg-saffron-300 data-[state=active]:text-crimson-800"
                >
                  Mahayana
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </motion.div>
        </motion.div>

        {/* Scripture display - Grid or List view */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className={
            viewMode === "grid"
              ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
              : "space-y-6"
          }
        >
          {filteredScriptures.length > 0 ? (
            filteredScriptures.map((scripture) => (
              <motion.div
                key={scripture._id.toString()}
                variants={itemVariants}
                className={viewMode === "list" ? "w-full" : ""}
              >
                <Card className="bg-saffron-50 border-saffron-200 h-full flex flex-col overflow-hidden shadow-md hover:shadow-lg transition-shadow">
                  <CardHeader className="border-b border-saffron-200 bg-gradient-to-r from-saffron-100 to-amber-100">
                    <div className="flex justify-between items-start mb-2">
                      <CardTitle className="text-2xl text-crimson-700">
                        {scripture.title}
                      </CardTitle>
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-100 text-amber-800">
                        {scripture.tradition}
                      </span>
                    </div>
                    <CardDescription className="text-maroon-600">
                      {scripture.description}
                    </CardDescription>
                    <div className="flex items-center gap-4 mt-3 text-sm text-maroon-600">
                      <div className="flex items-center gap-1">
                        <History className="h-4 w-4" />
                        <span>{scripture.period}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <BookOpenText className="h-4 w-4" />
                        <span>{scripture.language}</span>
                      </div>
                    </div>
                  </CardHeader>

                  <CardContent className="flex-grow pt-6">
                    {viewMode === "grid" ? (
                      <>
                        <h3 className="font-medium text-lg text-crimson-700 mb-3 flex items-center gap-2">
                          <Book className="h-5 w-5" />
                          Overview
                        </h3>
                        <p className="text-maroon-700 mb-6 line-clamp-3">
                          {scripture.overview}
                        </p>
                      </>
                    ) : (
                      <>
                        <h3 className="font-medium text-lg text-crimson-700 mb-3 flex items-center gap-2">
                          <Book className="h-5 w-5" />
                          Overview
                        </h3>
                        <p className="text-maroon-700 mb-6">
                          {scripture.overview}
                        </p>

                        <h3 className="font-medium text-lg text-crimson-700 mb-3 flex items-center gap-2">
                          <HeartHandshake className="h-5 w-5" />
                          Significance
                        </h3>
                        <p className="text-maroon-700 mb-6">
                          {scripture.significance}
                        </p>

                        <h3 className="font-medium text-lg text-crimson-700 mb-3 flex items-center gap-2">
                          <History className="h-5 w-5" />
                          Historical Context
                        </h3>
                        <p className="text-maroon-700 mb-6">
                          {scripture.historicalContext}
                        </p>
                      </>
                    )}

                    <h3 className="font-medium text-lg text-crimson-700 mb-3 flex items-center gap-2">
                      <Bookmark className="h-5 w-5" />
                      Key Verses
                    </h3>

                    <Accordion type="single" collapsible className="w-full">
                      {scripture.verses.slice(0, 3).map((verse, verseIndex) => (
                        <AccordionItem
                          key={verseIndex}
                          value={`verse-${verseIndex}`}
                          className="border-saffron-200"
                        >
                          <AccordionTrigger className="text-crimson-600 hover:text-crimson-700 py-3">
                            <span className="flex items-center gap-2">
                              {verse.chapter && (
                                <span className="text-sm text-maroon-600">
                                  {verse.chapter}:
                                </span>
                              )}
                              <span>Verse {verse.number}</span>
                            </span>
                          </AccordionTrigger>
                          <AccordionContent className="text-maroon-800 space-y-3">
                            <p className="italic">{verse.text}</p>
                            {verse.commentary && (
                              <div className="pt-2 text-sm bg-amber-50 p-3 rounded-md border-l-2 border-amber-300">
                                <span className="font-medium text-amber-800">
                                  Commentary:
                                </span>{" "}
                                {verse.commentary}
                              </div>
                            )}
                          </AccordionContent>
                        </AccordionItem>
                      ))}
                    </Accordion>
                  </CardContent>

                  <CardFooter className="bg-saffron-50 border-t border-saffron-200 p-4">
                    <div className="flex justify-between items-center w-full">
                      <Link href={`/teachings/scriptures/${scripture._id}`}>
                        <Button
                          variant="ghost"
                          className="text-crimson-600 hover:text-crimson-800 hover:bg-saffron-100"
                        >
                          <BookOpenText className="mr-2 h-4 w-4" />
                          Read Full Text
                        </Button>
                      </Link>
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-maroon-600">
                          {scripture.views || 0} views
                        </span>
                        <Button
                          variant="outline"
                          className="text-crimson-600 border-crimson-300 hover:bg-crimson-50"
                        >
                          <Bookmark className="mr-2 h-4 w-4" />
                          Bookmark
                        </Button>
                      </div>
                    </div>
                  </CardFooter>
                </Card>
              </motion.div>
            ))
          ) : (
            <motion.div
              className="col-span-full text-center py-12"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <MessageCircleQuestion className="mx-auto h-12 w-12 text-crimson-300 mb-4" />
              <h3 className="text-xl font-medium text-crimson-700 mb-2">
                No scriptures found
              </h3>
              <p className="text-maroon-600">
                Try adjusting your search or filters
              </p>
            </motion.div>
          )}
        </motion.div>

        {/* Study recommendations */}
        <motion.div
          className="mt-16 bg-gradient-to-r from-saffron-100 to-amber-200 rounded-xl p-8 shadow-md"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          viewport={{ once: true }}
        >
          <h2 className="text-2xl font-bold text-crimson-800 mb-4">
            How to Study Buddhist Scriptures
          </h2>
          <p className="text-maroon-700 mb-6">
            Buddhist texts are meant to be contemplated deeply rather than
            merely read. Here are some traditional approaches to scripture
            study:
          </p>

          <div className="grid md:grid-cols-3 gap-6">
            <motion.div
              whileHover={{ y: -5 }}
              className="bg-white/80 p-6 rounded-lg shadow-sm"
            >
              <h3 className="font-semibold text-xl text-crimson-700 mb-2 flex items-center gap-2">
                <Book className="h-5 w-5" />
                Threefold Approach
              </h3>
              <ol className="space-y-2 text-maroon-700 list-decimal pl-5">
                <li>
                  <span className="font-medium">Listening/Reading</span> - First
                  encounter with the teaching
                </li>
                <li>
                  <span className="font-medium">Contemplation</span> -
                  Reflecting deeply on the meaning
                </li>
                <li>
                  <span className="font-medium">Meditation</span> -
                  Internalizing wisdom through practice
                </li>
              </ol>
            </motion.div>

            <motion.div
              whileHover={{ y: -5 }}
              className="bg-white/80 p-6 rounded-lg shadow-sm"
            >
              <h3 className="font-semibold text-xl text-crimson-700 mb-2 flex items-center gap-2">
                <MessageCircleQuestion className="h-5 w-5" />
                Key Questions
              </h3>
              <ul className="space-y-2 text-maroon-700 list-disc pl-5">
                <li>What is the historical context of this teaching?</li>
                <li>How does it relate to core Buddhist principles?</li>
                <li>How might I apply this wisdom in daily life?</li>
                <li>What obstacles prevent me from realizing this truth?</li>
              </ul>
            </motion.div>

            <motion.div
              whileHover={{ y: -5 }}
              className="bg-white/80 p-6 rounded-lg shadow-sm"
            >
              <h3 className="font-semibold text-xl text-crimson-700 mb-2 flex items-center gap-2">
                <HeartHandshake className="h-5 w-5" />
                Community Support
              </h3>
              <ul className="space-y-2 text-maroon-700 list-disc pl-5">
                <li>Study with qualified teachers when possible</li>
                <li>Discuss interpretations with fellow practitioners</li>
                <li>Attend dharma talks and scripture study groups</li>
                <li>Read traditional commentaries for deeper insights</li>
              </ul>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
