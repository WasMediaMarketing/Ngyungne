"use client";

import { useState, useEffect, useRef, useMemo } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { toast } from "sonner";
import {
  pageApi,
  type PageUI,
  type CreatePageInput,
  type UpdatePageInput,
} from "@/utils/pageApi";
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
import { RefreshCw } from "lucide-react";
import { slugify } from "@/lib/utils/slugify";
import dynamic from "next/dynamic";
import { siteConfig } from "@/config/site";

const JoditEditor = dynamic(() => import("jodit-react"), {
  ssr: false,
});

// Define the validation schema using Zod
const formSchema = z.object({
  title: z.string().min(1, "Title is required"),
  slug: z
    .string()
    .min(1, "Slug is required")
    .regex(/^[a-z0-9]+(-[a-z0-9]+)*$/, {
      message:
        "Slug can only contain lowercase letters, numbers, and hyphens. No spaces or special characters allowed.",
    }),
  location: z.enum(["header", "footer"], {
    required_error: "Please select a location",
  }),
  parentPage: z.string().optional(),
  content: z.string().min(1, "Content is required"),
  status: z.enum(["draft", "published"], {
    required_error: "Please select a status",
  }),
  metaTitle: z.string().optional(),
  metaKeywords: z.string().optional(),
  metaDescription: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

interface PageFormProps {
  page?: PageUI;
  onSuccess: () => void;
  onCancel: () => void;
  parentPages: PageUI[];
}

// Helper function to get navigation sections based on location
const getNavigationSections = (location: "header" | "footer") => {
  if (location === "header") {
    return [
      { id: "teachings", name: "Teachings" },
      { id: "programs", name: "Programs" },
      { id: "resources", name: "Resources" },
    ];
  } else {
    return [
      { id: "quick-links", name: "Quick Links" },
      { id: "resources", name: "Resources" },
    ];
  }
};

export function PageForm({
  page,
  onSuccess,
  onCancel,
  parentPages,
}: PageFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [autoSlug, setAutoSlug] = useState(!page);
  const isEditing = !!page;

  // Filter parent pages based on location
  const [filteredParentPages, setFilteredParentPages] = useState<PageUI[]>([]);
  const [selectedLocation, setSelectedLocation] = useState<"header" | "footer">(
    page?.location || "header"
  );
  const [navigationSections, setNavigationSections] = useState(
    getNavigationSections(selectedLocation)
  );

  // Initialize the form
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: page?.title || "",
      slug: page?.slug || "",
      location: page?.location || "header",
      parentPage: page?.parentPage || "",
      content: page?.content || "",
      status: page?.status || "draft",
      metaTitle: page?.metaTitle || "",
      metaKeywords: page?.metaKeywords || "",
      metaDescription: page?.metaDescription || "",
    },
  });

  // Watch the title field to auto-generate slug
  const title = form.watch("title");
  const location = form.watch("location");

  // Update filtered parent pages and navigation sections when location changes
  useEffect(() => {
    if (location !== selectedLocation) {
      setSelectedLocation(location);
      form.setValue("parentPage", "");
      setNavigationSections(getNavigationSections(location));
    }

    setFilteredParentPages(
      parentPages.filter(
        (p) => p.location === location && (!page || p.id !== page.id)
      )
    );
  }, [location, parentPages, page, selectedLocation, form]);

  // Auto-generate slug from title if autoSlug is enabled
  useEffect(() => {
    if (autoSlug && title) {
      const generatedSlug = slugify(title);
      form.setValue("slug", generatedSlug, { shouldValidate: true });
    }
  }, [title, autoSlug, form]);

  const onSubmit = async (data: FormValues) => {
    setIsSubmitting(true);
    try {
      if (isEditing && page) {
        // Update existing page
        await pageApi.updatePage(page.id, data as UpdatePageInput);
        toast.success("Success", { description: "Page updated successfully" });
      } else {
        // Create new page
        await pageApi.createPage(data as CreatePageInput);
        toast.success("Success", { description: "Page created successfully" });
      }
      onSuccess();
    } catch (error) {
      console.error("Error saving page:", error);
      toast.error("Error", { description: "Failed to save page" });
    } finally {
      setIsSubmitting(false);
    }
  };

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

  // Get navigation items for the selected location
  const getNavigationItems = (section: string) => {
    if (location === "header") {
      switch (section) {
        case "teachings":
          return siteConfig.mainNav.teachings || [];
        case "programs":
          return siteConfig.mainNav.programs || [];
        case "resources":
          return siteConfig.mainNav.resources || [];
        default:
          return [];
      }
    } else {
      // For footer
      if (section === "quick-links") {
        return [
          { title: "About Us", href: "/about-us" },
          { title: "Teachings", href: "/teachings" },
          { title: "Courses", href: "/courses" },
          { title: "Events", href: "/events" },
          { title: "Donate", href: "/donate" },
          { title: "Contact Us", href: "/contact-us" },
        ];
      } else if (section === "resources") {
        return siteConfig.mainNav.resources || [];
      }
      return [];
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <Tabs defaultValue="basic" className="w-full">
          <TabsList className="grid grid-cols-3 mb-4">
            <TabsTrigger value="basic">Basic Info</TabsTrigger>
            <TabsTrigger value="content">Content</TabsTrigger>
            <TabsTrigger value="seo">SEO</TabsTrigger>
          </TabsList>

          {/* Basic Info Tab */}
          <TabsContent value="basic" className="space-y-4">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Title *</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter page title" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex items-end gap-4">
              <div className="flex-1">
                <FormField
                  control={form.control}
                  name="slug"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Slug *</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="enter-page-slug"
                          {...field}
                          onChange={(e) => {
                            field.onChange(e);
                            if (e.target.value !== slugify(title)) {
                              setAutoSlug(false);
                            }
                          }}
                        />
                      </FormControl>
                      <FormDescription>
                        URL-friendly identifier (lowercase letters, numbers, and
                        hyphens only)
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <Button
                type="button"
                variant="outline"
                className="mb-8"
                onClick={() => {
                  setAutoSlug(true);
                  form.setValue("slug", slugify(title), {
                    shouldValidate: true,
                  });
                }}
              >
                Generate from Title
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="location"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Location *</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select location" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="header">
                          Header Navigation
                        </SelectItem>
                        <SelectItem value="footer">Footer Links</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormDescription>
                      Where this page will appear in the site navigation
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="parentPage"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Parent Section</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      value={field.value || "none"}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="None (Top Level)" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="none">None (Top Level)</SelectItem>

                        {/* Navigation Sections from Site Config */}
                        <SelectItem
                          value="site-sections"
                          disabled
                          className="font-semibold text-muted-foreground"
                        >
                          Site Navigation Sections
                        </SelectItem>
                        {navigationSections.map((section) => (
                          <SelectItem key={section.id} value={section.id}>
                            {section.name}
                          </SelectItem>
                        ))}

                        {/* Dynamic Pages */}
                        {filteredParentPages.length > 0 && (
                          <>
                            <SelectItem
                              value="dynamic-pages"
                              disabled
                              className="font-semibold text-muted-foreground"
                            >
                              Existing Pages
                            </SelectItem>
                            {filteredParentPages.map((parentPage) => (
                              <SelectItem
                                key={parentPage.id}
                                value={parentPage.id}
                              >
                                {parentPage.title}
                              </SelectItem>
                            ))}
                          </>
                        )}
                      </SelectContent>
                    </Select>
                    <FormDescription>
                      {location === "header"
                        ? "Select a navigation section or existing page for dropdown navigation"
                        : "Select a section for the footer"}
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="status"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <FormLabel className="text-base">Published</FormLabel>
                    <FormDescription>
                      {field.value === "published"
                        ? "This page is live and visible to the public"
                        : "This page is in draft mode and only visible to admins"}
                    </FormDescription>
                  </div>
                  <FormControl>
                    <Switch
                      checked={field.value === "published"}
                      onCheckedChange={(checked) => {
                        field.onChange(checked ? "published" : "draft");
                      }}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
          </TabsContent>

          {/* Content Tab */}
          <TabsContent value="content" className="space-y-4">
            <FormField
              control={form.control}
              name="content"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Page Content *</FormLabel>
                  <FormControl>
                    {typeof window !== "undefined" && (
                      <JoditEditor
                        ref={contentEditorRef}
                        config={editorConfig}
                        value={field.value}
                        onChange={field.onChange}
                      />
                    )}
                  </FormControl>
                  <FormDescription>
                    Use the rich text editor to format your content. You can
                    also switch to HTML source mode.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </TabsContent>

          {/* SEO Tab */}
          <TabsContent value="seo" className="space-y-4">
            <FormField
              control={form.control}
              name="metaTitle"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Meta Title</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter meta title (for SEO)"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    Leave blank to use the page title. Recommended length: 50-60
                    characters.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="metaDescription"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Meta Description</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Enter meta description (for SEO)"
                      className="min-h-[100px]"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    Recommended length: 150-160 characters.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="metaKeywords"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Meta Keywords</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="keyword1, keyword2, keyword3"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    Comma-separated list of keywords.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </TabsContent>
        </Tabs>

        <div className="flex justify-end gap-2">
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
                <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                {isEditing ? "Updating..." : "Creating..."}
              </>
            ) : (
              <>{isEditing ? "Update Page" : "Create Page"}</>
            )}
          </Button>
        </div>
      </form>
    </Form>
  );
}
