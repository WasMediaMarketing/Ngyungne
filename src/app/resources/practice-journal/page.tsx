"use client";

import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { JournalEntry, Stats } from "@/types/practice-journal";
import { practiceTypes } from "@/data/practice-types";
import { mockEntries } from "@/data/mock-entries";
import JournalEntryForm from "@/components/practice-journal/JournalEntryForm";
import JournalEntryList from "@/components/practice-journal/JournalEntryList";
import StatisticsCards from "@/components/practice-journal/StatisticsCard";
import SearchAndFilter from "@/components/practice-journal/SearchAndFilter";
import { Button } from "@/components/ui/button";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { BookOpen, Plus } from "lucide-react";

export default function PracticeJournalPage() {
  const [entries, setEntries] = useState<JournalEntry[]>(mockEntries);

  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState<string | null>(null);
  const [isFormVisible, setIsFormVisible] = useState(false);

  const filteredEntries = useMemo(() => {
    return entries.filter((entry) => {
      const matchesSearch =
        entry.notes.toLowerCase().includes(searchTerm.toLowerCase()) ||
        entry.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (entry.insights?.some((i) =>
          i.toLowerCase().includes(searchTerm.toLowerCase())
        ) ??
          false);
      const matchesType = filterType ? entry.type === filterType : true;
      return matchesSearch && matchesType;
    });
  }, [entries, searchTerm, filterType]);

  const stats: Stats = useMemo(() => {
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

    // Calculate current streak (simplified version)
    let currentStreak = 0;
    const sortedEntries = [...entries].sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
    );
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    for (let i = 0; i < sortedEntries.length; i++) {
      const entryDate = new Date(sortedEntries[i].date);
      entryDate.setHours(0, 0, 0, 0);
      if ((today.getTime() - entryDate.getTime()) / (1000 * 3600 * 24) === i) {
        currentStreak++;
      } else {
        break;
      }
    }

    const weeklyPracticeTime = entries
      .filter((entry) => {
        const entryDate = new Date(entry.date);
        const oneWeekAgo = new Date();
        oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
        return entryDate >= oneWeekAgo;
      })
      .reduce((sum, entry) => sum + entry.duration, 0);

    return {
      totalSessions,
      totalMinutes,
      currentStreak,
      practiceTypeCounts,
      avgMood,
      weeklyPracticeTime,
    };
  }, [entries]);

  const addEntry = (newEntry: JournalEntry) => {
    setEntries([newEntry, ...entries]);
    setIsFormVisible(false);
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <Breadcrumbs />
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-8"
      >
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-primary mb-2 flex items-center justify-center">
            <BookOpen className="mr-3 h-8 w-8 text-primary/80" />
            Spiritual Practice Journal
          </h1>
          <p className="text-primary/60 max-w-2xl mx-auto">
            Record your spiritual journey, track your progress, and discover
            patterns in your practice
          </p>
        </div>

        <StatisticsCards stats={stats} />

        {isFormVisible ? (
          <JournalEntryForm
            onSubmit={addEntry}
            onCancel={() => setIsFormVisible(false)}
          />
        ) : (
          <div className="flex justify-center">
            <Button
              onClick={() => setIsFormVisible(true)}
              className="shadow-md"
              size="lg"
            >
              <Plus className="mr-2 h-5 w-5" /> Record New Practice
            </Button>
          </div>
        )}

        <SearchAndFilter
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          filterType={filterType}
          setFilterType={setFilterType}
        />

        <JournalEntryList entries={filteredEntries} />
      </motion.div>
    </div>
  );
}
