"use client";

import type React from "react";

import { useState } from "react";
import { toast } from "sonner";
import { meditationApi } from "@/utils/meditationApi";
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
import { AudioUpload } from "@/components/admin/shared/audio-upload";
import { RefreshCw, Plus, Minus } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface AddMeditationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

export function AddMeditationDialog({
  open,
  onOpenChange,
  onSuccess,
}: AddMeditationDialogProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activeTab, setActiveTab] = useState("general");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [audioFile, setAudioFile] = useState<File | null>(null);
  const [audioPreview, setAudioPreview] = useState<string | null>(null);
  const [instructorImageFile, setInstructorImageFile] = useState<File | null>(
    null
  );
  const [instructorImagePreview, setInstructorImagePreview] = useState<
    string | null
  >(null);
  const [benefits, setBenefits] = useState<string[]>([""]);
  const [steps, setSteps] = useState<string[]>([""]);
  const [tags, setTags] = useState<string[]>([""]);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    longDescription: "",
    duration: 10,
    category: "",
    difficulty: "Beginner",
    instructor: {
      name: "",
      bio: "",
      image: "",
    },
    isVisible: false,
    sessions: 0,
    favorites: 0,
  });

  const resetForm = () => {
    setFormData({
      title: "",
      description: "",
      longDescription: "",
      duration: 10,
      category: "",
      difficulty: "Beginner",
      instructor: {
        name: "",
        bio: "",
        image: "",
      },
      isVisible: false,
      sessions: 0,
      favorites: 0,
    });
    setBenefits([""]);
    setSteps([""]);
    setTags([""]);
    setImageFile(null);
    setImagePreview(null);
    setAudioFile(null);
    setAudioPreview(null);
    setInstructorImageFile(null);
    setInstructorImagePreview(null);
    setActiveTab("general");
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;

    if (name.startsWith("instructor.")) {
      const instructorField = name.split(".")[1];
      setFormData((prev) => ({
        ...prev,
        instructor: {
          ...prev.instructor,
          [instructorField]: value,
        },
      }));
    } else if (name === "duration") {
      setFormData((prev) => ({ ...prev, [name]: Number.parseInt(value) || 0 }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSwitchChange = (checked: boolean) => {
    setFormData((prev) => ({ ...prev, isVisible: checked }));
  };

  const handleSelectChange = (name: string, value: string) => {
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
    } else {
      setImagePreview(null);
    }
  };

  const handleAudioChange = (file: File | null) => {
    setAudioFile(file);

    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setAudioPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    } else {
      setAudioPreview(null);
    }
  };

  const handleInstructorImageChange = (file: File | null) => {
    setInstructorImageFile(file);

    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setInstructorImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    } else {
      setInstructorImagePreview(null);
    }
  };

  const handleBenefitChange = (index: number, value: string) => {
    const newBenefits = [...benefits];
    newBenefits[index] = value;
    setBenefits(newBenefits);
  };

  const handleAddBenefit = () => {
    setBenefits([...benefits, ""]);
  };

  const handleRemoveBenefit = (index: number) => {
    const newBenefits = benefits.filter((_, i) => i !== index);
    if (newBenefits.length === 0) {
      newBenefits.push("");
    }
    setBenefits(newBenefits);
  };

  const handleStepChange = (index: number, value: string) => {
    const newSteps = [...steps];
    newSteps[index] = value;
    setSteps(newSteps);
  };

  const handleAddStep = () => {
    setSteps([...steps, ""]);
  };

  const handleRemoveStep = (index: number) => {
    const newSteps = steps.filter((_, i) => i !== index);
    if (newSteps.length === 0) {
      newSteps.push("");
    }
    setSteps(newSteps);
  };

  const handleTagChange = (index: number, value: string) => {
    const newTags = [...tags];
    newTags[index] = value;
    setTags(newTags);
  };

  const handleAddTag = () => {
    setTags([...tags, ""]);
  };

  const handleRemoveTag = (index: number) => {
    const newTags = tags.filter((_, i) => i !== index);
    if (newTags.length === 0) {
      newTags.push("");
    }
    setTags(newTags);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.title || !formData.description || !formData.category) {
      toast.error("Please fill in all required fields");
      return;
    }

    setIsSubmitting(true);

    try {
      const meditationFormData = new FormData();

      // Add basic fields
      meditationFormData.append("title", formData.title);
      meditationFormData.append("description", formData.description);
      meditationFormData.append("longDescription", formData.longDescription);
      meditationFormData.append("duration", formData.duration.toString());
      meditationFormData.append("category", formData.category);
      meditationFormData.append("difficulty", formData.difficulty);
      meditationFormData.append("isVisible", formData.isVisible.toString());

      // Add instructor fields
      meditationFormData.append(
        "instructor",
        JSON.stringify({
          name: formData.instructor.name,
          bio: formData.instructor.bio,
        })
      );

      // Add arrays
      meditationFormData.append(
        "benefits",
        JSON.stringify(benefits.filter((b) => b.trim() !== ""))
      );
      meditationFormData.append(
        "steps",
        JSON.stringify(steps.filter((s) => s.trim() !== ""))
      );
      meditationFormData.append(
        "tags",
        JSON.stringify(tags.filter((t) => t.trim() !== ""))
      );

      // Add files
      if (imageFile) {
        meditationFormData.append("image", imageFile);
      }

      if (audioFile) {
        meditationFormData.append("audioFile", audioFile);
      }

      if (instructorImageFile) {
        meditationFormData.append("instructorImage", instructorImageFile);
      }

      await meditationApi.createMeditation(meditationFormData);
      toast.success("Meditation created successfully");
      resetForm();
      onSuccess();
    } catch (error) {
      console.error("Error creating meditation:", error);
      toast.error("Failed to create meditation");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh]">
        <DialogHeader>
          <DialogTitle>Add New Meditation</DialogTitle>
          <DialogDescription>
            Create a new meditation with details and audio.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit}>
          <Tabs
            value={activeTab}
            onValueChange={setActiveTab}
            className="w-full"
          >
            <TabsList className="grid grid-cols-4 mb-4">
              <TabsTrigger value="general">General</TabsTrigger>
              <TabsTrigger value="content">Content</TabsTrigger>
              <TabsTrigger value="instructor">Instructor</TabsTrigger>
              <TabsTrigger value="media">Media</TabsTrigger>
            </TabsList>

            <ScrollArea className="h-[60vh]">
              <TabsContent value="general" className="space-y-4 p-1">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="title">
                      Title <span className="text-destructive">*</span>
                    </Label>
                    <Input
                      id="title"
                      name="title"
                      value={formData.title}
                      onChange={handleInputChange}
                      placeholder="Enter meditation title"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="category">
                      Category <span className="text-destructive">*</span>
                    </Label>
                    <Input
                      id="category"
                      name="category"
                      value={formData.category}
                      onChange={handleInputChange}
                      placeholder="E.g., Morning, Sleep, Focus"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="duration">
                      Duration (minutes){" "}
                      <span className="text-destructive">*</span>
                    </Label>
                    <Input
                      id="duration"
                      name="duration"
                      type="number"
                      value={formData.duration}
                      onChange={handleInputChange}
                      min={1}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="difficulty">
                      Difficulty <span className="text-destructive">*</span>
                    </Label>
                    <Select
                      value={formData.difficulty}
                      onValueChange={(value) =>
                        handleSelectChange("difficulty", value)
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select difficulty" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Beginner">Beginner</SelectItem>
                        <SelectItem value="Intermediate">
                          Intermediate
                        </SelectItem>
                        <SelectItem value="Advanced">Advanced</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">
                    Description <span className="text-destructive">*</span>
                  </Label>
                  <Textarea
                    id="description"
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    placeholder="Brief description of the meditation"
                    rows={3}
                    required
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

              <TabsContent value="content" className="space-y-4 p-1">
                <div className="space-y-2">
                  <Label htmlFor="longDescription">Long Description</Label>
                  <Textarea
                    id="longDescription"
                    name="longDescription"
                    value={formData.longDescription}
                    onChange={handleInputChange}
                    placeholder="Comprehensive description of the meditation"
                    rows={5}
                  />
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <Label>Benefits</Label>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={handleAddBenefit}
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Add Benefit
                    </Button>
                  </div>
                  <div className="space-y-3">
                    {benefits.map((benefit, index) => (
                      <div key={index} className="flex items-center gap-2">
                        <Input
                          value={benefit}
                          onChange={(e) =>
                            handleBenefitChange(index, e.target.value)
                          }
                          placeholder={`Benefit ${index + 1}`}
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          onClick={() => handleRemoveBenefit(index)}
                          disabled={benefits.length === 1}
                          className="shrink-0"
                        >
                          <Minus className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <Label>Steps</Label>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={handleAddStep}
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Add Step
                    </Button>
                  </div>
                  <div className="space-y-3">
                    {steps.map((step, index) => (
                      <div key={index} className="flex items-center gap-2">
                        <Input
                          value={step}
                          onChange={(e) =>
                            handleStepChange(index, e.target.value)
                          }
                          placeholder={`Step ${index + 1}`}
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          onClick={() => handleRemoveStep(index)}
                          disabled={steps.length === 1}
                          className="shrink-0"
                        >
                          <Minus className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <Label>Tags</Label>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={handleAddTag}
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Add Tag
                    </Button>
                  </div>
                  <div className="space-y-3">
                    {tags.map((tag, index) => (
                      <div key={index} className="flex items-center gap-2">
                        <Input
                          value={tag}
                          onChange={(e) =>
                            handleTagChange(index, e.target.value)
                          }
                          placeholder={`Tag ${index + 1}`}
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          onClick={() => handleRemoveTag(index)}
                          disabled={tags.length === 1}
                          className="shrink-0"
                        >
                          <Minus className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="instructor" className="space-y-4 p-1">
                <div className="space-y-2">
                  <Label htmlFor="instructor.name">Instructor Name</Label>
                  <Input
                    id="instructor.name"
                    name="instructor.name"
                    value={formData.instructor.name}
                    onChange={handleInputChange}
                    placeholder="Enter instructor name"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="instructor.bio">Instructor Bio</Label>
                  <Textarea
                    id="instructor.bio"
                    name="instructor.bio"
                    value={formData.instructor.bio}
                    onChange={handleInputChange}
                    placeholder="Brief bio of the instructor"
                    rows={3}
                  />
                </div>

                <div className="space-y-2">
                  <Label>Instructor Image</Label>
                  <ImageUpload
                    value={instructorImagePreview}
                    onChange={handleInstructorImageChange}
                    maxSizeMB={2}
                  />
                </div>
              </TabsContent>

              <TabsContent value="media" className="space-y-4 p-1">
                <div className="space-y-2">
                  <Label>Meditation Image</Label>
                  <ImageUpload
                    value={imagePreview}
                    onChange={handleImageChange}
                    maxSizeMB={5}
                  />
                </div>

                <div className="space-y-2">
                  <Label>Audio File</Label>
                  <AudioUpload
                    value={audioPreview}
                    onChange={handleAudioChange}
                    maxSizeMB={20}
                  />
                </div>
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
                "Create Meditation"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
