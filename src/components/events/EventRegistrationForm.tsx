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
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import { ArrowRight, CalendarDays, MapPin, User } from "lucide-react";
import type { IEvent } from "@/types/event.types";
import { bookingApi } from "@/utils/eventBookingsApi";
import type { Types } from "mongoose";
import Spinner from "../spinner";

// Form schema
const registrationSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters." }),
  email: z.string().email({ message: "Please enter a valid email address." }),
  phoneNumber: z
    .string()
    .min(10, { message: "Please enter a valid phone number." }),
  TicketNumber: z.string().refine(
    (val) => {
      const num = Number.parseInt(val);
      return !isNaN(num) && num > 0;
    },
    { message: "Please enter a valid number of tickets." }
  ),
  dietaryRequirements: z.string().optional(),
  specialAccomodation: z.string().optional(),
  page: z.string().optional(),
  pageTitle: z.string().optional(),
});

interface EventRegistrationFormProps {
  event: IEvent;
  isOpen: boolean;
  onClose: () => void;
  onSuccessfulRegistration: () => void;
}

export function EventRegistrationForm({
  event,
  isOpen,
  onClose,
  onSuccessfulRegistration,
}: EventRegistrationFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Initialize form
  const form = useForm<z.infer<typeof registrationSchema>>({
    resolver: zodResolver(registrationSchema),
    defaultValues: {
      name: "",
      email: "",
      phoneNumber: "",
      TicketNumber: "1",
      dietaryRequirements: "",
      specialAccomodation: "",
      page: "event-registration",
      pageTitle: `Registration for ${event.title}`,
    },
  });

  // Form submission handler
  async function onSubmit(values: z.infer<typeof registrationSchema>) {
    setIsSubmitting(true);

    try {
      const ticketNumber = Number.parseInt(values.TicketNumber);

      // Check if requested tickets exceed available tickets
      if (ticketNumber > event.availableTickets) {
        toast.error("Not enough tickets available", {
          description: `Only ${event.availableTickets} tickets are available for this event.`,
        });
        setIsSubmitting(false);
        return;
      }

      // Create booking data
      const bookingData = {
        name: values.name,
        email: values.email,
        phoneNumber: values.phoneNumber,
        TicketNumber: ticketNumber,
        eventId: event._id as unknown as Types.ObjectId,
        dietaryRequirements: values.dietaryRequirements,
        specialAccomodation: values.specialAccomodation,
        page: values.page || "event-registration",
        pageTitle: values.pageTitle || `Registration for ${event.title}`,
      };

      // Submit booking
      const success = await bookingApi.createBooking(bookingData);

      if (success) {
        // Show success toast
        toast.success("Registration successful!", {
          description: `You have registered for "${event.title}". A confirmation email has been sent to ${values.email}.`,
        });

        onSuccessfulRegistration();
        onClose();
      }
    } catch (error) {
      console.error("Error during registration:", error);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl">Register for Event</DialogTitle>
          <DialogDescription>
            Complete the form below to register for this event.
          </DialogDescription>
        </DialogHeader>

        {/* Event Summary */}
        <div className="bg-gray-50 p-4 rounded-md mb-4">
          <h3 className="font-medium mb-2">{event.title}</h3>
          <div className="space-y-2 text-sm">
            <div className="flex items-center gap-2 text-gray-600">
              <CalendarDays className="h-4 w-4" />
              <span>
                {new Date(event.date).toLocaleDateString("en-US", {
                  weekday: "long",
                  month: "long",
                  day: "numeric",
                  year: "numeric",
                })}
                {" • "}
                {event.time}
              </span>
            </div>
            <div className="flex items-center gap-2 text-gray-600">
              <MapPin className="h-4 w-4" />
              <span>{event.location}</span>
            </div>
            <div className="flex items-center gap-2 text-gray-600">
              <User className="h-4 w-4" />
              <span>{event.teacher.name}</span>
            </div>
          </div>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Full Name *</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter your full name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email *</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="your.email@example.com"
                        type="email"
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
                    <FormLabel>Phone Number *</FormLabel>
                    <FormControl>
                      <Input placeholder="Your phone number" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="TicketNumber"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Number of Tickets *</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      min="1"
                      max={event.availableTickets.toString()}
                      placeholder="Enter number of tickets"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    {event.availableTickets} ticket
                    {event.availableTickets !== 1 ? "s" : ""} available
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="dietaryRequirements"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Dietary Requirements</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Please list any dietary requirements"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    Leave blank if you have no special dietary needs.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="specialAccomodation"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Special Accommodations</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Please let us know if you need any special accommodations"
                      className="resize-none"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    We want to ensure that everyone can participate comfortably.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button type="button" variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button
                type="submit"
                className="bg-crimson-600 hover:bg-crimson-700"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <Spinner text="Processing..." />
                ) : (
                  "Complete Registration"
                )}
                {!isSubmitting && <ArrowRight className="ml-2 h-4 w-4" />}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
