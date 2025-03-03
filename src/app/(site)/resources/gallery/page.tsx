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
import Link from "next/link";

export const galleryItems = {
  photos: [
    {
      id: "1",
      title: "Meditation Hall",
      description: "Our serene meditation hall during a group session",
      image: "/placeholder.svg?height=400&width=600",
      type: "photo",
      fullDescription:
        "Our meditation hall provides a peaceful sanctuary for practitioners of all levels. The spacious room features natural lighting, comfortable cushions, and a calming atmosphere conducive to mindfulness practice.",
      date: "June 15, 2024",
    },
    {
      id: "2",
      title: "Zen Garden",
      description: "The beautiful Zen garden at our retreat center",
      image: "/placeholder.svg?height=400&width=600",
      type: "photo",
      fullDescription:
        "Our meticulously maintained Zen garden offers a contemplative space for walking meditation and quiet reflection. The arrangement of rocks, sand, and plants embodies the principles of harmony and balance.",
      date: "July 2, 2024",
    },
    {
      id: "3",
      title: "Buddha Statue",
      description: "The centerpiece of our main hall",
      image: "/placeholder.svg?height=400&width=600",
      type: "photo",
      fullDescription:
        "This hand-carved Buddha statue was created by local artisans and serves as a focal point for meditation and inspiration. Its serene expression reminds us of the peace that comes from mindful awareness.",
      date: "May 20, 2024",
    },
    {
      id: "4",
      title: "Group Retreat",
      description: "Participants during our annual summer retreat",
      image: "/placeholder.svg?height=400&width=600",
      type: "photo",
      fullDescription:
        "Our annual summer retreat brings together practitioners from around the country for a week of intensive meditation, dharma talks, and community building. This photo captures the closing ceremony.",
      date: "August 12, 2024",
    },
  ],
  videos: [
    {
      id: "5",
      title: "Guided Meditation",
      description: "A 10-minute guided meditation session",
      thumbnail: "/placeholder.svg?height=400&width=600",
      videoUrl: "#",
      type: "video",
      fullDescription:
        "This guided meditation focuses on breath awareness and is perfect for beginners or as a quick mindfulness break. Our teacher leads you through a gentle practice to center your mind and relax your body.",
      duration: "10:23",
      date: "September 5, 2024",
    },
    {
      id: "6",
      title: "Dharma Talk",
      description: "Weekly Dharma talk on compassion",
      thumbnail: "/placeholder.svg?height=400&width=600",
      videoUrl: "#",
      type: "video",
      fullDescription:
        "In this weekly Dharma talk, our resident teacher explores the concept of compassion in Buddhist practice and daily life. Learn how cultivating compassion can transform your relationships and inner experience.",
      duration: "45:12",
      date: "October 1, 2024",
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
                <Link href={`/resources/gallery/${item.id}`}>
                  <Card className="bg-saffron-50 border-saffron-200 transition-all hover:shadow-lg hover:-translate-y-1 cursor-pointer">
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
                </Link>
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
                <Link href={`/resources/gallery/${item.id}`}>
                  <Card className="bg-saffron-50 border-saffron-200 transition-all hover:shadow-lg hover:-translate-y-1 cursor-pointer">
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
                        <div className="relative w-full h-full">
                          <Image
                            src={item.thumbnail || "/placeholder.svg"}
                            alt={item.title}
                            fill
                            className="rounded-md object-cover"
                          />
                          <div className="absolute inset-0 flex items-center justify-center">
                            <div className="rounded-full bg-crimson-700 bg-opacity-70 p-4 text-white">
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 24 24"
                                fill="currentColor"
                                className="w-6 h-6"
                              >
                                <path
                                  fillRule="evenodd"
                                  d="M4.5 5.653c0-1.426 1.529-2.33 2.779-1.643l11.54 6.348c1.295.712 1.295 2.573 0 3.285L7.28 19.991c-1.25.687-2.779-.217-2.779-1.643V5.653z"
                                />
                              </svg>
                            </div>
                          </div>
                        </div>
                      </AspectRatio>
                    </CardContent>
                  </Card>
                </Link>
              </motion.div>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
