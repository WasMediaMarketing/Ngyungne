"use client";

import type React from "react";

import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Upload, X, ImageIcon } from "lucide-react";
import Image from "next/image";

interface ImageUploadProps {
  value: string | null;
  onChange: (file: File | null) => void;
  maxSizeMB?: number;
}

export function ImageUpload({
  value,
  onChange,
  maxSizeMB = 2,
}: ImageUploadProps) {
  const [dragActive, setDragActive] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [localValue, setLocalValue] = useState<string | null>(value);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const validateFile = (file: File): boolean => {
    // Check file type
    if (!file.type.startsWith("image/")) {
      setError("Please upload an image file");
      return false;
    }

    // Check file size
    const maxSizeBytes = maxSizeMB * 1024 * 1024;
    if (file.size > maxSizeBytes) {
      setError(`Image must be smaller than ${maxSizeMB}MB`);
      return false;
    }

    setError(null);
    return true;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (validateFile(file)) {
        onChange(file);
      } else {
        e.target.value = "";
        onChange(null);
      }
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      if (validateFile(file)) {
        onChange(file);
      }
    }
  };

  const handleRemove = () => {
    setLocalValue(null);
    onChange(null);
    if (inputRef.current) {
      inputRef.current.value = "";
    }
  };

  return (
    <div className="space-y-2">
      {localValue ? (
        <div className="relative aspect-video w-full max-w-md mx-auto border rounded-md overflow-hidden">
          <Image
            src={localValue || "/placeholder.svg"}
            alt="Uploaded image"
            fill
            className="object-cover"
          />
          <Button
            type="button"
            variant="destructive"
            size="icon"
            className="absolute top-2 right-2 h-8 w-8 rounded-full"
            onClick={handleRemove}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      ) : (
        <div
          className={`border-2 border-dashed rounded-md p-8 text-center ${
            dragActive
              ? "border-primary bg-primary/5"
              : "border-muted-foreground/20"
          }`}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
        >
          <div className="flex flex-col items-center justify-center gap-2">
            <ImageIcon className="h-10 w-10 text-muted-foreground" />
            <div className="space-y-1">
              <p className="text-sm font-medium">
                Drag & drop an image here, or click to browse
              </p>
              <p className="text-xs text-muted-foreground">
                Supports JPG, PNG, GIF up to {maxSizeMB}MB
              </p>
            </div>
            <Label htmlFor="image-upload" className="cursor-pointer">
              <div className="flex items-center gap-1 mt-2 text-primary">
                <Upload className="h-4 w-4" />
                <span>Upload Image</span>
              </div>
              <Input
                id="image-upload"
                ref={inputRef}
                type="file"
                accept="image/*"
                onChange={handleChange}
                className="hidden"
              />
            </Label>
          </div>
        </div>
      )}

      {error && <p className="text-sm text-destructive">{error}</p>}
    </div>
  );
}
