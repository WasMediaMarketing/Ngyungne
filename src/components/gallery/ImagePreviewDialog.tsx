"use client";

import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, X, Download } from "lucide-react";
import Image from "next/image";

interface ImagePreviewDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  images: string[];
  initialIndex?: number;
  title?: string;
}

export function ImagePreviewDialog({
  open,
  onOpenChange,
  images,
  initialIndex = 0,
  title,
}: ImagePreviewDialogProps) {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);

  // Reset current index when dialog opens or images change
  useEffect(() => {
    if (open) {
      setCurrentIndex(initialIndex);
    }
  }, [open, initialIndex, images]);

  const handlePrevious = () => {
    setCurrentIndex((prev) => (prev > 0 ? prev - 1 : images.length - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev < images.length - 1 ? prev + 1 : 0));
  };

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!open) return;

      switch (e.key) {
        case "ArrowLeft":
          handlePrevious();
          break;
        case "ArrowRight":
          handleNext();
          break;
        case "Escape":
          onOpenChange(false);
          break;
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [open, onOpenChange]);

  if (!images || images.length === 0) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-5xl max-h-[90vh] p-0 overflow-hidden bg-black/95 border-none">
        <div className="absolute top-4 right-4 z-50">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onOpenChange(false)}
            className="rounded-full bg-black/50 text-white hover:bg-black/70"
          >
            <X className="h-5 w-5" />
          </Button>
        </div>

        {title && (
          <DialogHeader className="absolute top-4 left-4 z-40">
            <DialogTitle className="text-white text-xl">{title}</DialogTitle>
            <DialogDescription className="text-gray-300">
              Image {currentIndex + 1} of {images.length}
            </DialogDescription>
          </DialogHeader>
        )}

        <div className="relative h-[80vh] w-full flex items-center justify-center">
          <div className="absolute inset-0 flex items-center justify-center">
            <Image
              src={images[currentIndex] || "/placeholder.svg"}
              alt={`Image ${currentIndex + 1}`}
              fill
              className="object-contain"
            />
          </div>

          {images.length > 1 && (
            <>
              <Button
                variant="ghost"
                size="icon"
                onClick={handlePrevious}
                className="absolute left-4 rounded-full bg-black/50 text-white hover:bg-black/70"
              >
                <ChevronLeft className="h-6 w-6" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={handleNext}
                className="absolute right-4 rounded-full bg-black/50 text-white hover:bg-black/70"
              >
                <ChevronRight className="h-6 w-6" />
              </Button>
            </>
          )}
        </div>

        <div className="flex justify-between items-center p-4 bg-black/80">
          <div className="flex gap-2">
            <Button
              variant="outline"
              className="bg-white/10 text-white border-white/20 hover:bg-white/20"
              onClick={() => window.open(images[currentIndex], "_blank")}
            >
              <Download className="mr-2 h-4 w-4" />
              Download
            </Button>
          </div>

          {images.length > 1 && (
            <div className="flex gap-2 overflow-x-auto py-2 max-w-[50%]">
              {images.map((image, idx) => (
                <div
                  key={idx}
                  className={`flex-none w-12 h-12 relative rounded-md overflow-hidden cursor-pointer transition-all ${
                    currentIndex === idx
                      ? "ring-2 ring-white ring-offset-1 ring-offset-black"
                      : "opacity-60 hover:opacity-100"
                  }`}
                  onClick={() => setCurrentIndex(idx)}
                >
                  <Image
                    src={image || "/placeholder.svg"}
                    alt={`Thumbnail ${idx + 1}`}
                    fill
                    className="object-cover"
                  />
                </div>
              ))}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
