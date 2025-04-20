"use client";

import { useState } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Image from "next/image";

interface ImageGalleryProps {
  images: string[];
  isOpen: boolean;
  onClose: () => void;
}

export function ImageGallery({ images, isOpen, onClose }: ImageGalleryProps) {
  const [currentIndex, setCurrentIndex] = useState(0);

  // Ensure we have valid images
  const validImages = Array.isArray(images) ? images : [];

  const handlePrevious = () => {
    if (validImages.length === 0) return;
    setCurrentIndex((prev) => (prev === 0 ? validImages.length - 1 : prev - 1));
  };

  const handleNext = () => {
    if (validImages.length === 0) return;
    setCurrentIndex((prev) => (prev === validImages.length - 1 ? 0 : prev + 1));
  };

  const handleThumbnailClick = (index: number) => {
    setCurrentIndex(index);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl p-0 bg-black/95 border-none">
        <div className="relative h-[60vh] w-full">
          {validImages.length > 0 && (
            <Image
              src={
                validImages[currentIndex] ||
                "/placeholder.svg?height=600&width=800"
              }
              alt={`Gallery image ${currentIndex + 1}`}
              layout="fill"
              objectFit="contain"
              className="p-4"
            />
          )}

          {validImages.length > 1 && (
            <>
              <Button
                variant="ghost"
                size="icon"
                className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white hover:bg-white/20 rounded-full"
                onClick={handlePrevious}
              >
                <ChevronLeft className="h-8 w-8" />
              </Button>

              <Button
                variant="ghost"
                size="icon"
                className="absolute right-4 top-1/2 transform -translate-y-1/2 text-white hover:bg-white/20 rounded-full"
                onClick={handleNext}
              >
                <ChevronRight className="h-8 w-8" />
              </Button>
            </>
          )}
        </div>

        {validImages.length > 1 && (
          <div className="bg-black/80 p-4 overflow-x-auto">
            <div className="flex space-x-2">
              {validImages.map((image, index) => (
                <button
                  key={index}
                  onClick={() => handleThumbnailClick(index)}
                  className={`relative w-16 h-16 rounded-md overflow-hidden flex-shrink-0 border-2 transition-all ${
                    currentIndex === index
                      ? "border-crimson-500 scale-105"
                      : "border-transparent hover:border-white/50"
                  }`}
                >
                  <Image
                    src={image || "/placeholder.svg?height=64&width=64"}
                    alt={`Thumbnail ${index + 1}`}
                    layout="fill"
                    objectFit="cover"
                  />
                </button>
              ))}
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
