"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"

export function MantraCounter() {
  const [count, setCount] = useState(0)
  const [goal, setGoal] = useState(108)
  const [isPlaying, setIsPlaying] = useState(false)
  const [bellSound, setBellSound] = useState<HTMLAudioElement | null>(null)

  useEffect(() => {
    setBellSound(new Audio("/bell-sound.mp3"))
  }, [])

  const handleCount = () => {
    setCount((prev) => {
      const newCount = prev + 1
      if (newCount === goal) {
        bellSound?.play()
      }
      return newCount
    })
  }

  const resetCount = () => {
    setCount(0)
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" className="w-full">
          Open Mantra Counter
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Mantra Counter</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="text-center">
            <div className="text-6xl font-bold text-primary mb-4">{count}</div>
            <div className="text-sm text-primary/60">Goal: {goal} recitations</div>
            <div className="h-2 bg-secondary/20 rounded-full mt-2">
              <div
                className="h-full bg-secondary rounded-full transition-all duration-300"
                style={{ width: `${(count / goal) * 100}%` }}
              />
            </div>
          </div>
          <div className="flex gap-4">
            <Button onClick={handleCount} className="flex-1 bg-primary hover:bg-primary/90">
              Count
            </Button>
            <Button onClick={resetCount} variant="outline" className="flex-1">
              Reset
            </Button>
          </div>
          <div className="space-y-2">
            <label className="text-sm text-primary/60">Set Goal</label>
            <Input type="number" value={goal} onChange={(e) => setGoal(Number.parseInt(e.target.value) || 0)} min="1" />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

