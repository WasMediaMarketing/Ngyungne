"use client";

import { useState, useEffect } from "react";
import type { GalleryItem } from "@/utils/galleryApi";
import { GalleryItemType } from "@/types/gallery";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Loader2,
  Calendar,
  MapPin,
  User,
  Clock,
  Tag,
  Globe,
  Edit,
  ExternalLink,
} from "lucide-react";
import Image from "next/image";
import { format } from "date-fns";
import { ImagePreviewDialog } from "@/components/gallery/ImagePreviewDialog";

interface ViewGalleryItemDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  galleryItem: GalleryItem | null;
  onEdit: (id: string) => void;
}

export function ViewGalleryItemDialog({
  open,
  onOpenChange,
  galleryItem,
  onEdit,
}: ViewGalleryItemDialogProps) {
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  // Add state for the image preview dialog
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewImageIndex, setPreviewImageIndex] = useState(0);

  // Reset active image index when dialog opens/closes or item changes
  useEffect(() => {
    setActiveImageIndex(0);
  }, [open, galleryItem]);

  if (!galleryItem) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-4xl">
          <div className="flex justify-center items-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <span className="ml-2">Loading gallery item...</span>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  const formatDate = (dateString?: string) => {
    if (!dateString) return "N/A";
    try {
      return format(new Date(dateString), "MMMM d, yyyy");
    } catch (error) {
      return dateString;
    }
  };

  // Prepare images array for the gallery
  const images = [
    galleryItem.image,
    ...(galleryItem.additionalImages || []),
  ].filter(Boolean);

  // Add a function to open the preview dialog
  const openImagePreview = (index: number) => {
    setPreviewImageIndex(index);
    setPreviewOpen(true);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl">{galleryItem.title}</DialogTitle>
          <DialogDescription>
            <div className="flex flex-wrap gap-2 mt-2">
              <Badge
                variant="outline"
                className={
                  galleryItem.type === GalleryItemType.PHOTO
                    ? "bg-blue-100 text-blue-800 border-blue-300"
                    : "bg-purple-100 text-purple-800 border-purple-300"
                }
              >
                {galleryItem.type}
              </Badge>
              <Badge variant={galleryItem.isVisible ? "outline" : "secondary"}>
                {galleryItem.isVisible ? "Public" : "Hidden"}
              </Badge>
              {galleryItem.date && (
                <Badge variant="outline" className="bg-gray-100">
                  <Calendar className="h-3 w-3 mr-1" />
                  {formatDate(galleryItem.date)}
                </Badge>
              )}
            </div>
          </DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="preview" className="w-full">
          <TabsList className="grid grid-cols-2 mb-4">
            <TabsTrigger value="preview">Preview</TabsTrigger>
            <TabsTrigger value="details">Details</TabsTrigger>
          </TabsList>

          <TabsContent value="preview" className="space-y-4">
            {galleryItem.type === GalleryItemType.PHOTO ? (
              <>
                {/* Photo Gallery */}
                <div className="relative aspect-video w-full overflow-hidden rounded-lg border">
                  <Image
                    src={images[activeImageIndex] || "/placeholder.svg"}
                    alt={galleryItem.title}
                    fill
                    className="object-contain cursor-pointer"
                    onClick={() => openImagePreview(activeImageIndex)}
                  />
                </div>

                {/* Thumbnails */}
                {images.length > 1 && (
                  <div className="grid grid-cols-6 gap-2">
                    {images.map((image, index) => (
                      <div
                        key={index}
                        className={`relative aspect-square cursor-pointer rounded-md overflow-hidden border-2 ${
                          activeImageIndex === index
                            ? "border-primary"
                            : "border-transparent"
                        }`}
                        onClick={() => setActiveImageIndex(index)}
                      >
                        <Image
                          src={image || "/placeholder.svg"}
                          alt={`Thumbnail ${index + 1}`}
                          fill
                          className="object-cover"
                        />
                      </div>
                    ))}
                  </div>
                )}
              </>
            ) : (
              <>
                {/* Video Preview */}
                <div className="relative aspect-video w-full overflow-hidden rounded-lg border">
                  {galleryItem.videoUrl ? (
                    <iframe
                      src={galleryItem.videoUrl.replace("watch?v=", "embed/")}
                      title={galleryItem.title}
                      className="absolute inset-0 w-full h-full"
                      allowFullScreen
                    ></iframe>
                  ) : (
                    <div className="flex items-center justify-center h-full bg-gray-100">
                      <p className="text-muted-foreground">
                        No video URL provided
                      </p>
                    </div>
                  )}
                </div>

                {/* Video Thumbnail */}
                {galleryItem.image && (
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-medium">Thumbnail:</p>
                    <div className="relative h-16 w-24 rounded-md overflow-hidden border">
                      <Image
                        src={galleryItem.image || "/placeholder.svg"}
                        alt="Video thumbnail"
                        fill
                        className="object-cover"
                      />
                    </div>
                  </div>
                )}
              </>
            )}

            <div className="space-y-4 mt-6">
              <h3 className="text-lg font-semibold">Description</h3>
              <p className="text-muted-foreground">{galleryItem.description}</p>

              {galleryItem.fullDescription && (
                <div className="mt-4">
                  <h3 className="text-lg font-semibold">Full Description</h3>
                  <p className="text-muted-foreground whitespace-pre-line">
                    {galleryItem.fullDescription}
                  </p>
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="details" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Basic Information</h3>
                <div className="space-y-2">
                  <div className="flex items-start gap-2">
                    <Calendar className="h-4 w-4 mt-1 text-muted-foreground" />
                    <div>
                      <p className="font-medium">Date</p>
                      <p className="text-muted-foreground">
                        {formatDate(galleryItem.date)}
                      </p>
                    </div>
                  </div>

                  {galleryItem.location && (
                    <div className="flex items-start gap-2">
                      <MapPin className="h-4 w-4 mt-1 text-muted-foreground" />
                      <div>
                        <p className="font-medium">Location</p>
                        <p className="text-muted-foreground">
                          {galleryItem.location}
                        </p>
                      </div>
                    </div>
                  )}

                  {galleryItem.type === GalleryItemType.PHOTO &&
                    galleryItem.photographer && (
                      <div className="flex items-start gap-2">
                        <User className="h-4 w-4 mt-1 text-muted-foreground" />
                        <div>
                          <p className="font-medium">Photographer</p>
                          <p className="text-muted-foreground">
                            {galleryItem.photographer}
                          </p>
                        </div>
                      </div>
                    )}

                  {galleryItem.type === GalleryItemType.VIDEO &&
                    galleryItem.presenter && (
                      <div className="flex items-start gap-2">
                        <User className="h-4 w-4 mt-1 text-muted-foreground" />
                        <div>
                          <p className="font-medium">Presenter</p>
                          <p className="text-muted-foreground">
                            {galleryItem.presenter}
                          </p>
                        </div>
                      </div>
                    )}

                  {galleryItem.event && (
                    <div className="flex items-start gap-2">
                      <Calendar className="h-4 w-4 mt-1 text-muted-foreground" />
                      <div>
                        <p className="font-medium">Event</p>
                        <p className="text-muted-foreground">
                          {galleryItem.event}
                        </p>
                      </div>
                    </div>
                  )}

                  {galleryItem.type === GalleryItemType.VIDEO &&
                    galleryItem.duration && (
                      <div className="flex items-start gap-2">
                        <Clock className="h-4 w-4 mt-1 text-muted-foreground" />
                        <div>
                          <p className="font-medium">Duration</p>
                          <p className="text-muted-foreground">
                            {galleryItem.duration}
                          </p>
                        </div>
                      </div>
                    )}
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-semibold">
                  Additional Information
                </h3>

                {galleryItem.tags && galleryItem.tags.length > 0 && (
                  <div className="space-y-2">
                    <div className="flex items-start gap-2">
                      <Tag className="h-4 w-4 mt-1 text-muted-foreground" />
                      <div>
                        <p className="font-medium">Tags</p>
                        <div className="flex flex-wrap gap-2 mt-1">
                          {galleryItem.tags.map((tag, index) => (
                            <Badge
                              key={index}
                              variant="outline"
                              className="bg-gray-100"
                            >
                              {tag}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                <div className="space-y-2">
                  <div className="flex items-start gap-2">
                    <Globe className="h-4 w-4 mt-1 text-muted-foreground" />
                    <div>
                      <p className="font-medium">Visibility</p>
                      <p className="text-muted-foreground">
                        {galleryItem.isVisible
                          ? "Visible to the public"
                          : "Hidden from the public"}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-start gap-2">
                    <Calendar className="h-4 w-4 mt-1 text-muted-foreground" />
                    <div>
                      <p className="font-medium">Created At</p>
                      <p className="text-muted-foreground">
                        {galleryItem.createdAt
                          ? formatDate(galleryItem.createdAt)
                          : "N/A"}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-start gap-2">
                    <Calendar className="h-4 w-4 mt-1 text-muted-foreground" />
                    <div>
                      <p className="font-medium">Last Updated</p>
                      <p className="text-muted-foreground">
                        {galleryItem.updatedAt
                          ? formatDate(galleryItem.updatedAt)
                          : "N/A"}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>

        <DialogFooter className="gap-2 sm:gap-0">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Close
          </Button>
          <Button
            variant="outline"
            onClick={() =>
              window.open(`/resources/gallery/${galleryItem._id}`, "_blank")
            }
          >
            <ExternalLink className="h-4 w-4 mr-2" />
            View on Website
          </Button>
          <Button onClick={() => onEdit(galleryItem._id)}>
            <Edit className="h-4 w-4 mr-2" />
            Edit
          </Button>
        </DialogFooter>
        {/* Image Preview Dialog */}
        {galleryItem && (
          <ImagePreviewDialog
            open={previewOpen}
            onOpenChange={setPreviewOpen}
            images={images}
            initialIndex={previewImageIndex}
            title={galleryItem.title}
          />
        )}
      </DialogContent>
    </Dialog>
  );
}
