"use client";

import type React from "react";

import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Upload, X, Music } from "lucide-react";

interface AudioUploadProps {
  value: string | null;
  onChange: (file: File | null) => void;
  maxSizeMB?: number;
}

export function AudioUpload({
  value,
  onChange,
  maxSizeMB = 20,
}: AudioUploadProps) {
  const [dragActive, setDragActive] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [audioName, setAudioName] = useState<string | null>(null);
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
    if (!file.type.startsWith("audio/")) {
      setError("Please upload an audio file");
      return false;
    }

    // Check file size
    const maxSizeBytes = maxSizeMB * 1024 * 1024;
    if (file.size > maxSizeBytes) {
      setError(`Audio must be smaller than ${maxSizeMB}MB`);
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
        setAudioName(file.name);
      } else {
        e.target.value = "";
        onChange(null);
        setAudioName(null);
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
        setAudioName(file.name);
      }
    }
  };

  const handleRemove = () => {
    onChange(null);
    setAudioName(null);
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
                <Music className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="font-medium">{audioName || "Audio file"}</p>
                <audio controls className="mt-2 max-w-full">
                  <source src={value} type="audio/mpeg" />
                  Your browser does not support the audio element.
                </audio>
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
            <Music className="h-10 w-10 text-muted-foreground" />
            <div className="space-y-1">
              <p className="text-sm font-medium">
                Drag & drop an audio file here, or click to browse
              </p>
              <p className="text-xs text-muted-foreground">
                Supports MP3, WAV, OGG up to {maxSizeMB}MB
              </p>
            </div>
            <Label htmlFor="audio-upload" className="cursor-pointer">
              <div className="flex items-center gap-1 mt-2 text-primary">
                <Upload className="h-4 w-4" />
                <span>Upload Audio</span>
              </div>
              <Input
                id="audio-upload"
                ref={inputRef}
                type="file"
                accept="audio/*"
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
