"use client";

import type React from "react";

import { useState, useEffect } from "react";
import { toast } from "sonner";
import { createScriptureApi } from "@/utils/scriptureApi";
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
import { VerseEditor } from "@/components/admin/scripture/verse-editor";
import { RefreshCw, Plus } from "lucide-react";
import type {
  IScripture,
  IScriptureUpdate,
  IVerse,
} from "@/types/scripture.types";

const scriptureApi = createScriptureApi();

interface EditScriptureDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  scripture: IScripture | null;
  onSuccess: () => void;
}

export function EditScriptureDialog({
  open,
  onOpenChange,
  scripture,
  onSuccess,
}: EditScriptureDialogProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activeTab, setActiveTab] = useState("general");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [verses, setVerses] = useState<IVerse[]>([]);
  const [formData, setFormData] = useState<Omit<IScriptureUpdate, "verses">>({
    title: "",
    tradition: "",
    period: "",
    language: "",
    description: "",
    overview: "",
    significance: "",
    historicalContext: "",
    isVisible: false,
  });

  useEffect(() => {
    if (scripture) {
      setFormData({
        title: scripture.title || "",
        tradition: scripture.tradition || "",
        period: scripture.period || "",
        language: scripture.language || "",
        description: scripture.description || "",
        overview: scripture.overview || "",
        significance: scripture.significance || "",
        historicalContext: scripture.historicalContext || "",
        isVisible: scripture.isVisible || false,
      });

      setVerses(scripture.verses || []);

      if (scripture.image) {
        setImagePreview(scripture.image);
      } else {
        setImagePreview(null);
      }
    }
  }, [scripture]);

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
    } else if (scripture?.image) {
      setImagePreview(scripture.image);
    } else {
      setImagePreview(null);
    }
  };

  const handleAddVerse = () => {
    const lastVerse = verses[verses.length - 1];
    const newNumber = lastVerse
      ? typeof lastVerse.number === "number"
        ? lastVerse.number + 1
        : Number.parseInt(String(lastVerse.number), 10) + 1
      : 1;
    const newChapter = lastVerse ? lastVerse.chapter : "1";

    setVerses([
      ...verses,
      { number: newNumber, chapter: newChapter, text: "", commentary: "" },
    ]);
  };

  const handleRemoveVerse = (index: number) => {
    setVerses(verses.filter((_, i) => i !== index));
  };

  const handleVerseChange = (
    index: number,
    field: keyof IVerse,
    value: string | number
  ) => {
    setVerses((prev) => {
      const updated = [...prev];
      if (field === "number") {
        // Ensure number is stored as a number type
        updated[index] = {
          ...updated[index],
          [field]:
            typeof value === "string" ? Number.parseInt(value, 10) || 1 : value,
        };
      } else {
        updated[index] = { ...updated[index], [field]: value };
      }
      return updated;
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!scripture) return;

    if (
      !formData.title ||
      !formData.tradition ||
      !formData.language ||
      !formData.period
    ) {
      toast.error("Please fill in all required fields");
      return;
    }

    if (!verses.length || !verses[0].text) {
      toast.error("Please add at least one verse with text");
      return;
    }

    setIsSubmitting(true);

    try {
      const scriptureData: IScriptureUpdate = {
        ...formData,
        verses,
      };

      await scriptureApi.updateScripture(
        scripture._id,
        scriptureData,
        imageFile || undefined
      );
      toast.success("Scripture updated successfully");
      onSuccess();
    } catch (error) {
      console.error("Error updating scripture:", error);
      toast.error("Failed to update scripture");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh]">
        <DialogHeader>
          <DialogTitle>Edit Scripture</DialogTitle>
          <DialogDescription>
            Update scripture details and verses.
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
              <TabsTrigger value="verses">Verses</TabsTrigger>
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
                      placeholder="Enter scripture title"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="tradition">
                      Tradition <span className="text-destructive">*</span>
                    </Label>
                    <Input
                      id="tradition"
                      name="tradition"
                      value={formData.tradition}
                      onChange={handleInputChange}
                      placeholder="E.g., Buddhism, Christianity, Islam"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="period">
                      Period <span className="text-destructive">*</span>
                    </Label>
                    <Input
                      id="period"
                      name="period"
                      value={formData.period}
                      onChange={handleInputChange}
                      placeholder="E.g., Ancient, Medieval, Modern"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="language">
                      Language <span className="text-destructive">*</span>
                    </Label>
                    <Input
                      id="language"
                      name="language"
                      value={formData.language}
                      onChange={handleInputChange}
                      placeholder="Original language of the scripture"
                      required
                    />
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
                    placeholder="Brief description of the scripture"
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
                  <Label htmlFor="isVisible">Published</Label>
                </div>
              </TabsContent>

              <TabsContent value="content" className="space-y-4 p-1">
                <div className="space-y-2">
                  <Label htmlFor="overview">
                    Overview <span className="text-destructive">*</span>
                  </Label>
                  <Textarea
                    id="overview"
                    name="overview"
                    value={formData.overview}
                    onChange={handleInputChange}
                    placeholder="Comprehensive overview of the scripture"
                    rows={5}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="significance">Significance</Label>
                  <Textarea
                    id="significance"
                    name="significance"
                    value={formData.significance || ""}
                    onChange={handleInputChange}
                    placeholder="Religious or cultural significance of the scripture"
                    rows={4}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="historicalContext">Historical Context</Label>
                  <Textarea
                    id="historicalContext"
                    name="historicalContext"
                    value={formData.historicalContext || ""}
                    onChange={handleInputChange}
                    placeholder="Historical context of the scripture"
                    rows={4}
                  />
                </div>
              </TabsContent>

              <TabsContent value="verses" className="space-y-4 p-1">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-medium">Scripture Verses</h3>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={handleAddVerse}
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add Verse
                  </Button>
                </div>

                <div className="space-y-6">
                  {verses.map((verse, index) => (
                    <VerseEditor
                      key={index}
                      verse={verse}
                      onChange={(field, value) =>
                        handleVerseChange(index, field, value)
                      }
                      onRemove={() => handleRemoveVerse(index)}
                      showRemove={verses.length > 1}
                    />
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="media" className="space-y-4 p-1">
                <div className="space-y-2">
                  <Label>Scripture Image</Label>
                  <ImageUpload
                    value={imagePreview}
                    onChange={handleImageChange}
                    maxSizeMB={5}
                  />
                </div>
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
                "Update Scripture"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
