import { useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CalendarIcon, Clock, Star, Plus, Sparkles } from "lucide-react";
import type { JournalEntry } from "@/types/practice-journal";
import { practiceTypes } from "@/data/practice-types";

interface JournalEntryFormProps {
  onSubmit: (entry: JournalEntry) => void;
  onCancel: () => void;
}

export default function JournalEntryForm({
  onSubmit,
  onCancel,
}: JournalEntryFormProps) {
  const [newEntry, setNewEntry] = useState<Partial<JournalEntry>>({
    date: new Date().toISOString().split("T")[0],
    type: "Meditation",
    duration: 30,
    notes: "",
    mood: 3,
    insights: [],
  });

  const handleSubmit = () => {
    if (!newEntry.notes) return;

    const newInsights = newEntry.notes
      .split(".")
      .filter(
        (sentence) =>
          sentence.toLowerCase().includes("realized") ||
          sentence.toLowerCase().includes("insight") ||
          sentence.toLowerCase().includes("noticed") ||
          sentence.toLowerCase().includes("understood")
      )
      .map((s) => s.trim())
      .filter((s) => s.length > 10);

    onSubmit({
      ...newEntry,
      id: Date.now().toString(),
      insights: newInsights.length > 0 ? newInsights : undefined,
    } as JournalEntry);
  };

  return (
    <Card className="overflow-hidden border-primary/10 shadow-lg">
      <CardHeader className="bg-primary/5">
        <CardTitle className="flex items-center">
          <Plus className="mr-2 h-5 w-5" />
          New Practice Entry
        </CardTitle>
        <CardDescription>
          Record your spiritual practice session
        </CardDescription>
      </CardHeader>
      <CardContent className="pt-6">
        <div className="grid gap-6">
          <div className="grid md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium flex items-center">
                <CalendarIcon className="h-4 w-4 mr-1" /> Date
              </label>
              <Input
                type="date"
                value={newEntry.date}
                onChange={(e) =>
                  setNewEntry({
                    ...newEntry,
                    date: e.target.value,
                  })
                }
                className="border-primary/20 focus:border-primary"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium flex items-center">
                <Clock className="h-4 w-4 mr-1" /> Practice Type
              </label>
              <Select
                value={newEntry.type}
                onValueChange={(value) =>
                  setNewEntry({
                    ...newEntry,
                    type: value,
                  })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a practice type" />
                </SelectTrigger>
                <SelectContent>
                  {practiceTypes.map((type) => (
                    <SelectItem key={type.value} value={type.value}>
                      <span className="flex items-center">
                        <span className="mr-2">{type.icon}</span>
                        {type.value}
                      </span>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium flex items-center">
                <Clock className="h-4 w-4 mr-1" /> Duration (minutes)
              </label>
              <Input
                type="number"
                value={newEntry.duration}
                onChange={(e) =>
                  setNewEntry({
                    ...newEntry,
                    duration: Number.parseInt(e.target.value),
                  })
                }
                className="border-primary/20 focus:border-primary"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium flex items-center">
              <Star className="h-4 w-4 mr-1" /> Practice Quality
            </label>
            <div className="flex gap-2">
              {[1, 2, 3, 4, 5].map((rating) => (
                <button
                  key={rating}
                  onClick={() =>
                    setNewEntry({
                      ...newEntry,
                      mood: rating,
                    })
                  }
                  className={`w-12 h-12 rounded-full flex items-center justify-center transition-all ${
                    newEntry.mood === rating
                      ? "bg-primary text-white"
                      : "bg-gray-100 hover:bg-gray-200"
                  }`}
                >
                  <Star
                    className={`h-5 w-5 ${
                      newEntry.mood === rating ? "fill-white" : ""
                    }`}
                  />
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium flex items-center">
              <Sparkles className="h-4 w-4 mr-1" /> Notes & Insights
              <span className="text-xs ml-2 text-primary/50">
                (insights will be automatically extracted)
              </span>
            </label>
            <Textarea
              value={newEntry.notes}
              onChange={(e) =>
                setNewEntry({
                  ...newEntry,
                  notes: e.target.value,
                })
              }
              placeholder="Write about your practice experience, insights, challenges..."
              className="min-h-40 border-primary/20 focus:border-primary"
            />
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex justify-end gap-3">
        <Button variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button onClick={handleSubmit}>
          <Plus className="mr-2 h-4 w-4" /> Save Entry
        </Button>
      </CardFooter>
    </Card>
  );
}
