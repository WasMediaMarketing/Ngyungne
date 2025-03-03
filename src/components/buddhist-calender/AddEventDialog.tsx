import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
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
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import type { BuddhistEvent, EventType } from "@/types/buddhist-event";

type AddEventDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (event: BuddhistEvent) => void;
  selectedDate?: Date;
};

export function AddEventDialog({
  open,
  onOpenChange,
  onSave,
  selectedDate,
}: AddEventDialogProps) {
  const [eventDate, setEventDate] = useState<Date | undefined>(
    selectedDate || new Date()
  );
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [eventType, setEventType] = useState<EventType>("teaching");
  const [location, setLocation] = useState("");
  const [time, setTime] = useState("");
  const [teacher, setTeacher] = useState("");
  const [selectedTraditions, setSelectedTraditions] = useState<string[]>([]);

  const handleSubmit = () => {
    if (!title || !eventDate) return;

    const newEvent: BuddhistEvent = {
      id: Date.now().toString(),
      title,
      description,
      date: eventDate,
      type: eventType,
      location,
      time,
      teacher: teacher || undefined,
      traditions:
        selectedTraditions.length > 0 ? selectedTraditions : undefined,
    };

    onSave(newEvent);
    resetForm();
    onOpenChange(false);
  };

  const resetForm = () => {
    setTitle("");
    setDescription("");
    setEventType("teaching");
    setLocation("");
    setTime("");
    setTeacher("");
    setSelectedTraditions([]);
  };

  const handleTraditionToggle = (tradition: string) => {
    if (selectedTraditions.includes(tradition)) {
      setSelectedTraditions(selectedTraditions.filter((t) => t !== tradition));
    } else {
      setSelectedTraditions([...selectedTraditions, tradition]);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Add Buddhist Event</DialogTitle>
          <DialogDescription>
            Create a new event in the Buddhist calendar
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="title" className="text-right">
              Title
            </Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="col-span-3"
              placeholder="Event title"
            />
          </div>

          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="description" className="text-right">
              Description
            </Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="col-span-3"
              placeholder="Event description"
            />
          </div>

          <div className="grid grid-cols-4 items-center gap-4">
            <Label className="text-right">Date</Label>
            <div className="col-span-3">
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !eventDate && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {eventDate ? (
                      format(eventDate, "PPP")
                    ) : (
                      <span>Pick a date</span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={eventDate}
                    onSelect={setEventDate}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>

          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="time" className="text-right">
              Time
            </Label>
            <Input
              id="time"
              value={time}
              onChange={(e) => setTime(e.target.value)}
              className="col-span-3"
              placeholder="e.g., 7:00 PM - 9:00 PM"
            />
          </div>

          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="location" className="text-right">
              Location
            </Label>
            <Input
              id="location"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="col-span-3"
              placeholder="Event location"
            />
          </div>

          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="teacher" className="text-right">
              Teacher
            </Label>
            <Input
              id="teacher"
              value={teacher}
              onChange={(e) => setTeacher(e.target.value)}
              className="col-span-3"
              placeholder="Teacher's name (if applicable)"
            />
          </div>

          <div className="grid grid-cols-4 items-center gap-4">
            <Label className="text-right">Type</Label>
            <RadioGroup
              value={eventType}
              onValueChange={(value: EventType) => setEventType(value)}
              className="col-span-3"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="teaching" id="teaching" />
                <Label htmlFor="teaching">Teaching</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="festival" id="festival" />
                <Label htmlFor="festival">Festival</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="practice" id="practice" />
                <Label htmlFor="practice">Practice</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="moon" id="moon" />
                <Label htmlFor="moon">Moon Ceremony</Label>
              </div>
            </RadioGroup>
          </div>

          <div className="grid grid-cols-4 items-start gap-4">
            <Label className="text-right pt-2">Traditions</Label>
            <div className="col-span-3 space-y-2">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="theravada"
                  checked={selectedTraditions.includes("Theravada")}
                  onCheckedChange={() => handleTraditionToggle("Theravada")}
                />
                <Label htmlFor="theravada">Theravada</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="mahayana"
                  checked={selectedTraditions.includes("Mahayana")}
                  onCheckedChange={() => handleTraditionToggle("Mahayana")}
                />
                <Label htmlFor="mahayana">Mahayana</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="vajrayana"
                  checked={selectedTraditions.includes("Vajrayana")}
                  onCheckedChange={() => handleTraditionToggle("Vajrayana")}
                />
                <Label htmlFor="vajrayana">Vajrayana</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="zen"
                  checked={selectedTraditions.includes("Zen")}
                  onCheckedChange={() => handleTraditionToggle("Zen")}
                />
                <Label htmlFor="zen">Zen</Label>
              </div>
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} type="submit">
            Save Event
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
