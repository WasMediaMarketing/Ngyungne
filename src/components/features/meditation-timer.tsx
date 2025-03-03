"use client";

import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import {
  Bell,
  Settings,
  Calendar,
  Save,
  Play,
  Pause,
  RotateCcw,
  Volume2,
  Volume,
  Music,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

export function MeditationTimer() {
  const [duration, setDuration] = useState(15);
  const [timeLeft, setTimeLeft] = useState(duration * 60);
  const [isActive, setIsActive] = useState(false);
  const [bellSound, setBellSound] = useState<HTMLAudioElement | null>(null);
  const [backgroundSound, setBackgroundSound] =
    useState<HTMLAudioElement | null>(null);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [completedSessions, setCompletedSessions] = useState<
    { date: string; duration: number }[]
  >([]);
  const [selectedSound, setSelectedSound] = useState("bell");
  const [selectedBackgroundSound, setSelectedBackgroundSound] =
    useState("none");
  const [volume, setVolume] = useState(50);
  const [intervalBell, setIntervalBell] = useState(false);
  const [intervalMinutes, setIntervalMinutes] = useState(5);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const backgroundSoundRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    // Load saved settings from localStorage
    const savedDuration = localStorage.getItem("meditationDuration");
    const savedSound = localStorage.getItem("meditationSound");
    const savedBgSound = localStorage.getItem("meditationBgSound");
    const savedVolume = localStorage.getItem("meditationVolume");
    const savedIntervalBell = localStorage.getItem("meditationIntervalBell");
    const savedIntervalMinutes = localStorage.getItem(
      "meditationIntervalMinutes"
    );
    const savedSessions = localStorage.getItem("meditationSessions");

    if (savedDuration) setDuration(parseInt(savedDuration));
    if (savedSound) setSelectedSound(savedSound);
    if (savedBgSound) setSelectedBackgroundSound(savedBgSound);
    if (savedVolume) setVolume(parseInt(savedVolume));
    if (savedIntervalBell) setIntervalBell(savedIntervalBell === "true");
    if (savedIntervalMinutes)
      setIntervalMinutes(parseInt(savedIntervalMinutes));
    if (savedSessions) setCompletedSessions(JSON.parse(savedSessions));

    // Initialize sound objects
    setBellSound(new Audio(`/${selectedSound || "bell"}.mp3`));

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
      if (backgroundSoundRef.current) {
        backgroundSoundRef.current.pause();
        backgroundSoundRef.current = null;
      }
    };
  }, []);

  // Update sounds when selected options change
  useEffect(() => {
    if (bellSound) {
      bellSound.src = `/${selectedSound}.mp3`;
      bellSound.volume = volume / 100;
    }

    if (selectedBackgroundSound !== "none") {
      const bgSound = new Audio(`/${selectedBackgroundSound}.mp3`);
      bgSound.loop = true;
      bgSound.volume = volume / 100;
      setBackgroundSound(bgSound);
      backgroundSoundRef.current = bgSound;
    } else if (backgroundSoundRef.current) {
      backgroundSoundRef.current.pause();
      backgroundSoundRef.current = null;
      setBackgroundSound(null);
    }

    // Save settings to localStorage
    localStorage.setItem("meditationDuration", duration.toString());
    localStorage.setItem("meditationSound", selectedSound);
    localStorage.setItem("meditationBgSound", selectedBackgroundSound);
    localStorage.setItem("meditationVolume", volume.toString());
    localStorage.setItem("meditationIntervalBell", intervalBell.toString());
    localStorage.setItem(
      "meditationIntervalMinutes",
      intervalMinutes.toString()
    );
    localStorage.setItem(
      "meditationSessions",
      JSON.stringify(completedSessions)
    );
  }, [
    selectedSound,
    selectedBackgroundSound,
    volume,
    duration,
    intervalBell,
    intervalMinutes,
    bellSound,
    completedSessions,
  ]);

  useEffect(() => {
    if (!isActive) {
      setTimeLeft(duration * 60);
    }
  }, [duration, isActive]);

  const startTimer = () => {
    setIsActive(true);
    bellSound?.play();

    // Start background sound if selected
    if (backgroundSoundRef.current && selectedBackgroundSound !== "none") {
      backgroundSoundRef.current.play();
    }

    let lastIntervalTime = timeLeft;

    intervalRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          if (intervalRef.current) clearInterval(intervalRef.current);
          if (backgroundSoundRef.current) backgroundSoundRef.current.pause();
          setIsActive(false);
          bellSound?.play();

          // Record completed session
          setCompletedSessions((prev) => [
            { date: new Date().toLocaleDateString(), duration },
            ...prev,
          ]);

          return 0;
        }

        // Play interval bell if enabled
        if (intervalBell && lastIntervalTime - prev >= intervalMinutes * 60) {
          bellSound?.play();
          lastIntervalTime = prev;
        }

        return prev - 1;
      });
    }, 1000);
  };

  const pauseTimer = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    if (backgroundSoundRef.current) {
      backgroundSoundRef.current.pause();
    }
    setIsActive(false);
  };

  const resetTimer = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    if (backgroundSoundRef.current) {
      backgroundSoundRef.current.pause();
    }
    setIsActive(false);
    setTimeLeft(duration * 60);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs
      .toString()
      .padStart(2, "0")}`;
  };

  const clearHistory = () => {
    setCompletedSessions([]);
  };

  const totalMinutes = completedSessions.reduce(
    (total, session) => total + session.duration,
    0
  );
  const totalHours = Math.floor(totalMinutes / 60);
  const remainingMinutes = totalMinutes % 60;

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" className="w-full">
          Open Meditation Timer
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex justify-between items-center">
            <span>Meditation Timer</span>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setSettingsOpen(!settingsOpen)}
            >
              <Settings className="h-5 w-5" />
            </Button>
          </DialogTitle>
        </DialogHeader>

        <Tabs defaultValue="timer">
          <TabsList className="w-full">
            <TabsTrigger value="timer" className="w-1/2">
              Timer
            </TabsTrigger>
            <TabsTrigger value="history" className="w-1/2">
              History
            </TabsTrigger>
          </TabsList>

          <TabsContent value="timer" className="space-y-4">
            {settingsOpen ? (
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="sound">Bell Sound</Label>
                  <Select
                    value={selectedSound}
                    onValueChange={setSelectedSound}
                  >
                    <SelectTrigger id="sound">
                      <SelectValue placeholder="Select sound" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="bell">Bell</SelectItem>
                      <SelectItem value="peace">Peace Bell</SelectItem>
                      <SelectItem value="bowl">Singing Bowl</SelectItem>
                      <SelectItem value="gong">Gong</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="bgSound">Background Sound</Label>
                  <Select
                    value={selectedBackgroundSound}
                    onValueChange={setSelectedBackgroundSound}
                  >
                    <SelectTrigger id="bgSound">
                      <SelectValue placeholder="Select background" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">None</SelectItem>
                      <SelectItem value="ambient">Ambient</SelectItem>
                      <SelectItem value="nature">Nature</SelectItem>
                      <SelectItem value="rain">Rain</SelectItem>
                      <SelectItem value="waves">Ocean Waves</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <Label htmlFor="volume">Volume</Label>
                    <span className="text-xs text-primary/60">{volume}%</span>
                  </div>
                  <div className="flex gap-2 items-center">
                    <Volume className="h-4 w-4" />
                    <Slider
                      id="volume"
                      value={[volume]}
                      onValueChange={([value]) => setVolume(value)}
                      min={0}
                      max={100}
                      step={5}
                    />
                    <Volume2 className="h-4 w-4" />
                  </div>
                </div>

                <div className="flex items-center justify-between space-y-0 pt-2">
                  <Label htmlFor="intervalBell">Interval Bell</Label>
                  <Switch
                    id="intervalBell"
                    checked={intervalBell}
                    onCheckedChange={setIntervalBell}
                  />
                </div>

                {intervalBell && (
                  <div className="space-y-2">
                    <Label htmlFor="intervalMinutes">
                      Bell Interval (minutes)
                    </Label>
                    <Input
                      id="intervalMinutes"
                      type="number"
                      value={intervalMinutes}
                      onChange={(e) =>
                        setIntervalMinutes(Number(e.target.value) || 5)
                      }
                      min={1}
                      max={60}
                    />
                  </div>
                )}

                <div className="flex gap-2 pt-2">
                  <Button
                    onClick={() => setSettingsOpen(false)}
                    className="flex-1"
                  >
                    <Save className="h-4 w-4 mr-2" />
                    Save Settings
                  </Button>
                </div>
              </div>
            ) : (
              <>
                <div className="text-center mb-8">
                  <div
                    className="text-7xl font-bold text-primary mb-4 cursor-pointer"
                    onClick={() => !isActive && setSettingsOpen(true)}
                  >
                    {formatTime(timeLeft)}
                  </div>
                  <div className="flex items-center justify-center gap-2 text-primary/60">
                    <Bell className="h-5 w-5" />
                    <span>Duration: {duration} minutes</span>
                    {selectedBackgroundSound !== "none" && (
                      <>
                        <Music className="h-5 w-5 ml-2" />
                        <span>{selectedBackgroundSound}</span>
                      </>
                    )}
                  </div>
                </div>

                <div className="space-y-6">
                  {!settingsOpen && (
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <Label>Set Duration (minutes)</Label>
                        <span className="text-sm text-primary/60">
                          {duration} min
                        </span>
                      </div>
                      <Slider
                        value={[duration]}
                        onValueChange={([value]) => setDuration(value)}
                        min={1}
                        max={60}
                        step={1}
                        disabled={isActive}
                      />
                      <div className="flex justify-between text-xs text-primary/60">
                        <span>1m</span>
                        <span>15m</span>
                        <span>30m</span>
                        <span>60m</span>
                      </div>
                    </div>
                  )}

                  <div className="flex gap-4">
                    {!isActive ? (
                      <Button
                        onClick={startTimer}
                        className="flex-1 bg-primary hover:bg-primary/90 py-6"
                      >
                        <Play className="h-5 w-5 mr-2" />
                        Start
                      </Button>
                    ) : (
                      <Button
                        onClick={pauseTimer}
                        className="flex-1 bg-accent hover:bg-accent/90 py-6"
                      >
                        <Pause className="h-5 w-5 mr-2" />
                        Pause
                      </Button>
                    )}
                    <Button
                      onClick={resetTimer}
                      variant="outline"
                      className="flex-1"
                    >
                      <RotateCcw className="h-4 w-4 mr-2" />
                      Reset
                    </Button>
                  </div>
                </div>
              </>
            )}
          </TabsContent>

          <TabsContent value="history" className="min-h-[300px]">
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="font-medium">Meditation Sessions</h3>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={clearHistory}
                  className="text-xs"
                >
                  Clear History
                </Button>
              </div>

              <div className="bg-primary/5 p-3 rounded-md text-center mb-4">
                <div className="text-sm text-primary/70">
                  Total Meditation Time
                </div>
                <div className="text-xl font-bold">
                  {totalHours}h {remainingMinutes}m
                </div>
              </div>

              {completedSessions.length > 0 ? (
                <div className="divide-y max-h-[200px] overflow-y-auto">
                  {completedSessions.map((session, i) => (
                    <div key={i} className="py-2 flex justify-between">
                      <span className="text-primary/70">{session.date}</span>
                      <span className="font-medium">
                        {session.duration} minutes
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center h-[200px] text-center text-primary/50">
                  <Calendar className="h-12 w-12 mb-2 opacity-30" />
                  <p>No sessions yet.</p>
                  <p className="text-sm">
                    Complete a meditation to record your progress.
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
