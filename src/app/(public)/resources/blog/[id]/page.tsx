"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import Image from "next/image";
import { blogApi } from "@/utils/blogApi";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { CalendarDays, Clock, Share2, Bookmark, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { IBlogPost } from "@/types";

export default function BlogPost() {
  const params = useParams();
  const router = useRouter();
  const [post, setPost] = useState<IBlogPost | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState("article");
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [viewIncremented, setViewIncremented] = useState(false);

  useEffect(() => {
    const fetchBlogPost = async () => {
      setLoading(true);
      try {
        const fetchedPost = await blogApi.getBlogPost(params.id as string);
        setPost(fetchedPost);
      } catch (err) {
        console.error("Error fetching blog post:", err);
        setError("Failed to load blog post");
      } finally {
        setLoading(false);
      }
    };

    if (params.id) {
      fetchBlogPost();
    }
  }, [params.id]);

  // Increment view count once when the post is loaded
  useEffect(() => {
    const incrementViewCount = async () => {
      if (post && !viewIncremented && params.id) {
        try {
          await blogApi.incrementViews(params.id as string);
          // Update local state to reflect the incremented view count
          setPost((prev) =>
            prev
              ? ({
                  ...prev,
                  views: (prev.views || 0) + 1,
                } as IBlogPost)
              : null
          );
          setViewIncremented(true);
        } catch (error) {
          console.error("Failed to increment view count:", error);
          // Non-critical error, don't show to user
        }
      }
    };

    incrementViewCount();
  }, [post, viewIncremented, params.id]);

  const handleBookmark = () => {
    setIsBookmarked(!isBookmarked);
  };

  // Animation variants for content elements
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
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 },
    },
  };

  const formatDate = (dateString: string | Date) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8 flex flex-col items-center justify-center min-h-[50vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-crimson-600"></div>
        <p className="mt-4 text-maroon-600">Loading article...</p>
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="container mx-auto px-4 py-8 flex flex-col items-center justify-center min-h-[50vh]">
        <h1 className="text-2xl font-bold text-crimson-800 mb-4">
          Post not found
        </h1>
        <p className="text-maroon-600 mb-6">
          The blog post you're looking for doesn't exist or has been removed.
        </p>
        <Button
          onClick={() => router.push("/resources/blog")}
          variant="default"
          className="bg-crimson-600 hover:bg-crimson-700"
        >
          Return to Blog
        </Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 bg-saffron-50/30">
      <Breadcrumbs />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Card className="bg-white border-saffron-200 shadow-md mb-8">
              <CardHeader className="relative pb-0">
                <div className="absolute top-4 right-4 flex space-x-2 z-10">
                  <Button
                    size="sm"
                    variant="ghost"
                    className={`rounded-full p-2 ${
                      isBookmarked ? "text-crimson-600" : "text-maroon-400"
                    }`}
                    onClick={handleBookmark}
                  >
                    <Bookmark
                      className={`h-5 w-5 ${
                        isBookmarked ? "fill-crimson-600" : ""
                      }`}
                    />
                    <span className="sr-only">Bookmark</span>
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    className="rounded-full p-2 text-maroon-400"
                  >
                    <Share2 className="h-5 w-5" />
                    <span className="sr-only">Share</span>
                  </Button>
                </div>

                <div className="flex flex-wrap justify-between items-start mb-6">
                  <div className="w-full md:w-auto">
                    <CardTitle className="text-2xl md:text-3xl lg:text-4xl text-crimson-800 font-serif">
                      {post.title}
                    </CardTitle>
                    <p className="text-lg md:text-xl text-maroon-700 mt-2 font-light">
                      {post.description}
                    </p>
                  </div>
                </div>

                <div className="flex flex-wrap md:flex-nowrap gap-4 justify-between items-center border-t border-b border-saffron-100 py-4 mb-6">
                  <div className="flex items-center space-x-4">
                    <Avatar className="h-12 w-12 border-2 border-saffron-200">
                      <AvatarImage
                        src={
                          post.author?.image ||
                          "/placeholder.svg?height=40&width=40" ||
                          "/placeholder.svg"
                        }
                        alt={post.author?.name || "Author"}
                      />
                      <AvatarFallback className="bg-saffron-100 text-crimson-700">
                        {post.author?.name
                          ? post.author.name
                              .split(" ")
                              .map((n) => n[0])
                              .join("")
                          : "A"}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="text-sm font-medium text-maroon-800">
                        Written by{" "}
                        <span className="text-crimson-700">
                          {post.author?.name || "Anonymous"}
                        </span>
                      </p>
                      <div className="flex items-center flex-wrap text-xs text-maroon-600">
                        <CalendarDays className="mr-1 h-3 w-3" />
                        <span className="mr-3">{formatDate(post.date)}</span>
                        <Clock className="mr-1 h-3 w-3" />
                        <span className="mr-3">
                          {post.readTime || "5 min read"}
                        </span>
                        <Eye className="mr-1 h-3 w-3" />
                        <span>{post.views || 0} views</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {Array.isArray(post.tags) &&
                      post.tags.map((tag, tagIndex) => (
                        <Badge
                          key={tagIndex}
                          variant="secondary"
                          className="bg-saffron-100 text-crimson-700 hover:bg-saffron-200 transition-colors"
                        >
                          {tag}
                        </Badge>
                      ))}
                  </div>
                </div>
              </CardHeader>

              <CardContent>
                <Tabs
                  defaultValue="article"
                  onValueChange={setActiveTab}
                  className="w-full"
                >
                  <TabsList className="grid grid-cols-2 mb-6">
                    <TabsTrigger
                      value="article"
                      className="data-[state=active]:bg-saffron-100 data-[state=active]:text-crimson-700"
                    >
                      Article
                    </TabsTrigger>
                    <TabsTrigger
                      value="author"
                      className="data-[state=active]:bg-saffron-100 data-[state=active]:text-crimson-700"
                    >
                      About Author
                    </TabsTrigger>
                  </TabsList>

                  <TabsContent value="article" className="mt-0">
                    <div
                      className="prose prose-lg max-w-none prose-headings:text-crimson-800 prose-a:text-crimson-600 prose-a:no-underline hover:prose-a:underline"
                      dangerouslySetInnerHTML={{ __html: post.content }}
                    />
                  </TabsContent>

                  <TabsContent value="author">
                    <div className="flex flex-col md:flex-row gap-6 items-start">
                      <div className="w-full md:w-1/3">
                        <div className="relative w-32 h-32 mx-auto">
                          <Image
                            src={
                              post.author?.image ||
                              "/placeholder.svg?height=128&width=128" ||
                              "/placeholder.svg"
                            }
                            alt={post.author?.name || "Author"}
                            layout="fill"
                            className="rounded-full object-cover"
                          />
                        </div>
                      </div>
                      <div className="w-full md:w-2/3">
                        <h3 className="text-xl font-semibold text-crimson-800 mb-2">
                          {post.author?.name || "Anonymous"}
                        </h3>
                        <p className="text-maroon-700">
                          {post.author?.bio || "No bio available"}
                        </p>
                      </div>
                    </div>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Sidebar */}
        <div className="lg:col-span-4">
          <div className="sticky top-8 space-y-6">
            {/* Meta Information */}
            <Card className="bg-white border-saffron-200 shadow-md">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg text-crimson-800">
                  Article Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h4 className="font-medium text-maroon-800 mb-1">
                    Categories
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {Array.isArray(post.categories) &&
                      post.categories.map((category) => (
                        <Badge
                          key={category}
                          className="bg-crimson-600 text-white"
                        >
                          {category}
                        </Badge>
                      ))}
                  </div>
                </div>
                <div>
                  <h4 className="font-medium text-maroon-800 mb-1">Tags</h4>
                  <div className="flex flex-wrap gap-2">
                    {Array.isArray(post.tags) &&
                      post.tags.map((tag) => (
                        <Badge
                          key={tag}
                          variant="secondary"
                          className="bg-saffron-100 text-maroon-700"
                        >
                          {tag}
                        </Badge>
                      ))}
                  </div>
                </div>
                <div>
                  <h4 className="font-medium text-maroon-800 mb-1">Views</h4>
                  <p className="text-maroon-600 flex items-center">
                    <Eye className="h-4 w-4 mr-2 text-maroon-400" />
                    {post.views || 0}
                  </p>
                </div>
                {post.metaTitle ||
                post.metaDescription ||
                (Array.isArray(post.metaKeywords) &&
                  post.metaKeywords.length > 0) ? (
                  <div>
                    <h4 className="font-medium text-maroon-800 mb-1">
                      SEO Information
                    </h4>
                    {post.metaTitle && (
                      <p className="text-sm text-maroon-600">
                        <span className="font-medium">Meta Title:</span>{" "}
                        {post.metaTitle}
                      </p>
                    )}
                    {post.metaDescription && (
                      <p className="text-sm text-maroon-600 mt-1">
                        <span className="font-medium">Meta Description:</span>{" "}
                        {post.metaDescription}
                      </p>
                    )}
                    {Array.isArray(post.metaKeywords) &&
                      post.metaKeywords.length > 0 && (
                        <div className="mt-1">
                          <span className="text-sm font-medium text-maroon-600">
                            Meta Keywords:
                          </span>
                          <div className="flex flex-wrap gap-1 mt-1">
                            {post.metaKeywords.map((keyword) => (
                              <Badge
                                key={keyword}
                                variant="outline"
                                className="text-xs bg-saffron-50 text-maroon-600"
                              >
                                {keyword}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      )}
                  </div>
                ) : null}
              </CardContent>
            </Card>

            {/* Author info (visible on desktop only) */}
            <Card className="bg-white border-saffron-200 shadow-md hidden lg:block">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg text-crimson-800">
                  About the Author
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center space-x-4">
                  <Avatar className="h-10 w-10 border border-saffron-200">
                    <AvatarImage
                      src={
                        post.author?.image ||
                        "/placeholder.svg?height=40&width=40" ||
                        "/placeholder.svg"
                      }
                      alt={post.author?.name || "Author"}
                    />
                    <AvatarFallback className="bg-saffron-100 text-crimson-700">
                      {post.author?.name
                        ? post.author.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")
                        : "A"}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium text-maroon-800">
                      {post.author?.name || "Anonymous"}
                    </p>
                    <p className="text-sm text-maroon-600 mt-1 line-clamp-3">
                      {post.author?.bio || "No bio available"}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
