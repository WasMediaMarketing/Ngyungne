"use client";

import { useState } from "react";
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
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { RefreshCw } from "lucide-react";
import { joinCourseApi } from "@/utils/joinCourseApi";
import { toast } from "sonner";
import type { IJoinCourseData, ICourse, IUser } from "@/types";

// Define the form schema using Zod
const enrollmentFormSchema = z.object({
  educationalLevel: z
    .string()
    .min(1, { message: "Please select an educational level" }),
  experience: z.string().optional(),
  specialRequirement: z.string().optional(),
  reason: z
    .string()
    .min(10, { message: "Please provide a reason for joining" }),
});

type EnrollmentFormValues = z.infer<typeof enrollmentFormSchema>;

interface CourseEnrollmentFormDialogProps {
  open: boolean;
  enrollment: IJoinCourseData;
  onClose: () => void;
  onSaved: () => void;
}

export default function CourseEnrollmentFormDialog({
  open,
  enrollment,
  onClose,
  onSaved,
}: CourseEnrollmentFormDialogProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Helper function to get course title
  const getCourseTitle = (): string => {
    if (
      typeof enrollment.courseId === "object" &&
      enrollment.courseId !== null &&
      "title" in enrollment.courseId
    ) {
      return (enrollment.courseId as ICourse).title || "Unknown Course";
    }
    return "Unknown Course";
  };

  // Helper function to get user name
  const getUserName = (): string => {
    if (
      typeof enrollment.userId === "object" &&
      enrollment.userId !== null &&
      "name" in enrollment.userId
    ) {
      return (enrollment.userId as IUser).name || "Unknown User";
    }
    return "Unknown User";
  };

  // Initialize the form
  const form = useForm<EnrollmentFormValues>({
    resolver: zodResolver(enrollmentFormSchema),
    defaultValues: {
      educationalLevel: enrollment.educationalLevel || "",
      experience: enrollment.experience || "",
      specialRequirement: enrollment.specialRequirement || "",
      reason: enrollment.reason || "",
    },
  });

  // Handle form submission
  const handleSubmit = async (values: EnrollmentFormValues) => {
    setIsSubmitting(true);
    try {
      const result = await joinCourseApi.updateJoinCourse(
        enrollment._id.toString(),
        values
      );

      if (result) {
        toast.success("Success", {
          description: "Enrollment updated successfully",
        });
        onSaved();
      }
    } catch (error) {
      console.error("Error updating enrollment:", error);
      toast.error("Error", {
        description: "Failed to update enrollment",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Edit Enrollment</DialogTitle>
          <DialogDescription>
            Update enrollment details for {getUserName()} in {getCourseTitle()}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="space-y-4"
          >
            <FormField
              control={form.control}
              name="educationalLevel"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Educational Level</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select educational level" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="High school">High School</SelectItem>
                      <SelectItem value="Bachelors degree">
                        Bachelor's Degree
                      </SelectItem>
                      <SelectItem value="Masters degree">
                        Master's Degree
                      </SelectItem>
                      <SelectItem value="PhD">Ph.D.</SelectItem>
                      <SelectItem value="Other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="experience"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Prior Experience (Optional)</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Prior experience with the subject"
                      className="resize-none"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="specialRequirement"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Special Requirements (Optional)</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Any special requirements or accommodations"
                      className="resize-none"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="reason"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Reason for Joining</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Why they are interested in this course"
                      className="resize-none"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

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
                    <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  "Save Changes"
                )}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
