"use client";

import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
import { Trash2, Plus, MoveUp, MoveDown } from "lucide-react";
import { IPracticeItem } from "@/types/about.types";

interface PracticeEditorProps {
  practiceItems: IPracticeItem[];
  onUpdate: (practiceItems: IPracticeItem[]) => void;
  onSave: () => Promise<void>;
}

export default function PracticeEditor({
  practiceItems,
  onUpdate,
  onSave,
}: PracticeEditorProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);

  const iconOptions = [
    { value: "lotus", label: "Lotus" },
    { value: "brain", label: "Brain" },
    { value: "zap", label: "Zap" },
    { value: "heart", label: "Heart" },
    { value: "feather", label: "Feather" },
    { value: "sunrise", label: "Sunrise" },
    { value: "leaf", label: "Leaf" },
  ];

  const handleSave = async () => {
    setLoading(true);
    try {
      await onSave();
      setIsEditing(false);
    } catch (error) {
      console.error("Error saving practice items:", error);
    } finally {
      setLoading(false);
    }
  };

  const handlePracticeItemChange = (
    index: number,
    field: keyof IPracticeItem,
    value: string
  ) => {
    const updatedPracticeItems = [...practiceItems];
    updatedPracticeItems[index] = {
      ...updatedPracticeItems[index],
      [field]: value,
    };
    onUpdate(updatedPracticeItems);
  };

  const addPracticeItem = () => {
    const newId = `practice-${Date.now()}`;
    onUpdate([
      ...practiceItems,
      {
        id: newId,
        title: "New Practice",
        description: "Description goes here",
        icon: "lotus",
        order: practiceItems.length,
      },
    ]);
  };

  const removePracticeItem = (index: number) => {
    const updatedPracticeItems = [...practiceItems];
    updatedPracticeItems.splice(index, 1);
    // Update order for remaining items
    updatedPracticeItems.forEach((item, i) => {
      item.order = i;
    });
    onUpdate(updatedPracticeItems);
  };

  const movePracticeItem = (index: number, direction: "up" | "down") => {
    if (
      (direction === "up" && index === 0) ||
      (direction === "down" && index === practiceItems.length - 1)
    ) {
      return;
    }

    const updatedPracticeItems = [...practiceItems];
    const newIndex = direction === "up" ? index - 1 : index + 1;

    // Swap order values
    const tempOrder = updatedPracticeItems[index].order;
    updatedPracticeItems[index].order = updatedPracticeItems[newIndex].order;
    updatedPracticeItems[newIndex].order = tempOrder;

    // Swap positions in array
    const temp = updatedPracticeItems[index];
    updatedPracticeItems[index] = updatedPracticeItems[newIndex];
    updatedPracticeItems[newIndex] = temp;

    onUpdate(updatedPracticeItems);
  };

  return (
    <Card className="mb-8">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Practice Elements</CardTitle>
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
            {practiceItems.map((item, index) => (
              <div key={item.id} className="border p-4 rounded-md">
                <div className="flex justify-between items-center mb-2">
                  <h4 className="font-medium">Practice Element {index + 1}</h4>
                  <div className="flex gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => movePracticeItem(index, "up")}
                      disabled={index === 0}
                    >
                      <MoveUp className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => movePracticeItem(index, "down")}
                      disabled={index === practiceItems.length - 1}
                    >
                      <MoveDown className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => removePracticeItem(index)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Title
                    </label>
                    <Input
                      value={item.title}
                      onChange={(e) =>
                        handlePracticeItemChange(index, "title", e.target.value)
                      }
                      placeholder="e.g., Fasting"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Icon
                    </label>
                    <Select
                      value={item.icon}
                      onValueChange={(value) =>
                        handlePracticeItemChange(index, "icon", value)
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select an icon" />
                      </SelectTrigger>
                      <SelectContent>
                        {iconOptions.map((option) => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="mt-4">
                  <label className="block text-sm font-medium mb-1">
                    Description
                  </label>
                  <Textarea
                    value={item.description}
                    onChange={(e) =>
                      handlePracticeItemChange(
                        index,
                        "description",
                        e.target.value
                      )
                    }
                    placeholder="Enter description"
                    rows={2}
                  />
                </div>
              </div>
            ))}
            <Button
              onClick={addPracticeItem}
              className="w-full"
              variant="outline"
            >
              <Plus className="h-4 w-4 mr-2" /> Add Practice Element
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {practiceItems.map((item) => (
              <div key={item.id} className="border p-4 rounded-md text-center">
                <div className="font-semibold">{item.title}</div>
                <p className="text-sm text-gray-600 line-clamp-2">
                  {item.description}
                </p>
              </div>
            ))}
            {practiceItems.length === 0 && (
              <div className="col-span-6 text-center py-8 text-gray-500">
                No practice elements added yet
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
