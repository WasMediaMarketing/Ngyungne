"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Settings, Save, RotateCcw, History } from "lucide-react";

const goalSchema = z.object({
  newGoal: z.number().min(1, "Goal must be at least 1").default(108),
});

export function MantraCounter() {
  const [count, setCount] = useState(0);
  const [goal, setGoal] = useState(108);
  const [bellSound, setBellSound] = useState<HTMLAudioElement | null>(null);
  const [history, setHistory] = useState<{ date: string; count: number }[]>([]);
  const [settingsOpen, setSettingsOpen] = useState(false);

  useEffect(() => {
    // Try to load saved state from localStorage
    const savedCount = localStorage.getItem("mantraCount");
    const savedGoal = localStorage.getItem("mantraGoal");
    const savedHistory = localStorage.getItem("mantraHistory");

    if (savedCount) setCount(parseInt(savedCount));
    if (savedGoal) setGoal(parseInt(savedGoal));
    if (savedHistory) setHistory(JSON.parse(savedHistory));

    setBellSound(new Audio("/bell.mp3"));
  }, []);

  useEffect(() => {
    // Save state to localStorage whenever it changes
    localStorage.setItem("mantraCount", count.toString());
    localStorage.setItem("mantraGoal", goal.toString());
    localStorage.setItem("mantraHistory", JSON.stringify(history));
  }, [count, goal, history]);

  const form = useForm<z.infer<typeof goalSchema>>({
    resolver: zodResolver(goalSchema),
    defaultValues: {
      newGoal: goal,
    },
  });

  const handleCount = () => {
    setCount((prev) => {
      const newCount = prev + 1;
      if (newCount === goal) {
        bellSound?.play();
        // Add to history when goal is completed
        setHistory((prevHistory) => [
          { date: new Date().toLocaleDateString(), count: newCount },
          ...prevHistory,
        ]);
      }
      return newCount;
    });
  };

  const resetCount = () => {
    // Add to history before resetting
    if (count > 0) {
      setHistory((prevHistory) => [
        { date: new Date().toLocaleDateString(), count },
        ...prevHistory,
      ]);
    }
    setCount(0);
  };

  const onSaveGoal = (data: z.infer<typeof goalSchema>) => {
    setGoal(data.newGoal);
    setSettingsOpen(false);
  };

  const clearHistory = () => {
    setHistory([]);
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" className="w-full">
          Open Mantra Counter
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex justify-between items-center">
            <span>Mantra Counter</span>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setSettingsOpen(!settingsOpen)}
            >
              <Settings className="h-5 w-5" />
            </Button>
          </DialogTitle>
        </DialogHeader>

        <Tabs defaultValue="counter">
          <TabsList className="w-full">
            <TabsTrigger value="counter" className="w-1/2">
              Counter
            </TabsTrigger>
            <TabsTrigger value="history" className="w-1/2">
              History
            </TabsTrigger>
          </TabsList>

          <TabsContent value="counter" className="space-y-4">
            {settingsOpen ? (
              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(onSaveGoal)}
                  className="space-y-4"
                >
                  <FormField
                    control={form.control}
                    name="newGoal"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Set Goal</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            {...field}
                            onChange={(e) =>
                              field.onChange(parseInt(e.target.value) || 1)
                            }
                            min={1}
                          />
                        </FormControl>
                        <FormDescription>
                          Number of mantras to complete
                        </FormDescription>
                      </FormItem>
                    )}
                  />
                  <div className="flex gap-2">
                    <Button type="submit" className="flex-1">
                      <Save className="h-4 w-4 mr-2" />
                      Save
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      className="flex-1"
                      onClick={() => setSettingsOpen(false)}
                    >
                      Cancel
                    </Button>
                  </div>
                </form>
              </Form>
            ) : (
              <>
                <div className="text-center">
                  <div className="text-7xl font-bold text-primary mb-4">
                    {count}
                  </div>
                  <div className="text-sm text-primary/60">
                    Goal: {goal} recitations
                  </div>
                  <div className="h-3 bg-secondary/20 rounded-full mt-2">
                    <div
                      className="h-full bg-secondary rounded-full transition-all duration-300"
                      style={{
                        width: `${Math.min((count / goal) * 100, 100)}%`,
                      }}
                    />
                  </div>
                </div>
                <div className="flex gap-4">
                  <Button
                    onClick={handleCount}
                    className="flex-1 bg-primary hover:bg-primary/90 text-lg py-6"
                  >
                    Count
                  </Button>
                  <Button
                    onClick={resetCount}
                    variant="outline"
                    className="flex-1"
                  >
                    <RotateCcw className="h-4 w-4 mr-2" />
                    Reset
                  </Button>
                </div>
              </>
            )}
          </TabsContent>

          <TabsContent value="history" className="min-h-[300px]">
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="font-medium">Recent Sessions</h3>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={clearHistory}
                  className="text-xs"
                >
                  Clear History
                </Button>
              </div>

              {history.length > 0 ? (
                <div className="divide-y max-h-[250px] overflow-y-auto">
                  {history.map((session, i) => (
                    <div key={i} className="py-2 flex justify-between">
                      <span className="text-primary/70">{session.date}</span>
                      <span className="font-medium">
                        {session.count} mantras
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center h-[200px] text-center text-primary/50">
                  <History className="h-12 w-12 mb-2 opacity-30" />
                  <p>No history yet.</p>
                  <p className="text-sm">
                    Complete a goal to record your progress.
                  </p>
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
