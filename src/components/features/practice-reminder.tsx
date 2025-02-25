"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Bell, Calendar, Clock } from "lucide-react"

export function PracticeReminder() {
  const [reminders, setReminders] = useState([
    {
      id: 1,
      type: "Meditation",
      time: "06:00",
      days: ["Mon", "Wed", "Fri"],
      active: true,
    },
    {
      id: 2,
      type: "Mantra",
      time: "19:00",
      days: ["Daily"],
      active: true,
    },
  ])

  const handleToggle = (id: number) => {
    setReminders(
      reminders.map((reminder) => (reminder.id === id ? { ...reminder, active: !reminder.active } : reminder)),
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">Practice Reminders</h3>
          <p className="text-sm text-primary/60">Set up notifications for your daily practice</p>
        </div>
        <Button variant="outline">
          <Bell className="h-4 w-4 mr-2" />
          Add Reminder
        </Button>
      </div>

      <div className="space-y-4">
        {reminders.map((reminder) => (
          <div key={reminder.id} className="flex items-center justify-between p-4 bg-white rounded-lg shadow">
            <div className="space-y-1">
              <h4 className="font-medium">{reminder.type}</h4>
              <div className="flex items-center gap-2 text-sm text-primary/60">
                <Clock className="h-4 w-4" />
                {reminder.time}
                <Calendar className="h-4 w-4 ml-2" />
                {reminder.days.join(", ")}
              </div>
            </div>
            <Switch checked={reminder.active} onCheckedChange={() => handleToggle(reminder.id)} />
          </div>
        ))}
      </div>
    </div>
  )
}

