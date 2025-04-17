"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { blogApi } from "@/utils/blogApi";
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
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { CalendarDays, Clock, Search } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import type { IBlogPost } from "@/types";

export default function Blog() {
  const [blogPosts, setBlogPosts] = useState<IBlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedTag, setSelectedTag] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [allCategories, setAllCategories] = useState<string[]>([]);
  const [allTags, setAllTags] = useState<string[]>([]);

  const postsPerPage = 3;

  useEffect(() => {
    const fetchBlogPosts = async () => {
      setLoading(true);
      try {
        const posts = await blogApi.getPublicBlogPosts();
        setBlogPosts(posts);

        // Extract all unique categories and tags
        if (Array.isArray(posts) && posts.length > 0) {
          // Make sure categories and tags are arrays before using flatMap
          const categories = [
            ...new Set(
              posts
                .filter((post) => Array.isArray(post.categories))
                .flatMap((post) => post.categories)
            ),
          ];

          const tags = [
            ...new Set(
              posts
                .filter((post) => Array.isArray(post.tags))
                .flatMap((post) => post.tags)
            ),
          ];

          setAllCategories(categories);
          setAllTags(tags);
        }
      } catch (error) {
        console.error("Error fetching blog posts:", error);
        setError("Failed to load blog posts");
      } finally {
        setLoading(false);
      }
    };

    fetchBlogPosts();
  }, []);

  // Filter posts based on search query, category, and tag
  const filteredPosts = blogPosts.filter((post) => {
    const matchesSearch =
      searchQuery === "" ||
      post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (post.description &&
        post.description.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesCategory =
      selectedCategory === "" ||
      (Array.isArray(post.categories) &&
        post.categories.includes(selectedCategory));

    const matchesTag =
      selectedTag === "" ||
      (Array.isArray(post.tags) && post.tags.includes(selectedTag));

    return matchesSearch && matchesCategory && matchesTag;
  });

  // Calculate pagination
  const indexOfLastPost = currentPage * postsPerPage;
  const indexOfFirstPost = indexOfLastPost - postsPerPage;
  const currentPosts = filteredPosts.slice(indexOfFirstPost, indexOfLastPost);
  const totalPages = Math.ceil(filteredPosts.length / postsPerPage);

  // Reset pagination when filters change
  const handleFilterChange = () => {
    setCurrentPage(1);
  };

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

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <Breadcrumbs />

      {/* Header Section with Animation */}
      <div className="mb-12 text-center">
        <motion.h1
          className="text-5xl font-bold mb-4 py-4 text-crimson-800 bg-gradient-to-r from-crimson-700 to-maroon-800 bg-clip-text text-transparent"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          Dharma Insights
        </motion.h1>
        <motion.p
          className="text-xl mb-8 text-maroon-700 max-w-3xl mx-auto"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          Explore our collection of articles on Buddhist teachings, meditation
          practices, and insights for bringing mindfulness into everyday life.
        </motion.p>

        {/* Search and Filter Section */}
        <motion.div
          className="flex flex-col md:flex-row gap-4 justify-center items-center mb-10"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <div className="relative w-full md:w-1/3">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
            <Input
              placeholder="Search articles..."
              className="pl-10"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                handleFilterChange();
              }}
            />
          </div>

          <Select
            value={selectedCategory || "all-categories"}
            onValueChange={(value) => {
              setSelectedCategory(value === "all-categories" ? "" : value);
              handleFilterChange();
            }}
          >
            <SelectTrigger className="w-full md:w-48">
              <SelectValue placeholder="All Categories" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all-categories">All Categories</SelectItem>
              {allCategories.map((category) => (
                <SelectItem key={category} value={category}>
                  {category}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select
            value={selectedTag || "all-tags"}
            onValueChange={(value) => {
              setSelectedTag(value === "all-tags" ? "" : value);
              handleFilterChange();
            }}
          >
            <SelectTrigger className="w-full md:w-48">
              <SelectValue placeholder="All Tags" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all-tags">All Tags</SelectItem>
              {allTags.map((tag) => (
                <SelectItem key={tag} value={tag}>
                  {tag}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </motion.div>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-crimson-600"></div>
        </div>
      ) : (
        <>
          {/* Latest Article (formerly Featured) */}
          {currentPage === 1 &&
            !searchQuery &&
            !selectedCategory &&
            !selectedTag &&
            blogPosts.length > 0 && (
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
                            blogPosts[0].image ||
                            "/placeholder.svg?height=400&width=600"
                          }
                          alt={blogPosts[0].title}
                          layout="fill"
                          objectFit="cover"
                          className="rounded-t-lg md:rounded-l-lg md:rounded-t-none"
                          unoptimized
                        />
                      </div>
                      <div className="absolute top-4 left-4 flex gap-2">
                        {Array.isArray(blogPosts[0].categories) &&
                          blogPosts[0].categories.map((category) => (
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
                        {blogPosts[0].title}
                      </CardTitle>
                      <CardDescription className="text-maroon-700 mb-4 text-lg">
                        {blogPosts[0].description}
                      </CardDescription>
                      <div className="flex items-center space-x-4 mb-6">
                        <Avatar className="border-2 border-saffron-200">
                          <AvatarImage
                            src={
                              blogPosts[0].author?.image ||
                              "/placeholder.svg?height=40&width=40"
                            }
                            alt={blogPosts[0].author?.name || "Author"}
                          />
                          <AvatarFallback className="bg-maroon-100 text-maroon-800">
                            {blogPosts[0].author?.name
                              ? blogPosts[0].author.name
                                  .split(" ")
                                  .map((n) => n[0])
                                  .join("")
                              : "A"}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="text-sm font-medium text-maroon-800">
                            {blogPosts[0].author?.name || "Anonymous"}
                          </p>
                          <div className="flex items-center text-sm text-maroon-600">
                            <CalendarDays className="mr-1 h-3 w-3" />
                            {formatDate(blogPosts[0].date)}
                            <Clock className="ml-3 mr-1 h-3 w-3" />
                            {blogPosts[0].readTime || "5 min read"}
                          </div>
                        </div>
                      </div>
                      <div className="flex flex-wrap gap-2 mb-6">
                        {Array.isArray(blogPosts[0].tags) &&
                          blogPosts[0].tags.map((tag) => (
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
                        <Link href={`/resources/blog/${blogPosts[0].id}`}>
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

          {/* Blog Posts Grid */}
          <div className="mb-12">
            <h2 className="text-2xl font-semibold mb-6 text-crimson-700 border-b border-saffron-200 pb-2">
              {searchQuery || selectedCategory || selectedTag
                ? "Search Results"
                : "All Articles"}
            </h2>

            {currentPosts.length === 0 ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-12"
              >
                <p className="text-lg text-maroon-700">
                  No articles found matching your criteria.
                </p>
                <Button
                  variant="outline"
                  className="mt-4 border-crimson-600 text-crimson-600 hover:bg-crimson-50"
                  onClick={() => {
                    setSearchQuery("");
                    setSelectedCategory("");
                    setSelectedTag("");
                  }}
                >
                  Clear Filters
                </Button>
              </motion.div>
            ) : (
              <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="grid gap-8 md:grid-cols-2 lg:grid-cols-3"
              >
                {currentPosts.map((post) => (
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
                              "/placeholder.svg?height=400&width=600"
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
                                "/placeholder.svg?height=40&width=40"
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
                          <div className="ml-auto text-xs text-maroon-600">
                            <Clock className="inline-block mr-1 h-3 w-3" />
                            {post.readTime || "5 min read"}
                          </div>
                        </div>
                        <p className="text-maroon-700 text-sm line-clamp-3 mb-4">
                          {post.content.substring(0, 150)}...
                        </p>
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

          {/* Pagination */}
          {filteredPosts.length > postsPerPage && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.6 }}
              className="mb-8"
            >
              <Pagination>
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious
                      onClick={() =>
                        setCurrentPage((prev) => Math.max(1, prev - 1))
                      }
                      className={
                        currentPage === 1
                          ? "pointer-events-none opacity-50"
                          : "cursor-pointer"
                      }
                    />
                  </PaginationItem>

                  {Array.from({ length: totalPages }).map((_, i) => {
                    // Show first page, current page, last page, and pages adjacent to current
                    if (
                      i === 0 ||
                      i === totalPages - 1 ||
                      i + 1 === currentPage ||
                      i + 1 === currentPage - 1 ||
                      i + 1 === currentPage + 1
                    ) {
                      return (
                        <PaginationItem key={i}>
                          <PaginationLink
                            isActive={currentPage === i + 1}
                            onClick={() => setCurrentPage(i + 1)}
                            className="cursor-pointer"
                          >
                            {i + 1}
                          </PaginationLink>
                        </PaginationItem>
                      );
                    }

                    // Show ellipses for gaps
                    if (
                      (i === 1 && currentPage > 3) ||
                      (i === totalPages - 2 && currentPage < totalPages - 2)
                    ) {
                      return (
                        <PaginationItem key={i}>
                          <PaginationEllipsis />
                        </PaginationItem>
                      );
                    }

                    return null;
                  })}

                  <PaginationItem>
                    <PaginationNext
                      onClick={() =>
                        setCurrentPage((prev) => Math.min(totalPages, prev + 1))
                      }
                      className={
                        currentPage === totalPages
                          ? "pointer-events-none opacity-50"
                          : "cursor-pointer"
                      }
                    />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            </motion.div>
          )}

          {/* Newsletter Subscription */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.7 }}
            className="bg-gradient-to-r from-crimson-50 to-saffron-50 rounded-xl p-8 border border-saffron-200 shadow-sm mb-12"
          >
            <div className="text-center mb-6">
              <h3 className="text-2xl font-bold text-crimson-800 mb-2">
                Subscribe to Our Newsletter
              </h3>
              <p className="text-maroon-700">
                Receive the latest articles and updates on Buddhist teachings
                directly in your inbox.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
              <Input placeholder="Enter your email" className="flex-grow" />
              <Button className="bg-crimson-600 hover:bg-crimson-700 text-white whitespace-nowrap">
                Subscribe
              </Button>
            </div>
          </motion.div>

          {/* Popular Tags */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ opacity: 0, y: 20 }}
            className="mb-12"
          >
            <h3 className="text-xl font-semibold mb-4 text-crimson-700 border-b border-saffron-200 pb-2">
              Popular Topics
            </h3>
            <div className="flex flex-wrap gap-2">
              {allTags.map((tag) => (
                <Badge
                  key={tag}
                  variant="secondary"
                  className={`bg-saffron-100 text-maroon-700 hover:bg-saffron-200 cursor-pointer ${
                    selectedTag === tag
                      ? "ring-2 ring-crimson-500 bg-saffron-200"
                      : ""
                  }`}
                  onClick={() => {
                    if (selectedTag === tag) {
                      setSelectedTag("");
                    } else {
                      setSelectedTag(tag);
                    }
                    handleFilterChange();
                  }}
                >
                  {tag}
                </Badge>
              ))}
            </div>
          </motion.div>
        </>
      )}
    </div>
  );
}
