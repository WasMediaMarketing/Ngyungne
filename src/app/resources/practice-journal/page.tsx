"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
import {
  Calendar as CalendarIcon,
  Clock,
  Star,
  Search,
  Plus,
  Filter,
  SlidersHorizontal,
  BookOpen,
} from "lucide-react";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { Badge } from "@/components/ui/badge";
import { Avatar } from "@/components/ui/avatar";

interface JournalEntry {
  id: string;
  date: string;
  type: string;
  duration: number;
  notes: string;
  mood: number;
}

const practiceTypes = [
  { value: "Meditation", icon: "🧘" },
  { value: "Mantra Recitation", icon: "🔄" },
  { value: "Scripture Study", icon: "📚" },
  { value: "Prostrations", icon: "🙏" },
];

export default function PracticeJournalPage() {
  const [entries, setEntries] = useState<JournalEntry[]>([
    {
      id: "1",
      date: "2024-02-25",
      type: "Meditation",
      duration: 30,
      notes: "Morning meditation session. Focused on breath awareness.",
      mood: 4,
    },
    {
      id: "2",
      date: "2024-02-24",
      type: "Scripture Study",
      duration: 45,
      notes:
        "Read the Heart Sutra and reflected on emptiness. Interesting insights on the nature of form.",
      mood: 5,
    },
    {
      id: "3",
      date: "2024-02-23",
      type: "Mantra Recitation",
      duration: 20,
      notes:
        "Recited Om Mani Padme Hum 108 times. Felt very centered afterward.",
      mood: 3,
    },
  ]);

  const [newEntry, setNewEntry] = useState<Partial<JournalEntry>>({
    date: new Date().toISOString().split("T")[0],
    type: "Meditation",
    duration: 30,
    notes: "",
    mood: 3,
  });

  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState<string | null>(null);

  const filteredEntries = useMemo(() => {
    return entries.filter((entry) => {
      const matchesSearch =
        entry.notes.toLowerCase().includes(searchTerm.toLowerCase()) ||
        entry.type.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesType = filterType ? entry.type === filterType : true;
      return matchesSearch && matchesType;
    });
  }, [entries, searchTerm, filterType]);

  // Calculate statistics
  const stats = useMemo(() => {
    const totalSessions = entries.length;
    const totalMinutes = entries.reduce(
      (sum, entry) => sum + entry.duration,
      0
    );
    const practiceTypeCounts = entries.reduce((acc, entry) => {
      acc[entry.type] = (acc[entry.type] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    const avgMood =
      entries.length > 0
        ? (
            entries.reduce((sum, entry) => sum + entry.mood, 0) / entries.length
          ).toFixed(1)
        : "0";

    return { totalSessions, totalMinutes, practiceTypeCounts, avgMood };
  }, [entries]);

  const addEntry = () => {
    if (!newEntry.notes) return;

    setEntries([
      {
        ...newEntry,
        id: Date.now().toString(),
      } as JournalEntry,
      ...entries,
    ]);

    setNewEntry({
      ...newEntry,
      notes: "",
      date: new Date().toISOString().split("T")[0],
    });
  };

  const getTypeIcon = (type: string) => {
    const practiceType = practiceTypes.find((p) => p.value === type);
    return practiceType ? practiceType.icon : "📝";
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-5xl">
      <Breadcrumbs />
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-8"
      >
        <div className="text-center">
          <h1 className="text-4xl font-bold text-primary mb-2">
            <BookOpen className="inline-block mr-2 mb-1" />
            Spiritual Practice Journal
          </h1>
          <p className="text-primary/60 max-w-lg mx-auto">
            Record your spiritual journey, track your progress, and discover
            patterns in your practice
          </p>
        </div>

        <div className="grid md:grid-cols-4 gap-6">
          <Card className="md:col-span-1">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm">Total Sessions</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">{stats.totalSessions}</p>
            </CardContent>
          </Card>

          <Card className="md:col-span-1">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm">Total Minutes</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">{stats.totalMinutes}</p>
            </CardContent>
          </Card>

          <Card className="md:col-span-1">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm">Average Quality</CardTitle>
            </CardHeader>
            <CardContent className="flex items-center">
              <p className="text-3xl font-bold mr-2">{stats.avgMood}</p>
              <div className="flex">
                {[1, 2, 3, 4, 5].map((i) => (
                  <Star
                    key={i}
                    className={`h-4 w-4 ${
                      parseFloat(stats.avgMood) >= i
                        ? "text-yellow-400 fill-yellow-400"
                        : "text-gray-300"
                    }`}
                  />
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="md:col-span-1">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm">Top Practice</CardTitle>
            </CardHeader>
            <CardContent>
              {Object.keys(stats.practiceTypeCounts).length > 0 ? (
                <p className="text-lg font-bold flex items-center">
                  <span className="mr-2">
                    {getTypeIcon(
                      Object.entries(stats.practiceTypeCounts).sort(
                        (a, b) => b[1] - a[1]
                      )[0][0]
                    )}
                  </span>
                  {
                    Object.entries(stats.practiceTypeCounts).sort(
                      (a, b) => b[1] - a[1]
                    )[0][0]
                  }
                </p>
              ) : (
                <p>No entries yet</p>
              )}
            </CardContent>
          </Card>
        </div>

        <Card className="overflow-hidden border-primary/10">
          <CardHeader className="bg-primary/5">
            <CardTitle className="flex items-center">
              <Plus className="mr-2 h-5 w-5" />
              New Entry
            </CardTitle>
            <CardDescription>
              Record your spiritual practice session
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="grid gap-6">
              <div className="grid md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium flex items-center">
                    <CalendarIcon className="h-4 w-4 mr-1" /> Date
                  </label>
                  <Input
                    type="date"
                    value={newEntry.date}
                    onChange={(e) =>
                      setNewEntry({
                        ...newEntry,
                        date: e.target.value,
                      })
                    }
                    className="border-primary/20 focus:border-primary"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium flex items-center">
                    <BookOpen className="h-4 w-4 mr-1" /> Practice Type
                  </label>
                  <Select
                    value={newEntry.type}
                    onValueChange={(value) =>
                      setNewEntry({
                        ...newEntry,
                        type: value,
                      })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select a practice type" />
                    </SelectTrigger>
                    <SelectContent>
                      {practiceTypes.map((type) => (
                        <SelectItem key={type.value} value={type.value}>
                          <span className="flex items-center">
                            <span className="mr-2">{type.icon}</span>
                            {type.value}
                          </span>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium flex items-center">
                    <Clock className="h-4 w-4 mr-1" /> Duration (minutes)
                  </label>
                  <Input
                    type="number"
                    value={newEntry.duration}
                    onChange={(e) =>
                      setNewEntry({
                        ...newEntry,
                        duration: parseInt(e.target.value),
                      })
                    }
                    className="border-primary/20 focus:border-primary"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium flex items-center">
                  <Star className="h-4 w-4 mr-1" /> Practice Quality
                </label>
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5].map((rating) => (
                    <button
                      key={rating}
                      onClick={() =>
                        setNewEntry({
                          ...newEntry,
                          mood: rating,
                        })
                      }
                      className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${
                        newEntry.mood === rating
                          ? "bg-primary text-white"
                          : "bg-gray-100 hover:bg-gray-200"
                      }`}
                    >
                      <Star
                        className={`h-5 w-5 ${
                          newEntry.mood === rating ? "fill-white" : ""
                        }`}
                      />
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Notes & Insights</label>
                <Textarea
                  value={newEntry.notes}
                  onChange={(e) =>
                    setNewEntry({
                      ...newEntry,
                      notes: e.target.value,
                    })
                  }
                  placeholder="Write about your practice experience, insights, challenges..."
                  className="min-h-32 border-primary/20 focus:border-primary"
                />
              </div>

              <Button onClick={addEntry} className="w-full md:w-auto">
                <Plus className="mr-2 h-4 w-4" /> Save Entry
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <CardTitle>Journal Entries</CardTitle>

              <div className="flex flex-col md:flex-row gap-3">
                <div className="relative">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-primary/40" />
                  <Input
                    type="search"
                    placeholder="Search entries..."
                    className="pl-9 w-full md:w-60"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>

                <Select
                  value={filterType || "all"}
                  onValueChange={(value) =>
                    setFilterType(value === "all" ? null : value)
                  }
                >
                  <SelectTrigger className="w-full md:w-48">
                    <div className="flex items-center">
                      <Filter className="mr-2 h-4 w-4" />
                      <span>{filterType || "All types"}</span>
                    </div>
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All types</SelectItem>
                    {practiceTypes.map((type) => (
                      <SelectItem key={type.value} value={type.value}>
                        <span className="flex items-center">
                          <span className="mr-2">{type.icon}</span>
                          {type.value}
                        </span>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="list" className="space-y-6">
              <TabsList>
                <TabsTrigger value="list">List</TabsTrigger>
                <TabsTrigger value="calendar">Calendar</TabsTrigger>
                <TabsTrigger value="stats">Statistics</TabsTrigger>
              </TabsList>

              <TabsContent value="list" className="space-y-4">
                <AnimatePresence>
                  {filteredEntries.length > 0 ? (
                    filteredEntries.map((entry, index) => (
                      <motion.div
                        key={entry.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ delay: index * 0.05 }}
                      >
                        <Card className="overflow-hidden hover:shadow-md transition-shadow">
                          <CardContent className="p-0">
                            <div className="p-6 grid md:grid-cols-12 gap-4">
                              <div className="md:col-span-1 flex md:flex-col items-center md:items-start justify-start">
                                <Avatar className="h-12 w-12 rounded-md flex items-center justify-center bg-primary/10 text-lg">
                                  {getTypeIcon(entry.type)}
                                </Avatar>
                              </div>

                              <div className="md:col-span-9">
                                <div className="flex flex-wrap items-center gap-2 mb-2">
                                  <h3 className="font-semibold text-primary">
                                    {entry.type}
                                  </h3>
                                  <Badge variant="outline" className="ml-2">
                                    {entry.duration} min
                                  </Badge>
                                </div>

                                <p className="text-primary/80 mb-3">
                                  {entry.notes}
                                </p>

                                <div className="flex items-center gap-2 text-xs text-primary/60">
                                  <CalendarIcon className="h-3 w-3" />
                                  {new Date(entry.date).toLocaleDateString(
                                    "en-US",
                                    {
                                      weekday: "short",
                                      year: "numeric",
                                      month: "short",
                                      day: "numeric",
                                    }
                                  )}
                                </div>
                              </div>

                              <div className="md:col-span-2 flex justify-end items-start">
                                <div className="flex">
                                  {Array.from({ length: 5 }).map((_, i) => (
                                    <Star
                                      key={i}
                                      className={`h-4 w-4 ${
                                        i < entry.mood
                                          ? "text-yellow-400 fill-yellow-400"
                                          : "text-gray-200"
                                      }`}
                                    />
                                  ))}
                                </div>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      </motion.div>
                    ))
                  ) : (
                    <div className="text-center py-12 text-primary/60">
                      <Search className="h-12 w-12 mx-auto mb-4 text-primary/40" />
                      <h3 className="text-lg font-medium mb-1">
                        No entries found
                      </h3>
                      <p>Try adjusting your search or filters</p>
                    </div>
                  )}
                </AnimatePresence>
              </TabsContent>

              <TabsContent value="calendar">
                <div className="h-64 flex items-center justify-center bg-primary/5 rounded-md text-primary/60">
                  <div className="text-center">
                    <CalendarIcon className="h-12 w-12 mx-auto mb-2" />
                    <p>Calendar view coming soon</p>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="stats">
                <div className="h-64 flex items-center justify-center bg-primary/5 rounded-md text-primary/60">
                  <div className="text-center">
                    <SlidersHorizontal className="h-12 w-12 mx-auto mb-2" />
                    <p>Detailed statistics coming soon</p>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
