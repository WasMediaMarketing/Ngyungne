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
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { toast } from "@/components/ui/use-toast-hook";
import {
  AlertCircle,
  ArrowRight,
  CalendarDays,
  MapPin,
  User,
} from "lucide-react";
import { Event } from "@/data/events";

// Form schema
const registrationSchema = z.object({
  firstName: z
    .string()
    .min(2, { message: "First name must be at least 2 characters." }),
  lastName: z
    .string()
    .min(2, { message: "Last name must be at least 2 characters." }),
  email: z.string().email({ message: "Please enter a valid email address." }),
  phone: z.string().min(10, { message: "Please enter a valid phone number." }),
  tickets: z.string().min(1, { message: "Please select number of tickets." }),
  dietary: z.string().optional(),
  specialNeeds: z.string().optional(),
  experience: z.enum(["beginner", "intermediate", "advanced"], {
    required_error: "Please select your experience level.",
  }),
  hearAbout: z.string().optional(),
  termsAccepted: z.boolean().refine((val) => val === true, {
    message: "You must accept the terms and conditions.",
  }),
  marketingConsent: z.boolean().optional(),
});

interface EventRegistrationFormProps {
  event: Event;
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
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      tickets: "1",
      dietary: "",
      specialNeeds: "",
      experience: "beginner",
      hearAbout: "",
      termsAccepted: false,
      marketingConsent: false,
    },
  });

  // Calculate available spots
  const spotsLeft = event.capacity - event.attending;
  const ticketOptions = Array.from({ length: Math.min(spotsLeft, 5) }, (_, i) =>
    (i + 1).toString()
  );

  // Form submission handler
  function onSubmit(values: z.infer<typeof registrationSchema>) {
    setIsSubmitting(true);

    // Simulate API call with a timeout
    setTimeout(() => {
      console.log("Registration submitted:", values);

      // Show success toast
      toast({
        title: "Registration successful!",
        description: `You have registered for "${event.title}". A confirmation email has been sent to ${values.email}.`,
      });

      setIsSubmitting(false);
      onSuccessfulRegistration();
      onClose();
    }, 1500);
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
                {event.date.toLocaleDateString("en-US", {
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
              <span>{event.teacher}</span>
            </div>
          </div>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="firstName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>First Name *</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter your first name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="lastName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Last Name *</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter your last name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

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
                name="phone"
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

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="tickets"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Number of Tickets *</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select number of tickets" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {ticketOptions.map((option) => (
                          <SelectItem key={option} value={option}>
                            {option}{" "}
                            {parseInt(option) === 1 ? "ticket" : "tickets"}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormDescription>
                      {spotsLeft} spot{spotsLeft !== 1 ? "s" : ""} remaining
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="experience"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Experience Level *</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select your experience level" />
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
            </div>

            <FormField
              control={form.control}
              name="dietary"
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
              name="specialNeeds"
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

            <FormField
              control={form.control}
              name="hearAbout"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>How did you hear about us?</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select an option" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="social">Social Media</SelectItem>
                      <SelectItem value="friend">Friend/Family</SelectItem>
                      <SelectItem value="search">Search Engine</SelectItem>
                      <SelectItem value="email">Email Newsletter</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="space-y-4">
              <FormField
                control={form.control}
                name="termsAccepted"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel>Terms and Conditions *</FormLabel>
                      <FormDescription>
                        I agree to the{" "}
                        <a
                          href="#"
                          className="text-crimson-600 hover:underline"
                        >
                          terms of service
                        </a>{" "}
                        and{" "}
                        <a
                          href="#"
                          className="text-crimson-600 hover:underline"
                        >
                          privacy policy
                        </a>
                        .
                      </FormDescription>
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="marketingConsent"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel>Marketing Communications</FormLabel>
                      <FormDescription>
                        I would like to receive updates about similar events and
                        promotions.
                      </FormDescription>
                    </div>
                  </FormItem>
                )}
              />
            </div>

            <DialogFooter>
              <Button type="button" variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button
                type="submit"
                className="bg-crimson-600 hover:bg-crimson-700"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Processing..." : "Complete Registration"}
                {!isSubmitting && <ArrowRight className="ml-2 h-4 w-4" />}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
