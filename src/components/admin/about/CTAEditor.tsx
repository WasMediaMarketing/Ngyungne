"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import type { ICTASection } from "@/types/about.types";

interface CTAEditorProps {
  ctaData: ICTASection;
  onUpdate: (ctaData: ICTASection) => void;
  onSave: () => Promise<void>;
}

export default function CTAEditor({
  ctaData,
  onUpdate,
  onSave,
}: CTAEditorProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSave = async () => {
    setLoading(true);
    try {
      await onSave();
      setIsEditing(false);
    } catch (error) {
      console.error("Error saving CTA section:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (field: keyof ICTASection, value: string) => {
    onUpdate({ ...ctaData, [field]: value });
  };

  return (
    <Card className="mb-8">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Call to Action</CardTitle>
        <div className="flex gap-2">
          {isEditing ? (
            <>
              <Button
                variant="outline"
                onClick={() => setIsEditing(false)}
                disabled={loading}
              >
                Cancel
              </Button>
              <Button onClick={handleSave} disabled={loading}>
                {loading ? "Saving..." : "Save Changes"}
              </Button>
            </>
          ) : (
            <Button onClick={() => setIsEditing(true)}>Edit</Button>
          )}
        </div>
      </CardHeader>
      <CardContent>
        {isEditing ? (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Title</label>
              <Input
                value={ctaData.title}
                onChange={(e) => handleChange("title", e.target.value)}
                placeholder="e.g., Ready to Experience Ngyungne?"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">
                Description
              </label>
              <Textarea
                value={ctaData.description}
                onChange={(e) => handleChange("description", e.target.value)}
                placeholder="Enter description"
                rows={3}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">
                  Primary Button Text
                </label>
                <Input
                  value={ctaData.primaryButtonText}
                  onChange={(e) =>
                    handleChange("primaryButtonText", e.target.value)
                  }
                  placeholder="e.g., Explore Our Retreats"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">
                  Primary Button URL
                </label>
                <Input
                  value={ctaData.primaryButtonUrl}
                  onChange={(e) =>
                    handleChange("primaryButtonUrl", e.target.value)
                  }
                  placeholder="e.g., /programs/retreats"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">
                  Secondary Button Text (optional)
                </label>
                <Input
                  value={ctaData.secondaryButtonText || ""}
                  onChange={(e) =>
                    handleChange("secondaryButtonText", e.target.value)
                  }
                  placeholder="e.g., Read Our Blog"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">
                  Secondary Button URL (optional)
                </label>
                <Input
                  value={ctaData.secondaryButtonUrl || ""}
                  onChange={(e) =>
                    handleChange("secondaryButtonUrl", e.target.value)
                  }
                  placeholder="e.g., /resources/blog"
                />
              </div>
            </div>
          </div>
        ) : (
          <div className="border p-4 rounded-md">
            <h3 className="font-semibold text-lg mb-2">{ctaData.title}</h3>
            <p className="text-gray-600 mb-4">{ctaData.description}</p>
            <div className="flex gap-2">
              <div className="bg-crimson-600 text-white px-3 py-1 rounded-md text-sm">
                {ctaData.primaryButtonText}
              </div>
              {ctaData.secondaryButtonText && (
                <div className="border border-crimson-600 text-crimson-600 px-3 py-1 rounded-md text-sm">
                  {ctaData.secondaryButtonText}
                </div>
              )}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
