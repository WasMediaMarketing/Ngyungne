"use client";

import { useState, useEffect } from "react";
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
import { galleryApi, GalleryItem } from "@/utils/galleryApi";
import { GalleryItemType } from "@/types/gallery";
import { RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Gallery() {
  const [galleryItems, setGalleryItems] = useState<GalleryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchGalleryItems = async () => {
      try {
        setLoading(true);
        const data = await galleryApi.getGalleryItems();
        setGalleryItems(data);
        setError(null);
      } catch (err) {
        console.error("Error fetching gallery items:", err);
        setError("Failed to load gallery items. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchGalleryItems();
  }, []);

  // Filter items by type
  const photos = galleryItems.filter(
    (item) => item.type === GalleryItemType.PHOTO
  );
  const videos = galleryItems.filter(
    (item) => item.type === GalleryItemType.VIDEO
  );

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8 flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <RefreshCw className="h-12 w-12 text-crimson-700 animate-spin mx-auto mb-4" />
          <p className="text-xl text-maroon-700">Loading gallery items...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Breadcrumbs />
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center max-w-md p-8 bg-white/80 rounded-xl shadow-md">
            <h2 className="text-2xl font-bold text-crimson-800 mb-4">
              Something went wrong
            </h2>
            <p className="text-maroon-700 mb-6">{error}</p>
            <Button
              onClick={() => window.location.reload()}
              className="bg-crimson-700 hover:bg-crimson-800"
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh Page
            </Button>
          </div>
        </div>
      </div>
    );
  }

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
            Photos ({photos.length})
          </TabsTrigger>
          <TabsTrigger
            value="videos"
            className="data-[state=active]:bg-saffron-300 data-[state=active]:text-crimson-800"
          >
            Videos ({videos.length})
          </TabsTrigger>
        </TabsList>
        <TabsContent value="photos">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {photos.length > 0 ? (
              photos.map((item, index) => (
                <motion.div
                  key={item._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <Link href={`/resources/gallery/${item._id}`}>
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
              ))
            ) : (
              <div className="col-span-3 text-center py-12">
                <p className="text-maroon-600">
                  No photos available at the moment.
                </p>
              </div>
            )}
          </div>
        </TabsContent>
        <TabsContent value="videos">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {videos.length > 0 ? (
              videos.map((item, index) => (
                <motion.div
                  key={item._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <Link href={`/resources/gallery/${item._id}`}>
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
                              src={item.image || "/placeholder.svg"}
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
              ))
            ) : (
              <div className="col-span-2 text-center py-12">
                <p className="text-maroon-600">
                  No videos available at the moment.
                </p>
              </div>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
