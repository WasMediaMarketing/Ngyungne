"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import {
  Heart,
  Share2,
  Send,
  UserCircle,
  Facebook,
  Twitter,
  Mail,
  Link,
  X,
} from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { toast } from "@/components/ui/use-toast-hook";

interface Dedication {
  id: number;
  author: string;
  message: string;
  likes: number;
  timestamp: string;
  liked: boolean;
}

export function MeritDedication() {
  const [dedications, setDedications] = useState<Dedication[]>([
    {
      id: 1,
      author: "Tenzin",
      message:
        "May all beings be free from suffering and the causes of suffering.",
      likes: 12,
      timestamp: new Date().toISOString(),
      liked: false,
    },
    {
      id: 2,
      author: "Pema",
      message:
        "I dedicate this practice to the benefit of all sentient beings. May they find peace and liberation.",
      likes: 8,
      timestamp: new Date(Date.now() - 86400000).toISOString(),
      liked: false,
    },
    {
      id: 3,
      author: "Dorje",
      message:
        "Through this merit, may all beings develop loving-kindness and compassion.",
      likes: 15,
      timestamp: new Date(Date.now() - 172800000).toISOString(),
      liked: true,
    },
  ]);

  const [newDedication, setNewDedication] = useState("");
  const [author, setAuthor] = useState("");
  const [shareUrl, setShareUrl] = useState("");
  const [openShareDialog, setOpenShareDialog] = useState(false);
  const [currentDedicationId, setCurrentDedicationId] = useState<number | null>(
    null
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDedication.trim()) return;

    const newEntry = {
      id: Date.now(),
      author: author.trim() || "Anonymous",
      message: newDedication.trim(),
      likes: 0,
      timestamp: new Date().toISOString(),
      liked: false,
    };

    setDedications([newEntry, ...dedications]);
    setNewDedication("");
    setAuthor("");

    toast({
      title: "Dedication shared",
      description: "Your dedication has been posted to the wall.",
    });
  };

  const handleLike = (id: number) => {
    setDedications(
      dedications.map((dedication) => {
        if (dedication.id === id) {
          return {
            ...dedication,
            likes: dedication.liked
              ? dedication.likes - 1
              : dedication.likes + 1,
            liked: !dedication.liked,
          };
        }
        return dedication;
      })
    );
  };

  const openShare = (id: number) => {
    setCurrentDedicationId(id);
    setShareUrl(`https://example.com/dedications/${id}`);
    setOpenShareDialog(true);
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(shareUrl);
    toast({
      title: "Link copied",
      description: "Dedication link copied to clipboard.",
    });
  };

  const formatTimeAgo = (timestamp: string) => {
    const seconds = Math.floor(
      (new Date().getTime() - new Date(timestamp).getTime()) / 1000
    );

    let interval = seconds / 31536000;
    if (interval > 1) return Math.floor(interval) + " years ago";

    interval = seconds / 2592000;
    if (interval > 1) return Math.floor(interval) + " months ago";

    interval = seconds / 86400;
    if (interval > 1) return Math.floor(interval) + " days ago";

    interval = seconds / 3600;
    if (interval > 1) return Math.floor(interval) + " hours ago";

    interval = seconds / 60;
    if (interval > 1) return Math.floor(interval) + " minutes ago";

    return "just now";
  };

  return (
    <div className="space-y-6 max-w-2xl mx-auto">
      <div className="text-center">
        <h3 className="text-2xl font-bold text-primary mb-2">
          Merit Dedication Wall
        </h3>
        <p className="text-primary/60">
          Share your practice merit and dedications with the community
        </p>
      </div>

      <Dialog>
        <DialogTrigger asChild>
          <Button className="w-full">
            <Send className="h-4 w-4 mr-2" />
            Share Your Dedication
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Share a Dedication</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="author">Your Name (optional)</Label>
              <Input
                id="author"
                placeholder="Enter your name"
                value={author}
                onChange={(e) => setAuthor(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="dedication">Your Dedication</Label>
              <Textarea
                id="dedication"
                placeholder="Write your dedication..."
                value={newDedication}
                onChange={(e) => setNewDedication(e.target.value)}
                className="min-h-[120px]"
                required
              />
            </div>
            <DialogFooter className="sm:justify-between mt-4">
              <DialogClose asChild>
                <Button variant="outline" type="button">
                  Cancel
                </Button>
              </DialogClose>
              <DialogClose asChild>
                <Button type="submit">Share Dedication</Button>
              </DialogClose>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <div className="space-y-4">
        <AnimatePresence>
          {dedications.map((dedication) => (
            <motion.div
              key={dedication.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="bg-white p-4 rounded-lg shadow"
            >
              <div className="flex items-center gap-2 mb-2">
                <UserCircle className="h-6 w-6 text-primary/60" />
                <span className="font-medium">{dedication.author}</span>
                <span className="text-xs text-primary/40">
                  • {formatTimeAgo(dedication.timestamp)}
                </span>
              </div>
              <p className="text-primary mb-4">{dedication.message}</p>
              <div className="flex items-center justify-between text-sm text-primary/60">
                <button
                  className={`flex items-center gap-1 ${
                    dedication.liked ? "text-red-500" : ""
                  }`}
                  onClick={() => handleLike(dedication.id)}
                >
                  <Heart
                    className={`h-4 w-4 ${
                      dedication.liked ? "fill-red-500" : ""
                    }`}
                  />
                  {dedication.likes}
                </button>
                <button
                  className="flex items-center gap-1"
                  onClick={() => openShare(dedication.id)}
                >
                  <Share2 className="h-4 w-4" />
                  Share
                </button>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      <Dialog open={openShareDialog} onOpenChange={setOpenShareDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Share this Dedication</DialogTitle>
          </DialogHeader>
          <div className="grid grid-cols-4 gap-4 py-4">
            <Button
              variant="outline"
              className="flex flex-col items-center p-3 h-auto"
            >
              <Facebook className="h-6 w-6 mb-1" />
              <span className="text-xs">Facebook</span>
            </Button>
            <Button
              variant="outline"
              className="flex flex-col items-center p-3 h-auto"
            >
              <Twitter className="h-6 w-6 mb-1" />
              <span className="text-xs">Twitter</span>
            </Button>
            <Button
              variant="outline"
              className="flex flex-col items-center p-3 h-auto"
            >
              <Mail className="h-6 w-6 mb-1" />
              <span className="text-xs">Email</span>
            </Button>
            <Button
              variant="outline"
              className="flex flex-col items-center p-3 h-auto"
              onClick={copyToClipboard}
            >
              <Link className="h-6 w-6 mb-1" />
              <span className="text-xs">Copy Link</span>
            </Button>
          </div>
          <div className="flex items-center space-x-2">
            <Input value={shareUrl} readOnly className="flex-1" />
            <Button size="sm" onClick={copyToClipboard}>
              Copy
            </Button>
          </div>
          <DialogFooter className="sm:justify-end">
            <DialogClose asChild>
              <Button variant="outline">
                <X className="h-4 w-4 mr-2" />
                Close
              </Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
