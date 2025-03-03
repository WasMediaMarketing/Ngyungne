"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Calendar, Check, Plus } from "lucide-react";

export function PracticeDashboard() {
  const [selectedPeriod] = useState("week");
  const [isGoalDialogOpen, setIsGoalDialogOpen] = useState(false);
  const [isLogDialogOpen, setIsLogDialogOpen] = useState(false);
  const [currentTab, setCurrentTab] = useState("meditation");
  const [newGoal, setNewGoal] = useState("");
  const [logValue, setLogValue] = useState("");
  const [logDate, setLogDate] = useState(
    new Date().toISOString().split("T")[0]
  );

  const practiceData = {
    meditation: {
      daily: 30,
      weekly: 210,
      monthly: 900,
      goal: 1000,
      streak: 7,
    },
    mantras: {
      daily: 108,
      weekly: 756,
      monthly: 3240,
      goal: 10000,
      streak: 5,
    },
    teachings: {
      completed: 12,
      inProgress: 3,
      total: 20,
    },
  };

  const handleSaveGoal = () => {
    // Implementation would go here to save the new goal
    setIsGoalDialogOpen(false);
    setNewGoal("");
  };

  const handleLogPractice = () => {
    // Implementation would go here to log the practice
    setIsLogDialogOpen(false);
    setLogValue("");
  };

  const getCurrentGoal = () => {
    switch (currentTab) {
      case "meditation":
        return practiceData.meditation.goal;
      case "mantras":
        return practiceData.mantras.goal;
      default:
        return 0;
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle>Practice Dashboard</CardTitle>
              <CardDescription>
                Track your spiritual practice and progress
              </CardDescription>
            </div>
            <Button
              variant="outline"
              onClick={() => setIsLogDialogOpen(true)}
              className="flex items-center gap-2"
            >
              <Plus className="h-4 w-4" />
              Log Practice
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <Tabs
            defaultValue="meditation"
            className="space-y-4"
            onValueChange={setCurrentTab}
          >
            <TabsList>
              <TabsTrigger value="meditation">Meditation</TabsTrigger>
              <TabsTrigger value="mantras">Mantras</TabsTrigger>
              <TabsTrigger value="teachings">Teachings</TabsTrigger>
            </TabsList>

            <TabsContent value="meditation" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium">
                      Daily Practice
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">
                      {practiceData.meditation.daily} min
                    </div>
                    <p className="text-xs text-muted-foreground">
                      +5 min from yesterday
                    </p>
                    <Progress value={70} className="mt-2" />
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium">
                      Weekly Total
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">
                      {practiceData.meditation.weekly} min
                    </div>
                    <p className="text-xs text-muted-foreground flex items-center justify-between">
                      <span>Goal: 300 min</span>
                      <Button
                        variant="ghost"
                        className="h-6 p-0 text-xs text-primary"
                        onClick={() => {
                          setNewGoal(String(getCurrentGoal()));
                          setIsGoalDialogOpen(true);
                        }}
                      >
                        Edit Goal
                      </Button>
                    </p>
                    <Progress value={80} className="mt-2" />
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium">
                      Streak
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">
                      {practiceData.meditation.streak} days
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Personal best: 14 days
                    </p>
                  </CardContent>
                </Card>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle>Practice History</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-[200px] w-full flex items-center justify-center bg-secondary/10 rounded-md">
                    <p className="text-primary/60">
                      Chart visualization would go here
                    </p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="mantras" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium">
                      Daily Recitations
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">
                      {practiceData.mantras.daily}
                    </div>
                    <p className="text-xs text-muted-foreground">
                      +28 from yesterday
                    </p>
                    <Progress value={60} className="mt-2" />
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium">
                      Weekly Total
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">
                      {practiceData.mantras.weekly}
                    </div>
                    <p className="text-xs text-muted-foreground flex items-center justify-between">
                      <span>Goal: 1000 recitations</span>
                      <Button
                        variant="ghost"
                        className="h-6 p-0 text-xs text-primary"
                        onClick={() => {
                          setNewGoal(String(getCurrentGoal()));
                          setIsGoalDialogOpen(true);
                        }}
                      >
                        Edit Goal
                      </Button>
                    </p>
                    <Progress value={75} className="mt-2" />
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium">
                      Streak
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">
                      {practiceData.mantras.streak} days
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Personal best: 10 days
                    </p>
                  </CardContent>
                </Card>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle>Recitation History</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-[200px] w-full flex items-center justify-center bg-secondary/10 rounded-md">
                    <p className="text-primary/60">
                      Chart visualization would go here
                    </p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="teachings" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium">
                      Completed
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">
                      {practiceData.teachings.completed}
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Out of {practiceData.teachings.total} teachings
                    </p>
                    <Progress
                      value={
                        (practiceData.teachings.completed /
                          practiceData.teachings.total) *
                        100
                      }
                      className="mt-2"
                    />
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium">
                      In Progress
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">
                      {practiceData.teachings.inProgress}
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Currently studying
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium">
                      Completion Rate
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">
                      {Math.round(
                        (practiceData.teachings.completed /
                          practiceData.teachings.total) *
                          100
                      )}
                      %
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Overall progress
                    </p>
                  </CardContent>
                </Card>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle>Teaching Progress</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-[200px] w-full flex items-center justify-center bg-secondary/10 rounded-md">
                    <p className="text-primary/60">
                      Progress visualization would go here
                    </p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Goal Setting Dialog */}
      <Dialog open={isGoalDialogOpen} onOpenChange={setIsGoalDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Set New Goal</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">
                {currentTab === "meditation"
                  ? "Meditation Minutes Goal"
                  : "Mantra Recitations Goal"}
              </label>
              <Input
                type="number"
                value={newGoal}
                onChange={(e) => setNewGoal(e.target.value)}
                placeholder={`Enter your ${
                  currentTab === "meditation" ? "minutes" : "recitations"
                } goal`}
                min="1"
              />
            </div>
            <Button onClick={handleSaveGoal} className="w-full">
              Save Goal
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Log Practice Dialog */}
      <Dialog open={isLogDialogOpen} onOpenChange={setIsLogDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Log Your Practice</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Date</label>
              <Input
                type="date"
                value={logDate}
                onChange={(e) => setLogDate(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">
                {currentTab === "meditation"
                  ? "Meditation Minutes"
                  : currentTab === "mantras"
                  ? "Mantra Recitations"
                  : "Teachings Completed"}
              </label>
              <Input
                type="number"
                value={logValue}
                onChange={(e) => setLogValue(e.target.value)}
                placeholder={`Enter ${
                  currentTab === "meditation"
                    ? "minutes meditated"
                    : currentTab === "mantras"
                    ? "mantras recited"
                    : "teachings completed"
                }`}
                min="1"
              />
            </div>
            <Button onClick={handleLogPractice} className="w-full">
              Log Practice
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
