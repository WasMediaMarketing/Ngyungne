"use client";

import { useState } from "react";
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
import { RefreshCw } from "lucide-react";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { MediaType, MediaSourceType } from "@/types/slider.types";

interface AddSliderDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

export function AddSliderDialog({
  open,
  onOpenChange,
  onSuccess,
}: AddSliderDialogProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activeTab, setActiveTab] = useState("general");

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

  const resetForm = () => {
    setFormData({
      title: "",
      description: "",
      buttonText: "",
      buttonUrl: "",
      order: 0,
      isVisible: true,
    });
    setMediaType(MediaType.IMAGE);
    setMediaSourceType(MediaSourceType.FILE);
    setMediaUrl("");
    setImageFile(null);
    setImagePreview(null);
    setVideoFile(null);
    setVideoPreview(null);
    setActiveTab("general");
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSwitchChange = (checked: boolean) => {
    setFormData((prev) => ({ ...prev, isVisible: checked }));
  };

  const handleImageChange = (file: File | null) => {
    setImageFile(file);

    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    } else {
      setImagePreview(null);
    }
  };

  const handleVideoChange = (file: File | null) => {
    setVideoFile(file);

    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setVideoPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    } else {
      setVideoPreview(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate media selection
    if (mediaSourceType === MediaSourceType.FILE) {
      if (mediaType === MediaType.IMAGE && !imageFile) {
        toast.error("Please upload an image");
        return;
      }
      if (mediaType === MediaType.VIDEO && !videoFile) {
        toast.error("Please upload a video");
        return;
      }
    } else if (mediaSourceType === MediaSourceType.URL) {
      if (!mediaUrl) {
        toast.error("Please enter a media URL");
        return;
      }
    }

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

      // Add media information
      const mediaData = {
        type: mediaType,
        sourceType: mediaSourceType,
        url: mediaSourceType === MediaSourceType.URL ? mediaUrl : undefined,
        altText: formData.title, // Using title as alt text by default
      };

      sliderFormData.append("media", JSON.stringify(mediaData));

      // Add files if using file source type
      if (mediaSourceType === MediaSourceType.FILE) {
        if (mediaType === MediaType.IMAGE && imageFile) {
          sliderFormData.append("image", imageFile);
        } else if (mediaType === MediaType.VIDEO && videoFile) {
          sliderFormData.append("video", videoFile);
        }
      }

      await sliderApi.createSlider(sliderFormData);
      toast.success("Slider created successfully");
      resetForm();
      onSuccess();
    } catch (error) {
      console.error("Error creating slider:", error);
      toast.error("Failed to create slider");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="max-w-4xl max-h-[90vh]"
        onInteractOutside={() => onOpenChange(false)}
        onEscapeKeyDown={() => onOpenChange(false)}
      >
        <DialogHeader>
          <DialogTitle>Add New Slider</DialogTitle>
          <DialogDescription>
            Create a new slider for your homepage.
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
                        order: parseInt(e.target.value) || 0,
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
                  <Label htmlFor="isVisible">Publish immediately</Label>
                </div>
              </TabsContent>

              <TabsContent value="media" className="space-y-6 p-1">
                <div className="space-y-4">
                  <Label>Media Type</Label>
                  <RadioGroup
                    value={mediaType}
                    onValueChange={(value) => setMediaType(value as MediaType)}
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
                    onValueChange={(value) =>
                      setMediaSourceType(value as MediaSourceType)
                    }
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
                    <Input
                      id="mediaUrl"
                      value={mediaUrl}
                      onChange={(e) => setMediaUrl(e.target.value)}
                      placeholder={`Enter ${mediaType.toLowerCase()} URL`}
                    />
                  </div>
                ) : (
                  <>
                    {mediaType === MediaType.IMAGE && (
                      <div className="space-y-2">
                        <Label>Image Upload</Label>
                        <ImageUpload
                          value={imagePreview}
                          onChange={handleImageChange}
                          maxSizeMB={5}
                        />
                      </div>
                    )}

                    {mediaType === MediaType.VIDEO && (
                      <div className="space-y-2">
                        <Label>Video Upload</Label>
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
              onClick={() => {
                resetForm();
                onOpenChange(false);
              }}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                  Creating...
                </>
              ) : (
                "Create Slider"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
