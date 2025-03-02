"use client";

import { motion } from "framer-motion";
import { useParams, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { Breadcrumbs } from "@/components/breadcrumbs";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  CalendarDays,
  Clock,
  Share2,
  Bookmark,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BlogContent } from "@/components/blog/blog-content";
import { BlogAuthorInfo } from "@/components/blog/blog-author-info";
import { BlogTableOfContents } from "@/components/blog/blog-table-of-contents";
import { BlogSocialShare } from "@/components/blog/blog-social-share";

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
      bio: "Meditation teacher and mindfulness advocate with over 10 years of experience in guiding others toward inner peace.",
    },
    tags: ["Mindfulness", "Daily Practice", "Meditation", "Well-being"],
    content: [
      {
        type: "text",
        content:
          "Mindfulness is the practice of being fully present and engaged in the moment, aware of your thoughts and feelings without distraction or judgment. In our fast-paced world, it's easy to get caught up in the hustle and bustle of daily life, often leading to stress and anxiety. However, by incorporating mindfulness into our daily routines, we can cultivate a sense of inner peace and clarity that can profoundly impact our overall well-being.",
      },
      {
        type: "image",
        src: "/placeholder.svg?height=400&width=800",
        alt: "Person meditating in nature",
        caption:
          "Finding peace through mindful presence in natural settings can amplify the benefits of the practice.",
      },
      {
        type: "heading",
        level: 2,
        content: "The Science Behind Mindfulness",
      },
      {
        type: "text",
        content:
          "Recent scientific studies have shown that regular mindfulness practice can actually change the structure of the brain. MRI scans reveal increased gray matter density in regions associated with learning, memory, and emotional regulation. Additionally, researchers have observed decreased activity in the amygdala, the brain's fear center, suggesting that mindfulness can help modulate our stress response.",
      },
      {
        type: "quote",
        content:
          "The present moment is the only time over which we have dominion.",
        author: "Thích Nhất Hạnh",
      },
      {
        type: "text",
        content:
          "One of the key benefits of mindfulness is its ability to reduce stress and anxiety. By focusing on the present moment, we can let go of worries about the future or regrets about the past. This shift in perspective allows us to approach challenges with a calmer, more balanced mindset.",
      },
      {
        type: "video",
        src: "https://www.example.com/mindfulness-video.mp4",
        poster: "/placeholder.svg?height=400&width=800",
        caption:
          "A guided 5-minute mindfulness practice you can incorporate into your daily routine.",
      },
      {
        type: "heading",
        level: 2,
        content: "Practical Mindfulness Techniques",
      },
      {
        type: "text",
        content:
          "To incorporate mindfulness into your daily life, start with these simple yet powerful practices:",
      },
      {
        type: "list",
        items: [
          "Mindful breathing: Take a few minutes each day to focus solely on your breath. Notice the sensation of air moving in and out of your body.",
          "Body scan meditation: Starting from your toes and moving upward, pay attention to each part of your body without judgment.",
          "Mindful eating: Fully engage with your food by noticing its texture, taste, and smell. Eat slowly and without distractions.",
          "Walking meditation: As you walk, pay attention to the sensation of your feet touching the ground and the rhythm of your movements.",
        ],
      },
      {
        type: "text",
        content:
          "Consistency is key in developing a mindfulness practice that can lead to lasting positive changes in your life. Even just a few minutes each day can make a significant difference in how you experience the world around you.",
      },
    ],
    related: [2, 3, 5],
    views: 1875,
  },
  // Other blog posts would be defined here
  {
    id: 2,
    title: "Mindful Eating: Transforming Your Relationship with Food",
    description:
      "Learn how eating mindfully can improve digestion and foster a healthier approach to nutrition.",
    // ... other post data ...
  },
  {
    id: 3,
    title: "The Science of Meditation: What Research Tells Us",
    description:
      "Explore the growing body of scientific evidence supporting meditation's benefits for mental health.",
    // ... other post data ...
  },
  {
    id: 5,
    title: "5-Minute Mindfulness Practices for Busy Professionals",
    description:
      "Discover quick mindfulness techniques that fit seamlessly into your hectic schedule.",
    // ... other post data ...
  },
];

export default function BlogPost() {
  const params = useParams();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("article");
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [windowWidth, setWindowWidth] = useState(
    typeof window !== "undefined" ? window.innerWidth : 1200
  );

  // Find current post
  const post = blogPosts.find((p) => p.id === Number(params.id));

  // Get related posts
  const relatedPosts =
    post?.related
      ?.map((id) => blogPosts.find((p) => p.id === id))
      .filter(Boolean) || [];

  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  if (!post) {
    return (
      <div className="container mx-auto px-4 py-8 flex flex-col items-center justify-center min-h-[50vh]">
        <h1 className="text-2xl font-bold text-crimson-800 mb-4">
          Post not found
        </h1>
        <p className="text-maroon-600 mb-6">
          The blog post you're looking for doesn't exist or has been removed.
        </p>
        <Button
          onClick={() => router.push("/blog")}
          variant="default"
          className="bg-crimson-600 hover:bg-crimson-700"
        >
          Return to Blog
        </Button>
      </div>
    );
  }

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
                        src={post?.author?.image}
                        alt={post?.author?.name}
                      />
                      <AvatarFallback className="bg-saffron-100 text-crimson-700">
                        {post?.author?.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="text-sm font-medium text-maroon-800">
                        Written by{" "}
                        <span className="text-crimson-700">
                          {post?.author?.name}
                        </span>
                      </p>
                      <div className="flex items-center flex-wrap text-xs text-maroon-600">
                        <CalendarDays className="mr-1 h-3 w-3" />
                        <span className="mr-3">{post.date}</span>
                        <Clock className="mr-1 h-3 w-3" />
                        <span className="mr-3">{post.readTime}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {post?.tags?.map((tag, tagIndex) => (
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
                    <BlogContent
                      content={post.content}
                      containerVariants={containerVariants}
                      itemVariants={itemVariants}
                    />

                    <div className="mt-8 pt-6 border-t border-saffron-100">
                      <div className="flex justify-between items-center">
                        <div className="flex items-center space-x-6">
                          {/* Bookmark button could go here if needed */}
                        </div>

                        <BlogSocialShare />
                      </div>
                    </div>
                  </TabsContent>

                  <TabsContent value="author">
                    <BlogAuthorInfo author={post.author} />
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Sidebar */}
        <div className="lg:col-span-4">
          <div className="sticky top-8 space-y-6">
            {/* Table of Contents */}
            <BlogTableOfContents content={post.content} />

            {/* Author info (visible on desktop only) */}
            <Card className="bg-white border-saffron-200 shadow-md hidden lg:block">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg text-crimson-800">
                  About the Author
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center space-x-4">
                  <span className="text-2xl">~</span>
                  <div>
                    <p className="font-medium text-maroon-800">
                      {post?.author?.name}
                    </p>
                    <p className="text-sm text-maroon-600 mt-1">
                      {post?.author?.bio}
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
