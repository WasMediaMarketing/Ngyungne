"use client";

import type React from "react";

import { useState, useEffect } from "react";
import { toast } from "sonner";
import { sliderApi } from "@/utils/sliderApi";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ImageUpload } from "@/components/admin/shared/image-upload";
import { VideoUpload } from "@/components/admin/shared/video-upload";
import { RefreshCw, X } from "lucide-react";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { MediaType, MediaSourceType, type ISlider } from "@/types/slider.types";

interface EditSliderDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  slider: ISlider | null;
  onSuccess: () => void;
}

export function EditSliderDialog({
  open,
  onOpenChange,
  slider,
  onSuccess,
}: EditSliderDialogProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activeTab, setActiveTab] = useState("general");

  // Track if media has been changed
  const [mediaChanged, setMediaChanged] = useState(false);

  // Media state
  const [mediaType, setMediaType] = useState<MediaType>(MediaType.IMAGE);
  const [mediaSourceType, setMediaSourceType] = useState<MediaSourceType>(
    MediaSourceType.FILE
  );
  const [mediaUrl, setMediaUrl] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [videoPreview, setVideoPreview] = useState<string | null>(null);

  // Form data
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    buttonText: "",
    buttonUrl: "",
    order: 0,
    isVisible: true,
  });

  // Initialize form with slider data when it changes
  useEffect(() => {
    if (slider) {
      setFormData({
        title: slider.title || "",
        description: slider.description || "",
        buttonText: slider.buttonText || "",
        buttonUrl: slider.buttonUrl || "",
        order: slider.order || 0,
        isVisible: slider.isVisible,
      });

      // Reset media changed flag
      setMediaChanged(false);

      // Set media type and source type
      setMediaType(slider.media.type);
      setMediaSourceType(slider.media.sourceType);

      // Set media URL or preview based on source type
      if (slider.media.sourceType === MediaSourceType.URL) {
        setMediaUrl(slider.media.url || "");
      } else {
        if (slider.media.type === MediaType.IMAGE) {
          setImagePreview(slider.media.file || null);
        } else {
          setVideoPreview(slider.media.file || null);
        }
      }

      // Reset file inputs
      setImageFile(null);
      setVideoFile(null);
    }
  }, [slider]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSwitchChange = (checked: boolean) => {
    setFormData((prev) => ({ ...prev, isVisible: checked }));
  };

  const handleMediaTypeChange = (value: string) => {
    setMediaType(value as MediaType);
    setMediaChanged(true);
    // Clear media when changing type if it's a new file
    if (imageFile || videoFile) {
      setImageFile(null);
      setVideoFile(null);
      setImagePreview(
        slider?.media.type === MediaType.IMAGE
          ? slider.media.file || null
          : null
      );
      setVideoPreview(
        slider?.media.type === MediaType.VIDEO
          ? slider.media.file || null
          : null
      );
    }
  };

  const handleMediaSourceTypeChange = (value: string) => {
    setMediaSourceType(value as MediaSourceType);
    setMediaChanged(true);
  };

  const handleImageChange = (file: File | null) => {
    setImageFile(file);
    setMediaChanged(true);

    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    } else if (slider?.media.type === MediaType.IMAGE && slider.media.file) {
      setImagePreview(slider.media.file);
    } else {
      setImagePreview(null);
    }
  };

  const handleVideoChange = (file: File | null) => {
    setVideoFile(file);
    setMediaChanged(true);

    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setVideoPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    } else if (slider?.media.type === MediaType.VIDEO && slider.media.file) {
      setVideoPreview(slider.media.file);
    } else {
      setVideoPreview(null);
    }
  };

  const handleMediaUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setMediaUrl(e.target.value);
    setMediaChanged(true);
  };

  // Add clear functions for both image and video
  const clearImageMedia = () => {
    setImageFile(null);
    setImagePreview(null);
    setMediaChanged(true);
  };

  const clearVideoMedia = () => {
    setVideoFile(null);
    setVideoPreview(null);
    setMediaChanged(true);
  };

  // Clear URL media
  const clearUrlMedia = () => {
    setMediaUrl("");
    setMediaChanged(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!slider) return;

    setIsSubmitting(true);

    try {
      const sliderFormData = new FormData();

      // Add basic fields
      sliderFormData.append("title", formData.title);
      sliderFormData.append("description", formData.description);
      sliderFormData.append("buttonText", formData.buttonText);
      sliderFormData.append("buttonUrl", formData.buttonUrl);
      sliderFormData.append("order", formData.order.toString());
      sliderFormData.append("isVisible", formData.isVisible.toString());

      // Always include media information (changed or not) to handle clear actions properly
      // Validate media selection
      if (mediaSourceType === MediaSourceType.FILE) {
        if (mediaType === MediaType.IMAGE && !imagePreview) {
          toast.error("Please upload an image");
          setIsSubmitting(false);
          return;
        }
        if (mediaType === MediaType.VIDEO && !videoPreview) {
          toast.error("Please upload a video");
          setIsSubmitting(false);
          return;
        }
      } else if (mediaSourceType === MediaSourceType.URL) {
        if (!mediaUrl) {
          toast.error("Please enter a media URL");
          setIsSubmitting(false);
          return;
        }
      }

      // Add media information
      const mediaData = {
        type: mediaType,
        sourceType: mediaSourceType,
        url: mediaSourceType === MediaSourceType.URL ? mediaUrl : undefined,
        file:
          mediaSourceType === MediaSourceType.FILE
            ? mediaType === MediaType.IMAGE
              ? imagePreview
              : videoPreview
            : undefined,
        altText: formData.title, // Using title as alt text by default
      };

      sliderFormData.append("media", JSON.stringify(mediaData));

      // Add files if using file source type and if a new file was selected
      if (mediaSourceType === MediaSourceType.FILE) {
        if (mediaType === MediaType.IMAGE && imageFile) {
          sliderFormData.append("image", imageFile);
        } else if (mediaType === MediaType.VIDEO && videoFile) {
          sliderFormData.append("video", videoFile);
        }
      }

      await sliderApi.updateSlider(slider._id.toString(), sliderFormData);
      toast.success("Slider updated successfully");
      onSuccess();
    } catch (error) {
      console.error("Error updating slider:", error);
      toast.error("Failed to update slider");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh]">
        <DialogHeader>
          <DialogTitle>Edit Slider</DialogTitle>
          <DialogDescription>
            Update slider content and settings.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit}>
          <Tabs
            value={activeTab}
            onValueChange={setActiveTab}
            className="w-full"
          >
            <TabsList className="grid grid-cols-2 mb-4">
              <TabsTrigger value="general">General</TabsTrigger>
              <TabsTrigger value="media">Media</TabsTrigger>
            </TabsList>

            <ScrollArea className="h-[60vh]">
              <TabsContent value="general" className="space-y-4 p-1">
                <div className="space-y-2">
                  <Label htmlFor="title">Title</Label>
                  <Input
                    id="title"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    placeholder="Enter slider title"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    placeholder="Enter slider description"
                    rows={3}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="buttonText">Button Text</Label>
                  <Input
                    id="buttonText"
                    name="buttonText"
                    value={formData.buttonText}
                    onChange={handleInputChange}
                    placeholder="Enter button text"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="buttonUrl">Button URL</Label>
                  <Input
                    id="buttonUrl"
                    name="buttonUrl"
                    value={formData.buttonUrl}
                    onChange={handleInputChange}
                    placeholder="Enter button URL"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="order">Order</Label>
                  <Input
                    id="order"
                    name="order"
                    type="number"
                    value={formData.order}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        order: Number.parseInt(e.target.value) || 0,
                      })
                    }
                    placeholder="Enter display order"
                  />
                </div>

                <div className="flex items-center space-x-2">
                  <Switch
                    id="isVisible"
                    checked={formData.isVisible}
                    onCheckedChange={handleSwitchChange}
                  />
                  <Label htmlFor="isVisible">Published</Label>
                </div>
              </TabsContent>

              <TabsContent value="media" className="space-y-6 p-1">
                <div className="space-y-4">
                  <Label>Media Type</Label>
                  <RadioGroup
                    value={mediaType}
                    onValueChange={handleMediaTypeChange}
                    className="flex space-x-4"
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem
                        value={MediaType.IMAGE}
                        id="media-image"
                      />
                      <Label htmlFor="media-image">Image</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem
                        value={MediaType.VIDEO}
                        id="media-video"
                      />
                      <Label htmlFor="media-video">Video</Label>
                    </div>
                  </RadioGroup>
                </div>

                <div className="space-y-4">
                  <Label>Media Source</Label>
                  <RadioGroup
                    value={mediaSourceType}
                    onValueChange={handleMediaSourceTypeChange}
                    className="flex space-x-4"
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem
                        value={MediaSourceType.FILE}
                        id="source-file"
                      />
                      <Label htmlFor="source-file">Upload File</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem
                        value={MediaSourceType.URL}
                        id="source-url"
                      />
                      <Label htmlFor="source-url">External URL</Label>
                    </div>
                  </RadioGroup>
                </div>

                {mediaSourceType === MediaSourceType.URL ? (
                  <div className="space-y-2">
                    <Label htmlFor="mediaUrl">Media URL</Label>
                    <div className="flex gap-2 items-center">
                      <Input
                        id="mediaUrl"
                        value={mediaUrl}
                        onChange={handleMediaUrlChange}
                        placeholder={`Enter ${mediaType.toLowerCase()} URL`}
                        className="flex-1"
                      />
                      {mediaUrl && (
                        <Button
                          type="button"
                          size="icon"
                          variant="destructive"
                          onClick={clearUrlMedia}
                          title="Clear URL"
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  </div>
                ) : (
                  <>
                    {mediaType === MediaType.IMAGE && (
                      <div className="space-y-2">
                        <div className="flex justify-between items-center">
                          <Label>Image Upload</Label>
                          {imagePreview && (
                            <Button
                              type="button"
                              size="sm"
                              variant="destructive"
                              onClick={clearImageMedia}
                              className="text-xs"
                            >
                              <X className="h-4 w-4 mr-1" /> Clear Image
                            </Button>
                          )}
                        </div>
                        <ImageUpload
                          value={imagePreview}
                          onChange={handleImageChange}
                          maxSizeMB={5}
                        />
                      </div>
                    )}

                    {mediaType === MediaType.VIDEO && (
                      <div className="space-y-2">
                        <div className="flex justify-between items-center">
                          <Label>Video Upload</Label>
                          {videoPreview && (
                            <Button
                              type="button"
                              size="sm"
                              variant="destructive"
                              onClick={clearVideoMedia}
                              className="text-xs"
                            >
                              <X className="h-4 w-4 mr-1" /> Clear Video
                            </Button>
                          )}
                        </div>
                        <VideoUpload
                          value={videoPreview}
                          onChange={handleVideoChange}
                          maxSizeMB={50}
                        />
                      </div>
                    )}
                  </>
                )}
              </TabsContent>
            </ScrollArea>
          </Tabs>

          <DialogFooter className="mt-6">
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
                  <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                  Updating...
                </>
              ) : (
                "Update Slider"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
