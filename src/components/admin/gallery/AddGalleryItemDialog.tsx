"use client";

import { GalleryItemFormDialog } from "./GalleryItemFormDialog";

interface AddGalleryItemDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

export function AddGalleryItemDialog({
  open,
  onOpenChange,
  onSuccess,
}: AddGalleryItemDialogProps) {
  return (
    <GalleryItemFormDialog
      open={open}
      onOpenChange={onOpenChange}
      onSuccess={onSuccess}
      mode="add"
    />
  );
}
