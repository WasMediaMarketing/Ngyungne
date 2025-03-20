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
  DialogTrigger,
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
import Spinner from "../spinner";

// Define the form schema using Zod - removed agreeToTerms field
const enrollmentFormSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters" }),
  email: z.string().email("Please enter a valid email address"),
  phoneNumber: z
    .string()
    .min(10, { message: "Please enter a valid phone number" }),
  address: z.string().min(5, { message: "Please enter your full address" }),
  educationalLevel: z
    .string()
    .min(1, { message: "Please select your educational level" }),
  experience: z.string().optional(),
  specialRequirement: z.string().optional(),
  reason: z
    .string()
    .min(10, { message: "Please tell us a bit more about your motivation" }),
});

type EnrollmentFormValues = z.infer<typeof enrollmentFormSchema>;

interface CourseEnrollmentDialogProps {
  courseTitle: string;
  courseId: string;
  onSubmit?: (data: EnrollmentFormValues) => void;
  buttonText?: string;
  buttonClassName?: string;
}

export function CourseEnrollmentDialog({
  courseTitle,
  courseId,
  onSubmit,
  buttonText = "Enroll Now",
  buttonClassName = "",
}: CourseEnrollmentDialogProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Initialize the form - removed agreeToTerms from defaultValues
  const form = useForm<EnrollmentFormValues>({
    resolver: zodResolver(enrollmentFormSchema),
    defaultValues: {
      name: "",
      email: "",
      phoneNumber: "",
      address: "",
      educationalLevel: "",
      experience: "",
      specialRequirement: "",
      reason: "",
    },
  });

  // Handle form submission
  const handleSubmit = async (values: EnrollmentFormValues) => {
    setIsSubmitting(true);
    try {
      // Prepare data for API
      const enrollmentData = {
        name: values.name,
        email: values.email,
        phoneNumber: values.phoneNumber,
        address: values.address,
        educationalLevel: values.educationalLevel,
        courseId: courseId,
        experience: values.experience,
        specialRequirement: values.specialRequirement,
        reason: values.reason,
        page: window.location.pathname,
        pageTitle: courseTitle,
      };

      // Submit to API
      const result = await joinCourseApi.createJoinCourse(enrollmentData);

      if (result) {
        // Call the onSubmit callback if provided
        if (onSubmit) {
          onSubmit(values);
        }

        form.reset();
        setIsOpen(false);
        toast.success("Enrollment Submitted", {
          description: "Thank you for enrolling in this course!",
        });
      }
    } catch (error) {
      console.error("Error submitting enrollment:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button className={buttonClassName}>{buttonText}</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl text-crimson-700">
            Enroll in Course
          </DialogTitle>
          <DialogDescription>
            Complete the form below to enroll in{" "}
            <span className="font-medium">{courseTitle}</span>
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="space-y-4"
          >
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Full Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter your full name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input
                      type="email"
                      placeholder="Enter your email"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="phoneNumber"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Phone Number</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter your phone number" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="address"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Address</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Enter your full address"
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
                        <SelectValue placeholder="Select your educational level" />
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
                      placeholder="Tell us about your prior experience with this subject"
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
                      placeholder="Why are you interested in this course?"
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
                      placeholder="Any special requests or accommodations needed?"
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
                onClick={() => setIsOpen(false)}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? (
                  <Spinner text="Submitting..." />
                ) : (
                  "Submit Enrollment"
                )}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
