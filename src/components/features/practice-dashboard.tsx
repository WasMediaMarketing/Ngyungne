"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export function PracticeDashboard() {
  const [selectedPeriod, setSelectedPeriod] = useState("week")

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
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Practice Dashboard</CardTitle>
          <CardDescription>Track your spiritual practice and progress</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="meditation" className="space-y-4">
            <TabsList>
              <TabsTrigger value="meditation">Meditation</TabsTrigger>
              <TabsTrigger value="mantras">Mantras</TabsTrigger>
              <TabsTrigger value="teachings">Teachings</TabsTrigger>
            </TabsList>

            <TabsContent value="meditation" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium">Daily Practice</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{practiceData.meditation.daily} min</div>
                    <p className="text-xs text-muted-foreground">+5 min from yesterday</p>
                    <Progress value={70} className="mt-2" />
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium">Weekly Total</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{practiceData.meditation.weekly} min</div>
                    <p className="text-xs text-muted-foreground">Goal: 300 min</p>
                    <Progress value={80} className="mt-2" />
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium">Streak</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{practiceData.meditation.streak} days</div>
                    <p className="text-xs text-muted-foreground">Personal best: 14 days</p>
                  </CardContent>
                </Card>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle>Practice History</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-[200px] w-full">{/* Add Chart.js or similar for visualization */}</div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Similar content for mantras and teachings tabs */}
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}

