"use client";

import { motion, useInView } from "framer-motion";
import { useRef, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ChevronRight } from "lucide-react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Link from "next/link";
import { BlogFeaturedArticle } from "./blog-featured-article";
import { BlogPostCard } from "./blog-post-card";
import { BlogNewsletter } from "./blog-newsletter";
import { blogPosts } from "@/data/blog-posts";
import type { BlogPost } from "@/types/blog";

// Group articles by category
const categorizedPosts = blogPosts.reduce<Record<string, BlogPost[]>>(
  (acc, post) => {
    if (!acc[post.category]) {
      acc[post.category] = [];
    }
    acc[post.category].push(post);
    return acc;
  },
  {}
);

// Get all unique categories
const categories = Object.keys(categorizedPosts);

export function BlogSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.2 });
  const [activeTab, setActiveTab] = useState("All");
  const [hoveredCard, setHoveredCard] = useState<string | null>(null);

  // Filter posts based on selected category tab
  const filteredPosts =
    activeTab === "All" ? blogPosts : categorizedPosts[activeTab] || [];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.3,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 },
    },
  };

  return (
    <section className="py-20 bg-gradient-to-b from-white to-saffron-50">
      <div className="container mx-auto px-4">
        <motion.div
          ref={ref}
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : { opacity: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: -20 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <Badge
              variant="outline"
              className="mb-4 bg-saffron-100 text-crimson-700 border-saffron-200 px-3 py-1"
            >
              Dharma Insights
            </Badge>
            <h2 className="text-4xl font-bold mb-4 text-crimson-800 bg-gradient-to-r from-crimson-700 to-maroon-800 bg-clip-text text-transparent">
              From Our Blog
            </h2>
            <p className="text-xl text-maroon-600 max-w-3xl mx-auto mb-10">
              Explore our collection of articles on Buddhist teachings,
              meditation practices, and mindful living.
            </p>
          </motion.div>

          {/* Category Tabs */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="inline-block"
          >
            <Tabs
              defaultValue="All"
              value={activeTab}
              onValueChange={setActiveTab}
              className="w-full"
            >
              <TabsList className="bg-saffron-100 p-1 rounded-full flex flex-wrap justify-center">
                <TabsTrigger
                  value="All"
                  className="rounded-full data-[state=active]:bg-crimson-600 data-[state=active]:text-white px-6"
                >
                  All
                </TabsTrigger>
                {categories.map((category) => (
                  <TabsTrigger
                    key={category}
                    value={category}
                    className="rounded-full data-[state=active]:bg-crimson-600 data-[state=active]:text-white px-6"
                  >
                    {category}
                  </TabsTrigger>
                ))}
              </TabsList>
            </Tabs>
          </motion.div>
        </motion.div>

        {/* Featured Article */}
        {activeTab === "All" && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="mb-16"
          >
            <h3 className="text-2xl font-semibold mb-6 text-crimson-700 border-b border-saffron-200 pb-2">
              Featured Article
            </h3>
            <BlogFeaturedArticle post={blogPosts[0]} />
          </motion.div>
        )}

        {/* Blog Posts Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          className="grid md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {filteredPosts
            .slice(activeTab === "All" ? 1 : 0, activeTab === "All" ? 7 : 6)
            .map((post) => (
              <motion.div
                key={post.slug}
                variants={itemVariants}
                className="h-full"
              >
                <BlogPostCard
                  post={post}
                  isHovered={hoveredCard === post.slug}
                  onHoverStart={() => setHoveredCard(post.slug)}
                  onHoverEnd={() => setHoveredCard(null)}
                />
              </motion.div>
            ))}
        </motion.div>

        {/* View All Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.5, delay: 0.8 }}
          className="mt-12 text-center"
        >
          <Button
            variant="outline"
            size="lg"
            className="border-crimson-600 text-crimson-600 hover:bg-crimson-50 group"
            asChild
          >
            <Link href="/resources/blog">
              <span>View All Articles</span>
              <ChevronRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </Button>
        </motion.div>

        {/* Newsletter Subscription */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.5, delay: 1 }}
          className="mt-20"
        >
          <BlogNewsletter />
        </motion.div>
      </div>
    </section>
  );
}
