"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Calendar, Clock, Star } from "lucide-react"

interface JournalEntry {
  id: string
  date: string
  type: string
  duration: number
  notes: string
  mood: number
}

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
    // Add more entries
  ])

  const [newEntry, setNewEntry] = useState<Partial<JournalEntry>>({
    date: new Date().toISOString().split("T")[0],
    type: "Meditation",
    duration: 30,
    notes: "",
    mood: 3,
  })

  const addEntry = () => {
    if (!newEntry.notes) return

    setEntries([
      {
        ...newEntry,
        id: Date.now().toString(),
      } as JournalEntry,
      ...entries,
    ])

    setNewEntry({
      ...newEntry,
      notes: "",
      date: new Date().toISOString().split("T")[0],
    })
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-primary mb-2">Practice Journal</h1>
          <p className="text-primary/60">Track your spiritual practice and insights</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>New Entry</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Date</label>
                  <Input
                    type="date"
                    value={newEntry.date}
                    onChange={(e) =>
                      setNewEntry({
                        ...newEntry,
                        date: e.target.value,
                      })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Practice Type</label>
                  <select
                    className="w-full p-2 rounded-md border"
                    value={newEntry.type}
                    onChange={(e) =>
                      setNewEntry({
                        ...newEntry,
                        type: e.target.value,
                      })
                    }
                  >
                    <option>Meditation</option>
                    <option>Mantra Recitation</option>
                    <option>Scripture Study</option>
                    <option>Prostrations</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Duration (minutes)</label>
                  <Input
                    type="number"
                    value={newEntry.duration}
                    onChange={(e) =>
                      setNewEntry({
                        ...newEntry,
                        duration: Number.parseInt(e.target.value),
                      })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Practice Quality</label>
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
                        className={`p-2 rounded-full ${
                          newEntry.mood === rating ? "bg-primary text-white" : "bg-gray-100"
                        }`}
                      >
                        <Star className="h-5 w-5" />
                      </button>
                    ))}
                  </div>
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
                  placeholder="Write about your practice experience..."
                  className="min-h-[100px]"
                />
              </div>

              <Button onClick={addEntry}>Save Entry</Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Journal Entries</CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="list" className="space-y-4">
              <TabsList>
                <TabsTrigger value="list">List</TabsTrigger>
                <TabsTrigger value="calendar">Calendar</TabsTrigger>
                <TabsTrigger value="stats">Statistics</TabsTrigger>
              </TabsList>

              <TabsContent value="list" className="space-y-4">
                {entries.map((entry) => (
                  <Card key={entry.id}>
                    <CardContent className="pt-6">
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <h3 className="font-semibold">{entry.type}</h3>
                          <div className="flex items-center gap-2 text-sm text-primary/60">
                            <Calendar className="h-4 w-4" />
                            {entry.date}
                            <Clock className="h-4 w-4 ml-2" />
                            {entry.duration} minutes
                          </div>
                        </div>
                        <div className="flex gap-1">
                          {Array.from({ length: entry.mood }).map((_, i) => (
                            <Star key={i} className="h-4 w-4 text-secondary fill-current" />
                          ))}
                        </div>
                      </div>
                      <p className="text-primary/80">{entry.notes}</p>
                    </CardContent>
                  </Card>
                ))}
              </TabsContent>

              <TabsContent value="calendar">{/* Add calendar view */}</TabsContent>

              <TabsContent value="stats">{/* Add statistics and charts */}</TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}

