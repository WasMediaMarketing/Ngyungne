"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Search, Book, Video, Headphones, X } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from "@/components/ui/dialog";

interface Teaching {
  title: string;
  type: "video" | "audio" | "text";
  teacher: string;
  duration: string;
  level: string;
  category: string;
  content?: string;
  videoUrl?: string;
  audioUrl?: string;
}

const teachings: Teaching[] = [
  {
    title: "Introduction to Buddhist Philosophy",
    type: "video",
    teacher: "Ven. Khen Ripoche",
    duration: "1:30:00",
    level: "Beginner",
    category: "Philosophy",
    videoUrl: "https://example.com/video1",
  },
  {
    title: "Meditation Techniques",
    type: "audio",
    teacher: "H.E. Choknyi Rinpoche",
    duration: "45:00",
    level: "Intermediate",
    category: "Meditation",
    audioUrl:
      "https://www.learningcontainer.com/wp-content/uploads/2020/02/Kalimba.mp3",
  },
  {
    title: "Understanding Karma",
    type: "text",
    teacher: "Ven. Dolpo Tulku Rinpoche",
    duration: "20 min read",
    level: "All Levels",
    category: "Philosophy",
    content:
      "Karma is a fundamental concept in Buddhist philosophy. It refers to the law of cause and effect that governs our lives. Every action we take, whether physical, verbal, or mental, has consequences that shape our future experiences. Understanding karma helps us make skillful choices that lead to happiness and avoid actions that lead to suffering. The Buddha taught that karma is not fate or predestination, but rather a natural law that we can work with through our choices and actions.",
  },
];

export function DharmaLibrary() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedTeaching, setSelectedTeaching] = useState<Teaching | null>(
    null
  );
  const [isDialogOpen, setIsDialogOpen] = useState(false);

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

  const handleOpenContent = (teaching: Teaching) => {
    setSelectedTeaching(teaching);
    setIsDialogOpen(true);
  };

  const renderContent = () => {
    if (!selectedTeaching) return null;

    switch (selectedTeaching.type) {
      case "video":
        return (
          <div className="space-y-4">
            <div className="aspect-video bg-secondary/20 rounded-md flex items-center justify-center">
              <Video className="h-12 w-12 text-primary/60" />
              <p className="text-primary/60">Video Player Placeholder</p>
            </div>
            <div>
              <h3 className="font-bold mb-2">{selectedTeaching.title}</h3>
              <p className="text-sm text-primary/60">
                Teacher: {selectedTeaching.teacher}
              </p>
              <p className="text-sm text-primary/60">
                Duration: {selectedTeaching.duration}
              </p>
            </div>
          </div>
        );
      case "audio":
        return (
          <div className="space-y-4">
            <div className="h-24 bg-secondary/20 rounded-md flex items-center justify-center">
              <Headphones className="h-12 w-12 text-primary/60" />
              <p className="text-primary/60">Audio Player Placeholder</p>
            </div>
            <div>
              <h3 className="font-bold mb-2">{selectedTeaching.title}</h3>
              <p className="text-sm text-primary/60">
                Teacher: {selectedTeaching.teacher}
              </p>
              <p className="text-sm text-primary/60">
                Duration: {selectedTeaching.duration}
              </p>
            </div>
          </div>
        );
      case "text":
        return (
          <div className="space-y-4">
            <h3 className="font-bold">{selectedTeaching.title}</h3>
            <p className="text-sm text-primary/60">
              Teacher: {selectedTeaching.teacher}
            </p>
            <div className="prose max-w-none">
              <p>{selectedTeaching.content}</p>
            </div>
          </div>
        );
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
                <Button
                  className="w-full mt-4"
                  onClick={() => handleOpenContent(teaching)}
                >
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

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex justify-between items-center">
              <span>
                {selectedTeaching?.type === "video"
                  ? "Watch"
                  : selectedTeaching?.type === "audio"
                  ? "Listen"
                  : "Read"}
              </span>
              <DialogClose className="rounded-full h-6 w-6 flex items-center justify-center"></DialogClose>
            </DialogTitle>
          </DialogHeader>
          {renderContent()}
        </DialogContent>
      </Dialog>
    </div>
  );
}
