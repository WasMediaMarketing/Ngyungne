"use client";

import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Trash2, Plus, MoveUp, MoveDown } from "lucide-react";
import { IHistoryItem } from "@/types/about.types";

interface HistoryEditorProps {
  historyItems: IHistoryItem[];
  onUpdate: (historyItems: IHistoryItem[]) => void;
  onSave: () => Promise<void>;
}

export default function HistoryEditor({
  historyItems,
  onUpdate,
  onSave,
}: HistoryEditorProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSave = async () => {
    setLoading(true);
    try {
      await onSave();
      setIsEditing(false);
    } catch (error) {
      console.error("Error saving history items:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleHistoryItemChange = (
    index: number,
    field: keyof IHistoryItem,
    value: any
  ) => {
    const updatedHistoryItems = [...historyItems];
    updatedHistoryItems[index] = {
      ...updatedHistoryItems[index],
      [field]: value,
    };
    onUpdate(updatedHistoryItems);
  };

  const addHistoryItem = () => {
    onUpdate([
      ...historyItems,
      {
        title: "New History Item",
        description: "Description goes here",
        year: "",
        order: historyItems.length,
        isLeftSide: historyItems.length % 2 === 0,
      },
    ]);
  };

  const removeHistoryItem = (index: number) => {
    const updatedHistoryItems = [...historyItems];
    updatedHistoryItems.splice(index, 1);
    // Update order for remaining items
    updatedHistoryItems.forEach((item, i) => {
      item.order = i;
    });
    onUpdate(updatedHistoryItems);
  };

  const moveHistoryItem = (index: number, direction: "up" | "down") => {
    if (
      (direction === "up" && index === 0) ||
      (direction === "down" && index === historyItems.length - 1)
    ) {
      return;
    }

    const updatedHistoryItems = [...historyItems];
    const newIndex = direction === "up" ? index - 1 : index + 1;

    // Swap order values
    const tempOrder = updatedHistoryItems[index].order;
    updatedHistoryItems[index].order = updatedHistoryItems[newIndex].order;
    updatedHistoryItems[newIndex].order = tempOrder;

    // Swap positions in array
    const temp = updatedHistoryItems[index];
    updatedHistoryItems[index] = updatedHistoryItems[newIndex];
    updatedHistoryItems[newIndex] = temp;

    onUpdate(updatedHistoryItems);
  };

  return (
    <Card className="mb-8">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>History Timeline</CardTitle>
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
            {historyItems.map((item, index) => (
              <div key={index} className="border p-4 rounded-md">
                <div className="flex justify-between items-center mb-2">
                  <h4 className="font-medium">History Item {index + 1}</h4>
                  <div className="flex gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => moveHistoryItem(index, "up")}
                      disabled={index === 0}
                    >
                      <MoveUp className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => moveHistoryItem(index, "down")}
                      disabled={index === historyItems.length - 1}
                    >
                      <MoveDown className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => removeHistoryItem(index)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Title
                    </label>
                    <Input
                      value={item.title}
                      onChange={(e) =>
                        handleHistoryItemChange(index, "title", e.target.value)
                      }
                      placeholder="e.g., Origins"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Description
                    </label>
                    <Textarea
                      value={item.description}
                      onChange={(e) =>
                        handleHistoryItemChange(
                          index,
                          "description",
                          e.target.value
                        )
                      }
                      placeholder="Enter description"
                      rows={3}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-1">
                        Year (optional)
                      </label>
                      <Input
                        value={item.year || ""}
                        onChange={(e) =>
                          handleHistoryItemChange(index, "year", e.target.value)
                        }
                        placeholder="e.g., 1100"
                      />
                    </div>
                    <div className="flex items-center space-x-2 pt-6">
                      <Checkbox
                        id={`left-side-${index}`}
                        checked={item.isLeftSide}
                        onCheckedChange={(checked) =>
                          handleHistoryItemChange(
                            index,
                            "isLeftSide",
                            !!checked
                          )
                        }
                      />
                      <label
                        htmlFor={`left-side-${index}`}
                        className="text-sm font-medium"
                      >
                        Display on left side (timeline)
                      </label>
                    </div>
                  </div>
                </div>
              </div>
            ))}
            <Button
              onClick={addHistoryItem}
              className="w-full"
              variant="outline"
            >
              <Plus className="h-4 w-4 mr-2" /> Add History Item
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            {historyItems.map((item, index) => (
              <div key={index} className="border p-4 rounded-md">
                <h4 className="font-semibold">{item.title}</h4>
                {item.year && (
                  <div className="text-sm text-gray-500 mb-1">{item.year}</div>
                )}
                <p className="text-gray-600">{item.description}</p>
              </div>
            ))}
            {historyItems.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                No history items added yet
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
