"use client";

import type React from "react";

import { useState, useEffect, useRef } from "react";
import { toast } from "sonner";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
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
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { RefreshCw, Plus, Trash2, X, Upload } from "lucide-react";
import { courseApi } from "@/utils/courseApi";
import type { ICourse } from "@/types";

// Define the form schema using Zod
const courseFormSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().min(1, "Description is required"),
  overView: z.string().min(1, "Overview is required"),
  outcomes: z.array(z.string()).min(1, "At least one outcome is required"),
  prerequisites: z.string().min(1, "Prerequisites are required"),
  targetAudience: z.string().min(1, "Target audience is required"),
  duration: z.string().min(1, "Duration is required"),
  lessons: z.number().min(1, "Number of lessons is required"),
  level: z.string().min(1, "Level is required"),
  featured: z.boolean().default(false),
  students: z.number().optional(),
  image: z.any().optional(), // Handle file upload separately
  modules: z
    .array(
      z.object({
        title: z.string().min(1, "Module title is required"),
        lessons: z.array(z.string()).min(1, "At least one lesson is required"),
      })
    )
    .min(1, "At least one module is required"),
  instructor: z.object({
    name: z.string().min(1, "Instructor name is required"),
    image: z.any().optional(), // Handle file upload separately
    position: z.string().min(1, "Instructor position is required"),
    description: z.string().min(1, "Instructor description is required"),
  }),
  isVisible: z.boolean().default(true),
});

type CourseFormValues = z.infer<typeof courseFormSchema>;

interface CourseFormDialogProps {
  open: boolean;
  course?: ICourse;
  onClose: () => void;
  onSaved: () => void;
}

export default function CourseFormDialog({
  open,
  course,
  onClose,
  onSaved,
}: CourseFormDialogProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activeTab, setActiveTab] = useState("basic");
  const [courseImage, setCourseImage] = useState<File | null>(null);
  const [instructorImage, setInstructorImage] = useState<File | null>(null);
  const [courseImagePreview, setCourseImagePreview] = useState<string | null>(
    course?.image || null
  );
  const [instructorImagePreview, setInstructorImagePreview] = useState<
    string | null
  >(course?.instructor?.image || null);

  // Refs for file inputs
  const courseImageInputRef = useRef<HTMLInputElement>(null);
  const instructorImageInputRef = useRef<HTMLInputElement>(null);

  // Initialize the form with default values or existing course data
  const form = useForm<CourseFormValues>({
    resolver: zodResolver(courseFormSchema),
    defaultValues: course
      ? {
          ...course,
          lessons: course.lessons || 0,
          students: course.students || 0,
          outcomes: course.outcomes || [],
          modules: course.modules || [],
          isVisible: course.isVisible !== undefined ? course.isVisible : true,
        }
      : {
          title: "",
          description: "",
          overView: "",
          outcomes: [""],
          prerequisites: "",
          targetAudience: "",
          duration: "",
          lessons: 0,
          level: "",
          featured: false,
          students: 0,
          modules: [{ title: "", lessons: [""] }],
          instructor: {
            name: "",
            position: "",
            description: "",
          },
          isVisible: true,
        },
  });

  // Handle form submission
  const onSubmit = async (values: CourseFormValues) => {
    setIsSubmitting(true);

    try {
      const formData = new FormData();

      // Append all form fields to FormData except image and instructor
      Object.entries(values).forEach(([key, value]) => {
        if (key !== "image" && key !== "instructor") {
          if (typeof value === "object" && value !== null) {
            formData.append(key, JSON.stringify(value));
          } else {
            formData.append(key, String(value));
          }
        }
      });

      // Append instructor data (excluding the image)
      const instructorData = { ...values.instructor };
      delete instructorData.image; // Remove image from instructor data
      formData.append("instructor", JSON.stringify(instructorData));

      // For course image, we need to handle both new uploads and existing URLs
      if (courseImage) {
        // If we have a new file, append it directly
        formData.append("image", courseImage);
      }

      // For instructor image, similar approach
      if (instructorImage) {
        // If we have a new file, append it directly
        formData.append("instructorImage", instructorImage);
      }
      for (const pair of formData.entries()) {
      }

      let result;
      if (course) {
        // Update existing course
        result = await courseApi.updateCourse(course.id, formData);
      } else {
        // Create new course
        result = await courseApi.createCourse(formData);
      }

      if (result) {
        toast.success("Success", {
          description: course
            ? "Course updated successfully"
            : "Course created successfully",
        });
        onSaved();
      }
    } catch (error) {
      console.error("Error saving course:", error);
      toast.error("Error", {
        description: course
          ? "Failed to update course"
          : "Failed to create course",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle drag and drop
  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleImageDrop = (
    e: React.DragEvent<HTMLDivElement>,
    isInstructor: boolean
  ) => {
    e.preventDefault();
    e.stopPropagation();

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      if (!file.type.startsWith("image/")) {
        toast.error("Invalid file type", {
          description: "Please upload an image file (PNG, JPG, JPEG)",
        });
        return;
      }

      if (file.size > 2 * 1024 * 1024) {
        // 2MB limit
        toast.error("File too large", {
          description: "Image size should be less than 2MB",
        });
        return;
      }

      if (isInstructor) {
        setInstructorImage(file);
        setInstructorImagePreview(URL.createObjectURL(file));
      } else {
        setCourseImage(file);
        setCourseImagePreview(URL.createObjectURL(file));
      }
    }
  };

  // Handle image uploads
  const handleCourseImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (file.size > 2 * 1024 * 1024) {
        // 2MB limit
        toast.error("File too large", {
          description: "Image size should be less than 2MB",
        });
        return;
      }
      setCourseImage(file);
      setCourseImagePreview(URL.createObjectURL(file));
    }
  };

  const handleInstructorImageChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (file.size > 2 * 1024 * 1024) {
        // 2MB limit
        toast.error("File too large", {
          description: "Image size should be less than 2MB",
        });
        return;
      }
      setInstructorImage(file);
      setInstructorImagePreview(URL.createObjectURL(file));
    }
  };

  // Helper function to add a new outcome
  const addOutcome = () => {
    const currentOutcomes = form.getValues("outcomes");
    form.setValue("outcomes", [...currentOutcomes, ""]);
  };

  // Helper function to remove an outcome
  const removeOutcome = (index: number) => {
    const currentOutcomes = form.getValues("outcomes");
    if (currentOutcomes.length <= 1) return;

    const newOutcomes = [...currentOutcomes];
    newOutcomes.splice(index, 1);
    form.setValue("outcomes", newOutcomes);
  };

  // Helper functions for modules
  const addModule = () => {
    const currentModules = form.getValues("modules");
    form.setValue("modules", [...currentModules, { title: "", lessons: [""] }]);
  };

  const removeModule = (index: number) => {
    const currentModules = form.getValues("modules");
    if (currentModules.length <= 1) return;

    const newModules = [...currentModules];
    newModules.splice(index, 1);
    form.setValue("modules", newModules);
  };

  // Helper functions for module lessons
  const addLesson = (moduleIndex: number) => {
    const currentModules = form.getValues("modules");
    const currentLessons = currentModules[moduleIndex].lessons;

    const updatedModules = [...currentModules];
    updatedModules[moduleIndex] = {
      ...updatedModules[moduleIndex],
      lessons: [...currentLessons, ""],
    };

    form.setValue("modules", updatedModules);
  };

  const removeLesson = (moduleIndex: number, lessonIndex: number) => {
    const currentModules = form.getValues("modules");
    const currentLessons = currentModules[moduleIndex].lessons;

    if (currentLessons.length <= 1) return;

    const newLessons = [...currentLessons];
    newLessons.splice(lessonIndex, 1);

    const updatedModules = [...currentModules];
    updatedModules[moduleIndex] = {
      ...updatedModules[moduleIndex],
      lessons: newLessons,
    };

    form.setValue("modules", updatedModules);
  };

  // Clean up object URLs when component unmounts
  useEffect(() => {
    return () => {
      if (courseImagePreview && courseImagePreview.startsWith("blob:")) {
        URL.revokeObjectURL(courseImagePreview);
      }
      if (
        instructorImagePreview &&
        instructorImagePreview.startsWith("blob:")
      ) {
        URL.revokeObjectURL(instructorImagePreview);
      }
    };
  }, [courseImagePreview, instructorImagePreview]);

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {course ? "Edit Course" : "Create New Course"}
          </DialogTitle>
          <DialogDescription>
            {course
              ? "Update the details of an existing course."
              : "Fill in the details to create a new course."}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <Tabs
              defaultValue="basic"
              value={activeTab}
              onValueChange={setActiveTab}
              className="w-full"
            >
              <TabsList className="grid grid-cols-4">
                <TabsTrigger value="basic">Basic Info</TabsTrigger>
                <TabsTrigger value="details">Details</TabsTrigger>
                <TabsTrigger value="modules">Modules</TabsTrigger>
                <TabsTrigger value="instructor">Instructor</TabsTrigger>
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
                          <Input placeholder="Course title" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="level"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Level</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select level" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="Beginner">Beginner</SelectItem>
                            <SelectItem value="Intermediate">
                              Intermediate
                            </SelectItem>
                            <SelectItem value="Advanced">Advanced</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="duration"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Duration</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="e.g., 8 weeks, 3 hours"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="lessons"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Number of Lessons</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            placeholder="Total lessons"
                            {...field}
                            onChange={(e) =>
                              field.onChange(
                                Number.parseInt(e.target.value) || 0
                              )
                            }
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="students"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Students Enrolled</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            placeholder="Number of students"
                            {...field}
                            onChange={(e) =>
                              field.onChange(
                                Number.parseInt(e.target.value) || 0
                              )
                            }
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="flex flex-col space-y-4">
                    <FormField
                      control={form.control}
                      name="featured"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3">
                          <div className="space-y-0.5">
                            <FormLabel>Featured Course</FormLabel>
                            <FormDescription>
                              Display this course on the featured section
                            </FormDescription>
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

                    <FormField
                      control={form.control}
                      name="isVisible"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3">
                          <div className="space-y-0.5">
                            <FormLabel>Visible</FormLabel>
                            <FormDescription>
                              Make this course visible to students
                            </FormDescription>
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
                  </div>

                  <div className="col-span-1 md:col-span-2">
                    <FormField
                      control={form.control}
                      name="image"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Course Image</FormLabel>
                          <FormControl>
                            <div
                              className="border-2 border-dashed rounded-md p-4 hover:border-primary/50 transition-colors cursor-pointer"
                              onClick={() =>
                                courseImageInputRef.current?.click()
                              }
                              onDrop={(e) => handleImageDrop(e, false)}
                              onDragOver={handleDragOver}
                            >
                              <input
                                type="file"
                                ref={courseImageInputRef}
                                onChange={handleCourseImageChange}
                                accept="image/*"
                                className="hidden"
                              />

                              {courseImagePreview ? (
                                <div className="relative">
                                  <div className="relative h-40 w-full mx-auto rounded-md overflow-hidden">
                                    <img
                                      src={
                                        courseImagePreview || "/placeholder.svg"
                                      }
                                      alt="Course preview"
                                      className="w-full h-full object-cover"
                                    />
                                  </div>
                                  <button
                                    type="button"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      setCourseImage(null);
                                      setCourseImagePreview(null);
                                    }}
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
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>
              </TabsContent>

              {/* Details Tab */}
              <TabsContent value="details" className="space-y-4">
                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Detailed description of the course"
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
                  name="overView"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Overview</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Brief overview of the course"
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
                  name="prerequisites"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Prerequisites</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="What students should know before taking this course"
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
                  name="targetAudience"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Target Audience</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Who this course is designed for"
                          className="min-h-[80px]"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div>
                  <FormLabel>Learning Outcomes</FormLabel>
                  <FormDescription>
                    What students will learn from this course
                  </FormDescription>
                  <div className="space-y-2 mt-2">
                    {form.watch("outcomes").map((_, index) => (
                      <div key={index} className="flex items-center gap-2">
                        <FormField
                          control={form.control}
                          name={`outcomes.${index}`}
                          render={({ field }) => (
                            <FormItem className="flex-1">
                              <FormControl>
                                <Input
                                  placeholder={`Outcome ${index + 1}`}
                                  {...field}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <Button
                          type="button"
                          variant="outline"
                          size="icon"
                          onClick={() => removeOutcome(index)}
                          disabled={form.watch("outcomes").length <= 1}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={addOutcome}
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Add Outcome
                    </Button>
                  </div>
                </div>
              </TabsContent>

              {/* Modules Tab */}
              <TabsContent value="modules" className="space-y-4">
                <div className="space-y-4">
                  {form.watch("modules").map((_, moduleIndex) => (
                    <Card key={moduleIndex}>
                      <CardHeader>
                        <CardTitle className="text-lg flex justify-between items-center">
                          <span>Module {moduleIndex + 1}</span>
                          <Button
                            type="button"
                            variant="outline"
                            size="icon"
                            onClick={() => removeModule(moduleIndex)}
                            disabled={form.watch("modules").length <= 1}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </CardTitle>
                        <CardDescription>
                          Define the module title and lessons
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <FormField
                          control={form.control}
                          name={`modules.${moduleIndex}.title`}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Module Title</FormLabel>
                              <FormControl>
                                <Input placeholder="Module title" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <div className="space-y-2">
                          <FormLabel>Lessons</FormLabel>
                          <FormDescription>
                            List the lessons in this module
                          </FormDescription>
                          {form
                            .watch(`modules.${moduleIndex}.lessons`)
                            .map((_, lessonIndex) => (
                              <div
                                key={lessonIndex}
                                className="flex items-center gap-2"
                              >
                                <FormField
                                  control={form.control}
                                  name={`modules.${moduleIndex}.lessons.${lessonIndex}`}
                                  render={({ field }) => (
                                    <FormItem className="flex-1">
                                      <FormControl>
                                        <Input
                                          placeholder={`Lesson ${
                                            lessonIndex + 1
                                          }`}
                                          {...field}
                                        />
                                      </FormControl>
                                      <FormMessage />
                                    </FormItem>
                                  )}
                                />
                                <Button
                                  type="button"
                                  variant="outline"
                                  size="icon"
                                  onClick={() =>
                                    removeLesson(moduleIndex, lessonIndex)
                                  }
                                  disabled={
                                    form.watch(`modules.${moduleIndex}.lessons`)
                                      .length <= 1
                                  }
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </div>
                            ))}
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => addLesson(moduleIndex)}
                          >
                            <Plus className="h-4 w-4 mr-2" />
                            Add Lesson
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                  <Button type="button" variant="outline" onClick={addModule}>
                    <Plus className="h-4 w-4 mr-2" />
                    Add Module
                  </Button>
                </div>
              </TabsContent>

              {/* Instructor Tab */}
              <TabsContent value="instructor" className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="instructor.name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Instructor Name</FormLabel>
                        <FormControl>
                          <Input placeholder="Full name" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="instructor.position"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Position</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="e.g., Senior Developer"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="col-span-1 md:col-span-2">
                    <FormField
                      control={form.control}
                      name="instructor.description"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Instructor Bio</FormLabel>
                          <FormControl>
                            <Textarea
                              placeholder="Brief description about the instructor"
                              className="min-h-[100px]"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="col-span-1 md:col-span-2">
                    <FormField
                      control={form.control}
                      name="instructor.image"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Instructor Image</FormLabel>
                          <FormControl>
                            <div
                              className="border-2 border-dashed rounded-md p-4 hover:border-primary/50 transition-colors cursor-pointer"
                              onClick={() =>
                                instructorImageInputRef.current?.click()
                              }
                              onDrop={(e) => handleImageDrop(e, true)}
                              onDragOver={handleDragOver}
                            >
                              <input
                                type="file"
                                ref={instructorImageInputRef}
                                onChange={handleInstructorImageChange}
                                accept="image/*"
                                className="hidden"
                              />

                              {instructorImagePreview ? (
                                <div className="relative">
                                  <div className="relative h-40 w-40 mx-auto rounded-full overflow-hidden">
                                    <img
                                      src={
                                        instructorImagePreview ||
                                        "/placeholder.svg" ||
                                        "/placeholder.svg"
                                      }
                                      alt="Instructor preview"
                                      className="w-full h-full object-cover"
                                    />
                                  </div>
                                  <button
                                    type="button"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      setInstructorImage(null);
                                      setInstructorImagePreview(null);
                                    }}
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
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>
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
                    {course ? "Updating..." : "Creating..."}
                  </>
                ) : (
                  <>{course ? "Update Course" : "Create Course"}</>
                )}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
