"use client";

import { useState, useRef, useMemo, useEffect } from "react";
import dynamic from "next/dynamic";
import { toast } from "sonner";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { RefreshCw, Plus, Trash2 } from "lucide-react";
import { philosophyApi } from "@/utils/philosophyApi";
import type { IPhilosophyTopic } from "@/types";

// Dynamically import JoditEditor to avoid SSR issues
const JoditEditor = dynamic(() => import("jodit-react"), {
  ssr: false,
  loading: () => (
    <div className="h-[400px] w-full bg-muted/20 animate-pulse rounded-md"></div>
  ),
});

// Define the form schema
const formSchema = z.object({
  title: z.string().min(1, "Title is required"),
  icon: z.string().min(1, "Icon is required"),
  description: z.string().min(1, "Description is required"),
  content: z.string().min(1, "Content is required"),
  isVisible: z.boolean().default(true),
  quotes: z
    .array(
      z.object({
        text: z.string().min(1, "Quote text is required"),
        author: z.string().min(1, "Author is required"),
      })
    )
    .optional(),
  practices: z.array(z.string().min(1, "Practice cannot be empty")).optional(),
});

type FormValues = z.infer<typeof formSchema>;

interface PhilosophyFormDialogProps {
  open: boolean;
  topic?: IPhilosophyTopic;
  onClose: () => void;
  onSaved: () => void;
}

export default function PhilosophyFormDialog({
  open,
  topic,
  onClose,
  onSaved,
}: PhilosophyFormDialogProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activeTab, setActiveTab] = useState("basic");
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

  // Initialize form with default values or existing topic data
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: topic?.title || "",
      icon: topic?.icon || "🧘",
      description: topic?.description || "",
      content: topic?.content || "",
      isVisible: topic?.isVisible ?? true,
      quotes: topic?.quotes || [{ text: "", author: "" }],
      practices: topic?.practices || [""],
    },
  });

  // Update form values when topic changes
  useEffect(() => {
    if (topic) {
      form.reset({
        title: topic.title,
        icon: topic.icon,
        description: topic.description,
        content: topic.content,
        isVisible: topic.isVisible,
        quotes: topic.quotes?.length
          ? topic.quotes
          : [{ text: "", author: "" }],
        practices: topic.practices?.length ? topic.practices : [""],
      });
    }
  }, [topic, form]);

  // Handle form submission
  const onSubmit = async (values: FormValues) => {
    setIsSubmitting(true);
    try {
      // Filter out empty quotes and practices
      const filteredValues = {
        ...values,
        quotes:
          values.quotes?.filter((q) => q.text.trim() && q.author.trim()) || [],
        practices: values.practices?.filter((p) => p.trim()) || [],
      };

      if (topic) {
        // Update existing topic
        await philosophyApi.updatePhilosophyTopic(topic.id, filteredValues);
        toast.success("Success", {
          description: "Philosophy topic updated successfully",
        });
      } else {
        // Create new topic
        await philosophyApi.createPhilosophyTopic(filteredValues);
        toast.success("Success", {
          description: "Philosophy topic created successfully",
        });
      }
      onSaved();
    } catch (error) {
      console.error("Error saving philosophy topic:", error);
      toast.error("Error", {
        description: "Failed to save philosophy topic",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Add a new quote field
  const addQuote = () => {
    const currentQuotes = form.getValues("quotes") || [];
    form.setValue("quotes", [...currentQuotes, { text: "", author: "" }]);
  };

  // Remove a quote field
  const removeQuote = (index: number) => {
    const currentQuotes = form.getValues("quotes") || [];
    if (currentQuotes.length <= 1) return;
    form.setValue(
      "quotes",
      currentQuotes.filter((_, i) => i !== index)
    );
  };

  // Add a new practice field
  const addPractice = () => {
    const currentPractices = form.getValues("practices") || [];
    form.setValue("practices", [...currentPractices, ""]);
  };

  // Remove a practice field
  const removePractice = (index: number) => {
    const currentPractices = form.getValues("practices") || [];
    if (currentPractices.length <= 1) return;
    form.setValue(
      "practices",
      currentPractices.filter((_, i) => i !== index)
    );
  };

  return (
    <Dialog open={open} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {topic ? "Edit Philosophy Topic" : "Add Philosophy Topic"}
          </DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid grid-cols-4 mb-4">
                <TabsTrigger value="basic">Basic Info</TabsTrigger>
                <TabsTrigger value="content">Content</TabsTrigger>
                <TabsTrigger value="quotes">Quotes</TabsTrigger>
                <TabsTrigger value="practices">Practices</TabsTrigger>
              </TabsList>

              {/* Basic Info Tab */}
              <TabsContent value="basic" className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="title"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Title</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter title" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="icon"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Icon</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter icon (emoji)" {...field} />
                        </FormControl>
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
                      <FormLabel>Description</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Enter a brief description"
                          className="min-h-[100px]"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="isVisible"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3">
                      <div className="space-y-0.5">
                        <FormLabel>Visibility</FormLabel>
                        <div className="text-sm text-muted-foreground">
                          Make this philosophy topic visible to users
                        </div>
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

              {/* Content Tab */}
              <TabsContent value="content">
                <FormField
                  control={form.control}
                  name="content"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Content</FormLabel>
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
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </TabsContent>

              {/* Quotes Tab */}
              <TabsContent value="quotes" className="space-y-4">
                {form.watch("quotes")?.map((_, index) => (
                  <div key={index} className="space-y-4 p-4 border rounded-md">
                    <div className="flex justify-between items-center">
                      <h4 className="font-medium">Quote #{index + 1}</h4>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => removeQuote(index)}
                        disabled={form.watch("quotes")?.length === 1}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>

                    <FormField
                      control={form.control}
                      name={`quotes.${index}.text`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Quote Text</FormLabel>
                          <FormControl>
                            <Textarea
                              placeholder="Enter quote text"
                              className="min-h-[80px]"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name={`quotes.${index}.author`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Author</FormLabel>
                          <FormControl>
                            <Input placeholder="Enter author name" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                ))}

                <Button
                  type="button"
                  variant="outline"
                  onClick={addQuote}
                  className="w-full"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Quote
                </Button>
              </TabsContent>

              {/* Practices Tab */}
              <TabsContent value="practices" className="space-y-4">
                {form.watch("practices")?.map((_, index) => (
                  <div key={index} className="flex gap-2 items-start">
                    <FormField
                      control={form.control}
                      name={`practices.${index}`}
                      render={({ field }) => (
                        <FormItem className="flex-1">
                          <FormLabel>Practice #{index + 1}</FormLabel>
                          <FormControl>
                            <Textarea
                              placeholder="Enter practice description"
                              className="min-h-[80px]"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => removePractice(index)}
                      disabled={form.watch("practices")?.length === 1}
                      className="mt-8"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))}

                <Button
                  type="button"
                  variant="outline"
                  onClick={addPractice}
                  className="w-full"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Practice
                </Button>
              </TabsContent>
            </Tabs>

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                    Saving...
                  </>
                ) : topic ? (
                  "Update Topic"
                ) : (
                  "Create Topic"
                )}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
