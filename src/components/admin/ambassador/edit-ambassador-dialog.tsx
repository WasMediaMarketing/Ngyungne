"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { ambassadorApi } from "@/utils/ambassadorApi";
import { Ambassador } from "@/types/ambassador.types";
import { TeamMemberRole } from "@/types/team-member";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
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
import { RefreshCw, Plus, Trash2, ImageIcon } from "lucide-react";
import Image from "next/image";

// Define the validation schema using Zod
const formSchema = z.object({
  name: z.string().min(1, "Name is required"),
  role: z.enum([
    "Founder",
    "Co-Founder",
    "Executive Director",
    "Ambassador",
    "Program Coordinator",
    "Community Liaison",
    "Volunteer",
  ] as const),
  bio: z.string().min(1, "Bio is required"),
  image: z.any().optional(),
  location: z.string().optional(),
  quote: z.string().optional(),
  achievements: z.array(z.string()).optional(),
  socialLinks: z
    .object({
      linkedin: z
        .string()
        .url("Must be a valid URL")
        .optional()
        .or(z.literal("")),
      twitter: z
        .string()
        .url("Must be a valid URL")
        .optional()
        .or(z.literal("")),
      instagram: z
        .string()
        .url("Must be a valid URL")
        .optional()
        .or(z.literal("")),
      facebook: z
        .string()
        .url("Must be a valid URL")
        .optional()
        .or(z.literal("")),
      website: z
        .string()
        .url("Must be a valid URL")
        .optional()
        .or(z.literal("")),
      email: z
        .string()
        .email("Must be a valid email")
        .optional()
        .or(z.literal("")),
    })
    .optional(),
  isVisible: z.boolean().default(false),
});

type FormValues = z.infer<typeof formSchema>;

interface EditAmbassadorDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  ambassador: Ambassador | null;
  onSuccess: () => void;
}

export function EditAmbassadorDialog({
  open,
  onOpenChange,
  ambassador,
  onSuccess,
}: EditAmbassadorDialogProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [achievements, setAchievements] = useState<string[]>([]);
  const [newAchievement, setNewAchievement] = useState("");
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [newImageSelected, setNewImageSelected] = useState(false);

  // Initialize the form
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      role: "Ambassador" as TeamMemberRole,
      bio: "",
      image: undefined,
      location: "",
      quote: "",
      achievements: [],
      socialLinks: {
        linkedin: "",
        twitter: "",
        instagram: "",
        facebook: "",
        website: "",
        email: "",
      },
      isVisible: false,
    },
  });

  // Update form when ambassador changes
  useEffect(() => {
    if (ambassador) {
      form.reset({
        name: ambassador.name,
        role: ambassador.role,
        bio: ambassador.bio,
        image: undefined, // Don't set the image field, we'll handle it separately
        location: ambassador.location || "",
        quote: ambassador.quote || "",
        achievements: ambassador.achievements || [],
        socialLinks: {
          linkedin: ambassador.socialLinks?.linkedin || "",
          twitter: ambassador.socialLinks?.twitter || "",
          instagram: ambassador.socialLinks?.instagram || "",
          facebook: ambassador.socialLinks?.facebook || "",
          website: ambassador.socialLinks?.website || "",
          email: ambassador.socialLinks?.email || "",
        },
        isVisible: ambassador.isVisible,
      });

      setAchievements(ambassador.achievements || []);
      setImagePreview(ambassador.image);
      setNewImageSelected(false);
    }
  }, [ambassador, form]);

  const handleAddAchievement = () => {
    if (newAchievement.trim()) {
      const updatedAchievements = [...achievements, newAchievement.trim()];
      setAchievements(updatedAchievements);
      form.setValue("achievements", updatedAchievements);
      setNewAchievement("");
    }
  };

  const handleRemoveAchievement = (index: number) => {
    const updatedAchievements = achievements.filter((_, i) => i !== index);
    setAchievements(updatedAchievements);
    form.setValue("achievements", updatedAchievements);
  };

  const onSubmit = async (data: FormValues) => {
    if (!ambassador?.id) return;

    setIsSubmitting(true);
    try {
      // Create FormData for multipart/form-data request
      const formData = new FormData();

      // Add basic fields
      formData.append("name", data.name);
      formData.append("role", data.role);
      formData.append("bio", data.bio);

      // Add image file only if a new one was selected
      if (data.image instanceof File) {
        formData.append("image", data.image);
      }

      // Add optional fields if they exist
      if (data.location) formData.append("location", data.location);
      if (data.quote) formData.append("quote", data.quote);

      // Add achievements as JSON
      if (data.achievements && data.achievements.length > 0) {
        formData.append("achievements", JSON.stringify(data.achievements));
      }

      // Add social links as JSON
      if (data.socialLinks) {
        formData.append("socialLinks", JSON.stringify(data.socialLinks));
      }

      // Add visibility
      formData.append("isVisible", String(data.isVisible));

      // Submit the form
      await ambassadorApi.updateAmbassador(ambassador.id, formData);

      onSuccess();
    } catch (error) {
      console.error("Error updating ambassador:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!ambassador) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Ambassador</DialogTitle>
          <DialogDescription>
            Update the ambassador profile information.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <Tabs defaultValue="basic" className="w-full">
              <TabsList className="grid grid-cols-3 mb-4">
                <TabsTrigger value="basic">Basic Info</TabsTrigger>
                <TabsTrigger value="details">Details</TabsTrigger>
                <TabsTrigger value="social">Social Links</TabsTrigger>
              </TabsList>

              {/* Basic Info Tab */}
              <TabsContent value="basic" className="space-y-4">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Name *</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter full name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="role"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Role *</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a role" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="Founder">Founder</SelectItem>
                          <SelectItem value="Co-Founder">Co-Founder</SelectItem>
                          <SelectItem value="Executive Director">
                            Executive Director
                          </SelectItem>
                          <SelectItem value="Ambassador">Ambassador</SelectItem>
                          <SelectItem value="Program Coordinator">
                            Program Coordinator
                          </SelectItem>
                          <SelectItem value="Community Liaison">
                            Community Liaison
                          </SelectItem>
                          <SelectItem value="Volunteer">Volunteer</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="bio"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Bio *</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Enter a brief biography"
                          className="min-h-[120px]"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="image"
                  render={({ field: { value, onChange, ...fieldProps } }) => (
                    <FormItem>
                      <FormLabel>Profile Image</FormLabel>
                      <div className="space-y-2">
                        {imagePreview && !newImageSelected && (
                          <div className="relative h-40 w-40 rounded-md overflow-hidden border">
                            <Image
                              src={imagePreview || "/placeholder.svg"}
                              alt="Current profile image"
                              fill
                              className="object-cover"
                            />
                          </div>
                        )}
                        <FormControl>
                          <Input
                            type="file"
                            accept="image/*"
                            onChange={(e) => {
                              const file = e.target.files?.[0];
                              if (file) {
                                onChange(file);
                                setNewImageSelected(true);
                                // Create a preview URL
                                const url = URL.createObjectURL(file);
                                setImagePreview(url);
                              }
                            }}
                            {...fieldProps}
                          />
                        </FormControl>
                      </div>
                      <FormDescription>
                        Upload a new image or keep the existing one.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="isVisible"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                      <div className="space-y-0.5">
                        <FormLabel className="text-base">
                          Visible on Website
                        </FormLabel>
                        <FormDescription>
                          Make this ambassador visible to the public
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
              </TabsContent>

              {/* Details Tab */}
              <TabsContent value="details" className="space-y-4">
                <FormField
                  control={form.control}
                  name="location"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Location</FormLabel>
                      <FormControl>
                        <Input placeholder="City, Country" {...field} />
                      </FormControl>
                      <FormDescription>
                        Where the ambassador is based
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="quote"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Quote</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="A memorable quote from the ambassador"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="space-y-2">
                  <FormLabel>Achievements</FormLabel>
                  <div className="flex gap-2">
                    <Input
                      placeholder="Add an achievement"
                      value={newAchievement}
                      onChange={(e) => setNewAchievement(e.target.value)}
                    />
                    <Button
                      type="button"
                      variant="outline"
                      onClick={handleAddAchievement}
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                  <FormDescription>
                    Add notable achievements of the ambassador
                  </FormDescription>

                  {achievements.length > 0 && (
                    <div className="mt-2 space-y-2">
                      {achievements.map((achievement, index) => (
                        <div
                          key={index}
                          className="flex items-center justify-between rounded-md border px-3 py-2"
                        >
                          <span className="text-sm">{achievement}</span>
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => handleRemoveAchievement(index)}
                          >
                            <Trash2 className="h-4 w-4 text-destructive" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </TabsContent>

              {/* Social Links Tab */}
              <TabsContent value="social" className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="socialLinks.linkedin"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>LinkedIn</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="LinkedIn profile URL"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="socialLinks.twitter"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Twitter</FormLabel>
                        <FormControl>
                          <Input placeholder="Twitter profile URL" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="socialLinks.instagram"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Instagram</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Instagram profile URL"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="socialLinks.facebook"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Facebook</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Facebook profile URL"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="socialLinks.website"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Website</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Personal website URL"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="socialLinks.email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <Input placeholder="Email address" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </TabsContent>
            </Tabs>

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
                  "Update Ambassador"
                )}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
