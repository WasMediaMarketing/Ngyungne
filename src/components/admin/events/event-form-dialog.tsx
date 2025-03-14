"use client";

import type React from "react";

import { useState, useRef, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { format } from "date-fns";
import { CalendarIcon, X, Plus, Upload, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { eventApi } from "@/utils/eventApi";
import { toast } from "sonner";
import Image from "next/image";
import type { IEvent, ScheduleItem } from "@/types/event.types";

interface EventFormDialogProps {
  event?: IEvent;
  open: boolean;
  onClose: () => void;
  onSaved: () => void;
}

export default function EventFormDialog({
  event,
  open,
  onClose,
  onSaved,
}: EventFormDialogProps) {
  const isEditMode = !!event;
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activeTab, setActiveTab] = useState("basic");

  // Form state
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [type, setType] = useState("");
  const [date, setDate] = useState<Date | undefined>(undefined);
  const [time, setTime] = useState("");
  const [location, setLocation] = useState("");
  const [featured, setFeatured] = useState(false);
  const [capacity, setCapacity] = useState("");
  const [attending, setAttending] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState("");

  // Image upload state
  const [image, setImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const imageInputRef = useRef<HTMLInputElement>(null);

  // Teacher state
  const [teacherName, setTeacherName] = useState("");
  const [teacherSpeciality, setTeacherSpeciality] = useState("");
  const [teacherDescription, setTeacherDescription] = useState("");
  const [teacherLink, setTeacherLink] = useState("");
  const [teacherCredentials, setTeacherCredentials] = useState<string[]>([]);
  const [credentialInput, setCredentialInput] = useState("");
  const [teacherImage, setTeacherImage] = useState<File | null>(null);
  const [teacherImagePreview, setTeacherImagePreview] = useState<string | null>(
    null
  );
  const teacherImageInputRef = useRef<HTMLInputElement>(null);

  // Schedule state
  const [schedule, setSchedule] = useState<{ [key: string]: ScheduleItem }>({});
  const [scheduleTime, setScheduleTime] = useState("");
  const [scheduleTitle, setScheduleTitle] = useState("");
  const [scheduleDescription, setScheduleDescription] = useState("");

  // Initialize form with event data if in edit mode
  useEffect(() => {
    if (event) {
      setTitle(event.title || "");
      setDescription(event.description || "");
      setType(event.type || "");
      setDate(event.date ? new Date(event.date) : undefined);
      setTime(event.time || "");
      setLocation(event.location || "");
      setFeatured(event.featured || false);
      setCapacity(event.capacity?.toString() || "");
      setAttending(event.attending?.toString() || "");
      setTags(event.tags || []);
      setImagePreview(event.image || null);

      // Teacher data
      if (event.teacher) {
        setTeacherName(event.teacher.name || "");
        setTeacherSpeciality(event.teacher.speciality || "");
        setTeacherDescription(event.teacher.description || "");
        setTeacherLink(event.teacher.link || "");
        setTeacherCredentials(event.teacher.credentials || []);
        setTeacherImagePreview(event.teacher.image || null);
      }

      // Schedule data
      if (event.schedule) {
        setSchedule(event.schedule);
      }
    } else {
      // Reset form for new event
      resetForm();
    }
  }, [event]);

  const resetForm = () => {
    setTitle("");
    setDescription("");
    setType("");
    setDate(undefined);
    setTime("");
    setLocation("");
    setFeatured(false);
    setCapacity("");
    setAttending("");
    setTags([]);
    setTagInput("");
    setImage(null);
    setImagePreview(null);

    setTeacherName("");
    setTeacherSpeciality("");
    setTeacherDescription("");
    setTeacherLink("");
    setTeacherCredentials([]);
    setCredentialInput("");
    setTeacherImage(null);
    setTeacherImagePreview(null);

    setSchedule({});
    setScheduleTime("");
    setScheduleTitle("");
    setScheduleDescription("");
  };

  // Handle image upload
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  // Handle teacher image upload
  const handleTeacherImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setTeacherImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setTeacherImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  // Handle image drag and drop
  const handleImageDrop = (
    e: React.DragEvent<HTMLDivElement>,
    isTeacherImage = false
  ) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file) {
      if (isTeacherImage) {
        setTeacherImage(file);
      } else {
        setImage(file);
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        if (isTeacherImage) {
          setTeacherImagePreview(reader.result as string);
        } else {
          setImagePreview(reader.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  // Prevent default behavior for drag events
  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  // Add tag
  const handleAddTag = () => {
    if (tagInput.trim() && !tags.includes(tagInput.trim())) {
      setTags([...tags, tagInput.trim()]);
      setTagInput("");
    }
  };

  // Remove tag
  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter((tag) => tag !== tagToRemove));
  };

  // Add credential
  const handleAddCredential = () => {
    if (
      credentialInput.trim() &&
      !teacherCredentials.includes(credentialInput.trim())
    ) {
      setTeacherCredentials([...teacherCredentials, credentialInput.trim()]);
      setCredentialInput("");
    }
  };

  // Remove credential
  const handleRemoveCredential = (credentialToRemove: string) => {
    setTeacherCredentials(
      teacherCredentials.filter((cred) => cred !== credentialToRemove)
    );
  };

  // Add schedule item
  const handleAddScheduleItem = () => {
    if (scheduleTime.trim() && scheduleTitle.trim()) {
      setSchedule({
        ...schedule,
        [scheduleTime.trim()]: {
          title: scheduleTitle.trim(),
          description: scheduleDescription.trim(),
        },
      });
      setScheduleTime("");
      setScheduleTitle("");
      setScheduleDescription("");
    }
  };

  // Remove schedule item
  const handleRemoveScheduleItem = (timeKey: string) => {
    const newSchedule = { ...schedule };
    delete newSchedule[timeKey];
    setSchedule(newSchedule);
  };

  // Form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (
      !title.trim() ||
      !description.trim() ||
      !type.trim() ||
      !date ||
      !time.trim() ||
      !location.trim() ||
      !teacherName.trim()
    ) {
      toast.error("Error", {
        description: "Please fill in all required fields",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      // Create FormData object
      const formData = new FormData();

      // Add basic event data
      formData.append("title", title);
      formData.append("description", description);
      formData.append("type", type);
      formData.append("date", date.toISOString());
      formData.append("time", time);
      formData.append("location", location);
      // Convert boolean to a format the server can parse correctly
      formData.append("featured", featured ? "true" : "false");

      if (capacity) formData.append("capacity", capacity);
      if (attending) formData.append("attending", attending);

      // Add tags
      if (tags.length > 0) {
        formData.append("tags", JSON.stringify(tags));
      }

      // Add event image if selected
      if (image) {
        formData.append("image", image);
      }

      // Add teacher data
      const teacherData = {
        name: teacherName,
        speciality: teacherSpeciality,
        description: teacherDescription,
        link: teacherLink,
        credentials: teacherCredentials,
      };

      formData.append("teacher", JSON.stringify(teacherData));

      // Add teacher image if selected
      if (teacherImage) {
        formData.append("teacherImage", teacherImage);
      }

      // Add schedule data
      if (Object.keys(schedule).length > 0) {
        formData.append("schedule", JSON.stringify(schedule));
      }

      let success = false;

      if (isEditMode && event) {
        // Update existing event
        success = await eventApi.updateEvent(event._id.toString(), formData);
      } else {
        // Create new event
        success = await eventApi.createEvent(formData);
      }

      if (success) {
        onSaved();
        resetForm();
      }
    } catch (error) {
      console.error("Error submitting event:", error);
      toast.error("Error", {
        description: "Failed to save event",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(isOpen) => {
        if (!isOpen) onClose();
      }}
    >
      <DialogContent className="sm:max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {isEditMode ? "Edit Event" : "Add New Event"}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit}>
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid grid-cols-4 mb-4">
              <TabsTrigger value="basic">Basic Info</TabsTrigger>
              <TabsTrigger value="teacher">Teacher</TabsTrigger>
              <TabsTrigger value="schedule">Schedule</TabsTrigger>
              <TabsTrigger value="media">Media</TabsTrigger>
            </TabsList>

            {/* Basic Info Tab */}
            <TabsContent value="basic" className="space-y-4">
              <div className="grid grid-cols-1 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="title">
                    Title <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Event title"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">
                    Description <span className="text-red-500">*</span>
                  </Label>
                  <Textarea
                    id="description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Event description"
                    rows={4}
                    required
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="type">
                      Event Type <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="type"
                      value={type}
                      onChange={(e) => setType(e.target.value)}
                      placeholder="Workshop, Seminar, etc."
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="location">
                      Location <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="location"
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                      placeholder="Event location"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="date">
                      Date <span className="text-red-500">*</span>
                    </Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className={cn(
                            "w-full justify-start text-left font-normal",
                            !date && "text-muted-foreground"
                          )}
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {date ? format(date, "PPP") : "Select date"}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0">
                        <Calendar
                          mode="single"
                          selected={date}
                          onSelect={setDate}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="time">
                      Time <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="time"
                      value={time}
                      onChange={(e) => setTime(e.target.value)}
                      placeholder="e.g. 2:00 PM - 4:00 PM"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="capacity">Capacity</Label>
                    <Input
                      id="capacity"
                      type="number"
                      value={capacity}
                      onChange={(e) => setCapacity(e.target.value)}
                      placeholder="Maximum attendees (optional)"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="attending">Current Attendees</Label>
                    <Input
                      id="attending"
                      type="number"
                      value={attending}
                      onChange={(e) => setAttending(e.target.value)}
                      placeholder="Current number of attendees"
                      readOnly
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Tags</Label>
                  <div className="flex flex-wrap gap-2 mb-2">
                    {tags.map((tag, index) => (
                      <div
                        key={index}
                        className="flex items-center bg-secondary text-secondary-foreground px-3 py-1 rounded-full text-sm"
                      >
                        {tag}
                        <button
                          type="button"
                          onClick={() => handleRemoveTag(tag)}
                          className="ml-2 text-secondary-foreground/70 hover:text-secondary-foreground"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                  <div className="flex gap-2">
                    <Input
                      value={tagInput}
                      onChange={(e) => setTagInput(e.target.value)}
                      placeholder="Add a tag"
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault();
                          handleAddTag();
                        }
                      }}
                    />
                    <Button type="button" onClick={handleAddTag} size="sm">
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="featured"
                    checked={featured}
                    onCheckedChange={(checked) =>
                      setFeatured(checked as boolean)
                    }
                  />
                  <Label htmlFor="featured">Featured Event</Label>
                </div>
              </div>
            </TabsContent>

            {/* Teacher Tab */}
            <TabsContent value="teacher" className="space-y-4">
              <div className="grid grid-cols-1 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="teacherName">
                    Teacher Name <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="teacherName"
                    value={teacherName}
                    onChange={(e) => setTeacherName(e.target.value)}
                    placeholder="Teacher's name"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="teacherSpeciality">Speciality</Label>
                  <Input
                    id="teacherSpeciality"
                    value={teacherSpeciality}
                    onChange={(e) => setTeacherSpeciality(e.target.value)}
                    placeholder="Teacher's speciality"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="teacherDescription">Description</Label>
                  <Textarea
                    id="teacherDescription"
                    value={teacherDescription}
                    onChange={(e) => setTeacherDescription(e.target.value)}
                    placeholder="About the teacher"
                    rows={3}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="teacherLink">Profile Link</Label>
                  <Input
                    id="teacherLink"
                    value={teacherLink}
                    onChange={(e) => setTeacherLink(e.target.value)}
                    placeholder="Link to teacher's profile"
                  />
                </div>

                <div className="space-y-2">
                  <Label>Credentials</Label>
                  <div className="flex flex-wrap gap-2 mb-2">
                    {teacherCredentials.map((credential, index) => (
                      <div
                        key={index}
                        className="flex items-center bg-secondary text-secondary-foreground px-3 py-1 rounded-full text-sm"
                      >
                        {credential}
                        <button
                          type="button"
                          onClick={() => handleRemoveCredential(credential)}
                          className="ml-2 text-secondary-foreground/70 hover:text-secondary-foreground"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                  <div className="flex gap-2">
                    <Input
                      value={credentialInput}
                      onChange={(e) => setCredentialInput(e.target.value)}
                      placeholder="Add a credential"
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault();
                          handleAddCredential();
                        }
                      }}
                    />
                    <Button
                      type="button"
                      onClick={handleAddCredential}
                      size="sm"
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Teacher Image</Label>
                  <div
                    className="border-2 border-dashed rounded-md p-4 hover:border-primary/50 transition-colors cursor-pointer"
                    onClick={() => teacherImageInputRef.current?.click()}
                    onDrop={(e) => handleImageDrop(e, true)}
                    onDragOver={handleDragOver}
                  >
                    <input
                      type="file"
                      ref={teacherImageInputRef}
                      onChange={handleTeacherImageChange}
                      accept="image/*"
                      className="hidden"
                    />

                    {teacherImagePreview ? (
                      <div className="relative">
                        <div className="relative h-40 w-40 mx-auto rounded-full overflow-hidden">
                          <Image
                            src={teacherImagePreview || "/placeholder.svg"}
                            alt="Teacher preview"
                            fill
                            className="object-cover"
                          />
                        </div>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            setTeacherImage(null);
                            setTeacherImagePreview(null);
                          }}
                          className="absolute top-0 right-0 bg-destructive text-destructive-foreground rounded-full p-1"
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
                </div>
              </div>
            </TabsContent>

            {/* Schedule Tab */}
            <TabsContent value="schedule" className="space-y-4">
              <div className="space-y-4">
                <div className="grid grid-cols-1 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="scheduleTime">Time Slot</Label>
                    <Input
                      id="scheduleTime"
                      value={scheduleTime}
                      onChange={(e) => setScheduleTime(e.target.value)}
                      placeholder="e.g. 9:00 AM"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="scheduleTitle">Activity Title</Label>
                    <Input
                      id="scheduleTitle"
                      value={scheduleTitle}
                      onChange={(e) => setScheduleTitle(e.target.value)}
                      placeholder="e.g. Registration"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="scheduleDescription">
                      Activity Description
                    </Label>
                    <Textarea
                      id="scheduleDescription"
                      value={scheduleDescription}
                      onChange={(e) => setScheduleDescription(e.target.value)}
                      placeholder="Description of the activity"
                      rows={2}
                    />
                  </div>

                  <Button
                    type="button"
                    onClick={handleAddScheduleItem}
                    disabled={!scheduleTime.trim() || !scheduleTitle.trim()}
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add Schedule Item
                  </Button>
                </div>

                <Separator />

                <div className="space-y-2">
                  <h3 className="font-medium">Current Schedule</h3>
                  {Object.keys(schedule).length === 0 ? (
                    <p className="text-sm text-muted-foreground">
                      No schedule items added yet.
                    </p>
                  ) : (
                    <div className="space-y-3">
                      {Object.entries(schedule).map(([time, item], index) => (
                        <div
                          key={index}
                          className="flex items-start border rounded-md p-3"
                        >
                          <div className="flex-1">
                            <div className="font-medium">{time}</div>
                            <div className="text-sm">{item.title}</div>
                            {item.description && (
                              <div className="text-xs text-muted-foreground mt-1">
                                {item.description}
                              </div>
                            )}
                          </div>
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => handleRemoveScheduleItem(time)}
                            className="text-destructive"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </TabsContent>

            {/* Media Tab */}
            <TabsContent value="media" className="space-y-4">
              <div className="space-y-2">
                <Label>Event Image</Label>
                <div
                  className="border-2 border-dashed rounded-md p-6 hover:border-primary/50 transition-colors cursor-pointer"
                  onClick={() => imageInputRef.current?.click()}
                  onDrop={handleImageDrop}
                  onDragOver={handleDragOver}
                >
                  <input
                    type="file"
                    ref={imageInputRef}
                    onChange={handleImageChange}
                    accept="image/*"
                    className="hidden"
                  />

                  {imagePreview ? (
                    <div className="relative">
                      <div className="relative h-60 w-full rounded-md overflow-hidden">
                        <Image
                          src={imagePreview || "/placeholder.svg"}
                          alt="Event preview"
                          fill
                          className="object-cover"
                        />
                      </div>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setImage(null);
                          setImagePreview(null);
                        }}
                        className="absolute top-2 right-2 bg-destructive text-destructive-foreground rounded-full p-1"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  ) : (
                    <div className="text-center">
                      <Upload className="h-12 w-12 mx-auto text-muted-foreground" />
                      <p className="mt-2 text-sm text-muted-foreground">
                        Click to upload or drag and drop
                      </p>
                      <p className="text-xs text-muted-foreground">
                        PNG, JPG, GIF up to 10MB
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </TabsContent>
          </Tabs>

          <DialogFooter className="mt-6">
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
                  <span className="animate-spin mr-2">⟳</span>
                  {isEditMode ? "Updating..." : "Creating..."}
                </>
              ) : (
                <>{isEditMode ? "Update Event" : "Create Event"}</>
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
