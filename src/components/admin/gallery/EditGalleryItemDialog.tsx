"use client";

import { useState, useEffect } from "react";
import { galleryApi, type GalleryItem } from "@/utils/galleryApi";
import { GalleryItemFormDialog } from "./GalleryItemFormDialog";
import { Loader2 } from "lucide-react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { toast } from "sonner";

interface EditGalleryItemDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
  galleryItemId: string | null;
}

export function EditGalleryItemDialog({
  open,
  onOpenChange,
  onSuccess,
  galleryItemId,
}: EditGalleryItemDialogProps) {
  const [galleryItem, setGalleryItem] = useState<GalleryItem | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchGalleryItem = async () => {
      if (!galleryItemId || !open) return;

      setIsLoading(true);
      try {
        console.log("Fetching gallery item with ID:", galleryItemId);
        const item = await galleryApi.getGalleryItemById(galleryItemId);
        setGalleryItem(item);
      } catch (error) {
        console.error("Error fetching gallery item:", error);
        toast.error("Error", { description: "Failed to load gallery item" });
        onOpenChange(false); // Close the dialog on error
      } finally {
        setIsLoading(false);
      }
    };

    fetchGalleryItem();
  }, [galleryItemId, open, onOpenChange]);

  if (isLoading) {
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

  return (
    <GalleryItemFormDialog
      open={open}
      onOpenChange={onOpenChange}
      onSuccess={onSuccess}
      galleryItem={galleryItem}
      mode="edit"
    />
  );
}
