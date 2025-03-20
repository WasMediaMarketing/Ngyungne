"use client";

import { useState } from "react";
import { toast } from "sonner";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Types } from "mongoose";

import { Button } from "@/components/ui/button";
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
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { retreatRegisterApi } from "@/utils/retreatRegisterApi";
import type {
  IRegisterRetreatData,
  IRegisterRetreatUpdate,
  IRetreat,
  IUser,
} from "@/types";
import Spinner from "@/components/spinner";

// Define the form schema with Zod
const formSchema = z.object({
  MeditationExperience: z.string().min(1, "Meditation experience is required"),
  dietaryRestriction: z.string().optional(),
  specialRequest: z.string().optional(),
  accommodationType: z.string().min(1, "Accommodation type is required"),
  emergencyContactName: z.string().min(2, "Emergency contact name is required"),
  emergencyContactNumber: z
    .string()
    .min(10, "Valid emergency contact number is required"),
});

type FormValues = z.infer<typeof formSchema>;

interface RegistrationFormDialogProps {
  open: boolean;
  registration: IRegisterRetreatData;
  onClose: () => void;
  onSaved: () => void;
}

export default function RegistrationFormDialog({
  open,
  registration,
  onClose,
  onSaved,
}: RegistrationFormDialogProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Helper function to get retreat title
  const getRetreatTitle = (): string => {
    if (
      typeof registration.retreatId === "object" &&
      registration.retreatId !== null &&
      !Types.ObjectId.isValid(registration.retreatId as unknown as string)
    ) {
      return (registration.retreatId as IRetreat).title || "Unknown Retreat";
    }
    return "Unknown Retreat";
  };

  // Helper function to get user name
  const getUserName = (): string => {
    if (
      typeof registration.userId === "object" &&
      registration.userId !== null &&
      !Types.ObjectId.isValid(registration.userId as unknown as string)
    ) {
      return (registration.userId as IUser).name || "Unknown User";
    }
    return "Unknown User";
  };

  // Initialize the form
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      MeditationExperience: registration.MeditationExperience,
      dietaryRestriction: registration.dietaryRestriction || "",
      specialRequest: registration.specialRequest || "",
      accommodationType: registration.accommodationType,
      emergencyContactName: registration.emergencyContactName,
      emergencyContactNumber: registration.emergencyContactNumber,
    },
  });

  // Handle form submission
  const onSubmit = async (values: FormValues) => {
    setIsSubmitting(true);
    try {
      const updateData: IRegisterRetreatUpdate = {
        ...values,
      };

      const success = await retreatRegisterApi.updateRegistration(
        registration._id.toString(),
        updateData
      );

      if (success) {
        toast.success("Success", {
          description: "Registration updated successfully",
        });
        onSaved();
      }
    } catch (error) {
      console.error("Error updating registration:", error);
      toast.error("Error", {
        description: "Failed to update registration",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Registration</DialogTitle>
          <DialogDescription>
            Update registration details for {getUserName()} -{" "}
            {getRetreatTitle()}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="MeditationExperience"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Meditation Experience</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select experience level" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="beginner">Beginner</SelectItem>
                        <SelectItem value="intermediate">
                          Intermediate
                        </SelectItem>
                        <SelectItem value="advanced">Advanced</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="accommodationType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Accommodation Type</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
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
                name="dietaryRestriction"
                render={({ field }) => (
                  <FormItem className="col-span-2">
                    <FormLabel>Dietary Restrictions</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="e.g., Vegetarian, Gluten-free"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      Any dietary restrictions or allergies
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="specialRequest"
                render={({ field }) => (
                  <FormItem className="col-span-2">
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

              <FormField
                control={form.control}
                name="emergencyContactName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Emergency Contact Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Emergency contact name" {...field} />
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
                      <Input
                        type="tel"
                        placeholder="Emergency contact phone"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

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
                  <Spinner text="Saving..." />
                ) : (
                  "Update Registration"
                )}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
