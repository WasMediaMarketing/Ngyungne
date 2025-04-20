"use client";

import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Trash2 } from "lucide-react";
import type { IVerse } from "@/types/scripture.types";

interface VerseEditorProps {
  verse: IVerse;
  onChange: (field: keyof IVerse, value: string | number) => void;
  onRemove: () => void;
  showRemove: boolean;
}

export function VerseEditor({
  verse,
  onChange,
  onRemove,
  showRemove,
}: VerseEditorProps) {
  return (
    <div className="p-4 border rounded-md bg-muted/20 relative">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
        <div className="space-y-2">
          <Label htmlFor={`verse-number-${verse.number}`}>
            Verse Number <span className="text-destructive">*</span>
          </Label>
          <Input
            id={`verse-number-${verse.number}`}
            type="number"
            value={verse.number}
            onChange={(e) =>
              onChange("number", Number.parseInt(e.target.value, 10) || 1)
            }
            min={1}
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor={`verse-chapter-${verse.number}`}>
            Chapter <span className="text-destructive">*</span>
          </Label>
          <Input
            id={`verse-chapter-${verse.number}`}
            value={verse.chapter}
            onChange={(e) => onChange("chapter", e.target.value)}
            required
          />
        </div>
        {showRemove && (
          <div className="flex items-end justify-end">
            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={onRemove}
              className="text-destructive hover:text-destructive hover:bg-destructive/10"
            >
              <Trash2 className="h-4 w-4" />
              <span className="sr-only">Remove verse</span>
            </Button>
          </div>
        )}
      </div>

      <div className="space-y-2 mb-4">
        <Label htmlFor={`verse-text-${verse.number}`}>
          Verse Text <span className="text-destructive">*</span>
        </Label>
        <Textarea
          id={`verse-text-${verse.number}`}
          value={verse.text}
          onChange={(e) => onChange("text", e.target.value)}
          placeholder="Enter the verse text"
          rows={3}
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor={`verse-commentary-${verse.number}`}>Commentary</Label>
        <Textarea
          id={`verse-commentary-${verse.number}`}
          value={verse.commentary || ""}
          onChange={(e) => onChange("commentary", e.target.value)}
          placeholder="Optional commentary or explanation"
          rows={2}
        />
      </div>
    </div>
  );
}
