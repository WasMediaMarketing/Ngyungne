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
  Calendar,
  Clock,
  Download,
  ChevronUp,
  ChevronDown,
  RefreshCw,
  MapPin,
  User,
  Tag,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { galleryApi, type GalleryItem } from "@/utils/galleryApi";
import { GalleryItemType } from "@/types/gallery";
import { format } from "date-fns";
import { ImagePreviewDialog } from "@/components/gallery/ImagePreviewDialog";

export default function GalleryDetail() {
  const router = useRouter();
  const params = useParams();
  const [item, setItem] = useState<GalleryItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [showAllImages, setShowAllImages] = useState(false);
  const [relatedItems, setRelatedItems] = useState<GalleryItem[]>([]);
  const [isImagePreviewOpen, setIsImagePreviewOpen] = useState(false);

  useEffect(() => {
    const fetchGalleryItem = async () => {
      if (!params?.id) return;

      try {
        setLoading(true);
        // Ensure id is a string and not an array
        const id = Array.isArray(params.id)
          ? params.id[0]
          : params.id.toString();

        console.log("Fetching gallery item with ID:", id);

        const data = await galleryApi.getGalleryItemById(id);
        setItem(data);
        setError(null);

        // Fetch related items
        const allItems = await galleryApi.getGalleryItems();
        setRelatedItems(
          allItems
            .filter(
              (relatedItem) =>
                relatedItem._id !== id && relatedItem.type === data.type
            )
            .slice(0, 3)
        );
      } catch (err) {
        console.error("Error fetching gallery item:", err);
        setError("Failed to load gallery item. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchGalleryItem();
  }, [params?.id]);

  const handleThumbnailClick = (index: number) => {
    setActiveImageIndex(index);
  };

  const toggleShowAllImages = () => {
    setShowAllImages(!showAllImages);
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return "Not specified";
    try {
      return format(new Date(dateString), "MMMM d, yyyy");
    } catch (error) {
      return dateString;
    }
  };

  // Helper function to extract YouTube video ID
  const getYouTubeVideoId = (url: string) => {
    if (!url) return null;

    const regex =
      /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/i;
    const match = url.match(regex);
    return match ? match[1] : null;
  };

  // Prepare images array for the gallery
  const getAllImages = () => {
    if (!item) return [];

    const images = [item.image];
    if (item.additionalImages && item.additionalImages.length > 0) {
      images.push(...item.additionalImages);
    }
    return images.filter(Boolean);
  };

  const openImagePreview = () => {
    setIsImagePreviewOpen(true);
  };

  const handleWatchVideo = () => {
    if (item?.videoUrl) {
      window.open(item.videoUrl, "_blank");
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center h-64">
          <RefreshCw className="h-12 w-12 text-crimson-700 animate-spin" />
        </div>
      </div>
    );
  }

  if (error || !item) {
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
              {error || "The requested gallery item could not be found."}
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

  const images = getAllImages();
  const videoId =
    item.type === GalleryItemType.VIDEO
      ? getYouTubeVideoId(item.videoUrl || "")
      : null;

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
            {/* Main image/video display */}
            <div className="relative">
              <AspectRatio ratio={16 / 9}>
                {item.type === GalleryItemType.VIDEO && videoId ? (
                  <iframe
                    src={`https://www.youtube.com/embed/${videoId}`}
                    title={item.title}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    className="absolute inset-0 w-full h-full"
                  ></iframe>
                ) : (
                  <div className="cursor-pointer" onClick={openImagePreview}>
                    <Image
                      src={images[activeImageIndex] || "/placeholder.svg"}
                      alt={item.title}
                      fill
                      className="object-cover"
                    />
                    {item.type === GalleryItemType.VIDEO && !videoId && (
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
                  </div>
                )}
              </AspectRatio>
              {item.type !== GalleryItemType.VIDEO && (
                <div className="absolute top-2 left-2 bg-secondary text-secondary-foreground rounded-md px-2 py-1 text-sm">
                  {activeImageIndex + 1} / {images.length}
                </div>
              )}
            </div>

            {/* Thumbnails for switching images - only show for photos */}
            {item.type !== GalleryItemType.VIDEO && images.length > 1 && (
              <div className="p-4 bg-saffron-100">
                <div className="flex overflow-x-auto gap-2 pb-2">
                  {images.map((image, idx) => (
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
                        src={image || "/placeholder.svg"}
                        alt={`${item.title} - Image ${idx + 1}`}
                        fill
                        className="object-cover"
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}

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
              </div>
            </CardHeader>

            <CardContent>
              <div className="flex flex-wrap items-center gap-4 mb-4 text-maroon-600">
                <span className="flex items-center gap-1">
                  <Calendar className="h-4 w-4" />
                  {formatDate(item.date)}
                </span>
                {item.type === GalleryItemType.VIDEO && item.duration && (
                  <span className="flex items-center gap-1">
                    <Clock className="h-4 w-4" />
                    {item.duration}
                  </span>
                )}
                <span className="bg-saffron-200 text-crimson-800 px-3 py-1 rounded-full text-sm uppercase">
                  {item.type}
                </span>
                {item.location && (
                  <span className="flex items-center gap-1">
                    <MapPin className="h-4 w-4" />
                    {item.location}
                  </span>
                )}
                {item.type === GalleryItemType.PHOTO && item.photographer && (
                  <span className="flex items-center gap-1">
                    <User className="h-4 w-4" />
                    {item.photographer}
                  </span>
                )}
                {item.type === GalleryItemType.VIDEO && item.presenter && (
                  <span className="flex items-center gap-1">
                    <User className="h-4 w-4" />
                    {item.presenter}
                  </span>
                )}
              </div>

              {item.tags && item.tags.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-4">
                  <Tag className="h-4 w-4 text-maroon-600" />
                  {item.tags.map((tag, idx) => (
                    <span
                      key={idx}
                      className="bg-saffron-100 text-maroon-700 px-2 py-1 rounded-md text-sm"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              )}

              <div className="prose prose-crimson max-w-none">
                <p className="text-maroon-700 text-lg">
                  {item.fullDescription || item.description}
                </p>
              </div>
            </CardContent>

            <CardFooter className="flex justify-between border-t border-saffron-200 pt-6">
              <div className="flex gap-2">
                {item.type === GalleryItemType.PHOTO ? (
                  <Button className="bg-crimson-700 hover:bg-crimson-800">
                    <Download className="mr-2 h-4 w-4" /> Download
                  </Button>
                ) : (
                  <Button
                    className="bg-crimson-700 hover:bg-crimson-800"
                    onClick={handleWatchVideo}
                  >
                    <span className="mr-2 h-4 w-4">▶</span> Watch Video
                  </Button>
                )}
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
                About This{" "}
                {item.type === GalleryItemType.PHOTO ? "Collection" : "Video"}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {item.location && (
                  <div>
                    <h3 className="text-maroon-700 font-medium mb-1">
                      Taken at
                    </h3>
                    <p className="text-maroon-600">{item.location}</p>
                  </div>
                )}
                {item.event && (
                  <div>
                    <h3 className="text-maroon-700 font-medium mb-1">Event</h3>
                    <p className="text-maroon-600">{item.event}</p>
                  </div>
                )}
                {item.type === GalleryItemType.PHOTO && item.photographer && (
                  <div>
                    <h3 className="text-maroon-700 font-medium mb-1">
                      Photographer
                    </h3>
                    <p className="text-maroon-600">{item.photographer}</p>
                  </div>
                )}
                {item.type === GalleryItemType.VIDEO && item.presenter && (
                  <div>
                    <h3 className="text-maroon-700 font-medium mb-1">
                      Presenter
                    </h3>
                    <p className="text-maroon-600">{item.presenter}</p>
                  </div>
                )}
                {item.tags && item.tags.length > 0 && (
                  <div>
                    <h3 className="text-maroon-700 font-medium mb-1">Tags</h3>
                    <div className="flex flex-wrap gap-2 mt-1">
                      {item.tags.map((tag, idx) => (
                        <span
                          key={idx}
                          className="bg-saffron-100 text-maroon-700 px-2 py-1 rounded-md text-sm"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
            {item.type !== GalleryItemType.VIDEO && images.length > 1 && (
              <div className="px-6 pb-6">
                <Button
                  className="w-full bg-saffron-300 hover:bg-saffron-400 text-crimson-800"
                  onClick={toggleShowAllImages}
                >
                  {showAllImages ? (
                    <>
                      Hide All Images
                      <ChevronUp className="ml-2 h-4 w-4" />
                    </>
                  ) : (
                    <>
                      View All Images
                      <ChevronDown className="ml-2 h-4 w-4" />
                    </>
                  )}
                </Button>
              </div>
            )}
          </Card>
        </motion.div>
      </div>

      {/* View All Images Grid - only show for photos */}
      {item.type !== GalleryItemType.VIDEO &&
        showAllImages &&
        images.length > 1 && (
          <motion.div
            className="mt-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <Card className="bg-saffron-50 border-saffron-200 p-6">
              <CardHeader className="px-0 pt-0">
                <CardTitle className="text-2xl text-crimson-700">
                  All Images in this Collection
                </CardTitle>
              </CardHeader>
              <CardContent className="px-0 pb-0">
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {images.map((image, idx) => (
                    <div
                      key={idx}
                      className="cursor-pointer relative rounded-md overflow-hidden"
                      onClick={() => {
                        handleThumbnailClick(idx);
                        openImagePreview();
                      }}
                    >
                      <AspectRatio ratio={3 / 2}>
                        <Image
                          src={image || "/placeholder.svg"}
                          alt={`${item.title} - Image ${idx + 1}`}
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

      {/* Related Items */}
      {relatedItems.length > 0 && (
        <div className="mt-12">
          <h2 className="text-2xl font-bold mb-6 text-crimson-800">
            More from the Gallery
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {relatedItems.map((relatedItem, index) => (
              <Link key={index} href={`/resources/gallery/${relatedItem._id}`}>
                <Card className="bg-saffron-50 border-saffron-200 transition-all hover:shadow-md hover:-translate-y-1 cursor-pointer h-full">
                  <AspectRatio ratio={16 / 9}>
                    {relatedItem.type === GalleryItemType.VIDEO ? (
                      <div className="relative w-full h-full bg-gray-800">
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div className="rounded-full bg-crimson-700 p-4 text-white">
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
                        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent h-16"></div>
                      </div>
                    ) : (
                      <Image
                        src={relatedItem.image || "/placeholder.svg"}
                        alt={relatedItem.title}
                        fill
                        className="rounded-t-md object-cover"
                      />
                    )}
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
      )}

      {/* Image Preview Dialog - only for photos */}
      {item.type !== GalleryItemType.VIDEO && (
        <ImagePreviewDialog
          open={isImagePreviewOpen}
          onOpenChange={setIsImagePreviewOpen}
          images={images}
          initialIndex={activeImageIndex}
          title={item.title}
        />
      )}
    </div>
  );
}
