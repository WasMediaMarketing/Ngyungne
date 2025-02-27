"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Search, Book, Video, Headphones } from "lucide-react";

interface Teaching {
  title: string;
  type: "video" | "audio" | "text";
  teacher: string;
  duration: string;
  level: string;
  category: string;
}

const teachings: Teaching[] = [
  {
    title: "Introduction to Buddhist Philosophy",
    type: "video",
    teacher: "Ven. Khen Ripoche",
    duration: "1:30:00",
    level: "Beginner",
    category: "Philosophy",
  },
  {
    title: "Meditation Techniques",
    type: "audio",
    teacher: "H.E. Choknyi Rinpoche",
    duration: "45:00",
    level: "Intermediate",
    category: "Meditation",
  },
  {
    title: "Understanding Karma",
    type: "text",
    teacher: "Ven. Dolpo Tulku Rinpoche",
    duration: "20 min read",
    level: "All Levels",
    category: "Philosophy",
  },
];

export function DharmaLibrary() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");

  const categories = ["All", "Philosophy", "Meditation", "Rituals", "Practice"];

  const filteredTeachings = teachings.filter((teaching) => {
    const matchesSearch =
      teaching.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      teaching.teacher.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory =
      selectedCategory === "All" || teaching.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const getIcon = (type: string) => {
    switch (type) {
      case "video":
        return <Video className="h-5 w-5" />;
      case "audio":
        return <Headphones className="h-5 w-5" />;
      default:
        return <Book className="h-5 w-5" />;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex gap-4 flex-wrap">
        <div className="flex-1">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-primary/40" />
            <Input
              placeholder="Search teachings..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>
        <div className="flex gap-2 overflow-x-auto pb-2">
          {categories.map((category) => (
            <Button
              key={category}
              variant={selectedCategory === category ? "default" : "outline"}
              onClick={() => setSelectedCategory(category)}
              className="whitespace-nowrap"
            >
              {category}
            </Button>
          ))}
        </div>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredTeachings.map((teaching, index) => (
          <Card
            key={index}
            className="hover:shadow-lg transition-shadow duration-300"
          >
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">{teaching.title}</CardTitle>
                {getIcon(teaching.type)}
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <p className="text-primary/60">Teacher: {teaching.teacher}</p>
                <p className="text-primary/60">Duration: {teaching.duration}</p>
                <p className="text-primary/60">Level: {teaching.level}</p>
                <Button className="w-full mt-4">
                  {teaching.type === "video"
                    ? "Watch Now"
                    : teaching.type === "audio"
                    ? "Listen Now"
                    : "Read Now"}
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
