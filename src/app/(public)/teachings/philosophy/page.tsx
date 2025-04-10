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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import {
  ChevronDown,
  Flower,
  Book,
  History,
  Compass,
  RefreshCw,
} from "lucide-react";
import { philosophyApi } from "@/utils/philosophyApi";
import type { IPhilosophyTopic } from "@/types";

// Map of icon names to Lucide icon components
const iconMap: Record<string, JSX.Element> = {
  flower: <Flower className="h-5 w-5" />,
  compass: <Compass className="h-5 w-5" />,
  history: <History className="h-5 w-5" />,
  book: <Book className="h-5 w-5" />,
  // Add more icons as needed
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

export default function BuddhistPhilosophy() {
  const [expandedSection, setExpandedSection] = useState<number | null>(null);
  const [philosophyTopics, setPhilosophyTopics] = useState<IPhilosophyTopic[]>(
    []
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPhilosophyTopics = async () => {
      try {
        setLoading(true);
        const data = await philosophyApi.getPhilosophyTopics();
        setPhilosophyTopics(data);
        setError(null);
      } catch (err) {
        console.error("Error fetching philosophy topics:", err);
        setError("Failed to load philosophy topics. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchPhilosophyTopics();
  }, []);

  const toggleSection = (index: number) => {
    if (expandedSection === index) {
      setExpandedSection(null);
    } else {
      setExpandedSection(index);
    }
  };

  // Get the icon component based on the icon name from the database
  const getIconComponent = (iconName: string): JSX.Element => {
    return iconMap[iconName.toLowerCase()] || <Flower className="h-5 w-5" />;
  };

  // Default tab value (first topic or fallback)
  const defaultTabValue =
    philosophyTopics.length > 0
      ? philosophyTopics[0].title.toLowerCase().replace(/\s+/g, "-")
      : "loading";

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-amber-50 to-amber-100 flex items-center justify-center">
        <div className="text-center">
          <RefreshCw className="h-12 w-12 text-crimson-700 animate-spin mx-auto mb-4" />
          <p className="text-xl text-maroon-700">
            Loading philosophy topics...
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-amber-50 to-amber-100 flex items-center justify-center">
        <div className="text-center max-w-md p-8 bg-white/80 rounded-xl shadow-md">
          <h2 className="text-2xl font-bold text-crimson-800 mb-4">
            Something went wrong
          </h2>
          <p className="text-maroon-700 mb-6">{error}</p>
          <Button
            onClick={() => window.location.reload()}
            className="bg-crimson-700 hover:bg-crimson-800"
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh Page
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
          className="text-center mb-16"
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
        >
          <motion.div
            className="inline-block p-4 bg-saffron-100 rounded-full mb-4"
            whileHover={{ rotate: 360 }}
            transition={{ duration: 1.5, ease: "easeInOut" }}
          >
            <Flower className="h-12 w-12 text-crimson-700" />
          </motion.div>
          <motion.h1
            className="text-5xl font-bold mb-4 text-crimson-800 tracking-tight"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            Buddhist Philosophy
          </motion.h1>
          <motion.p
            className="text-xl mb-8 text-maroon-700 max-w-3xl mx-auto leading-relaxed"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            Explore the profound wisdom and compassionate teachings of Buddhism,
            a philosophy that has guided countless individuals toward inner
            peace and enlightenment for over 2,500 years.
          </motion.p>
        </motion.div>

        {philosophyTopics.length > 0 ? (
          <Tabs defaultValue={defaultTabValue} className="w-full">
            <TabsList className="grid w-full md:grid-cols-4 grid-cols-2 bg-saffron-100 rounded-xl p-1 mb-8">
              {philosophyTopics.map((topic, index) => (
                <TabsTrigger
                  key={index}
                  value={topic.title.toLowerCase().replace(/\s+/g, "-")}
                  className="data-[state=active]:bg-saffron-300 data-[state=active]:text-crimson-800 py-3 flex items-center justify-center gap-2"
                >
                  {getIconComponent(topic.icon)}
                  <span className="hidden sm:inline">{topic.title}</span>
                </TabsTrigger>
              ))}
            </TabsList>

            {philosophyTopics.map((topic, index) => (
              <TabsContent
                key={index}
                value={topic.title.toLowerCase().replace(/\s+/g, "-")}
              >
                <motion.div
                  variants={containerVariants}
                  initial="hidden"
                  animate="visible"
                >
                  <Card className="bg-saffron-50 border-saffron-200 shadow-lg overflow-hidden mb-8">
                    <CardHeader className="border-b border-saffron-200 bg-gradient-to-r from-saffron-100 to-amber-100">
                      <motion.div
                        variants={itemVariants}
                        className="flex items-center gap-3 mb-2"
                      >
                        {getIconComponent(topic.icon)}
                        <CardTitle className="text-3xl text-crimson-700">
                          {topic.title}
                        </CardTitle>
                      </motion.div>
                      <motion.div variants={itemVariants}>
                        <CardDescription className="text-lg text-maroon-600">
                          {topic.description}
                        </CardDescription>
                      </motion.div>
                    </CardHeader>
                    <CardContent className="text-maroon-800 pt-6">
                      <motion.div
                        variants={itemVariants}
                        className="prose prose-maroon max-w-none"
                      >
                        <div className="whitespace-pre-line text-lg">
                          {topic.content}
                        </div>
                      </motion.div>

                      {topic.quotes && topic.quotes.length > 0 && (
                        <motion.div variants={itemVariants} className="mt-8">
                          <h3 className="text-xl font-semibold text-crimson-700 mb-4 flex items-center gap-2">
                            <Book className="h-5 w-5" />
                            Notable Quotes
                          </h3>
                          <div className="space-y-4">
                            {topic.quotes.map((quote, i) => (
                              <motion.blockquote
                                key={i}
                                initial={{ opacity: 0, x: -20 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                transition={{ delay: i * 0.2 }}
                                className="border-l-4 border-saffron-300 pl-4 italic"
                              >
                                <p className="text-lg">{quote.text}</p>
                                <footer className="text-maroon-600 mt-2">
                                  — {quote.author}
                                </footer>
                              </motion.blockquote>
                            ))}
                          </div>
                        </motion.div>
                      )}
                    </CardContent>
                    {topic.practices && topic.practices.length > 0 && (
                      <CardFooter className="flex flex-col items-start bg-saffron-50 border-t border-saffron-200 px-6 py-4">
                        <motion.div variants={itemVariants} className="w-full">
                          <Button
                            variant="ghost"
                            onClick={() => toggleSection(index)}
                            className="flex items-center justify-between w-full text-left text-crimson-700 hover:text-crimson-900 hover:bg-saffron-100"
                          >
                            <span className="font-semibold">
                              Practices to Try
                            </span>
                            <ChevronDown
                              className={`h-5 w-5 transition-transform ${
                                expandedSection === index ? "rotate-180" : ""
                              }`}
                            />
                          </Button>

                          {expandedSection === index && (
                            <motion.ul
                              initial={{ opacity: 0, height: 0 }}
                              animate={{ opacity: 1, height: "auto" }}
                              exit={{ opacity: 0, height: 0 }}
                              className="mt-4 space-y-2 pl-6 list-disc text-maroon-700"
                            >
                              {topic.practices.map((practice, i) => (
                                <motion.li
                                  key={i}
                                  initial={{ opacity: 0, x: 20 }}
                                  animate={{ opacity: 1, x: 0 }}
                                  transition={{ delay: i * 0.1 }}
                                >
                                  {practice}
                                </motion.li>
                              ))}
                            </motion.ul>
                          )}
                        </motion.div>
                      </CardFooter>
                    )}
                  </Card>
                </motion.div>
              </TabsContent>
            ))}
          </Tabs>
        ) : (
          <div className="text-center p-8 bg-white/80 rounded-xl shadow-md">
            <h2 className="text-2xl font-bold text-crimson-800 mb-4">
              No philosophy topics found
            </h2>
            <p className="text-maroon-700 mb-6">
              Please check back later for content on Buddhist philosophy.
            </p>
          </div>
        )}

        <motion.div
          className="mt-16 bg-gradient-to-r from-saffron-100 to-amber-200 rounded-xl p-8 shadow-md"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          viewport={{ once: true }}
        >
          <h2 className="text-2xl font-bold text-crimson-800 mb-4">
            Begin Your Journey
          </h2>
          <p className="text-maroon-700 mb-6">
            Buddhism is not merely a philosophy to be studied, but a path to be
            practiced. Consider these resources to deepen your understanding:
          </p>

          <div className="grid md:grid-cols-3 gap-6">
            <motion.div
              whileHover={{ y: -5 }}
              className="bg-white/80 p-6 rounded-lg shadow-sm"
            >
              <h3 className="font-semibold text-xl text-crimson-700 mb-2">
                Recommended Books
              </h3>
              <ul className="space-y-2 text-maroon-700">
                <li>"What the Buddha Taught" by Walpola Rahula</li>
                <li>"The Heart of the Buddha's Teaching" by Thich Nhat Hanh</li>
                <li>"Buddhism Without Beliefs" by Stephen Batchelor</li>
              </ul>
            </motion.div>

            <motion.div
              whileHover={{ y: -5 }}
              className="bg-white/80 p-6 rounded-lg shadow-sm"
            >
              <h3 className="font-semibold text-xl text-crimson-700 mb-2">
                Meditation Centers
              </h3>
              <ul className="space-y-2 text-maroon-700">
                <li>Local Vipassana centers</li>
                <li>Zen Buddhist temples</li>
                <li>Tibetan Buddhist communities</li>
              </ul>
            </motion.div>

            <motion.div
              whileHover={{ y: -5 }}
              className="bg-white/80 p-6 rounded-lg shadow-sm"
            >
              <h3 className="font-semibold text-xl text-crimson-700 mb-2">
                Online Resources
              </h3>
              <ul className="space-y-2 text-maroon-700">
                <li>Access to Insight (Theravada texts)</li>
                <li>Dharma Seed (free meditation talks)</li>
                <li>Buddhist meditation apps</li>
              </ul>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
