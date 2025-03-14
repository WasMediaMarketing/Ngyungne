"use client";

import * as React from "react";
import { useDropzone } from "react-dropzone";
import { UploadCloud, X } from "lucide-react";
import Image from "next/image";
import { cn } from "@/lib/utils";

interface FileUploadProps {
  onFilesSelected: (files: File[]) => void;
  onFileRemoved?: (index: number) => void;
  previews?: string[];
  multiple?: boolean;
  accept?: Record<string, string[]>;
  maxSize?: number;
  className?: string;
  previewClassName?: string;
  label?: string;
}

export function FileUpload({
  onFilesSelected,
  onFileRemoved,
  previews = [],
  multiple = false,
  accept = { "image/*": [] },
  maxSize = 5242880, // 5MB
  className,
  previewClassName,
  label = "Drag and drop files here, or click to select files",
}: FileUploadProps) {
  const [files, setFiles] = React.useState<File[]>([]);
  const [localPreviews, setLocalPreviews] = React.useState<string[]>([]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept,
    multiple,
    maxSize,
    onDrop: (acceptedFiles) => {
      const newFiles = acceptedFiles.filter(
        (file) => !files.some((f) => f.name === file.name)
      );

      if (newFiles.length > 0) {
        const updatedFiles = multiple ? [...files, ...newFiles] : newFiles;
        setFiles(updatedFiles);
        onFilesSelected(updatedFiles);

        // Generate previews for new files
        newFiles.forEach((file) => {
          const reader = new FileReader();
          reader.onload = () => {
            setLocalPreviews((prev) => [...prev, reader.result as string]);
          };
          reader.readAsDataURL(file);
        });
      }
    },
  });

  const removeFile = (index: number) => {
    const updatedFiles = [...files];
    updatedFiles.splice(index, 1);
    setFiles(updatedFiles);

    const updatedPreviews = [...localPreviews];
    updatedPreviews.splice(index, 1);
    setLocalPreviews(updatedPreviews);

    onFilesSelected(updatedFiles);
    if (onFileRemoved) onFileRemoved(index);
  };

  // Combine external previews with local previews
  const allPreviews = [...previews, ...localPreviews];

  return (
    <div className="space-y-4">
      <div
        {...getRootProps()}
        className={cn(
          "border-2 border-dashed rounded-lg p-6 cursor-pointer transition-colors",
          isDragActive
            ? "border-primary bg-primary/5"
            : "border-muted-foreground/20 hover:border-primary/50",
          className
        )}
      >
        <input {...getInputProps()} />
        <div className="flex flex-col items-center justify-center gap-2 text-center">
          <UploadCloud className="h-10 w-10 text-muted-foreground" />
          <p className="text-sm text-muted-foreground">{label}</p>
          <p className="text-xs text-muted-foreground">
            Max file size: {Math.round(maxSize / 1024 / 1024)}MB
          </p>
        </div>
      </div>

      {allPreviews.length > 0 && (
        <div
          className={cn(
            "grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4",
            previewClassName
          )}
        >
          {allPreviews.map((preview, index) => (
            <div
              key={index}
              className="relative aspect-square rounded-md overflow-hidden border group"
            >
              <Image
                src={preview || "/placeholder.svg"}
                alt={`Preview ${index + 1}`}
                fill
                className="object-cover"
              />
              <button
                type="button"
                onClick={() => removeFile(index)}
                className="absolute top-1 right-1 bg-destructive text-destructive-foreground rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <X className="h-3 w-3" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
