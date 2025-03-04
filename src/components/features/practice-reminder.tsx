"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import {
  Bell,
  Calendar,
  Clock,
  AlertCircle,
  Plus,
  Trash2,
  Video,
  Headphones,
  BookOpen,
  X,
  PlayCircle,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "@/components/ui/use-toast-hook";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface Reminder {
  id: number;
  type: string;
  time: string;
  days: string[];
  active: boolean;
}

interface ContentItem {
  id: number;
  title: string;
  description: string;
  duration: string;
  type: "video" | "audio" | "reading";
  thumbnail: string;
}

export function PracticeReminder() {
  const [reminders, setReminders] = useState<Reminder[]>([
    {
      id: 1,
      type: "Meditation",
      time: "06:00",
      days: ["Mon", "Wed", "Fri"],
      active: true,
    },
    {
      id: 2,
      type: "Mantra",
      time: "19:00",
      days: ["Daily"],
      active: true,
    },
  ]);

  const contentItems: ContentItem[] = [
    {
      id: 1,
      title: "Loving-Kindness Meditation",
      description: "Guided meditation for developing compassion",
      duration: "15 min",
      type: "video",
      thumbnail: "/api/placeholder/200/112",
    },
    {
      id: 2,
      title: "Morning Mantra Chanting",
      description: "Traditional mantras with translation",
      duration: "20 min",
      type: "audio",
      thumbnail: "/api/placeholder/200/112",
    },
    {
      id: 3,
      title: "The Path of Liberation",
      description: "Essential teachings on the path",
      duration: "10 pages",
      type: "reading",
      thumbnail: "/api/placeholder/200/112",
    },
  ];

  const [newReminder, setNewReminder] = useState({
    type: "Meditation",
    time: "08:00",
    days: [] as string[],
  });

  const [contentDialogOpen, setContentDialogOpen] = useState(false);
  const [currentContent, setCurrentContent] = useState<ContentItem | null>(
    null
  );

  const handleToggle = (id: number) => {
    setReminders(
      reminders.map((reminder) =>
        reminder.id === id
          ? { ...reminder, active: !reminder.active }
          : reminder
      )
    );
  };

  const handleDaySelect = (day: string) => {
    if (day === "Daily") {
      setNewReminder({ ...newReminder, days: ["Daily"] });
      return;
    }

    // If Daily is already selected and a specific day is being added, remove Daily
    const updatedDays = newReminder.days.includes("Daily")
      ? [day]
      : newReminder.days.includes(day)
      ? newReminder.days.filter((d) => d !== day)
      : [...newReminder.days, day];

    setNewReminder({ ...newReminder, days: updatedDays });
  };

  const handleAddReminder = () => {
    if (newReminder.days.length === 0) {
      toast({
        variant: "destructive",
        title: "Please select at least one day",
        description: "You need to select days for your reminder.",
      });
      return;
    }

    const newEntry = {
      id: Date.now(),
      type: newReminder.type,
      time: newReminder.time,
      days: newReminder.days,
      active: true,
    };

    setReminders([...reminders, newEntry]);

    // Reset form
    setNewReminder({
      type: "Meditation",
      time: "08:00",
      days: [],
    });

    toast({
      title: "Reminder created",
      description: `Your ${newReminder.type} reminder has been set.`,
    });
  };

  const handleDeleteReminder = (id: number) => {
    setReminders(reminders.filter((reminder) => reminder.id !== id));

    toast({
      title: "Reminder deleted",
      description: "Your reminder has been removed.",
    });
  };

  const openContentDetails = (item: ContentItem) => {
    setCurrentContent(item);
    setContentDialogOpen(true);
  };

  return (
    <div className="space-y-6 max-w-2xl mx-auto">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">Practice Reminders</h3>
          <p className="text-sm text-primary/60">
            Set up notifications for your daily practice
          </p>
        </div>

        <Dialog>
          <DialogTrigger asChild>
            <Button variant="outline">
              <Bell className="h-4 w-4 mr-2" />
              Add Reminder
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Create New Reminder</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="reminderType">Reminder Type</Label>
                <Select
                  value={newReminder.type}
                  onValueChange={(value) =>
                    setNewReminder({ ...newReminder, type: value })
                  }
                >
                  <SelectTrigger id="reminderType">
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Meditation">Meditation</SelectItem>
                    <SelectItem value="Mantra">Mantra</SelectItem>
                    <SelectItem value="Reading">Reading</SelectItem>
                    <SelectItem value="Yoga">Yoga</SelectItem>
                    <SelectItem value="Custom">Custom</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="reminderTime">Time</Label>
                <Input
                  id="reminderTime"
                  type="time"
                  value={newReminder.time}
                  onChange={(e) =>
                    setNewReminder({ ...newReminder, time: e.target.value })
                  }
                />
              </div>

              <div className="space-y-2">
                <Label>Repeat</Label>
                <div className="grid grid-cols-4 gap-2 mt-2">
                  {[
                    "Mon",
                    "Tue",
                    "Wed",
                    "Thu",
                    "Fri",
                    "Sat",
                    "Sun",
                    "Daily",
                  ].map((day) => (
                    <div key={day} className="flex items-center space-x-2">
                      <Checkbox
                        id={`day-${day}`}
                        checked={newReminder.days.includes(day)}
                        onCheckedChange={() => handleDaySelect(day)}
                      />
                      <Label htmlFor={`day-${day}`} className="text-sm">
                        {day}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-amber-50 p-3 rounded-md flex items-start space-x-3 text-sm">
                <AlertCircle className="h-5 w-5 text-amber-600 flex-shrink-0 mt-0.5" />
                <p className="text-amber-800">
                  Reminders will be sent as browser notifications when you're
                  using the app
                </p>
              </div>
            </div>
            <DialogFooter className="sm:justify-between">
              <DialogClose asChild>
                <Button variant="outline" type="button">
                  Cancel
                </Button>
              </DialogClose>
              <DialogClose asChild>
                <Button type="button" onClick={handleAddReminder}>
                  Add Reminder
                </Button>
              </DialogClose>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="space-y-4">
        {reminders.map((reminder) => (
          <div
            key={reminder.id}
            className="flex items-center justify-between p-4 bg-white rounded-lg shadow"
          >
            <div className="space-y-1">
              <h4 className="font-medium">{reminder.type}</h4>
              <div className="flex items-center gap-2 text-sm text-primary/60">
                <Clock className="h-4 w-4" />
                {reminder.time}
                <Calendar className="h-4 w-4 ml-2" />
                {reminder.days.join(", ")}
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Switch
                checked={reminder.active}
                onCheckedChange={() => handleToggle(reminder.id)}
              />
              <Button
                variant="ghost"
                size="icon"
                onClick={() => handleDeleteReminder(reminder.id)}
              >
                <Trash2 className="h-4 w-4 text-red-500" />
              </Button>
            </div>
          </div>
        ))}
      </div>

      <div className="pt-6">
        <h3 className="text-lg font-semibold mb-4">Practice Resources</h3>

        <Tabs defaultValue="video">
          <TabsList className="grid w-full grid-cols-3 mb-4">
            <TabsTrigger value="video" className="flex items-center gap-2">
              <Video className="h-4 w-4" />
              Watch
            </TabsTrigger>
            <TabsTrigger value="audio" className="flex items-center gap-2">
              <Headphones className="h-4 w-4" />
              Listen
            </TabsTrigger>
            <TabsTrigger value="reading" className="flex items-center gap-2">
              <BookOpen className="h-4 w-4" />
              Read
            </TabsTrigger>
          </TabsList>

          {["video", "audio", "reading"].map((contentType) => (
            <TabsContent
              key={contentType}
              value={contentType}
              className="space-y-4"
            >
              {contentItems
                .filter((item) => item.type === contentType)
                .map((item) => (
                  <Card key={item.id} className="overflow-hidden">
                    <div className="flex flex-col sm:flex-row">
                      <div className="sm:w-1/3">
                        <img
                          src={item.thumbnail}
                          alt={item.title}
                          className="w-full h-40 sm:h-full object-cover"
                        />
                      </div>
                      <div className="p-4 sm:w-2/3 flex flex-col justify-between">
                        <div>
                          <h4 className="font-semibold text-lg">
                            {item.title}
                          </h4>
                          <p className="text-sm text-primary/60 mt-1">
                            {item.description}
                          </p>
                          <div className="flex items-center mt-2">
                            <Clock className="h-4 w-4 text-primary/60 mr-1" />
                            <span className="text-xs text-primary/60">
                              {item.duration}
                            </span>
                          </div>
                        </div>
                        <div className="mt-4">
                          <Button
                            className="w-full sm:w-auto"
                            onClick={() => openContentDetails(item)}
                          >
                            {contentType === "video" && (
                              <>
                                <PlayCircle className="h-4 w-4 mr-2" />
                                Watch Now
                              </>
                            )}
                            {contentType === "audio" && (
                              <>
                                <Headphones className="h-4 w-4 mr-2" />
                                Listen Now
                              </>
                            )}
                            {contentType === "reading" && (
                              <>
                                <BookOpen className="h-4 w-4 mr-2" />
                                Read Now
                              </>
                            )}
                          </Button>
                        </div>
                      </div>
                    </div>
                  </Card>
                ))}
            </TabsContent>
          ))}
        </Tabs>
      </div>

      <Dialog open={contentDialogOpen} onOpenChange={setContentDialogOpen}>
        {currentContent && (
          <DialogContent className="sm:max-w-lg">
            <DialogHeader>
              <DialogTitle>{currentContent.title}</DialogTitle>
            </DialogHeader>
            <div className="py-4">
              <div className="aspect-video mb-4 bg-black flex items-center justify-center rounded-md overflow-hidden">
                {currentContent.type === "video" && (
                  <div className="relative w-full h-full">
                    <img
                      src={currentContent.thumbnail}
                      alt={currentContent.title}
                      className="w-full h-full object-cover opacity-50"
                    />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <PlayCircle className="h-16 w-16 text-white" />
                    </div>
                  </div>
                )}
                {currentContent.type === "audio" && (
                  <div className="w-full p-4 flex flex-col items-center justify-center">
                    <img
                      src={currentContent.thumbnail}
                      alt={currentContent.title}
                      className="w-32 h-32 object-cover rounded-md mb-4"
                    />
                    <div className="w-full bg-gray-200 h-2 rounded-full overflow-hidden">
                      <div className="bg-primary h-full w-1/3"></div>
                    </div>
                    <div className="flex justify-between w-full mt-2 text-xs text-white">
                      <span>6:20</span>
                      <span>20:00</span>
                    </div>
                  </div>
                )}
                {currentContent.type === "reading" && (
                  <div className="p-6 w-full h-full overflow-auto bg-white text-black">
                    <h3 className="text-xl font-bold mb-4">
                      {currentContent.title}
                    </h3>
                    <p className="mb-4">
                      Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                      Vivamus at justo vel nunc commodo facilisis. Aenean vel
                      felis vestibulum, hendrerit turpis non, accumsan metus.
                      Proin ac mauris sit amet eros aliquet lobortis.
                    </p>
                    <p>
                      Vivamus facilisis lorem urna, quis tincidunt enim
                      tincidunt sed. Cras volutpat velit at purus tincidunt, vel
                      convallis nibh maximus. Cras sit amet rutrum sapien, vel
                      condimentum mauris.
                    </p>
                  </div>
                )}
              </div>

              <p className="text-sm">{currentContent.description}</p>

              <div className="flex items-center justify-between mt-4">
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-primary/60" />
                  <span className="text-sm text-primary/60">
                    {currentContent.duration}
                  </span>
                </div>

                <Dialog>
                  <DialogTrigger asChild>
                    <Button variant="outline" size="sm">
                      <Bell className="h-4 w-4 mr-2" />
                      Set Reminder
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                      <DialogTitle>
                        Set Reminder for {currentContent.title}
                      </DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                      <div className="space-y-2">
                        <Label htmlFor="reminderContentTime">Time</Label>
                        <Input
                          id="reminderContentTime"
                          type="time"
                          defaultValue="08:00"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label>Repeat</Label>
                        <div className="grid grid-cols-4 gap-2 mt-2">
                          {[
                            "Mon",
                            "Tue",
                            "Wed",
                            "Thu",
                            "Fri",
                            "Sat",
                            "Sun",
                            "Daily",
                          ].map((day) => (
                            <div
                              key={day}
                              className="flex items-center space-x-2"
                            >
                              <Checkbox id={`content-day-${day}`} />
                              <Label
                                htmlFor={`content-day-${day}`}
                                className="text-sm"
                              >
                                {day}
                              </Label>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                    <DialogFooter className="sm:justify-between">
                      <DialogClose asChild>
                        <Button variant="outline" type="button">
                          Cancel
                        </Button>
                      </DialogClose>
                      <DialogClose asChild>
                        <Button type="button">Set Reminder</Button>
                      </DialogClose>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>
            </div>
            <DialogFooter className="sm:justify-start">
              <DialogClose asChild>
                <Button variant="outline">
                  <X className="h-4 w-4 mr-2" />
                  Close
                </Button>
              </DialogClose>
            </DialogFooter>
          </DialogContent>
        )}
      </Dialog>
    </div>
  );
}
