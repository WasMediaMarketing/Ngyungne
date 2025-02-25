"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Breadcrumbs } from "@/components/breadcrumbs";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { CalendarDays, Clock } from "lucide-react";

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
    },
    tags: ["Mindfulness", "Daily Practice"],
    content:
      "Mindfulness is the practice of being fully present and engaged in the moment, aware of your thoughts and feelings without distraction or judgment. In our fast-paced world, it's easy to get caught up in the hustle and bustle of daily life, often leading to stress and anxiety...",
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
    },
    tags: ["Buddhist Philosophy", "Four Noble Truths"],
    content:
      "The Four Noble Truths are the central teachings of Buddhism, first expounded by the Buddha in his very first sermon after attaining enlightenment. These truths form the foundation of Buddhist thought and practice, offering a profound understanding of the nature of suffering and the path to liberation...",
  },
];

export default function Blog() {
  return (
    <div className="container mx-auto px-4 py-8">
      <Breadcrumbs />
      <motion.h1
        className="text-4xl font-bold mb-6 text-crimson-800"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        Blog
      </motion.h1>
      <motion.p
        className="text-xl mb-8 text-maroon-700"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        Explore our latest articles on Buddhist teachings and practices.
      </motion.p>
      {blogPosts.map((post, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: index * 0.1 + 0.3 }}
        >
          <Card className="mb-8 bg-saffron-50 border-saffron-200">
            <CardHeader>
              <div className="flex justify-between items-start mb-4">
                <div>
                  <CardTitle className="text-2xl text-crimson-700">
                    {post.title}
                  </CardTitle>
                  <CardDescription className="text-maroon-600 mt-1">
                    {post.description}
                  </CardDescription>
                </div>
                <div className="flex space-x-2">
                  {post.tags.map((tag, tagIndex) => (
                    <Badge
                      key={tagIndex}
                      variant="secondary"
                      className="bg-saffron-200 text-crimson-700"
                    >
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <Avatar>
                  <AvatarImage src={post.author.image} alt={post.author.name} />
                  <AvatarFallback>
                    {post.author.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="text-sm font-medium text-maroon-800">
                    {post.author.name}
                  </p>
                  <div className="flex items-center text-sm text-maroon-600">
                    <CalendarDays className="mr-1 h-3 w-3" />
                    {post.date}
                    <Clock className="ml-2 mr-1 h-3 w-3" />
                    {post.readTime}
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-maroon-700 mb-4">
                {post.content.substring(0, 200)}...
              </p>
              <Link href={`/resources/blog/${post.id}`}>
                <Button className="bg-crimson-600 hover:bg-crimson-700 text-white">
                  Read More
                </Button>
              </Link>
            </CardContent>
          </Card>
        </motion.div>
      ))}
    </div>
  );
}
