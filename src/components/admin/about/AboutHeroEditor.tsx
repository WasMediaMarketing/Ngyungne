"use client";

import { useState, useEffect } from "react";
import { toast } from "sonner";
import { aboutApi } from "@/utils/aboutApi";
import { type IHeroSection } from "@/types/about.types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ImageUpload } from "@/components/admin/shared/image-upload";
import { VideoUpload } from "@/components/admin/shared/video-upload";
import { RefreshCw } from "lucide-react";

interface AboutHeroEditorProps {
  heroData: IHeroSection;
  onUpdate: () => void;
}

export function AboutHeroEditor({ heroData, onUpdate }: AboutHeroEditorProps) {
  const [formData, setFormData] = useState<IHeroSection>({
    title: "",
    description: "",
    imageUrl: "",
    videoUrl: "",
    buttonText: "",
    buttonUrl: "",
  });

  const [activeTab, setActiveTab] = useState("content");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // File state
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [videoPreview, setVideoPreview] = useState<string | null>(null);

  useEffect(() => {
    if (heroData) {
      setFormData(heroData);

      // Set image preview if imageUrl exists
      if (heroData.imageUrl) {
        setImagePreview(heroData.imageUrl);
      }

      // Set video preview if videoUrl exists
      if (heroData.videoUrl) {
        setVideoPreview(heroData.videoUrl);
      }
    }
  }, [heroData]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (file: File | null) => {
    setImageFile(file);

    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
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
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Check if we have files to upload
      if (imageFile || videoFile) {
        // Create FormData for file upload
        const heroFormData = new FormData();

        // Add text fields
        heroFormData.append("title", formData.title);
        heroFormData.append("description", formData.description);
        heroFormData.append("buttonText", formData.buttonText || "");
        heroFormData.append("buttonUrl", formData.buttonUrl || "");

        // Add existing URLs if we're not replacing them
        if (!imageFile && formData.imageUrl) {
          heroFormData.append("imageUrl", formData.imageUrl);
        }

        if (!videoFile && formData.videoUrl) {
          heroFormData.append("videoUrl", formData.videoUrl);
        }

        // Add files if they exist
        if (imageFile) {
          heroFormData.append("image", imageFile);
        }

        if (videoFile) {
          heroFormData.append("video", videoFile);
        }

        await aboutApi.updateHeroSectionWithFiles(heroFormData);
      } else {
        // Regular JSON update without files
        await aboutApi.updateHeroSection(formData);
      }

      toast.success("Hero section updated successfully");
      onUpdate();
    } catch (error) {
      console.error("Error updating hero section:", error);
      toast.error("Failed to update hero section");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Hero Section</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit}>
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="mb-4">
              <TabsTrigger value="content">Content</TabsTrigger>
              <TabsTrigger value="media">Media</TabsTrigger>
              <TabsTrigger value="button">Button</TabsTrigger>
            </TabsList>

            <TabsContent value="content" className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  placeholder="Enter hero title"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  placeholder="Enter hero description"
                  rows={4}
                  required
                />
              </div>
            </TabsContent>

            <TabsContent value="media" className="space-y-6">
              <div className="space-y-4">
                <Label>Hero Image</Label>
                <ImageUpload
                  value={imagePreview}
                  onChange={handleImageChange}
                  maxSizeMB={5}
                />
                <p className="text-sm text-muted-foreground">
                  Recommended size: 1920x1080px. Max size: 5MB.
                </p>
              </div>

              <div className="space-y-4">
                <Label>Background Video (Optional)</Label>
                <VideoUpload
                  value={videoPreview}
                  onChange={handleVideoChange}
                  maxSizeMB={50}
                />
                <p className="text-sm text-muted-foreground">
                  Optional background video. Max size: 50MB.
                </p>
              </div>
            </TabsContent>

            <TabsContent value="button" className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="buttonText">Button Text</Label>
                <Input
                  id="buttonText"
                  name="buttonText"
                  value={formData.buttonText || ""}
                  onChange={handleInputChange}
                  placeholder="Enter button text (optional)"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="buttonUrl">Button URL</Label>
                <Input
                  id="buttonUrl"
                  name="buttonUrl"
                  value={formData.buttonUrl || ""}
                  onChange={handleInputChange}
                  placeholder="Enter button URL (optional)"
                />
              </div>
            </TabsContent>
          </Tabs>

          <div className="mt-6 flex justify-end">
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                  Saving...
                </>
              ) : (
                "Save Changes"
              )}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
