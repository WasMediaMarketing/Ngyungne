"use client";

import type React from "react";

import { useState, useRef, useMemo, type FormEvent, useEffect } from "react";
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
import type { IBlogPost, IAuthor } from "@/types";
import dynamic from "next/dynamic";

// Dynamically import JoditEditor to avoid SSR issues
const JoditEditor = dynamic(() => import("jodit-react"), {
  ssr: false,
  loading: () => <p>Loading editor...</p>,
});

interface EditBlogPostDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  blogPost: IBlogPost | null;
  onSuccess: () => void;
}

export function EditBlogPostDialog({
  open,
  onOpenChange,
  blogPost,
  onSuccess,
}: EditBlogPostDialogProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [authorImagePreview, setAuthorImagePreview] = useState<string | null>(
    null
  );
  const [imageChanged, setImageChanged] = useState(false);
  const [authorImageChanged, setAuthorImageChanged] = useState(false);
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

  useEffect(() => {
    if (blogPost) {
      if (blogPost.image) {
        setImagePreview(blogPost.image);
        setImageChanged(false);
      } else {
        setImagePreview(null);
      }

      if (blogPost.author?.image) {
        setAuthorImagePreview(blogPost.author.image);
        setAuthorImageChanged(false);
      } else {
        setAuthorImagePreview(null);
      }

      // Set content for the editor
      setContent(blogPost.content || "");
    }
  }, [blogPost]);

  // Keep the preview functionality using FileReader, but don't convert the actual file upload
  // Only modify the handleImageChange and handleAuthorImageChange functions to separate preview from file handling

  // In the handleImageChange function, keep the preview but don't modify the file
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
        setImageChanged(true);
      };
      reader.readAsDataURL(file);
      // Don't modify the file itself - it will be sent as is
    } else {
      setImagePreview(blogPost?.image || null);
      setImageChanged(false);
    }
  };

  // Similarly for handleAuthorImageChange
  const handleAuthorImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setAuthorImagePreview(reader.result as string);
        setAuthorImageChanged(true);
      };
      reader.readAsDataURL(file);
      // Don't modify the file itself - it will be sent as is
    } else {
      setAuthorImagePreview(blogPost?.author?.image || null);
      setAuthorImageChanged(false);
    }
  };

  const clearImage = () => {
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
    setImagePreview(null);
    setImageChanged(true);
  };

  const clearAuthorImage = () => {
    if (authorFileInputRef.current) {
      authorFileInputRef.current.value = "";
    }
    setAuthorImagePreview(null);
    setAuthorImageChanged(true);
  };

  // In the handleSubmit function, simplify the form data handling
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!blogPost) return;

    setIsSubmitting(true);

    try {
      const formData = new FormData(e.currentTarget);

      // Add the content from JoditEditor
      formData.set("content", content);

      // Handle tags and categories as arrays
      const tagsString = formData.get("tags") as string;
      const categoriesString = formData.get("categories") as string;

      // Remove original string values
      formData.delete("tags");
      formData.delete("categories");

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

      // Handle author as an object
      const author: IAuthor = {
        name: formData.get("authorName") as string,
        bio: formData.get("authorBio") as string,
        image: authorImageChanged
          ? (formData.get("authorImage") as string)
          : blogPost.author?.image || "",
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

      // If image wasn't changed, don't send it
      if (!imageChanged && fileInputRef.current) {
        formData.delete("image");
      }

      // If author image wasn't changed, don't send it
      if (!authorImageChanged && authorFileInputRef.current) {
        formData.delete("authorImage");
      }

      await blogApi.updateBlogPost(blogPost.id.toString(), formData);
      onSuccess();
    } catch (error) {
      console.error("Error updating blog post:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!blogPost) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Blog Post</DialogTitle>
          <DialogDescription>
            Update the details of your blog post.
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
                defaultValue={blogPost.title}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                name="description"
                placeholder="Enter a short description"
                defaultValue={blogPost.description || ""}
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
                      defaultValue={
                        blogPost.date
                          ? new Date(blogPost.date).toISOString().split("T")[0]
                          : new Date().toISOString().split("T")[0]
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="readTime">Read Time</Label>
                    <Input
                      id="readTime"
                      name="readTime"
                      placeholder="e.g. 5 min read"
                      defaultValue={blogPost.readTime || ""}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="tags">Tags</Label>
                  <Input
                    id="tags"
                    name="tags"
                    placeholder="Enter tags separated by commas"
                    defaultValue={blogPost.tags?.join(", ") || ""}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="categories">Categories</Label>
                  <Input
                    id="categories"
                    name="categories"
                    placeholder="Enter categories separated by commas"
                    defaultValue={blogPost.categories?.join(", ") || ""}
                  />
                </div>

                <div className="flex items-center space-x-2 pt-4">
                  <Switch
                    id="isVisible"
                    name="isVisible"
                    defaultChecked={blogPost.isVisible}
                  />
                  <Label htmlFor="isVisible">
                    {blogPost.isVisible ? "Published" : "Draft"}
                  </Label>
                </div>

                <div className="pt-2 text-sm text-muted-foreground">
                  <p>Views: {blogPost.views || 0}</p>
                </div>
              </div>

              {/* Right Column */}
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Featured Image {!imagePreview && "*"}</Label>
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
                      required={!imagePreview}
                    />
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => fileInputRef.current?.click()}
                      className="mt-2"
                    >
                      {imagePreview ? "Change Image" : "Select Image"}
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
                      defaultValue={blogPost.author?.name || ""}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Author Image {!authorImagePreview && "*"}</Label>
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
                        required={!authorImagePreview}
                      />
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => authorFileInputRef.current?.click()}
                        className="mt-2"
                      >
                        {authorImagePreview
                          ? "Change Author Image"
                          : "Select Author Image"}
                      </Button>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="authorBio">Author Bio *</Label>
                    <Textarea
                      id="authorBio"
                      name="authorBio"
                      placeholder="Enter author bio"
                      defaultValue={blogPost.author?.bio || ""}
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
                  Updating...
                </>
              ) : (
                "Update Blog Post"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
