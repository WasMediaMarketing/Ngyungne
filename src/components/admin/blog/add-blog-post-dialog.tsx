"use client";

import type React from "react";

import { useState, useRef, useMemo, type FormEvent } from "react";
import { blogApi } from "@/utils/blogApi";
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
import { RefreshCw, Upload, X } from "lucide-react";
import Image from "next/image";
import type { IAuthor } from "@/types";
import dynamic from "next/dynamic";

// Dynamically import JoditEditor to avoid SSR issues
const JoditEditor = dynamic(() => import("jodit-react"), {
  ssr: false,
  loading: () => <p>Loading editor...</p>,
});

interface AddBlogPostDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

export function AddBlogPostDialog({
  open,
  onOpenChange,
  onSuccess,
}: AddBlogPostDialogProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [authorImagePreview, setAuthorImagePreview] = useState<string | null>(
    null
  );
  const [content, setContent] = useState("");
  const formRef = useRef<HTMLFormElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const authorFileInputRef = useRef<HTMLInputElement>(null);
  const contentEditorRef = useRef(null);

  // Editor configuration
  const editorConfig = useMemo(
    () => ({
      readonly: false,
      placeholder: "Start typing content...",
      height: 400,
      buttons: [
        "source",
        "|",
        "bold",
        "italic",
        "underline",
        "strikethrough",
        "|",
        "ul",
        "ol",
        "|",
        "font",
        "fontsize",
        "brush",
        "paragraph",
        "|",
        "image",
        "table",
        "link",
        "|",
        "align",
        "|",
        "undo",
        "redo",
        "|",
        "hr",
        "eraser",
        "fullsize",
      ],
    }),
    []
  );

  // Keep the preview functionality using FileReader, but don't convert the actual file upload
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
      // Don't modify the file itself - it will be sent as is
    } else {
      setImagePreview(null);
    }
  };

  // Similarly for handleAuthorImageChange
  const handleAuthorImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setAuthorImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
      // Don't modify the file itself - it will be sent as is
    } else {
      setAuthorImagePreview(null);
    }
  };

  const clearImage = () => {
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
    setImagePreview(null);
  };

  const clearAuthorImage = () => {
    if (authorFileInputRef.current) {
      authorFileInputRef.current.value = "";
    }
    setAuthorImagePreview(null);
  };

  // In the handleSubmit function, simplify the form data handling
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const formData = new FormData(e.currentTarget);

      // Add the content from JoditEditor
      formData.set("content", content);

      // Handle tags and categories as arrays
      const tagsString = formData.get("tags") as string;
      const categoriesString = formData.get("categories") as string;
      const metaKeywordsString = formData.get("metaKeywords") as string;

      // Remove original string values
      formData.delete("tags");
      formData.delete("categories");
      formData.delete("metaKeywords");

      // Add as JSON strings
      formData.append(
        "tags",
        JSON.stringify(tagsString.split(",").map((tag) => tag.trim()))
      );
      formData.append(
        "categories",
        JSON.stringify(
          categoriesString.split(",").map((category) => category.trim())
        )
      );
      formData.append(
        "metaKeywords",
        JSON.stringify(
          metaKeywordsString.split(",").map((keyword) => keyword.trim())
        )
      );

      // Handle author as an object
      const author: IAuthor = {
        name: formData.get("authorName") as string,
        bio: formData.get("authorBio") as string,
        image: "", // This will be updated by the server when the authorImage is processed
      };

      // Remove original author fields
      formData.delete("authorName");
      formData.delete("authorBio");

      // Add author as JSON string
      formData.append("author", JSON.stringify(author));

      // Handle isVisible properly - convert "on" to true
      const isVisibleValue = formData.get("isVisible");
      formData.delete("isVisible");
      formData.append("isVisible", isVisibleValue === "on" ? "true" : "false");

      // Add current date if not provided
      if (!formData.get("date")) {
        formData.append("date", new Date().toISOString());
      }

      await blogApi.createBlogPost(formData);
      onSuccess();
      formRef.current?.reset();
      setContent("");
      setImagePreview(null);
      setAuthorImagePreview(null);
    } catch (error) {
      console.error("Error creating blog post:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Add New Blog Post</DialogTitle>
          <DialogDescription>
            Create a new blog post to publish on your website.
          </DialogDescription>
        </DialogHeader>

        <form ref={formRef} onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title">Title *</Label>
              <Input
                id="title"
                name="title"
                placeholder="Enter blog post title"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                name="description"
                placeholder="Enter a short description"
                rows={3}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="content">Content *</Label>
              {typeof window !== "undefined" && (
                <JoditEditor
                  ref={contentEditorRef}
                  config={editorConfig}
                  value={content}
                  onChange={(newContent) => setContent(newContent)}
                />
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Left Column */}
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="date">Publish Date</Label>
                    <Input
                      id="date"
                      name="date"
                      type="date"
                      defaultValue={new Date().toISOString().split("T")[0]}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="readTime">Read Time</Label>
                    <Input
                      id="readTime"
                      name="readTime"
                      placeholder="e.g. 5 min read"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="tags">Tags</Label>
                  <Input
                    id="tags"
                    name="tags"
                    placeholder="Enter tags separated by commas"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="categories">Categories</Label>
                  <Input
                    id="categories"
                    name="categories"
                    placeholder="Enter categories separated by commas"
                  />
                </div>

                <div className="flex items-center space-x-2 pt-4">
                  <Switch id="isVisible" name="isVisible" defaultChecked />
                  <Label htmlFor="isVisible">Publish immediately</Label>
                </div>

                {/* SEO Meta Information */}
                <div className="space-y-4 border rounded-md p-4 mt-4">
                  <h3 className="font-medium">SEO Information</h3>
                  <div className="space-y-2">
                    <Label htmlFor="metaTitle">Meta Title</Label>
                    <Input
                      id="metaTitle"
                      name="metaTitle"
                      placeholder="Enter SEO title (optional)"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="metaDescription">Meta Description</Label>
                    <Textarea
                      id="metaDescription"
                      name="metaDescription"
                      placeholder="Enter SEO description (optional)"
                      rows={2}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="metaKeywords">Meta Keywords</Label>
                    <Input
                      id="metaKeywords"
                      name="metaKeywords"
                      placeholder="Enter keywords separated by commas (optional)"
                    />
                  </div>
                </div>
              </div>

              {/* Right Column */}
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Featured Image *</Label>
                  <div className="border-2 border-dashed rounded-md p-4 text-center">
                    {imagePreview ? (
                      <div className="relative">
                        <Image
                          src={imagePreview || "/placeholder.svg"}
                          alt="Preview"
                          width={300}
                          height={200}
                          className="mx-auto object-cover rounded-md"
                          style={{ maxHeight: "200px", width: "auto" }}
                        />
                        <Button
                          type="button"
                          variant="destructive"
                          size="icon"
                          className="absolute top-2 right-2 h-6 w-6"
                          onClick={clearImage}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    ) : (
                      <div className="py-4">
                        <Upload className="mx-auto h-12 w-12 text-muted-foreground" />
                        <p className="mt-2 text-sm text-muted-foreground">
                          Click to upload or drag and drop
                        </p>
                      </div>
                    )}
                    <Input
                      ref={fileInputRef}
                      id="image"
                      name="image"
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handleImageChange}
                      required
                    />
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => fileInputRef.current?.click()}
                      className="mt-2"
                    >
                      Select Image
                    </Button>
                  </div>
                </div>

                <div className="space-y-4 border rounded-md p-4">
                  <h3 className="font-medium">Author Information</h3>
                  <div className="space-y-2">
                    <Label htmlFor="authorName">Author Name *</Label>
                    <Input
                      id="authorName"
                      name="authorName"
                      placeholder="Enter author name"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Author Image *</Label>
                    <div className="border-2 border-dashed rounded-md p-4 text-center">
                      {authorImagePreview ? (
                        <div className="relative">
                          <Image
                            src={authorImagePreview || "/placeholder.svg"}
                            alt="Author Preview"
                            width={100}
                            height={100}
                            className="mx-auto object-cover rounded-full"
                            style={{ height: "100px", width: "100px" }}
                          />
                          <Button
                            type="button"
                            variant="destructive"
                            size="icon"
                            className="absolute top-2 right-2 h-6 w-6"
                            onClick={clearAuthorImage}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      ) : (
                        <div className="py-4">
                          <Upload className="mx-auto h-12 w-12 text-muted-foreground" />
                          <p className="mt-2 text-sm text-muted-foreground">
                            Click to upload or drag and drop
                          </p>
                        </div>
                      )}
                      <Input
                        ref={authorFileInputRef}
                        id="authorImage"
                        name="authorImage"
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={handleAuthorImageChange}
                        required
                      />
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => authorFileInputRef.current?.click()}
                        className="mt-2"
                      >
                        Select Author Image
                      </Button>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="authorBio">Author Bio *</Label>
                    <Textarea
                      id="authorBio"
                      name="authorBio"
                      placeholder="Enter author bio"
                      rows={3}
                      required
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

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
                  Creating...
                </>
              ) : (
                "Create Blog Post"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
