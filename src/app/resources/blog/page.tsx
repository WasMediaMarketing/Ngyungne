"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
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
import {
  CalendarDays,
  Clock,
  Heart,
  Share2,
  Bookmark,
  ChevronDown,
  Search,
  Filter,
} from "lucide-react";
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

const blogPosts = [
  {
    id: 1,
    title: "The Power of Mindfulness in Daily Life",
    description:
      "Discover how practicing mindfulness can transform your everyday experiences and lead to greater peace and clarity.",
    date: "March 15, 2025",
    readTime: "5 min read",
    author: {
      name: "Tenzin Gyatso",
      image: "/placeholder.svg?height=40&width=40",
      bio: "Experienced meditation teacher with over 20 years of practice in Tibetan Buddhist traditions.",
    },
    tags: ["Mindfulness", "Daily Practice", "Meditation"],
    categories: ["Practice"],
    content:
      "Mindfulness is the practice of being fully present and engaged in the moment, aware of your thoughts and feelings without distraction or judgment. In our fast-paced world, it's easy to get caught up in the hustle and bustle of daily life, often leading to stress and anxiety. Through mindfulness practice, we can cultivate a deeper awareness of our emotions, thoughts, and sensations, allowing us to respond to life's challenges with greater clarity and compassion.\n\nThe benefits of mindfulness extend far beyond stress reduction. Research has shown that regular mindfulness practice can improve concentration, emotional regulation, and overall well-being. It can help us break free from automatic reactions and develop a more thoughtful relationship with our experiences.\n\nIn this article, we'll explore practical ways to incorporate mindfulness into your daily routine, from formal meditation sessions to mindful eating, walking, and communicating. You'll learn techniques that can be applied immediately to enhance your quality of life and develop a greater sense of inner peace.",
    image: "/placeholder.svg?height=400&width=600",
    views: 1245,
    likes: 87,
    comments: 23,
    relatedPosts: [2, 5],
  },
  {
    id: 2,
    title: "Understanding the Four Noble Truths",
    description:
      "An in-depth exploration of the foundational teachings of Buddhism and their relevance in modern times.",
    date: "March 10, 2025",
    readTime: "8 min read",
    author: {
      name: "Pema Chödrön",
      image: "/placeholder.svg?height=40&width=40",
      bio: "Renowned Buddhist teacher and author of numerous books on Buddhist philosophy and practice.",
    },
    tags: ["Buddhist Philosophy", "Four Noble Truths", "Dharma"],
    categories: ["Philosophy"],
    content:
      "The Four Noble Truths are the central teachings of Buddhism, first expounded by the Buddha in his very first sermon after attaining enlightenment. These truths form the foundation of Buddhist thought and practice, offering a profound understanding of the nature of suffering and the path to liberation.\n\nThe First Noble Truth acknowledges the reality of suffering (dukkha) in all forms of existence. This isn't limited to physical pain but includes the unsatisfactory nature of impermanent phenomena and the suffering caused by attachment to a false sense of self.\n\nThe Second Noble Truth identifies the cause of suffering as craving (tanha) and ignorance (avidya). Our tendency to grasp at pleasurable experiences, avoid unpleasant ones, and remain unaware of the true nature of reality perpetuates our suffering.\n\nThe Third Noble Truth offers hope by declaring that there is an end to suffering. By eliminating the causes of suffering—craving and ignorance—we can attain Nirvana, a state of perfect peace and freedom.\n\nThe Fourth Noble Truth prescribes the path to the cessation of suffering: the Noble Eightfold Path. This comprehensive approach to ethical conduct, mental discipline, and wisdom provides a practical framework for living a meaningful life and progressing toward liberation.",
    image: "/placeholder.svg?height=400&width=600",
    views: 982,
    likes: 92,
    comments: 31,
    relatedPosts: [3, 4],
  },
  {
    id: 3,
    title: "The Noble Eightfold Path: A Guide to Right Living",
    description:
      "Explore the Buddha's practical framework for ethical conduct, mental cultivation, and wisdom development.",
    date: "March 5, 2025",
    readTime: "10 min read",
    author: {
      name: "Thich Nhat Hanh",
      image: "/placeholder.svg?height=40&width=40",
      bio: "Zen master, global spiritual leader, peace activist, and author known for his teachings on mindfulness.",
    },
    tags: ["Eightfold Path", "Buddhist Ethics", "Meditation"],
    categories: ["Practice", "Philosophy"],
    content:
      "The Noble Eightfold Path represents Buddha's practical guidance for living ethically and mindfully. It encompasses three essential aspects of Buddhist practice: ethical conduct (sila), mental discipline (samadhi), and wisdom (panna). Through cultivation of these eight factors, practitioners progress toward liberation from suffering and the cultivation of compassion.",
    image: "/placeholder.svg?height=400&width=600",
    views: 845,
    likes: 76,
    comments: 19,
    relatedPosts: [2, 6],
  },
  {
    id: 4,
    title: "Introduction to Buddhist Meditation Techniques",
    description:
      "A comprehensive overview of various meditation practices in Buddhist traditions and their applications.",
    date: "February 28, 2025",
    readTime: "7 min read",
    author: {
      name: "Sharon Salzberg",
      image: "/placeholder.svg?height=40&width=40",
      bio: "Leading meditation teacher and author specializing in loving-kindness meditation.",
    },
    tags: ["Meditation", "Mindfulness", "Samatha", "Vipassana"],
    categories: ["Practice", "Meditation"],
    content:
      "Buddhist meditation encompasses a variety of techniques designed to develop mindfulness, concentration, and insight. From focusing on the breath to cultivating loving-kindness, these practices offer transformative tools for working with the mind and heart.",
    image: "/placeholder.svg?height=400&width=600",
    views: 1562,
    likes: 134,
    comments: 42,
    relatedPosts: [1, 3],
  },
  {
    id: 5,
    title: "Cultivating Compassion: Loving-Kindness Meditation",
    description:
      "Learn the ancient practice of metta meditation and how it can transform your relationships with yourself and others.",
    date: "February 20, 2025",
    readTime: "6 min read",
    author: {
      name: "Jack Kornfield",
      image: "/placeholder.svg?height=40&width=40",
      bio: "Trained as a Buddhist monk in Thailand, Burma, and India, now a renowned teacher and author.",
    },
    tags: ["Loving-Kindness", "Compassion", "Meditation"],
    categories: ["Practice", "Meditation"],
    content:
      "Loving-kindness meditation (metta) is a heartfelt practice that cultivates universal love and compassion. Beginning with oneself and extending outward, this meditation breaks down barriers between self and others, fostering deep connection and goodwill.",
    image: "/placeholder.svg?height=400&width=600",
    views: 923,
    likes: 102,
    comments: 28,
    relatedPosts: [1, 4],
  },
  {
    id: 6,
    title: "The Concept of Non-Self (Anatta) in Buddhism",
    description:
      "Exploring one of Buddhism's most profound and challenging teachings: the absence of a permanent, independent self.",
    date: "February 15, 2025",
    readTime: "9 min read",
    author: {
      name: "Joseph Goldstein",
      image: "/placeholder.svg?height=40&width=40",
      bio: "Co-founder of Insight Meditation Society and author of numerous books on Buddhist meditation.",
    },
    tags: ["Anatta", "Non-Self", "Buddhist Philosophy"],
    categories: ["Philosophy"],
    content:
      "The teaching of anatta (non-self) challenges our fundamental sense of identity by revealing the absence of a permanent, unchanging self. Through meditation and investigation, we can directly experience the fluid, interconnected nature of existence.",
    image: "/placeholder.svg?height=400&width=600",
    views: 765,
    likes: 83,
    comments: 37,
    relatedPosts: [2, 3],
  },
];

// Filter categories from all posts
const allCategories = [
  ...new Set(blogPosts.flatMap((post) => post.categories)),
];
// Get all unique tags
const allTags = [...new Set(blogPosts.flatMap((post) => post.tags))];

export default function Blog() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedTag, setSelectedTag] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const postsPerPage = 3;

  // Filter posts based on search query, category, and tag
  const filteredPosts = blogPosts.filter((post) => {
    const matchesSearch =
      searchQuery === "" ||
      post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.description.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCategory =
      selectedCategory === "" || post.categories.includes(selectedCategory);

    const matchesTag = selectedTag === "" || post.tags.includes(selectedTag);

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
            value={selectedCategory || "all-categories"} // Ensure default value is not an empty string
            onValueChange={(value) => {
              setSelectedCategory(value);
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
            value={selectedTag || "all-tags"} // Ensure default value is not an empty string
            onValueChange={(value) => {
              setSelectedTag(value);
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

      {/* Featured Post */}
      {currentPage === 1 &&
        !searchQuery &&
        !selectedCategory &&
        !selectedTag && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="mb-12"
          >
            <h2 className="text-2xl font-semibold mb-6 text-crimson-700 border-b border-saffron-200 pb-2">
              Featured Article
            </h2>
            <Card className="overflow-hidden bg-gradient-to-br from-saffron-50 to-white border-saffron-200 shadow-lg">
              <div className="md:flex">
                <div className="md:w-1/2 relative h-64 md:h-auto">
                  <div className="w-full h-full relative">
                    <Image
                      src={blogPosts[0].image}
                      alt={blogPosts[0].title}
                      layout="fill"
                      objectFit="cover"
                      className="rounded-t-lg md:rounded-l-lg md:rounded-t-none"
                      unoptimized
                    />
                  </div>
                  <div className="absolute top-4 left-4 flex gap-2">
                    {blogPosts[0].categories.map((category) => (
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
                        src={blogPosts[0].author.image}
                        alt={blogPosts[0].author.name}
                      />
                      <AvatarFallback className="bg-maroon-100 text-maroon-800">
                        {blogPosts[0].author.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="text-sm font-medium text-maroon-800">
                        {blogPosts[0].author.name}
                      </p>
                      <div className="flex items-center text-sm text-maroon-600">
                        <CalendarDays className="mr-1 h-3 w-3" />
                        {blogPosts[0].date}
                        <Clock className="ml-3 mr-1 h-3 w-3" />
                        {blogPosts[0].readTime}
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-2 mb-6">
                    {blogPosts[0].tags.map((tag) => (
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
                    <div className="flex items-center gap-4 text-sm text-maroon-600">
                      <span className="flex items-center">
                        <Heart className="h-4 w-4 mr-1" />
                        {blogPosts[0].likes}
                      </span>
                      <span className="flex items-center">
                        <span className="i-lucide-message-circle h-4 w-4 mr-1"></span>
                        {blogPosts[0].comments} comments
                      </span>
                    </div>
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
            : "Latest Articles"}
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
            {currentPosts.map((post, index) => (
              <motion.div
                key={post.id}
                variants={itemVariants}
                className="h-full"
              >
                <Card className="h-full flex flex-col bg-saffron-50 border-saffron-200 hover:shadow-md transition-shadow duration-300">
                  <div className="relative">
                    <div className="aspect-video relative">
                      <Image
                        src={post.image}
                        alt={post.title}
                        layout="fill"
                        objectFit="cover"
                        className="rounded-t-lg"
                        unoptimized
                      />
                    </div>
                    <div className="absolute top-4 left-4 flex gap-2">
                      {post.categories.map((category) => (
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
                          src={post.author.image}
                          alt={post.author.name}
                        />
                        <AvatarFallback className="bg-maroon-100 text-maroon-800 text-xs">
                          {post.author.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="text-xs font-medium text-maroon-800">
                          {post.author.name}
                        </p>
                        <div className="flex items-center text-xs text-maroon-600">
                          <CalendarDays className="mr-1 h-3 w-3" />
                          {post.date}
                        </div>
                      </div>
                      <div className="ml-auto text-xs text-maroon-600">
                        <Clock className="inline-block mr-1 h-3 w-3" />
                        {post.readTime}
                      </div>
                    </div>
                    <p className="text-maroon-700 text-sm line-clamp-3 mb-4">
                      {post.content.substring(0, 150)}...
                    </p>
                    <div className="flex flex-wrap gap-1 mb-2">
                      {post.tags.slice(0, 2).map((tag) => (
                        <Badge
                          key={tag}
                          variant="secondary"
                          className="bg-saffron-100 text-maroon-700 hover:bg-saffron-200 text-xs px-2 py-0"
                        >
                          {tag}
                        </Badge>
                      ))}
                      {post.tags.length > 2 && (
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
                    <div className="flex items-center gap-3 text-xs text-maroon-600">
                      <span className="flex items-center">
                        <Heart className="h-3 w-3 mr-1" />
                        {post.likes}
                      </span>
                      <span className="flex items-center">
                        <span className="i-lucide-message-circle h-3 w-3 mr-1"></span>
                        {post.comments}
                      </span>
                    </div>
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
        transition={{ duration: 0.5, delay: 0.8 }}
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
    </div>
  );
}
