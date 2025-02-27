"use client";

import { motion } from "framer-motion";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Calendar, Clock, Heart, MessageCircle } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import type { BlogPost } from "@/types/blog";

interface BlogPostCardProps {
  post: BlogPost;
  isHovered: boolean;
  onHoverStart: () => void;
  onHoverEnd: () => void;
}

export function BlogPostCard({
  post,
  isHovered,
  onHoverStart,
  onHoverEnd,
}: BlogPostCardProps) {
  const cardHoverVariants = {
    initial: { y: 0, boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)" },
    hover: {
      y: -8,
      boxShadow:
        "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
    },
  };

  return (
    <motion.div
      whileHover="hover"
      initial="initial"
      animate={isHovered ? "hover" : "initial"}
      onHoverStart={onHoverStart}
      onHoverEnd={onHoverEnd}
      className="h-full"
    >
      <Card
        className="h-full flex flex-col overflow-hidden transition-all duration-300 border border-saffron-200"
        style={cardHoverVariants[isHovered ? "hover" : "initial"]}
      >
        <div className="aspect-video relative overflow-hidden">
          <div
            className="w-full h-full transition-transform duration-500"
            style={{
              transform: isHovered ? "scale(1.05)" : "scale(1)",
            }}
          >
            <Image
              src={post.image || "/placeholder.svg"}
              alt={post.title}
              layout="fill"
              objectFit="cover"
              className="rounded-t-lg"
              unoptimized
            />
          </div>
          <div className="absolute top-4 left-4">
            <Badge className="bg-crimson-600 text-white hover:bg-crimson-700">
              {post.category}
            </Badge>
          </div>
        </div>
        <CardHeader className="pb-2">
          <div className="flex items-center gap-2 text-xs text-maroon-600 mb-2">
            <Calendar className="h-3 w-3" />
            {post.date &&
              new Date(post.date).toLocaleDateString("en-US", {
                month: "long",
                day: "numeric",
                year: "numeric",
              })}
            <span className="ml-auto flex items-center">
              <Clock className="h-3 w-3 mr-1" />
              {post.readTime}
            </span>
          </div>
          <CardTitle className="text-xl text-crimson-700 hover:text-crimson-800 transition-colors line-clamp-2">
            <Link href={`/resources/blog/${post.id}`}>{post.title}</Link>
          </CardTitle>
        </CardHeader>
        <CardContent className="pb-2 flex-grow">
          <p className="text-maroon-700 mb-4 line-clamp-3">{post.excerpt}</p>
          <div className="flex flex-wrap gap-1 mb-4">
            {post.tags.slice(0, 2).map((tag) => (
              <Badge
                key={tag}
                variant="secondary"
                className="bg-saffron-100 text-maroon-700 hover:bg-saffron-200 text-xs"
              >
                {tag}
              </Badge>
            ))}
            {post.tags.length > 2 && (
              <Badge
                variant="secondary"
                className="bg-saffron-100 text-maroon-700 hover:bg-saffron-200 text-xs"
              >
                +{post.tags.length - 2}
              </Badge>
            )}
          </div>
        </CardContent>
        <CardFooter className="pt-2 mt-auto">
          <div className="flex items-center w-full">
            <Avatar className="h-8 w-8">
              <AvatarImage src={post.author.image} alt={post.author.name} />
              <AvatarFallback className="text-xs">
                {post.author.name
                  .split(" ")
                  .map((n) => n[0])
                  .join("")}
              </AvatarFallback>
            </Avatar>
            <div className="ml-2 flex-grow">
              <p className="text-xs font-medium text-maroon-800 line-clamp-1">
                {post.author.name}
              </p>
            </div>
            <div className="flex items-center gap-3 text-xs text-maroon-600">
              <span className="flex items-center">
                <Heart className="h-3 w-3 mr-1" />
                {post.likes}
              </span>
              <span className="flex items-center">
                <MessageCircle className="h-3 w-3 mr-1" />
                {post.comments}
              </span>
            </div>
          </div>
        </CardFooter>
        <div
          className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-crimson-500 to-saffron-400"
          style={{
            transform: isHovered ? "scaleX(1)" : "scaleX(0)",
            transformOrigin: "left",
            transition: "transform 0.3s ease-out",
          }}
        ></div>
      </Card>
    </motion.div>
  );
}
