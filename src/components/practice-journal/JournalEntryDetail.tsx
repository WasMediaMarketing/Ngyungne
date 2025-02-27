import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import type { JournalEntry } from "@/types/practice-journal";
import { practiceTypes } from "@/data/practice-types";
import {
  Calendar,
  Clock,
  Star,
  Edit,
  Save,
  Trash2,
  Sparkles,
  Plus,
} from "lucide-react";

interface JournalEntryDetailProps {
  entry: JournalEntry;
  isEditing: boolean;
  editedEntry: JournalEntry | null;
  setEditedEntry: (entry: JournalEntry) => void;
  setIsEditing: (isEditing: boolean) => void;
  onSave: () => void;
  onDelete: () => void;
}

export default function JournalEntryDetail({
  entry,
  isEditing,
  editedEntry,
  setEditedEntry,
  setIsEditing,
  onSave,
  onDelete,
}: JournalEntryDetailProps) {
  const getTypeIcon = (type: string) => {
    const practiceType = practiceTypes.find((p) => p.value === type);
    return practiceType ? practiceType.icon : "📝";
  };

  const getTypeColor = (type: string) => {
    const practiceType = practiceTypes.find((p) => p.value === type);
    return practiceType ? practiceType.color : "bg-gray-100 text-gray-700";
  };

  const getTypeBorderColor = (type: string) => {
    if (type === "Meditation") return "border-blue-300";
    if (type === "Scripture Study") return "border-amber-300";
    if (type === "Mantra Recitation") return "border-purple-300";
    if (type === "Prostrations") return "border-green-300";
    if (type === "Prayer") return "border-indigo-300";
    if (type === "Yoga") return "border-rose-300";
    return "border-gray-300";
  };

  return (
    <Card
      className={`overflow-hidden border-l-4 ${getTypeBorderColor(entry.type)}`}
    >
      <CardHeader className="bg-primary/5">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <div
              className={`${getTypeColor(
                entry.type
              )} h-14 w-14 rounded-full flex items-center justify-center text-2xl mr-4 shadow-sm`}
            >
              {getTypeIcon(entry.type)}
            </div>
            <div>
              <CardTitle className="text-2xl">{entry.type}</CardTitle>
              <CardDescription className="flex items-center mt-1">
                <Calendar className="h-4 w-4 mr-1" />
                {new Date(entry.date).toLocaleDateString("en-US", {
                  weekday: "long",
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </CardDescription>
            </div>
          </div>

          <div className="flex flex-col items-end">
            <Badge variant="outline" className="mb-2 flex items-center">
              <Clock className="mr-1 h-3 w-3" />
              {entry.duration} minutes
            </Badge>
            <div className="flex">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star
                  key={i}
                  className={`h-5 w-5 ${
                    i < entry.mood
                      ? "text-yellow-400 fill-yellow-400"
                      : "text-gray-200"
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      </CardHeader>

      <CardContent className="pt-6 space-y-6">
        <div className="space-y-3">
          <h3 className="font-semibold text-primary flex items-center">
            <Sparkles className="mr-2 h-4 w-4 text-primary/70" />
            Practice Notes
          </h3>
          {isEditing ? (
            <Textarea
              value={editedEntry?.notes || ""}
              onChange={(e) =>
                setEditedEntry({ ...editedEntry!, notes: e.target.value })
              }
              className="min-h-32"
            />
          ) : (
            <div className="p-4 rounded-md bg-primary/5 whitespace-pre-line">
              {entry.notes}
            </div>
          )}
        </div>

        {entry.insights && entry.insights.length > 0 && (
          <div className="space-y-3">
            <Separator />
            <h3 className="font-semibold text-primary flex items-center">
              <Sparkles className="mr-2 h-4 w-4 text-primary/70" />
              Key Insights
            </h3>

            {isEditing ? (
              <div className="space-y-2">
                {editedEntry?.insights?.map((insight, index) => (
                  <div key={index} className="flex items-center">
                    <Textarea
                      value={insight}
                      onChange={(e) => {
                        const updatedInsights = [...editedEntry.insights!];
                        updatedInsights[index] = e.target.value;
                        setEditedEntry({
                          ...editedEntry,
                          insights: updatedInsights,
                        });
                      }}
                      className="flex-1"
                    />
                    <Button
                      variant="ghost"
                      size="sm"
                      className="ml-2 text-red-500"
                      onClick={() => {
                        const updatedInsights = [...editedEntry.insights!];
                        updatedInsights.splice(index, 1);
                        setEditedEntry({
                          ...editedEntry,
                          insights: updatedInsights,
                        });
                      }}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setEditedEntry({
                      ...editedEntry!,
                      insights: [...(editedEntry?.insights || []), ""],
                    });
                  }}
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Add Insight
                </Button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {entry.insights.map((insight, index) => (
                  <div
                    key={index}
                    className="p-3 rounded-md bg-primary/5 border border-primary/10 flex items-start"
                  >
                    <Sparkles className="h-4 w-4 mr-2 text-primary/60 mt-1 flex-shrink-0" />
                    <p>{insight}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </CardContent>

      <CardFooter className="bg-primary/5 flex justify-between items-center border-t">
        <div className="text-sm text-primary/60">Entry ID: {entry.id}</div>
        <div className="flex items-center text-sm text-primary/60">
          <Clock className="h-4 w-4 mr-1" />
          Last updated: {new Date().toLocaleDateString()}
        </div>
      </CardFooter>

      <div className="p-4 bg-white border-t flex justify-end gap-2">
        {isEditing ? (
          <>
            <Button variant="outline" onClick={() => setIsEditing(false)}>
              Cancel
            </Button>
            <Button onClick={onSave}>
              <Save className="mr-2 h-4 w-4" />
              Save
            </Button>
          </>
        ) : (
          <>
            <Button
              variant="outline"
              className="text-red-500"
              onClick={onDelete}
            >
              <Trash2 className="mr-2 h-4 w-4" />
              Delete
            </Button>
            <Button variant="outline" onClick={() => setIsEditing(true)}>
              <Edit className="mr-2 h-4 w-4" />
              Edit
            </Button>
          </>
        )}
      </div>
    </Card>
  );
}
