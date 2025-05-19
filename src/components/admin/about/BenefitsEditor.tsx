"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Trash2, Plus, MoveUp, MoveDown } from "lucide-react";
import type { IBenefitItem } from "@/types/about.types";

interface BenefitsEditorProps {
  benefitItems: IBenefitItem[];
  onUpdate: (benefitItems: IBenefitItem[]) => void;
  onSave: () => Promise<void>;
}

export default function BenefitsEditor({
  benefitItems,
  onUpdate,
  onSave,
}: BenefitsEditorProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);

  const iconOptions = [
    { value: "heart", label: "Heart" },
    { value: "brain", label: "Brain" },
    { value: "leaf", label: "Leaf" },
    { value: "zap", label: "Zap" },
    { value: "feather", label: "Feather" },
  ];

  const handleSave = async () => {
    setLoading(true);
    try {
      await onSave();
      setIsEditing(false);
    } catch (error) {
      console.error("Error saving benefit items:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleBenefitItemChange = (
    index: number,
    field: keyof IBenefitItem,
    value: any
  ) => {
    const updatedBenefitItems = [...benefitItems];
    updatedBenefitItems[index] = {
      ...updatedBenefitItems[index],
      [field]: value,
    };
    onUpdate(updatedBenefitItems);
  };

  const handleBenefitItemListChange = (
    index: number,
    listIndex: number,
    value: string
  ) => {
    const updatedBenefitItems = [...benefitItems];
    const items = [...updatedBenefitItems[index].items];
    items[listIndex] = value;
    updatedBenefitItems[index] = { ...updatedBenefitItems[index], items };
    onUpdate(updatedBenefitItems);
  };

  const addBenefitItem = () => {
    onUpdate([
      ...benefitItems,
      {
        title: "New Benefit Category",
        icon: "heart",
        items: ["Benefit item 1", "Benefit item 2", "Benefit item 3"],
        order: benefitItems.length,
      },
    ]);
  };

  const removeBenefitItem = (index: number) => {
    const updatedBenefitItems = [...benefitItems];
    updatedBenefitItems.splice(index, 1);
    // Update order for remaining items
    updatedBenefitItems.forEach((item, i) => {
      item.order = i;
    });
    onUpdate(updatedBenefitItems);
  };

  const addBenefitListItem = (index: number) => {
    const updatedBenefitItems = [...benefitItems];
    updatedBenefitItems[index].items.push("New benefit item");
    onUpdate(updatedBenefitItems);
  };

  const removeBenefitListItem = (index: number, listIndex: number) => {
    const updatedBenefitItems = [...benefitItems];
    updatedBenefitItems[index].items.splice(listIndex, 1);
    onUpdate(updatedBenefitItems);
  };

  const moveBenefitItem = (index: number, direction: "up" | "down") => {
    if (
      (direction === "up" && index === 0) ||
      (direction === "down" && index === benefitItems.length - 1)
    ) {
      return;
    }

    const updatedBenefitItems = [...benefitItems];
    const newIndex = direction === "up" ? index - 1 : index + 1;

    // Swap order values
    const tempOrder = updatedBenefitItems[index].order;
    updatedBenefitItems[index].order = updatedBenefitItems[newIndex].order;
    updatedBenefitItems[newIndex].order = tempOrder;

    // Swap positions in array
    const temp = updatedBenefitItems[index];
    updatedBenefitItems[index] = updatedBenefitItems[newIndex];
    updatedBenefitItems[newIndex] = temp;

    onUpdate(updatedBenefitItems);
  };

  return (
    <Card className="mb-8">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Benefits</CardTitle>
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
            {benefitItems.map((item, index) => (
              <div key={index} className="border p-4 rounded-md">
                <div className="flex justify-between items-center mb-2">
                  <h4 className="font-medium">Benefit Category {index + 1}</h4>
                  <div className="flex gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => moveBenefitItem(index, "up")}
                      disabled={index === 0}
                    >
                      <MoveUp className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => moveBenefitItem(index, "down")}
                      disabled={index === benefitItems.length - 1}
                    >
                      <MoveDown className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => removeBenefitItem(index)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Title
                    </label>
                    <Input
                      value={item.title}
                      onChange={(e) =>
                        handleBenefitItemChange(index, "title", e.target.value)
                      }
                      placeholder="e.g., Spiritual Growth"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Icon
                    </label>
                    <Select
                      value={item.icon}
                      onValueChange={(value) =>
                        handleBenefitItemChange(index, "icon", value)
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
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Benefit Items
                  </label>
                  {item.items.map((listItem, listIndex) => (
                    <div key={listIndex} className="flex gap-2 mb-2">
                      <Input
                        value={listItem}
                        onChange={(e) =>
                          handleBenefitItemListChange(
                            index,
                            listIndex,
                            e.target.value
                          )
                        }
                        placeholder="Enter benefit item"
                      />
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => removeBenefitListItem(index, listIndex)}
                        className="text-red-500 hover:text-red-700"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                  <Button
                    onClick={() => addBenefitListItem(index)}
                    variant="outline"
                    size="sm"
                    className="mt-2"
                  >
                    <Plus className="h-4 w-4 mr-2" /> Add Item
                  </Button>
                </div>
              </div>
            ))}
            <Button
              onClick={addBenefitItem}
              className="w-full"
              variant="outline"
            >
              <Plus className="h-4 w-4 mr-2" /> Add Benefit Category
            </Button>
          </div>
        ) : (
          <div className="grid md:grid-cols-3 gap-4">
            {benefitItems.map((item, index) => (
              <div key={index} className="border p-4 rounded-md">
                <h4 className="font-semibold mb-2">{item.title}</h4>
                <ul className="list-disc list-inside space-y-1">
                  {item.items.map((listItem, listIndex) => (
                    <li key={listIndex} className="text-gray-600 text-sm">
                      {listItem}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
            {benefitItems.length === 0 && (
              <div className="col-span-3 text-center py-8 text-gray-500">
                No benefit categories added yet
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
