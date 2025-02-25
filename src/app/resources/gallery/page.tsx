"use client";

import { motion } from "framer-motion";
import { Breadcrumbs } from "@/components/breadcrumbs";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import Image from "next/image";

const galleryItems = {
  photos: [
    {
      title: "Meditation Hall",
      description: "Our serene meditation hall during a group session",
      image: "/placeholder.svg?height=400&width=600",
    },
    {
      title: "Zen Garden",
      description: "The beautiful Zen garden at our retreat center",
      image: "/placeholder.svg?height=400&width=600",
    },
    {
      title: "Buddha Statue",
      description: "The centerpiece of our main hall",
      image: "/placeholder.svg?height=400&width=600",
    },
    {
      title: "Group Retreat",
      description: "Participants during our annual summer retreat",
      image: "/placeholder.svg?height=400&width=600",
    },
  ],
  videos: [
    {
      title: "Guided Meditation",
      description: "A 10-minute guided meditation session",
      thumbnail: "/placeholder.svg?height=400&width=600",
      videoUrl: "#",
    },
    {
      title: "Dharma Talk",
      description: "Weekly Dharma talk on compassion",
      thumbnail: "/placeholder.svg?height=400&width=600",
      videoUrl: "#",
    },
  ],
};

export default function Gallery() {
  return (
    <div className="container mx-auto px-4 py-8">
      <Breadcrumbs />
      <motion.h1
        className="text-4xl font-bold mb-6 text-crimson-800"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        Gallery
      </motion.h1>
      <motion.p
        className="text-xl mb-8 text-maroon-700"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        Explore photos and videos from our events and retreats.
      </motion.p>
      <Tabs defaultValue="photos" className="w-full">
        <TabsList className="bg-saffron-100 mb-6">
          <TabsTrigger
            value="photos"
            className="data-[state=active]:bg-saffron-300 data-[state=active]:text-crimson-800"
          >
            Photos
          </TabsTrigger>
          <TabsTrigger
            value="videos"
            className="data-[state=active]:bg-saffron-300 data-[state=active]:text-crimson-800"
          >
            Videos
          </TabsTrigger>
        </TabsList>
        <TabsContent value="photos">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {galleryItems.photos.map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Card className="bg-saffron-50 border-saffron-200">
                  <CardHeader>
                    <CardTitle className="text-lg text-crimson-700">
                      {item.title}
                    </CardTitle>
                    <CardDescription className="text-maroon-600">
                      {item.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <AspectRatio ratio={3 / 2}>
                      <Image
                        src={item.image || "/placeholder.svg"}
                        alt={item.title}
                        fill
                        className="rounded-md object-cover"
                      />
                    </AspectRatio>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </TabsContent>
        <TabsContent value="videos">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {galleryItems.videos.map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Card className="bg-saffron-50 border-saffron-200">
                  <CardHeader>
                    <CardTitle className="text-lg text-crimson-700">
                      {item.title}
                    </CardTitle>
                    <CardDescription className="text-maroon-600">
                      {item.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <AspectRatio ratio={16 / 9}>
                      <Image
                        src={item.thumbnail || "/placeholder.svg"}
                        alt={item.title}
                        fill
                        className="rounded-md object-cover"
                      />
                      {/* Add a play button overlay here */}
                    </AspectRatio>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
