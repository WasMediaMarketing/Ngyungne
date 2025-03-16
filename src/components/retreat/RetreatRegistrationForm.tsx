"use client";

import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
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
import { retreatRegisterApi } from "@/utils/retreatRegisterApi";
import { toast } from "sonner";
import type { IRetreat } from "@/types";
import Spinner from "../spinner";

// Form validation schema
const formSchema = z.object({
  name: z.string().min(2, {
    message: "Name must be at least 2 characters.",
  }),
  email: z.string().email({
    message: "Please enter a valid email address.",
  }),
  phoneNumber: z.string().min(10, {
    message: "Please enter a valid phone number.",
  }),
  address: z.string().optional(),
  MeditationExperience: z.string().min(1, {
    message: "Please select your meditation experience level.",
  }),
  dietaryRestriction: z.string().optional(),
  specialRequest: z.string().optional(),
  AccomodationType: z.string().min(1, {
    message: "Please select an accommodation type.",
  }),
  emergencyContactName: z.string().min(2, {
    message: "Emergency contact name must be at least 2 characters.",
  }),
  emergencyContactNumber: z.string().min(10, {
    message: "Please enter a valid emergency contact phone number.",
  }),
});

interface RetreatRegistrationFormProps {
  retreat: IRetreat | null;
}

export function RetreatRegistrationForm({
  retreat,
}: RetreatRegistrationFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      phoneNumber: "",
      address: "",
      MeditationExperience: "beginner",
      dietaryRestriction: "",
      specialRequest: "",
      AccomodationType: "shared",
      emergencyContactName: "",
      emergencyContactNumber: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    if (!retreat) return;

    setIsSubmitting(true);

    try {
      // Get the retreat ID as a string
      const retreatId = retreat._id
        ? retreat._id.toString()
        : retreat.id.toString();

      // Prepare the registration data
      const registrationData = {
        ...values,
        retreatId,
        page: window.location.pathname,
        pageTitle: retreat.title,
      };

      // Submit the registration - the API will handle converting the string to ObjectId
      const success = await retreatRegisterApi.registerForRetreat(
        registrationData
      );

      if (success) {
        // Reset the form on success
        form.reset();
        toast.success("Registration Successful", {
          description: "You have successfully registered for the retreat.",
        });
      }
    } catch (error) {
      console.error("Registration error:", error);
      toast.error("Registration Failed", {
        description:
          "There was an error submitting your registration. Please try again.",
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  if (!retreat) {
    return null;
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Full Name</FormLabel>
              <FormControl>
                <Input placeholder="Your Name" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input
                    type="email"
                    placeholder="john.doe@example.com"
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
                <FormLabel>Phone</FormLabel>
                <FormControl>
                  <Input type="tel" placeholder="123-456-7890" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="address"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Address (Optional)</FormLabel>
              <FormControl>
                <Textarea placeholder="Enter your address" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="dietaryRestriction"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Dietary Restrictions</FormLabel>
              <FormControl>
                <Input placeholder="e.g., Vegetarian, Gluten-free" {...field} />
              </FormControl>
              <FormDescription>
                Please list any dietary restrictions or allergies.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="MeditationExperience"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Meditation Experience</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select your experience level" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="beginner">Beginner</SelectItem>
                  <SelectItem value="intermediate">Intermediate</SelectItem>
                  <SelectItem value="advanced">Advanced</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="AccomodationType"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Accommodation Type</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select accommodation type" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="shared">Shared Room</SelectItem>
                  <SelectItem value="private">Private Room</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="specialRequest"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Special Requests</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Any special requests or accommodations"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="emergencyContactName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Emergency Contact Name</FormLabel>
                <FormControl>
                  <Input placeholder="Your Name" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="emergencyContactNumber"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Emergency Contact Phone</FormLabel>
                <FormControl>
                  <Input type="tel" placeholder="123-456-7890" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <Button type="submit" className="w-full" disabled={isSubmitting}>
          {isSubmitting ? (
            <Spinner text="Submitting..." />
          ) : (
            "Register for Retreat"
          )}
        </Button>
      </form>
    </Form>
  );
}
