"use client";

import { motion } from "framer-motion";
import { useParams } from "next/navigation";
import Image from "next/image";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
      },
      {
        type: "text",
        content:
          "To incorporate mindfulness into your daily life, start with simple practices such as mindful breathing, body scans, and mindful eating. Consistency is key in developing a mindfulness practice that can lead to lasting positive changes in your life.",
      },
    ],
  },
  // Add more blog posts here...
];

export default function BlogPost() {
  const params = useParams();
  const post = blogPosts.find((p) => p.id === Number(params.id));

  if (!post) {
    return <div>Post not found</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Breadcrumbs />
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Card className="bg-saffron-50 border-saffron-200">
          <CardHeader>
            <div className="flex justify-between items-start mb-4">
              <div>
                <CardTitle className="text-3xl text-crimson-800">
                  {post.title}
                </CardTitle>
                <p className="text-xl text-maroon-700 mt-2">
                  {post.description}
                </p>
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
            <div className="prose prose-lg text-maroon-800 max-w-none">
              {post.content.map((item, index) => {
                switch (item.type) {
                  case "text":
                    return (
                      <p key={index} className="mb-4">
                        {item.content}
                      </p>
                    );
                  case "image":
                    return (
                      <div key={index} className="my-8">
                        <Image
                          src={item.src || "/placeholder.svg"}
                          alt={item.alt || "Image"}
                          width={800}
                          height={400}
                          className="rounded-lg"
                        />
                      </div>
                    );
                  case "video":
                    return (
                      <div key={index} className="my-8">
                        <video
                          controls
                          poster={item.poster}
                          className="w-full rounded-lg"
                        >
                          <source src={item.src} type="video/mp4" />
                          Your browser does not support the video tag.
                        </video>
                      </div>
                    );
                  default:
                    return null;
                }
              })}
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
