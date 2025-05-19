"use client";

import type React from "react";

import { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Upload, X } from "lucide-react";
import { toast } from "sonner";

interface ImageUploadProps {
  value: string;
  onChange: (url: string) => void;
  endpoint: string;
  disabled?: boolean;
}

export const ImageUpload = ({
  value,
  onChange,
  endpoint,
  disabled,
}: ImageUploadProps) => {
  const [isUploading, setIsUploading] = useState(false);

  const onDrop = useCallback(
    async (acceptedFiles: File[]) => {
      const file = acceptedFiles[0];

      if (!file) {
        return;
      }

      try {
        setIsUploading(true);

        // Create a FormData object to send the file
        const formData = new FormData();
        formData.append("file", file);

        // Send the file to the server
        const response = await fetch(`/api/upload/${endpoint}`, {
          method: "POST",
          body: formData,
        });

        if (!response.ok) {
          throw new Error("Failed to upload image");
        }

        const data = await response.json();
        onChange(data.url);
        toast.success("Image uploaded successfully");
      } catch (error) {
        console.error("Error uploading image:", error);
        toast.error("Failed to upload image");
      } finally {
        setIsUploading(false);
      }
    },
    [endpoint, onChange]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "image/*": [".png", ".jpg", ".jpeg", ".gif", ".webp"],
    },
    maxFiles: 1,
    disabled: isUploading || disabled,
  });

  const handleRemove = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    onChange("");
  };

  return (
    <div
      {...getRootProps()}
      className={`
        border-2 border-dashed rounded-lg p-4 transition-colors
        ${isDragActive ? "border-crimson-500 bg-crimson-50" : "border-gray-300"}
        ${
          disabled
            ? "opacity-50 cursor-not-allowed"
            : "cursor-pointer hover:border-crimson-300"
        }
      `}
    >
      <input {...getInputProps()} />

      {value ? (
        <div className="relative aspect-video w-full overflow-hidden rounded-lg">
          <div className="absolute top-2 right-2 z-10">
            <Button
              type="button"
              variant="destructive"
              size="icon"
              onClick={handleRemove}
              disabled={disabled}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
          <Image
            fill
            src={value || "/placeholder.svg"}
            alt="Upload"
            className="object-cover"
          />
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center gap-2 py-8">
          <Upload
            className={`h-10 w-10 ${
              isDragActive ? "text-crimson-500" : "text-gray-400"
            }`}
          />
          <div className="text-center">
            {isUploading ? (
              <div className="space-y-2">
                <div className="mx-auto h-5 w-5 animate-spin rounded-full border-2 border-t-crimson-500" />
                <p className="text-sm text-gray-500">Uploading...</p>
              </div>
            ) : (
              <>
                <p className="text-sm font-medium">
                  {isDragActive
                    ? "Drop the image here"
                    : "Drag & drop an image here"}
                </p>
                <p className="text-xs text-gray-500 mt-1">or click to browse</p>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
