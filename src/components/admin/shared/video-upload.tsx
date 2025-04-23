"use client";

import type React from "react";

import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Upload, X, Video } from "lucide-react";

interface VideoUploadProps {
  value: string | null;
  onChange: (file: File | null) => void;
  maxSizeMB?: number;
}

export function VideoUpload({
  value,
  onChange,
  maxSizeMB = 50,
}: VideoUploadProps) {
  const [dragActive, setDragActive] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [videoName, setVideoName] = useState<string | null>(null);
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
    if (!file.type.startsWith("video/")) {
      setError("Please upload a video file");
      return false;
    }

    // Check file size
    const maxSizeBytes = maxSizeMB * 1024 * 1024;
    if (file.size > maxSizeBytes) {
      setError(`Video must be smaller than ${maxSizeMB}MB`);
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
        setVideoName(file.name);
      } else {
        e.target.value = "";
        onChange(null);
        setVideoName(null);
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
        setVideoName(file.name);
      }
    }
  };

  const handleRemove = () => {
    onChange(null);
    setVideoName(null);
    if (inputRef.current) {
      inputRef.current.value = "";
    }
  };

  return (
    <div className="space-y-2">
      {value ? (
        <div className="border rounded-md p-4 bg-muted/20">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="bg-primary/10 p-2 rounded-full">
                <Video className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="font-medium">{videoName || "Video file"}</p>
                <video controls className="mt-2 max-w-full max-h-[200px]">
                  <source src={value} type="video/mp4" />
                  Your browser does not support the video element.
                </video>
              </div>
            </div>
            <Button
              type="button"
              variant="destructive"
              size="icon"
              className="h-8 w-8 rounded-full"
              onClick={handleRemove}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
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
            <Video className="h-10 w-10 text-muted-foreground" />
            <div className="space-y-1">
              <p className="text-sm font-medium">
                Drag & drop a video file here, or click to browse
              </p>
              <p className="text-xs text-muted-foreground">
                Supports MP4, WebM, MOV up to {maxSizeMB}MB
              </p>
            </div>
            <Label htmlFor="video-upload" className="cursor-pointer">
              <div className="flex items-center gap-1 mt-2 text-primary">
                <Upload className="h-4 w-4" />
                <span>Upload Video</span>
              </div>
              <Input
                id="video-upload"
                ref={inputRef}
                type="file"
                accept="video/*"
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
