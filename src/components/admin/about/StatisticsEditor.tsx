"use client";

import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Trash2, Plus, MoveUp, MoveDown } from "lucide-react";
import { IStatistic } from "@/types/about.types";

interface StatisticsEditorProps {
  statistics: IStatistic[];
  onUpdate: (statistics: IStatistic[]) => void;
  onSave: () => Promise<void>;
}

export default function StatisticsEditor({
  statistics,
  onUpdate,
  onSave,
}: StatisticsEditorProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSave = async () => {
    setLoading(true);
    try {
      await onSave();
      setIsEditing(false);
    } catch (error) {
      console.error("Error saving statistics:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleStatisticChange = (
    index: number,
    field: keyof IStatistic,
    value: string
  ) => {
    const updatedStatistics = [...statistics];
    updatedStatistics[index] = { ...updatedStatistics[index], [field]: value };
    onUpdate(updatedStatistics);
  };

  const addStatistic = () => {
    onUpdate([
      ...statistics,
      { title: "New Statistic", value: "0", icon: "", description: "" },
    ]);
  };

  const removeStatistic = (index: number) => {
    const updatedStatistics = [...statistics];
    updatedStatistics.splice(index, 1);
    onUpdate(updatedStatistics);
  };

  const moveStatistic = (index: number, direction: "up" | "down") => {
    if (
      (direction === "up" && index === 0) ||
      (direction === "down" && index === statistics.length - 1)
    ) {
      return;
    }

    const updatedStatistics = [...statistics];
    const newIndex = direction === "up" ? index - 1 : index + 1;
    const temp = updatedStatistics[index];
    updatedStatistics[index] = updatedStatistics[newIndex];
    updatedStatistics[newIndex] = temp;
    onUpdate(updatedStatistics);
  };

  return (
    <Card className="mb-8">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Statistics</CardTitle>
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
            {statistics.map((stat, index) => (
              <div key={index} className="border p-4 rounded-md">
                <div className="flex justify-between items-center mb-2">
                  <h4 className="font-medium">Statistic {index + 1}</h4>
                  <div className="flex gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => moveStatistic(index, "up")}
                      disabled={index === 0}
                    >
                      <MoveUp className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => moveStatistic(index, "down")}
                      disabled={index === statistics.length - 1}
                    >
                      <MoveDown className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => removeStatistic(index)}
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
                      value={stat.title}
                      onChange={(e) =>
                        handleStatisticChange(index, "title", e.target.value)
                      }
                      placeholder="e.g., Years of Tradition"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Value
                    </label>
                    <Input
                      value={stat.value}
                      onChange={(e) =>
                        handleStatisticChange(index, "value", e.target.value)
                      }
                      placeholder="e.g., 1000+"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Icon (optional)
                    </label>
                    <Input
                      value={stat.icon || ""}
                      onChange={(e) =>
                        handleStatisticChange(index, "icon", e.target.value)
                      }
                      placeholder="e.g., calendar"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Description (optional)
                    </label>
                    <Input
                      value={stat.description || ""}
                      onChange={(e) =>
                        handleStatisticChange(
                          index,
                          "description",
                          e.target.value
                        )
                      }
                      placeholder="Additional description"
                    />
                  </div>
                </div>
              </div>
            ))}
            <Button onClick={addStatistic} className="w-full" variant="outline">
              <Plus className="h-4 w-4 mr-2" /> Add Statistic
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {statistics.map((stat, index) => (
              <div key={index} className="border p-4 rounded-md text-center">
                <div className="text-2xl font-bold">{stat.value}</div>
                <div className="text-gray-600">{stat.title}</div>
              </div>
            ))}
            {statistics.length === 0 && (
              <div className="col-span-4 text-center py-8 text-gray-500">
                No statistics added yet
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
