"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useParams, useRouter } from "next/navigation";
import { Breadcrumbs } from "@/components/breadcrumbs";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import {
  ChevronLeft,
  Share2,
  Calendar,
  Clock,
  Download,
  Bookmark,
  Play,
  ChevronUp,
  ChevronDown,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { galleryItems } from "../page";

// Define type for gallery item images
type GalleryItemImage = {
  url: string;
  alt: string;
};

// Define types for gallery items
type BaseGalleryItem = {
  id: string;
  title: string;
  description: string;
  fullDescription: string;
  date: string;
  type: "photo" | "video";
  images?: GalleryItemImage[];
};

type PhotoItem = BaseGalleryItem & {
  type: "photo";
  image: string;
};

type VideoItem = BaseGalleryItem & {
  type: "video";
  thumbnail: string;
  duration: string;
  videoUrl: string;
};

type GalleryItem = PhotoItem | VideoItem;

// Extended galleryItems with multiple images for each item
const extendedGalleryItems = {
  photos: galleryItems.photos.map((item) => ({
    ...item,
    images: [
      {
        url: item.image || "/placeholder.svg?height=800&width=1200",
        alt: item.title,
      },
      {
        url: `/placeholder.svg?height=800&width=1200&text=Image+2+for+${item.title}`,
        alt: `${item.title} - View 2`,
      },
      {
        url: `/placeholder.svg?height=800&width=1200&text=Image+3+for+${item.title}`,
        alt: `${item.title} - View 3`,
      },
      {
        url: `/placeholder.svg?height=800&width=1200&text=Image+4+for+${item.title}`,
        alt: `${item.title} - View 4`,
      },
    ],
  })),
  videos: galleryItems.videos.map((item) => ({
    ...item,
    images: [
      {
        url: item.thumbnail || "/placeholder.svg?height=800&width=1200",
        alt: item.title,
      },
      {
        url: `/placeholder.svg?height=800&width=1200&text=Screenshot+2+from+${item.title}`,
        alt: `${item.title} - Screenshot 2`,
      },
      {
        url: `/placeholder.svg?height=800&width=1200&text=Screenshot+3+from+${item.title}`,
        alt: `${item.title} - Screenshot 3`,
      },
    ],
  })),
};

export default function GalleryDetail() {
  const router = useRouter();
  const params = useParams();
  const [item, setItem] = useState<
    ((PhotoItem | VideoItem) & { images: GalleryItemImage[] }) | null
  >(null);
  const [loading, setLoading] = useState(true);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [showAllImages, setShowAllImages] = useState(false);

  useEffect(() => {
    if (params?.id) {
      const id = params.id.toString();
      // Find the item in both photos and videos arrays
      const photoItem = extendedGalleryItems.photos.find(
        (item) => item.id === id
      );
      const videoItem = extendedGalleryItems.videos.find(
        (item) => item.id === id
      );
      const foundItem = photoItem || videoItem;

      if (foundItem) {
        setItem(
          foundItem as (PhotoItem | VideoItem) & { images: GalleryItemImage[] }
        );
      }
      setLoading(false);
    }
  }, [params?.id]);

  const handleThumbnailClick = (index: number) => {
    setActiveImageIndex(index);
  };

  const toggleShowAllImages = () => {
    setShowAllImages(!showAllImages);
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center h-64">
          <div className="text-2xl text-crimson-800">Loading...</div>
        </div>
      </div>
    );
  }

  if (!item) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Breadcrumbs />
        <Card className="bg-saffron-50 border-saffron-200 my-8">
          <CardHeader>
            <CardTitle className="text-xl text-crimson-700">
              Item Not Found
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-maroon-600 mb-4">
              The requested gallery item could not be found.
            </p>
            <Button
              onClick={() => router.push("/resources/gallery")}
              className="bg-crimson-700 hover:bg-crimson-800"
            >
              <ChevronLeft className="mr-2 h-4 w-4" />
              Return to Gallery
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Breadcrumbs />
      <div className="mb-6">
        <Button
          onClick={() => router.push("/resources/gallery")}
          variant="outline"
          className="text-crimson-700 border-crimson-300 hover:bg-crimson-50"
        >
          <ChevronLeft className="mr-2 h-4 w-4" />
          Back to Gallery
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main content - 2/3 width on large screens */}
        <motion.div
          className="lg:col-span-2"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Card className="bg-saffron-50 border-saffron-200 overflow-hidden">
            {/* Main image display */}
            <div className="relative">
              <AspectRatio ratio={16 / 9}>
                <Image
                  src={item.images[activeImageIndex].url}
                  alt={item.images[activeImageIndex].alt}
                  fill
                  className="object-cover"
                />
                {item.type === "video" && (
                  <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-40">
                    <div className="rounded-full bg-crimson-700 p-6 text-white hover:bg-crimson-800 cursor-pointer transition-all">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                        className="w-8 h-8"
                      >
                        <path
                          fillRule="evenodd"
                          d="M4.5 5.653c0-1.426 1.529-2.33 2.779-1.643l11.54 6.348c1.295.712 1.295 2.573 0 3.285L7.28 19.991c-1.25.687-2.779-.217-2.779-1.643V5.653z"
                        />
                      </svg>
                    </div>
                  </div>
                )}
              </AspectRatio>
            </div>

            {/* Thumbnails for switching images */}
            <div className="p-4 bg-saffron-100">
              <div className="flex overflow-x-auto gap-2 pb-2">
                {item.images.map((image, idx) => (
                  <div
                    key={idx}
                    className={`flex-none w-20 h-20 relative rounded-md overflow-hidden cursor-pointer transition-all ${
                      activeImageIndex === idx
                        ? "ring-2 ring-crimson-700 ring-offset-2"
                        : "opacity-80 hover:opacity-100"
                    }`}
                    onClick={() => handleThumbnailClick(idx)}
                  >
                    <Image
                      src={image.url}
                      alt={image.alt}
                      fill
                      className="object-cover"
                    />
                  </div>
                ))}
              </div>
            </div>

            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-2xl text-crimson-700">
                    {item.title}
                  </CardTitle>
                  <CardDescription className="text-maroon-600 text-lg mt-2">
                    {item.description}
                  </CardDescription>
                </div>
                <Button
                  variant="outline"
                  size="icon"
                  className="rounded-full h-10 w-10 border-crimson-300 text-crimson-700 hover:bg-crimson-50"
                >
                  <Share2 className="h-5 w-5" />
                </Button>
              </div>
            </CardHeader>

            <CardContent>
              <div className="flex flex-wrap items-center gap-4 mb-4 text-maroon-600">
                <span className="flex items-center gap-1">
                  <Calendar className="h-4 w-4" />
                  {item.date}
                </span>
                {item.type === "video" && (
                  <span className="flex items-center gap-1">
                    <Clock className="h-4 w-4" />
                    {"duration" in item ? item.duration : ""}
                  </span>
                )}
                <span className="bg-saffron-200 text-crimson-800 px-3 py-1 rounded-full text-sm uppercase">
                  {item.type}
                </span>
                <span className="text-maroon-600">
                  {item.images.length}{" "}
                  {item.type === "photo" ? "Photos" : "Screenshots"}
                </span>
              </div>

              <div className="prose prose-crimson max-w-none">
                <p className="text-maroon-700 text-lg">
                  {item.fullDescription}
                </p>
              </div>
            </CardContent>

            <CardFooter className="flex justify-between border-t border-saffron-200 pt-6">
              <div className="flex gap-2">
                <Button className="bg-crimson-700 hover:bg-crimson-800">
                  {item.type === "photo" ? (
                    <>
                      <Download className="mr-2 h-4 w-4" /> Download
                    </>
                  ) : (
                    <>
                      <Play className="mr-2 h-4 w-4" /> Watch Video
                    </>
                  )}
                </Button>
                <Button
                  variant="outline"
                  className="border-crimson-300 text-crimson-700 hover:bg-crimson-50"
                >
                  <Bookmark className="mr-2 h-4 w-4" />
                  Save for Later
                </Button>
              </div>
            </CardFooter>
          </Card>
        </motion.div>

        {/* Sidebar content - 1/3 width on large screens */}
        <motion.div
          className="lg:col-span-1"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <Card className="bg-saffron-50 border-saffron-200 sticky top-4">
            <CardHeader>
              <CardTitle className="text-xl text-crimson-700">
                About This {item.type === "photo" ? "Collection" : "Video"}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h3 className="text-maroon-700 font-medium mb-1">Taken at</h3>
                  <p className="text-maroon-600">Lotus Meditation Center</p>
                </div>
                <div>
                  <h3 className="text-maroon-700 font-medium mb-1">Event</h3>
                  <p className="text-maroon-600">
                    {item.title.includes("Retreat")
                      ? "Summer Retreat 2024"
                      : "Weekly Practice Session"}
                  </p>
                </div>
                {item.type === "photo" ? (
                  <div>
                    <h3 className="text-maroon-700 font-medium mb-1">
                      Photographer
                    </h3>
                    <p className="text-maroon-600">David Chen</p>
                  </div>
                ) : (
                  <div>
                    <h3 className="text-maroon-700 font-medium mb-1">
                      Presenter
                    </h3>
                    <p className="text-maroon-600">Sensei Melissa Wong</p>
                  </div>
                )}
                <div>
                  <h3 className="text-maroon-700 font-medium mb-1">Tags</h3>
                  <div className="flex flex-wrap gap-2 mt-1">
                    <span className="bg-saffron-100 text-maroon-700 px-2 py-1 rounded-md text-sm">
                      {item.type === "photo" ? "Photography" : "Video"}
                    </span>
                    <span className="bg-saffron-100 text-maroon-700 px-2 py-1 rounded-md text-sm">
                      {item.title.split(" ")[0]}
                    </span>
                    <span className="bg-saffron-100 text-maroon-700 px-2 py-1 rounded-md text-sm">
                      Buddhism
                    </span>
                    <span className="bg-saffron-100 text-maroon-700 px-2 py-1 rounded-md text-sm">
                      Meditation
                    </span>
                  </div>
                </div>
              </div>
            </CardContent>
            <div className="px-6 pb-6">
              <Button
                className="w-full bg-saffron-300 hover:bg-saffron-400 text-crimson-800"
                onClick={toggleShowAllImages}
              >
                {showAllImages ? (
                  <>
                    Hide All {item.type === "photo" ? "Photos" : "Videos"}
                    <ChevronUp className="ml-2 h-4 w-4" />
                  </>
                ) : (
                  <>
                    View All {item.type === "photo" ? "Photos" : "Videos"}
                    <ChevronDown className="ml-2 h-4 w-4" />
                  </>
                )}
              </Button>
            </div>
          </Card>
        </motion.div>
      </div>

      {/* View All Images Grid */}
      {showAllImages && (
        <motion.div
          className="mt-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <Card className="bg-saffron-50 border-saffron-200 p-6">
            <CardHeader className="px-0 pt-0">
              <CardTitle className="text-2xl text-crimson-700">
                All {item.type === "photo" ? "Photos" : "Screenshots"} in this
                Collection
              </CardTitle>
            </CardHeader>
            <CardContent className="px-0 pb-0">
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {item.images.map((image, idx) => (
                  <div
                    key={idx}
                    className="cursor-pointer relative rounded-md overflow-hidden"
                    onClick={() => handleThumbnailClick(idx)}
                  >
                    <AspectRatio ratio={3 / 2}>
                      <Image
                        src={image.url}
                        alt={image.alt}
                        fill
                        className={`object-cover transition-all hover:scale-105 ${
                          activeImageIndex === idx
                            ? "ring-4 ring-crimson-500"
                            : ""
                        }`}
                      />
                    </AspectRatio>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}

      <div className="mt-12">
        <h2 className="text-2xl font-bold mb-6 text-crimson-800">
          More from the Gallery
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {(item.type === "photo" ? galleryItems.photos : galleryItems.videos)
            .filter((relatedItem) => relatedItem.id !== item.id)
            .slice(0, 3)
            .map((relatedItem, index) => (
              <Link key={index} href={`/resources/gallery/${relatedItem.id}`}>
                <Card className="bg-saffron-50 border-saffron-200 transition-all hover:shadow-md hover:-translate-y-1 cursor-pointer h-full">
                  <AspectRatio ratio={16 / 9}>
                    <Image
                      src={
                        "image" in relatedItem
                          ? relatedItem.image
                          : "thumbnail" in relatedItem
                          ? relatedItem.thumbnail
                          : "/placeholder.svg"
                      }
                      alt={relatedItem.title}
                      fill
                      className="rounded-t-md object-cover"
                    />
                  </AspectRatio>
                  <CardHeader className="py-3 px-4">
                    <CardTitle className="text-base text-crimson-700">
                      {relatedItem.title}
                    </CardTitle>
                  </CardHeader>
                </Card>
              </Link>
            ))}
        </div>
      </div>
    </div>
  );
}
