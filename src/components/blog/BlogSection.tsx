"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { blogApi } from "@/utils/blogApi";
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
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { CalendarDays, Clock, Eye } from "lucide-react";
import type { IBlogPost } from "@/types";

export default function BlogSection() {
  const [blogPosts, setBlogPosts] = useState<IBlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchBlogPosts = async () => {
      setLoading(true);
      try {
        const posts = await blogApi.getPublicBlogPosts();
        setBlogPosts(posts);
      } catch (error) {
        console.error("Error fetching blog posts:", error);
        setError("Failed to load blog posts");
      } finally {
        setLoading(false);
      }
    };

    fetchBlogPosts();
  }, []);

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

  const formatDate = (dateString: string | Date) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8 flex flex-col items-center justify-center min-h-[50vh]">
        <h1 className="text-2xl font-bold text-crimson-800 mb-4">
          Error Loading Blog
        </h1>
        <p className="text-maroon-600 mb-6">{error}</p>
        <Button
          onClick={() => window.location.reload()}
          variant="default"
          className="bg-crimson-600 hover:bg-crimson-700"
        >
          Try Again
        </Button>
      </div>
    );
  }

  // Get latest post and the next 6 posts
  const latestPost = blogPosts.length > 0 ? blogPosts[0] : null;
  const nextSixPosts = blogPosts.slice(1, 7);

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      {/* Header Section with Animation */}
      <div className="mb-12 text-center">
        <div className="mb-12 text-center">
          <span className="inline-block px-4 py-1 rounded-full bg-saffron-100 text-crimson-700 text-sm font-medium mb-4">
            Dharma Blog
          </span>
          <motion.h1
            className="text-3xl md:text-4xl font-bold mb-4 text-crimson-800"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            Dharma Insights
          </motion.h1>
          <motion.p
            className="text-maroon-600 max-w-2xl mx-auto text-base md:text-lg"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            Explore our collection of articles on Buddhist teachings, meditation
            practices, and insights for bringing mindfulness into everyday life.
          </motion.p>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-crimson-600"></div>
        </div>
      ) : (
        <>
          {/* Latest Article */}
          {latestPost && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="mb-12"
            >
              <h2 className="text-2xl font-semibold mb-6 text-crimson-700 border-b border-saffron-200 pb-2">
                Latest Article
              </h2>
              <Card className="overflow-hidden bg-gradient-to-br from-saffron-50 to-white border-saffron-200 shadow-lg">
                <div className="md:flex">
                  <div className="md:w-1/2 relative h-64 md:h-auto">
                    <div className="w-full h-full relative">
                      <Image
                        src={
                          latestPost.image ||
                          "/placeholder.svg?height=400&width=600" ||
                          "/placeholder.svg"
                        }
                        alt={latestPost.title}
                        layout="fill"
                        objectFit="cover"
                        className="rounded-t-lg md:rounded-l-lg md:rounded-t-none"
                        unoptimized
                      />
                    </div>
                    <div className="absolute top-4 left-4 flex gap-2">
                      {Array.isArray(latestPost.categories) &&
                        latestPost.categories.map((category) => (
                          <Badge
                            key={category}
                            className="bg-crimson-600 text-white hover:bg-crimson-700"
                          >
                            {category}
                          </Badge>
                        ))}
                    </div>
                  </div>
                  <div className="md:w-1/2 p-6">
                    <CardTitle className="text-2xl font-bold text-crimson-800 mb-3">
                      {latestPost.title}
                    </CardTitle>
                    <CardDescription className="text-maroon-700 mb-4 text-lg">
                      {latestPost.description}
                    </CardDescription>
                    <div className="flex items-center space-x-4 mb-6">
                      <Avatar className="border-2 border-saffron-200">
                        <AvatarImage
                          src={
                            latestPost.author?.image ||
                            "/placeholder.svg?height=40&width=40" ||
                            "/placeholder.svg"
                          }
                          alt={latestPost.author?.name || "Author"}
                        />
                        <AvatarFallback className="bg-maroon-100 text-maroon-800">
                          {latestPost.author?.name
                            ? latestPost.author.name
                                .split(" ")
                                .map((n) => n[0])
                                .join("")
                            : "A"}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="text-sm font-medium text-maroon-800">
                          {latestPost.author?.name || "Anonymous"}
                        </p>
                        <div className="flex items-center text-sm text-maroon-600">
                          <CalendarDays className="mr-1 h-3 w-3" />
                          {formatDate(latestPost.date)}
                          <Clock className="ml-3 mr-1 h-3 w-3" />
                          {latestPost.readTime || "5 min read"}
                          <Eye className="ml-3 mr-1 h-3 w-3" />
                          {latestPost.views || 0} views
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-2 mb-6">
                      {Array.isArray(latestPost.tags) &&
                        latestPost.tags.map((tag) => (
                          <Badge
                            key={tag}
                            variant="secondary"
                            className="bg-saffron-100 text-maroon-700 hover:bg-saffron-200"
                          >
                            {tag}
                          </Badge>
                        ))}
                    </div>
                    <div className="flex justify-between items-center">
                      <Link href={`/resources/blog/${latestPost.id}`}>
                        <Button className="bg-crimson-600 hover:bg-crimson-700 text-white">
                          Read Article
                        </Button>
                      </Link>
                    </div>
                  </div>
                </div>
              </Card>
            </motion.div>
          )}

          {/* Recent Posts Grid - 6 blog posts */}
          <div className="mb-12">
            <h2 className="text-2xl font-semibold mb-6 text-crimson-700 border-b border-saffron-200 pb-2">
              Recent Articles
            </h2>

            {nextSixPosts.length === 0 ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-12"
              >
                <p className="text-lg text-maroon-700">No articles found.</p>
              </motion.div>
            ) : (
              <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="grid gap-8 md:grid-cols-2 lg:grid-cols-3"
              >
                {nextSixPosts.map((post) => (
                  <motion.div
                    key={post.id.toString()}
                    variants={itemVariants}
                    className="h-full"
                  >
                    <Card className="h-full flex flex-col bg-saffron-50 border-saffron-200 hover:shadow-md transition-shadow duration-300">
                      <div className="relative">
                        <div className="aspect-video relative">
                          <Image
                            src={
                              post.image ||
                              "/placeholder.svg?height=400&width=600" ||
                              "/placeholder.svg"
                            }
                            alt={post.title}
                            layout="fill"
                            objectFit="cover"
                            className="rounded-t-lg"
                            unoptimized
                          />
                        </div>
                        <div className="absolute top-4 left-4 flex gap-2">
                          {Array.isArray(post.categories) &&
                            post.categories.map((category) => (
                              <Badge
                                key={category}
                                className="bg-crimson-600 text-white hover:bg-crimson-700"
                              >
                                {category}
                              </Badge>
                            ))}
                        </div>
                      </div>
                      <CardHeader className="pb-2">
                        <div className="flex justify-between items-start mb-2">
                          <CardTitle className="text-xl text-crimson-700 line-clamp-2 hover:text-crimson-800">
                            <Link href={`/resources/blog/${post.id}`}>
                              {post.title}
                            </Link>
                          </CardTitle>
                        </div>
                        <CardDescription className="text-maroon-600 line-clamp-2">
                          {post.description}
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="pb-2 flex-grow">
                        <div className="flex items-center space-x-3 mb-4">
                          <Avatar className="h-8 w-8 border border-saffron-200">
                            <AvatarImage
                              src={
                                post.author?.image ||
                                "/placeholder.svg?height=40&width=40" ||
                                "/placeholder.svg"
                              }
                              alt={post.author?.name || "Author"}
                            />
                            <AvatarFallback className="bg-maroon-100 text-maroon-800 text-xs">
                              {post.author?.name
                                ? post.author.name
                                    .split(" ")
                                    .map((n) => n[0])
                                    .join("")
                                : "A"}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="text-xs font-medium text-maroon-800">
                              {post.author?.name || "Anonymous"}
                            </p>
                            <div className="flex items-center text-xs text-maroon-600">
                              <CalendarDays className="mr-1 h-3 w-3" />
                              {formatDate(post.date)}
                            </div>
                          </div>
                          <div className="ml-auto text-xs text-maroon-600 flex items-center gap-2">
                            <div>
                              <Clock className="inline-block mr-1 h-3 w-3" />
                              {post.readTime || "5 min read"}
                            </div>
                            <div>
                              <Eye className="inline-block mr-1 h-3 w-3" />
                              {post.views || 0}
                            </div>
                          </div>
                        </div>
                        <p
                          className="text-maroon-700 text-sm line-clamp-3 mb-4"
                          dangerouslySetInnerHTML={{ __html: post.content }}
                        ></p>
                        <div className="flex flex-wrap gap-1 mb-2">
                          {Array.isArray(post.tags) &&
                            post.tags.slice(0, 2).map((tag) => (
                              <Badge
                                key={tag}
                                variant="secondary"
                                className="bg-saffron-100 text-maroon-700 hover:bg-saffron-200 text-xs px-2 py-0"
                              >
                                {tag}
                              </Badge>
                            ))}
                          {Array.isArray(post.tags) && post.tags.length > 2 && (
                            <Badge
                              variant="secondary"
                              className="bg-saffron-100 text-maroon-700 hover:bg-saffron-200 text-xs px-2 py-0"
                            >
                              +{post.tags.length - 2}
                            </Badge>
                          )}
                        </div>
                      </CardContent>
                      <CardFooter className="pt-2 flex justify-between items-center border-t border-saffron-200">
                        <Link href={`/resources/blog/${post.id}`}>
                          <Button
                            size="sm"
                            className="bg-crimson-600 hover:bg-crimson-700 text-white"
                          >
                            Read More
                          </Button>
                        </Link>
                      </CardFooter>
                    </Card>
                  </motion.div>
                ))}
              </motion.div>
            )}
          </div>

          {/* See All Articles Button */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.7 }}
            className="flex justify-center mb-12"
          >
            <Link href="/resources/blog">
              <Button
                className="bg-crimson-700 hover:bg-crimson-800 text-white px-8 py-6 text-lg"
                size="lg"
              >
                See All Articles
              </Button>
            </Link>
          </motion.div>
        </>
      )}
    </div>
  );
}
