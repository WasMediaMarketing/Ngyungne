"use client";

import { Card, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Calendar, Clock, Heart, MessageCircle, Eye } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import type { BlogPost } from "@/types/blog";

interface BlogFeaturedArticleProps {
  post: BlogPost;
}

export function BlogFeaturedArticle({ post }: BlogFeaturedArticleProps) {
  return (
    <Card className="overflow-hidden bg-gradient-to-br from-saffron-50 to-white border-saffron-200 shadow-lg">
      <div className="md:flex">
        <div className="md:w-1/2 relative h-64 md:h-auto">
          <div className="w-full h-full relative">
            <Image
              src={post.image || "/placeholder.svg"}
              alt={post.title}
              layout="fill"
              objectFit="cover"
              className="rounded-t-lg md:rounded-l-lg md:rounded-t-none"
              unoptimized
            />
          </div>
          <div className="absolute top-4 left-4">
            <Badge className="bg-crimson-600 text-white hover:bg-crimson-700">
              {post.category}
            </Badge>
          </div>
        </div>
        <div className="md:w-1/2 p-6">
          <CardTitle className="text-2xl font-bold text-crimson-800 mb-3">
            {post.title}
          </CardTitle>
          <CardDescription className="text-maroon-700 mb-4 text-lg">
            {post.excerpt}
          </CardDescription>
          <p className="text-maroon-700 mb-6">
            {typeof post.content === "string"
              ? post.content.substring(0, 200)
              : post.content[0].content?.substring(0, 200)}
            ...
          </p>
          <div className="flex items-center space-x-4 mb-6">
            <Avatar className="border-2 border-saffron-200">
              <AvatarImage src={post.author.image} alt={post.author.name} />
              <AvatarFallback className="bg-maroon-100 text-maroon-800">
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
              <p className="text-xs text-maroon-600">{post.author.bio}</p>
            </div>
            <div className="ml-auto flex flex-col text-right">
              <div className="flex items-center text-sm text-maroon-600 justify-end">
                <Calendar className="mr-1 h-3 w-3" />
                {post.date && new Date(post.date).toLocaleDateString("en-US")}
              </div>
              <div className="flex items-center text-sm text-maroon-600 justify-end">
                <Clock className="mr-1 h-3 w-3" />
                {post.readTime}
              </div>
            </div>
          </div>
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-4 text-sm text-maroon-600">
              <span className="flex items-center">
                <Heart className="h-4 w-4 mr-1" />
                {post.likes}
              </span>
              <span className="flex items-center">
                <MessageCircle className="h-4 w-4 mr-1" />
                {post.comments}
              </span>
              <span className="flex items-center">
                <Eye className="h-4 w-4 mr-1" />
                {post.views}
              </span>
            </div>
            <Link href={`/resources/blog/${post.slug}`}>
              <Button className="bg-crimson-600 hover:bg-crimson-700 text-white">
                Read Article
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </Card>
  );
}
