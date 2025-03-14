"use client";

import { useState, useEffect, useRef } from "react";
import type React from "react";
import Image from "next/image";

import { causeApi, type CauseUI } from "@/utils/causeApi";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { RefreshCw, Plus, X, Tag, Upload } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { DatePicker } from "@/components/ui/date-picker";
import TextEditor from "@/components/common/TextEditor";

interface CauseFormProps {
  cause?: CauseUI;
  onSuccess: () => void;
  onCancel: () => void;
}

export default function CauseForm({
  cause,
  onSuccess,
  onCancel,
}: CauseFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activeTab, setActiveTab] = useState("basic");
  const [tagInput, setTagInput] = useState("");
  const [objectiveInput, setObjectiveInput] = useState("");
  const [faqItems, setFaqItems] = useState<
    { question: string; answer: string }[]
  >([]);

  // Image handling
  const mainImageInputRef = useRef<HTMLInputElement>(null);
  const galleryImagesInputRef = useRef<HTMLInputElement>(null);
  const [mainImage, setMainImage] = useState<File | null>(null);
  const [mainImagePreview, setMainImagePreview] = useState<string | null>(null);
  const [galleryImages, setGalleryImages] = useState<File[]>([]);
  const [galleryPreviews, setGalleryPreviews] = useState<string[]>([]);

  // Form state
  const [formData, setFormData] = useState({
    title: "",
    subtitle: "",
    location: "",
    goal: 0,
    startDate: new Date(),
    endDate: new Date(new Date().setMonth(new Date().getMonth() + 1)),
    tags: [] as string[],
    isVisible: true,
    about: {
      longDescription: "",
      objectives: [] as string[],
    },
    impact: "",
    updates: "",
  });

  // Initialize form with existing cause data if editing
  useEffect(() => {
    if (cause) {
      setFormData({
        title: cause.title,
        subtitle: cause.subtitle,
        location: cause.location,
        goal: cause.goal,
        startDate: new Date(cause.startDate),
        endDate: new Date(cause.endDate),
        tags: cause.tags,
        isVisible: cause.isVisible,
        about: {
          longDescription: cause.about.longDescription,
          objectives: cause.about.objectives,
        },
        impact: cause.impact,
        updates: cause.updates,
      });
      setMainImagePreview(cause.image);
      setGalleryPreviews(cause.gallery);
      setFaqItems(cause.faq);
    }
  }, [cause]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;

    if (name === "longDescription") {
      setFormData((prev) => ({
        ...prev,
        about: {
          ...prev.about,
          longDescription: value,
        },
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: name === "goal" ? Number(value) : value,
      }));
    }
  };

  const handleSwitchChange = (checked: boolean) => {
    setFormData((prev) => ({
      ...prev,
      isVisible: checked,
    }));
  };

  const handleImpactChange = (content: string) => {
    setFormData((prev) => ({
      ...prev,
      impact: content,
    }));
  };

  const handleUpdatesChange = (content: string) => {
    setFormData((prev) => ({
      ...prev,
      updates: content,
    }));
  };

  const handleStartDateChange = (date: Date | undefined) => {
    if (date) {
      setFormData((prev) => ({
        ...prev,
        startDate: date,
      }));
    }
  };

  const handleEndDateChange = (date: Date | undefined) => {
    if (date) {
      setFormData((prev) => ({
        ...prev,
        endDate: date,
      }));
    }
  };

  // Image handling functions
  const handleMainImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setMainImage(file);
      const reader = new FileReader();
      reader.onload = () => {
        setMainImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleGalleryImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      const newFiles = Array.from(files);
      setGalleryImages((prev) => [...prev, ...newFiles]);

      // Create previews for all new files
      Array.from(files).forEach((file) => {
        const reader = new FileReader();
        reader.onload = () => {
          setGalleryPreviews((prev) => [...prev, reader.result as string]);
        };
        reader.readAsDataURL(file);
      });
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleMainImageDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();

    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      const file = files[0]; // Only take the first file for main image
      if (file.type.startsWith("image/")) {
        setMainImage(file);
        const reader = new FileReader();
        reader.onload = () => {
          setMainImagePreview(reader.result as string);
        };
        reader.readAsDataURL(file);
      }
    }
  };

  const handleGalleryImageDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();

    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      const imageFiles = Array.from(files).filter((file) =>
        file.type.startsWith("image/")
      );
      if (imageFiles.length > 0) {
        setGalleryImages((prev) => [...prev, ...imageFiles]);

        // Create previews for all new files
        imageFiles.forEach((file) => {
          const reader = new FileReader();
          reader.onload = () => {
            setGalleryPreviews((prev) => [...prev, reader.result as string]);
          };
          reader.readAsDataURL(file);
        });
      }
    }
  };

  const handleRemoveMainImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setMainImage(null);
    setMainImagePreview(null);
    if (mainImageInputRef.current) {
      mainImageInputRef.current.value = "";
    }
  };

  const handleRemoveGalleryImage = (index: number, e: React.MouseEvent) => {
    e.stopPropagation();
    setGalleryPreviews((prev) => prev.filter((_, i) => i !== index));
    setGalleryImages((prev) => prev.filter((_, i) => i !== index));
  };

  const handleAddTag = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && tagInput.trim()) {
      e.preventDefault();
      if (!formData.tags.includes(tagInput.trim())) {
        setFormData((prev) => ({
          ...prev,
          tags: [...prev.tags, tagInput.trim()],
        }));
      }
      setTagInput("");
    }
  };

  const handleRemoveTag = (tag: string) => {
    setFormData((prev) => ({
      ...prev,
      tags: prev.tags.filter((t) => t !== tag),
    }));
  };

  const handleAddObjective = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && objectiveInput.trim()) {
      e.preventDefault();
      if (!formData.about.objectives.includes(objectiveInput.trim())) {
        setFormData((prev) => ({
          ...prev,
          about: {
            ...prev.about,
            objectives: [...prev.about.objectives, objectiveInput.trim()],
          },
        }));
      }
      setObjectiveInput("");
    }
  };

  const handleRemoveObjective = (objective: string) => {
    setFormData((prev) => ({
      ...prev,
      about: {
        ...prev.about,
        objectives: prev.about.objectives.filter((o) => o !== objective),
      },
    }));
  };

  const handleAddFaqItem = () => {
    setFaqItems((prev) => [...prev, { question: "", answer: "" }]);
  };

  const handleRemoveFaqItem = (index: number) => {
    setFaqItems((prev) => prev.filter((_, i) => i !== index));
  };

  const handleFaqChange = (
    index: number,
    field: "question" | "answer",
    value: string
  ) => {
    setFaqItems((prev) =>
      prev.map((item, i) => (i === index ? { ...item, [field]: value } : item))
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const formDataObj = new FormData();

      // Add basic fields
      formDataObj.append("title", formData.title);
      formDataObj.append("subtitle", formData.subtitle);
      formDataObj.append("location", formData.location);
      formDataObj.append("goal", formData.goal.toString());
      formDataObj.append("startDate", formData.startDate.toISOString());
      formDataObj.append("endDate", formData.endDate.toISOString());
      formDataObj.append("isVisible", formData.isVisible.toString());

      // Add tags
      formDataObj.append("tags", JSON.stringify(formData.tags));

      // Add about section
      formDataObj.append("about", JSON.stringify(formData.about));

      // Add impact and updates
      formDataObj.append("impact", formData.impact);
      formDataObj.append("updates", formData.updates);

      // Add FAQ
      formDataObj.append("faq", JSON.stringify(faqItems));

      // Add main image if there's a new one
      if (mainImage) {
        formDataObj.append("image", mainImage);
      }

      // Add gallery images if there are new ones
      galleryImages.forEach((file) => {
        formDataObj.append("gallery", file);
      });

      let success;
      if (cause) {
        // Update existing cause
        success = await causeApi.updateCause(cause.id, formDataObj);
      } else {
        // Create new cause
        success = await causeApi.createCause(formDataObj);
      }

      if (success) {
        onSuccess();
      }
    } catch (error) {
      console.error("Error submitting cause:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid grid-cols-5 w-full">
          <TabsTrigger value="basic">Basic Info</TabsTrigger>
          <TabsTrigger value="about">About</TabsTrigger>
          <TabsTrigger value="impact">Impact</TabsTrigger>
          <TabsTrigger value="updates">Updates</TabsTrigger>
          <TabsTrigger value="faq">FAQ</TabsTrigger>
        </TabsList>

        {/* Basic Info Tab */}
        <TabsContent value="basic" className="space-y-4 py-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="title">Title *</Label>
              <Input
                id="title"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                placeholder="Enter cause title"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="subtitle">Subtitle</Label>
              <Input
                id="subtitle"
                name="subtitle"
                value={formData.subtitle}
                onChange={handleInputChange}
                placeholder="Enter a brief subtitle"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="location">Location *</Label>
              <Input
                id="location"
                name="location"
                value={formData.location}
                onChange={handleInputChange}
                placeholder="Enter location"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="goal">Fundraising Goal (USD) *</Label>
              <Input
                id="goal"
                name="goal"
                type="number"
                min="1"
                value={formData.goal}
                onChange={handleInputChange}
                placeholder="Enter goal amount"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="startDate">Start Date *</Label>
              <DatePicker
                date={formData.startDate}
                onSelect={handleStartDateChange}
                placeholder="Select start date"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="endDate">End Date *</Label>
              <DatePicker
                date={formData.endDate}
                onSelect={handleEndDateChange}
                placeholder="Select end date"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="tags">Tags</Label>
            <div className="flex items-center">
              <div className="relative flex-1">
                <Tag className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  id="tags"
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyDown={handleAddTag}
                  placeholder="Add tags and press Enter"
                  className="pl-10"
                />
              </div>
            </div>
            <div className="flex flex-wrap gap-2 mt-2">
              {formData.tags.map((tag, index) => (
                <Badge
                  key={index}
                  variant="secondary"
                  className="flex items-center gap-1"
                >
                  {tag}
                  <X
                    className="h-3 w-3 cursor-pointer"
                    onClick={() => handleRemoveTag(tag)}
                  />
                </Badge>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="main-image">Main Image *</Label>
            <div
              className="border-2 border-dashed rounded-md p-4 hover:border-primary/50 transition-colors cursor-pointer"
              onClick={() => mainImageInputRef.current?.click()}
              onDrop={handleMainImageDrop}
              onDragOver={handleDragOver}
            >
              <input
                type="file"
                ref={mainImageInputRef}
                onChange={handleMainImageChange}
                accept="image/*"
                className="hidden"
              />

              {mainImagePreview ? (
                <div className="relative">
                  <div className="relative h-40 w-full mx-auto rounded-md overflow-hidden">
                    <Image
                      src={mainImagePreview || "/placeholder.svg"}
                      alt="Main image preview"
                      fill
                      className="object-cover"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={handleRemoveMainImage}
                    className="absolute top-2 right-2 bg-destructive text-destructive-foreground rounded-full p-1"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              ) : (
                <div className="text-center">
                  <Upload className="h-10 w-10 mx-auto text-muted-foreground" />
                  <p className="mt-2 text-sm text-muted-foreground">
                    Click to upload or drag and drop
                  </p>
                  <p className="text-xs text-muted-foreground">
                    PNG, JPG, JPEG up to 2MB
                  </p>
                </div>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="gallery-images">Gallery Images</Label>
            <div
              className="border-2 border-dashed rounded-md p-4 hover:border-primary/50 transition-colors cursor-pointer"
              onClick={() => galleryImagesInputRef.current?.click()}
              onDrop={handleGalleryImageDrop}
              onDragOver={handleDragOver}
            >
              <input
                type="file"
                ref={galleryImagesInputRef}
                onChange={handleGalleryImageChange}
                accept="image/*"
                multiple
                className="hidden"
              />

              <div className="text-center mb-4">
                <Upload className="h-10 w-10 mx-auto text-muted-foreground" />
                <p className="mt-2 text-sm text-muted-foreground">
                  Click to upload or drag and drop
                </p>
                <p className="text-xs text-muted-foreground">
                  PNG, JPG, JPEG up to 2MB each
                </p>
              </div>

              {galleryPreviews.length > 0 && (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 mt-4">
                  {galleryPreviews.map((preview, index) => (
                    <div
                      key={index}
                      className="relative aspect-square rounded-md overflow-hidden border group"
                    >
                      <Image
                        src={preview || "/placeholder.svg"}
                        alt={`Gallery preview ${index + 1}`}
                        fill
                        className="object-cover"
                      />
                      <button
                        type="button"
                        onClick={(e) => handleRemoveGalleryImage(index, e)}
                        className="absolute top-1 right-1 bg-destructive text-destructive-foreground rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <Switch
              id="isVisible"
              checked={formData.isVisible}
              onCheckedChange={handleSwitchChange}
            />
            <Label htmlFor="isVisible">
              Make this cause visible on the website
            </Label>
          </div>
        </TabsContent>

        {/* About Tab */}
        <TabsContent value="about" className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="longDescription">Long Description *</Label>
            <Textarea
              id="longDescription"
              name="longDescription"
              value={formData.about.longDescription}
              onChange={handleInputChange}
              placeholder="Enter a detailed description of the cause"
              rows={10}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="objectives">Objectives</Label>
            <div className="flex items-center">
              <Input
                id="objectives"
                value={objectiveInput}
                onChange={(e) => setObjectiveInput(e.target.value)}
                onKeyDown={handleAddObjective}
                placeholder="Add objectives and press Enter"
              />
            </div>
            <div className="space-y-2 mt-2">
              {formData.about.objectives.map((objective, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-2 bg-muted rounded-md"
                >
                  <span>{objective}</span>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => handleRemoveObjective(objective)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          </div>
        </TabsContent>

        {/* Impact Tab */}
        <TabsContent value="impact" className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="impact">Impact Description *</Label>
            <TextEditor
              value={formData.impact}
              onChange={handleImpactChange}
              height={500}
            />
            <p className="text-xs text-muted-foreground">
              Describe the impact this cause will have. You can add images and
              videos to enhance your description.
            </p>
          </div>
        </TabsContent>

        {/* Updates Tab */}
        <TabsContent value="updates" className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="updates">Updates</Label>
            <TextEditor
              value={formData.updates}
              onChange={handleUpdatesChange}
              height={500}
            />
            <p className="text-xs text-muted-foreground">
              Provide updates about the cause's progress. You can add images and
              videos to enhance your updates.
            </p>
          </div>
        </TabsContent>

        {/* FAQ Tab */}
        <TabsContent value="faq" className="space-y-4 py-4">
          <div className="flex justify-between items-center">
            <Label>Frequently Asked Questions</Label>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleAddFaqItem}
            >
              <Plus className="h-4 w-4 mr-2" />
              Add FAQ Item
            </Button>
          </div>

          <div className="space-y-4">
            {faqItems.map((item, index) => (
              <div
                key={index}
                className="space-y-2 p-4 border rounded-md relative"
              >
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute top-2 right-2"
                  onClick={() => handleRemoveFaqItem(index)}
                >
                  <X className="h-4 w-4" />
                </Button>
                <div className="space-y-2">
                  <Label htmlFor={`faq-question-${index}`}>Question</Label>
                  <Input
                    id={`faq-question-${index}`}
                    value={item.question}
                    onChange={(e) =>
                      handleFaqChange(index, "question", e.target.value)
                    }
                    placeholder="Enter question"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor={`faq-answer-${index}`}>Answer</Label>
                  <Textarea
                    id={`faq-answer-${index}`}
                    value={item.answer}
                    onChange={(e) =>
                      handleFaqChange(index, "answer", e.target.value)
                    }
                    placeholder="Enter answer"
                    rows={3}
                  />
                </div>
              </div>
            ))}
            {faqItems.length === 0 && (
              <div className="text-center py-8 text-muted-foreground">
                No FAQ items added yet. Click the button above to add one.
              </div>
            )}
          </div>
        </TabsContent>
      </Tabs>

      <div className="flex justify-end gap-2 pt-4">
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          disabled={isSubmitting}
        >
          Cancel
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? (
            <>
              <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
              {cause ? "Updating..." : "Creating..."}
            </>
          ) : (
            <>{cause ? "Update Cause" : "Create Cause"}</>
          )}
        </Button>
      </div>
    </form>
  );
}
