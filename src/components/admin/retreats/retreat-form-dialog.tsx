"use client";

import { useState, useEffect } from "react";
import { toast } from "sonner";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { CalendarIcon, Plus, Trash2 } from "lucide-react";
import { format } from "date-fns";

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
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { retreatApi } from "@/utils/retreatApi";
import type { IRetreat, IRetreatUpdate, IRetreatInput } from "@/types";
import Spinner from "@/components/spinner";

// Define the form schema with Zod
const formSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().min(1, "Description is required"),
  date: z.date({ required_error: "Date is required" }),
  duration: z.string().min(1, "Duration is required"),
  location: z.string().min(1, "Location is required"),
  participants: z.coerce.number().min(1, "Participants is required"),
  price: z.string().min(1, "Price is required"),
  type: z.string().min(1, "Type is required"),
  isVisible: z.boolean().default(false),
  schedule: z
    .array(
      z.object({
        time: z.string().min(1, "Time is required"),
        activity: z.string().min(1, "Activity is required"),
      })
    )
    .default([]),
});

type FormValues = z.infer<typeof formSchema>;

interface RetreatFormDialogProps {
  open: boolean;
  retreat?: IRetreat;
  onClose: () => void;
  onSaved: () => void;
}

export default function RetreatFormDialog({
  open,
  retreat,
  onClose,
  onSaved,
}: RetreatFormDialogProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const isEditing = !!retreat;

  // Initialize the form
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      description: "",
      date: new Date(),
      duration: "",
      location: "",
      participants: 10,
      price: "",
      type: "",
      isVisible: false,
      schedule: [{ time: "", activity: "" }],
    },
  });

  // Set form values when editing an existing retreat
  useEffect(() => {
    if (retreat) {
      form.reset({
        title: retreat.title,
        description: retreat.description,
        date: new Date(retreat.date),
        duration: retreat.duration,
        location: retreat.location,
        participants: retreat.participants,
        price: retreat.price,
        type: retreat.type,
        isVisible: retreat.isVisible,
        schedule: retreat.schedule.length
          ? retreat.schedule
          : [{ time: "", activity: "" }],
      });
    } else {
      form.reset({
        title: "",
        description: "",
        date: new Date(),
        duration: "",
        location: "",
        participants: 10,
        price: "",
        type: "",
        isVisible: false,
        schedule: [{ time: "", activity: "" }],
      });
    }
  }, [retreat, form]);

  // Handle form submission
  const onSubmit = async (values: FormValues) => {
    setIsSubmitting(true);
    try {
      // Filter out empty schedule items
      const filteredSchedule = values.schedule.filter(
        (item) => item.time && item.activity
      );

      if (isEditing && retreat) {
        // For updating, create an object that matches IRetreatUpdate
        const updateData: IRetreatUpdate = {
          title: values.title,
          description: values.description,
          date: format(values.date, "yyyy-MM-dd"),
          duration: values.duration,
          location: values.location,
          participants: values.participants.toString(),
          price: values.price,
          type: values.type,
          isVisible: values.isVisible,
          schedule: filteredSchedule,
        };

        await retreatApi.updateRetreat(retreat._id.toString(), updateData);
        toast.success("Success", {
          description: "Retreat updated successfully",
        });
      } else {
        // For creating, create an object that matches IRetreatInput
        const createData: IRetreatInput = {
          title: values.title,
          description: values.description,
          date: format(values.date, "yyyy-MM-dd"),
          duration: values.duration,
          location: values.location,
          participants: values.participants,
          price: values.price,
          type: values.type,
          isVisible: values.isVisible,
          schedule: filteredSchedule,
        };

        await retreatApi.createRetreat(createData);
        toast.success("Success", {
          description: "Retreat created successfully",
        });
      }
      onSaved();
    } catch (error) {
      console.error("Error saving retreat:", error);
      toast.error("Error", {
        description: `Failed to ${isEditing ? "update" : "create"} retreat`,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Add a new schedule item
  const addScheduleItem = () => {
    const currentSchedule = form.getValues("schedule");
    form.setValue("schedule", [...currentSchedule, { time: "", activity: "" }]);
  };

  // Remove a schedule item
  const removeScheduleItem = (index: number) => {
    const currentSchedule = form.getValues("schedule");
    if (currentSchedule.length > 1) {
      form.setValue(
        "schedule",
        currentSchedule.filter((_, i) => i !== index)
      );
    }
  };

  // Retreat types
  const retreatTypes = [
    "Wellness",
    "Yoga",
    "Meditation",
    "Fitness",
    "Adventure",
    "Spiritual",
    "Corporate",
    "Other",
  ];

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {isEditing ? "Edit Retreat" : "Create New Retreat"}
          </DialogTitle>
          <DialogDescription>
            {isEditing
              ? "Update the details of this retreat."
              : "Fill in the details to create a new retreat."}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem className="md:col-span-2">
                    <FormLabel>Title</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Mountain Wellness Retreat"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Type</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select type" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {retreatTypes.map((type) => (
                          <SelectItem key={type} value={type}>
                            {type}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="date"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Date</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant={"outline"}
                            className={`w-full pl-3 text-left font-normal ${
                              !field.value ? "text-muted-foreground" : ""
                            }`}
                          >
                            {field.value ? (
                              format(field.value, "PPP")
                            ) : (
                              <span>Pick a date</span>
                            )}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
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
                      <Input placeholder="3 days" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="location"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Location</FormLabel>
                    <FormControl>
                      <Input placeholder="Lake Tahoe, CA" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="participants"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Participants</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        min={1}
                        placeholder="20"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="price"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Price</FormLabel>
                    <FormControl>
                      <Input placeholder="$500" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="isVisible"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                    <div className="space-y-0.5">
                      <FormLabel>Publish</FormLabel>
                      <FormDescription>
                        Make this retreat visible to the public
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
                name="description"
                render={({ field }) => (
                  <FormItem className="md:col-span-2">
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="A weekend retreat focusing on wellness and mindfulness."
                        className="min-h-[120px]"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-medium">Schedule</h3>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={addScheduleItem}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Activity
                </Button>
              </div>

              {form.watch("schedule").map((_, index) => (
                <div
                  key={index}
                  className="grid grid-cols-[1fr_2fr_auto] gap-2 items-start"
                >
                  <FormField
                    control={form.control}
                    name={`schedule.${index}.time`}
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <Input placeholder="9:00 AM" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name={`schedule.${index}.activity`}
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <Input placeholder="Morning Yoga" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => removeScheduleItem(index)}
                    disabled={form.watch("schedule").length <= 1}
                  >
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                </div>
              ))}
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
                ) : isEditing ? (
                  "Update"
                ) : (
                  "Create"
                )}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
