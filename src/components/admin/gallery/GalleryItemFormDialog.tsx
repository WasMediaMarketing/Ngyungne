"use client";

import { useState, useCallback, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { toast } from "sonner";
import { galleryApi, type GalleryItem } from "@/utils/galleryApi";
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
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { RefreshCw, Upload, X, Plus, Loader2 } from "lucide-react";
import { useDropzone } from "react-dropzone";
import Image from "next/image";
import { format } from "date-fns";

// Define the validation schema using Zod
const formSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().min(1, "Description is required"),
  fullDescription: z.string().optional(),
  type: z.enum([GalleryItemType.PHOTO, GalleryItemType.VIDEO], {
    required_error: "Type is required",
  }),
  videoUrl: z.string().url("Must be a valid URL").optional().or(z.literal("")),
  tags: z.array(z.string()).optional(),
  date: z.string().optional(),
  location: z.string().optional(),
  photographer: z.string().optional(),
  presenter: z.string().optional(),
  event: z.string().optional(),
  duration: z.string().optional(),
  isVisible: z.boolean().default(true),
});

type FormValues = z.infer<typeof formSchema>;

interface GalleryItemFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
  galleryItem?: GalleryItem | null;
  mode: "add" | "edit";
}

export function GalleryItemFormDialog({
  open,
  onOpenChange,
  onSuccess,
  galleryItem = null,
  mode,
}: GalleryItemFormDialogProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [mainImage, setMainImage] = useState<File | null>(null);
  const [mainImagePreview, setMainImagePreview] = useState<string | null>(null);
  const [additionalImages, setAdditionalImages] = useState<File[]>([]);
  const [additionalImagePreviews, setAdditionalImagePreviews] = useState<
    string[]
  >([]);
  const [existingAdditionalImages, setExistingAdditionalImages] = useState<
    string[]
  >([]);
  const [tags, setTags] = useState<string[]>([]);
  const [newTag, setNewTag] = useState("");
  const [replaceMainImage, setReplaceMainImage] = useState(false);

  // Initialize the form
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      description: "",
      fullDescription: "",
      type: GalleryItemType.PHOTO,
      videoUrl: "",
      tags: [],
      date: format(new Date(), "yyyy-MM-dd"),
      location: "",
      photographer: "",
      presenter: "",
      event: "",
      duration: "",
      isVisible: true,
    },
  });

  const selectedType = form.watch("type");

  // Fetch gallery item data when dialog opens in edit mode
  useEffect(() => {
    const fetchGalleryItem = async () => {
      if (mode !== "edit" || !galleryItem || !open) return;

      setIsLoading(true);
      try {
        // Set form values
        form.reset({
          title: galleryItem.title,
          description: galleryItem.description,
          fullDescription: galleryItem.fullDescription || "",
          type: galleryItem.type,
          videoUrl: galleryItem.videoUrl || "",
          tags: galleryItem.tags || [],
          date: galleryItem.date
            ? format(new Date(galleryItem.date), "yyyy-MM-dd")
            : format(new Date(), "yyyy-MM-dd"),
          location: galleryItem.location || "",
          photographer: galleryItem.photographer || "",
          presenter: galleryItem.presenter || "",
          event: galleryItem.event || "",
          duration: galleryItem.duration || "",
          isVisible: galleryItem.isVisible,
        });

        // Set image previews
        if (galleryItem.image) {
          setMainImagePreview(galleryItem.image);
        }

        if (
          galleryItem.additionalImages &&
          galleryItem.additionalImages.length > 0
        ) {
          setExistingAdditionalImages(galleryItem.additionalImages);
        }

        // Set tags
        setTags(galleryItem.tags || []);
      } catch (error) {
        console.error("Error setting gallery item data:", error);
        toast.error("Error", {
          description: "Failed to load gallery item data",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchGalleryItem();
  }, [galleryItem, open, form, mode]);

  // Reset form when dialog closes
  useEffect(() => {
    if (!open) {
      // Wait for dialog animation to complete before resetting
      const timeout = setTimeout(() => {
        if (mode === "add") {
          form.reset({
            title: "",
            description: "",
            fullDescription: "",
            type: GalleryItemType.PHOTO,
            videoUrl: "",
            tags: [],
            date: format(new Date(), "yyyy-MM-dd"),
            location: "",
            photographer: "",
            presenter: "",
            event: "",
            duration: "",
            isVisible: true,
          });
        }
        setMainImage(null);
        setMainImagePreview(null);
        setAdditionalImages([]);
        setAdditionalImagePreviews([]);
        setExistingAdditionalImages([]);
        setTags([]);
        setNewTag("");
        setReplaceMainImage(false);
      }, 300);
      return () => clearTimeout(timeout);
    }
  }, [open, form, mode]);

  // Dropzone for main image
  const onDropMainImage = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      const file = acceptedFiles[0];
      setMainImage(file);
      const previewUrl = URL.createObjectURL(file);
      setMainImagePreview(previewUrl);
      setReplaceMainImage(true);
    }
  }, []);

  const {
    getRootProps: getMainImageRootProps,
    getInputProps: getMainImageInputProps,
  } = useDropzone({
    onDrop: onDropMainImage,
    accept: {
      "image/*": [".jpeg", ".jpg", ".png", ".gif", ".webp"],
    },
    maxFiles: 1,
  });

  // Dropzone for additional images
  const onDropAdditionalImages = useCallback((acceptedFiles: File[]) => {
    setAdditionalImages((prev) => [...prev, ...acceptedFiles]);
    const newPreviews = acceptedFiles.map((file) => URL.createObjectURL(file));
    setAdditionalImagePreviews((prev) => [...prev, ...newPreviews]);
  }, []);

  const {
    getRootProps: getAdditionalImagesRootProps,
    getInputProps: getAdditionalImagesInputProps,
  } = useDropzone({
    onDrop: onDropAdditionalImages,
    accept: {
      "image/*": [".jpeg", ".jpg", ".png", ".gif", ".webp"],
    },
  });

  const removeMainImage = () => {
    if (mainImagePreview && replaceMainImage) {
      URL.revokeObjectURL(mainImagePreview);
    }
    setMainImage(null);
    setMainImagePreview(null);
    setReplaceMainImage(true);
  };

  const removeAdditionalImage = (index: number) => {
    URL.revokeObjectURL(additionalImagePreviews[index]);
    setAdditionalImagePreviews((prev) => prev.filter((_, i) => i !== index));
    setAdditionalImages((prev) => prev.filter((_, i) => i !== index));
  };

  const removeExistingAdditionalImage = (index: number) => {
    setExistingAdditionalImages((prev) => prev.filter((_, i) => i !== index));
  };

  const handleAddTag = () => {
    if (newTag.trim() && !tags.includes(newTag.trim())) {
      const updatedTags = [...tags, newTag.trim()];
      setTags(updatedTags);
      form.setValue("tags", updatedTags);
      setNewTag("");
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    const updatedTags = tags.filter((tag) => tag !== tagToRemove);
    setTags(updatedTags);
    form.setValue("tags", updatedTags);
  };

  const onSubmit = async (data: FormValues) => {
    if (mode === "edit" && !galleryItem?._id) return;

    if (
      selectedType === GalleryItemType.PHOTO &&
      !mainImagePreview &&
      !mainImage
    ) {
      toast.error("Error", { description: "Please upload a main image" });
      return;
    }

    if (selectedType === GalleryItemType.VIDEO && !data.videoUrl) {
      toast.error("Error", {
        description: "Video URL is required for video items",
      });
      return;
    }

    setIsSubmitting(true);
    try {
      // Create FormData for multipart/form-data request
      const formData = new FormData();

      // Add basic fields
      formData.append("title", data.title);
      formData.append("description", data.description);
      formData.append("type", data.type);
      formData.append("isVisible", String(data.isVisible));

      // Add optional fields if they exist
      if (data.fullDescription)
        formData.append("fullDescription", data.fullDescription);
      if (data.videoUrl) formData.append("videoUrl", data.videoUrl);
      if (data.date) formData.append("date", data.date);
      if (data.location) formData.append("location", data.location);
      if (data.photographer) formData.append("photographer", data.photographer);
      if (data.presenter) formData.append("presenter", data.presenter);
      if (data.event) formData.append("event", data.event);
      if (data.duration) formData.append("duration", data.duration);

      // Add tags as JSON
      if (tags.length > 0) {
        formData.append("tags", JSON.stringify(tags));
      }

      // Add main image
      if (mainImage) {
        formData.append("image", mainImage);
      }

      // For edit mode, handle existing additional images
      if (mode === "edit" && existingAdditionalImages.length > 0) {
        formData.append(
          "existingAdditionalImages",
          JSON.stringify(existingAdditionalImages)
        );
      }

      // Add additional images
      additionalImages.forEach((file) => {
        formData.append("additionalImages", file);
      });

      // Submit the form
      if (mode === "add") {
        await galleryApi.createGalleryItem(formData);
      } else if (mode === "edit" && galleryItem?._id) {
        await galleryApi.updateGalleryItem(galleryItem._id, formData);
      }

      // Reset form and close dialog
      if (mode === "add") {
        form.reset();
        setMainImage(null);
        setMainImagePreview(null);
        setAdditionalImages([]);
        setAdditionalImagePreviews([]);
        setTags([]);
      }

      onSuccess();
      onOpenChange(false);
    } catch (error) {
      console.error(
        `Error ${mode === "add" ? "creating" : "updating"} gallery item:`,
        error
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  // Clean up URLs when component unmounts
  useEffect(() => {
    return () => {
      if (mainImagePreview && replaceMainImage) {
        URL.revokeObjectURL(mainImagePreview);
      }
      additionalImagePreviews.forEach((url) => URL.revokeObjectURL(url));
    };
  }, [mainImagePreview, additionalImagePreviews, replaceMainImage]);

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
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {mode === "add" ? "Add New Gallery Item" : "Edit Gallery Item"}
          </DialogTitle>
          <DialogDescription>
            {mode === "add"
              ? "Create a new photo or video for the gallery."
              : "Update the gallery item information."}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <Tabs defaultValue="basic" className="w-full">
              <TabsList className="grid grid-cols-3 mb-4">
                <TabsTrigger value="basic">Basic Info</TabsTrigger>
                <TabsTrigger value="media">Media</TabsTrigger>
                <TabsTrigger value="details">Additional Details</TabsTrigger>
              </TabsList>

              {/* Basic Info Tab */}
              <TabsContent value="basic" className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="title"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Title *</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter title" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="type"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Type *</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          value={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select type" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value={GalleryItemType.PHOTO}>
                              Photo
                            </SelectItem>
                            <SelectItem value={GalleryItemType.VIDEO}>
                              Video
                            </SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Short Description *</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Enter a brief description"
                          className="min-h-[80px]"
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>
                        A short description that will appear in gallery listings
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="fullDescription"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Full Description</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Enter a detailed description"
                          className="min-h-[120px]"
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>
                        A detailed description that will appear on the item's
                        detail page
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="space-y-2">
                  <FormLabel>Tags</FormLabel>
                  <div className="flex gap-2">
                    <Input
                      placeholder="Add a tag"
                      value={newTag}
                      onChange={(e) => setNewTag(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault();
                          handleAddTag();
                        }
                      }}
                    />
                    <Button
                      type="button"
                      variant="outline"
                      onClick={handleAddTag}
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                  <FormDescription>
                    Add tags to help categorize and search for this item
                  </FormDescription>

                  {tags.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-2">
                      {tags.map((tag, index) => (
                        <div
                          key={index}
                          className="flex items-center bg-secondary text-secondary-foreground px-3 py-1 rounded-full text-sm"
                        >
                          <span>{tag}</span>
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            className="h-5 w-5 p-0 ml-1"
                            onClick={() => handleRemoveTag(tag)}
                          >
                            <X className="h-3 w-3" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <FormField
                  control={form.control}
                  name="isVisible"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                      <div className="space-y-0.5">
                        <FormLabel className="text-base">
                          Visible on Website
                        </FormLabel>
                        <FormDescription>
                          Make this gallery item visible to the public
                        </FormDescription>
                      </div>
                      <FormControl>
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </TabsContent>

              {/* Media Tab */}
              <TabsContent value="media" className="space-y-6">
                {/* Main Image Upload */}
                <div className="space-y-2">
                  <FormLabel>
                    Main Image {selectedType === GalleryItemType.PHOTO && "*"}
                  </FormLabel>
                  <div
                    {...getMainImageRootProps()}
                    className={`border-2 border-dashed rounded-lg p-4 text-center cursor-pointer hover:bg-secondary/20 transition ${
                      mainImagePreview ? "border-primary" : "border-muted"
                    }`}
                  >
                    <input {...getMainImageInputProps()} />
                    {mainImagePreview ? (
                      <div className="relative">
                        <div className="relative h-48 w-full">
                          <Image
                            src={mainImagePreview || "/placeholder.svg"}
                            alt="Preview"
                            fill
                            className="object-contain rounded-md"
                          />
                        </div>
                        <Button
                          type="button"
                          variant="destructive"
                          size="sm"
                          className="absolute top-2 right-2"
                          onClick={(e) => {
                            e.stopPropagation();
                            removeMainImage();
                          }}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    ) : (
                      <div className="py-4 flex flex-col items-center">
                        <Upload className="h-10 w-10 text-muted-foreground mb-2" />
                        <p className="text-sm text-muted-foreground">
                          Drag & drop an image here, or click to select
                        </p>
                      </div>
                    )}
                  </div>
                  <FormDescription>
                    {selectedType === GalleryItemType.PHOTO
                      ? "The main photo to display in the gallery"
                      : "A thumbnail image for the video"}
                  </FormDescription>
                </div>

                {/* Video URL (only for video type) */}
                {selectedType === GalleryItemType.VIDEO && (
                  <FormField
                    control={form.control}
                    name="videoUrl"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Video URL *</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="https://www.youtube.com/watch?v=..."
                            {...field}
                          />
                        </FormControl>
                        <FormDescription>
                          Enter a YouTube, Vimeo, or other video platform URL
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}

                {/* Additional Images (only for photo type) */}
                {selectedType === GalleryItemType.PHOTO && (
                  <>
                    {/* Existing Additional Images */}
                    {mode === "edit" && existingAdditionalImages.length > 0 && (
                      <div className="space-y-2">
                        <FormLabel>Existing Additional Images</FormLabel>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                          {existingAdditionalImages.map((image, index) => (
                            <div key={index} className="relative">
                              <div className="relative h-24 w-full">
                                <Image
                                  src={image || "/placeholder.svg"}
                                  alt={`Additional image ${index + 1}`}
                                  fill
                                  className="object-cover rounded-md"
                                />
                              </div>
                              <Button
                                type="button"
                                variant="destructive"
                                size="sm"
                                className="absolute top-1 right-1 h-6 w-6 p-0"
                                onClick={() =>
                                  removeExistingAdditionalImage(index)
                                }
                              >
                                <X className="h-3 w-3" />
                              </Button>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* New Additional Images */}
                    <div className="space-y-2">
                      <FormLabel>
                        {mode === "edit" && existingAdditionalImages.length > 0
                          ? "Add More Images"
                          : "Additional Images"}
                      </FormLabel>
                      <div
                        {...getAdditionalImagesRootProps()}
                        className="border-2 border-dashed rounded-lg p-4 text-center cursor-pointer hover:bg-secondary/20 transition"
                      >
                        <input {...getAdditionalImagesInputProps()} />
                        <div className="py-4 flex flex-col items-center">
                          <Upload className="h-10 w-10 text-muted-foreground mb-2" />
                          <p className="text-sm text-muted-foreground">
                            Drag & drop images here, or click to select
                          </p>
                        </div>
                      </div>
                      <FormDescription>
                        Optional additional images for the photo gallery
                      </FormDescription>

                      {additionalImagePreviews.length > 0 && (
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
                          {additionalImagePreviews.map((preview, index) => (
                            <div key={index} className="relative">
                              <div className="relative h-24 w-full">
                                <Image
                                  src={preview || "/placeholder.svg"}
                                  alt={`New additional image ${index + 1}`}
                                  fill
                                  className="object-cover rounded-md"
                                />
                              </div>
                              <Button
                                type="button"
                                variant="destructive"
                                size="sm"
                                className="absolute top-1 right-1 h-6 w-6 p-0"
                                onClick={() => removeAdditionalImage(index)}
                              >
                                <X className="h-3 w-3" />
                              </Button>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </>
                )}
              </TabsContent>

              {/* Additional Details Tab */}
              <TabsContent value="details" className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="date"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Date</FormLabel>
                        <FormControl>
                          <Input type="date" {...field} />
                        </FormControl>
                        <FormDescription>
                          When the photo was taken or video was recorded
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="location"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Location</FormLabel>
                        <FormControl>
                          <Input placeholder="e.g., New York, USA" {...field} />
                        </FormControl>
                        <FormDescription>
                          Where the photo was taken or video was recorded
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {selectedType === GalleryItemType.PHOTO ? (
                    <FormField
                      control={form.control}
                      name="photographer"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Photographer</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Photographer's name"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  ) : (
                    <FormField
                      control={form.control}
                      name="presenter"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Presenter</FormLabel>
                          <FormControl>
                            <Input placeholder="Presenter's name" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  )}

                  <FormField
                    control={form.control}
                    name="event"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Event</FormLabel>
                        <FormControl>
                          <Input placeholder="Associated event" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                {selectedType === GalleryItemType.VIDEO && (
                  <FormField
                    control={form.control}
                    name="duration"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Duration</FormLabel>
                        <FormControl>
                          <Input placeholder="e.g., 10:30" {...field} />
                        </FormControl>
                        <FormDescription>
                          Duration of the video (e.g., 10:30)
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}
              </TabsContent>
            </Tabs>

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                    {mode === "add" ? "Creating..." : "Updating..."}
                  </>
                ) : mode === "add" ? (
                  "Create Gallery Item"
                ) : (
                  "Update Gallery Item"
                )}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
