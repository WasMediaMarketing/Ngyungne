"use client"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import { Bell } from "lucide-react"

export function MeditationTimer() {
  const [duration, setDuration] = useState(15)
  const [timeLeft, setTimeLeft] = useState(duration * 60)
  const [isActive, setIsActive] = useState(false)
  const [bellSound, setBellSound] = useState<HTMLAudioElement | null>(null)
  const intervalRef = useRef<NodeJS.Timeout>()

  useEffect(() => {
    setBellSound(new Audio("/meditation-bell.mp3"))
    return () => {
      clearInterval(intervalRef.current)
    }
  }, [])

  useEffect(() => {
    setTimeLeft(duration * 60)
  }, [duration])

  const startTimer = () => {
    setIsActive(true)
    bellSound?.play()
    intervalRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(intervalRef.current)
          setIsActive(false)
          bellSound?.play()
          return 0
        }
        return prev - 1
      })
    }, 1000)
  }

  const pauseTimer = () => {
    clearInterval(intervalRef.current)
    setIsActive(false)
  }

  const resetTimer = () => {
    clearInterval(intervalRef.current)
    setIsActive(false)
    setTimeLeft(duration * 60)
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`
  }

  return (
    <div className="max-w-md mx-auto p-6 rounded-lg bg-white shadow-lg">
      <div className="text-center mb-8">
        <div className="text-6xl font-bold text-primary mb-4">{formatTime(timeLeft)}</div>
        <div className="flex items-center justify-center gap-2 text-primary/60">
          <Bell className="h-5 w-5" />
          <span>Duration: {duration} minutes</span>
        </div>
      </div>

      <div className="space-y-6">
        <div className="space-y-2">
          <label className="text-sm text-primary/60">Set Duration (minutes)</label>
          <Slider
            value={[duration]}
            onValueChange={([value]) => setDuration(value)}
            min={5}
            max={60}
            step={5}
            disabled={isActive}
          />
        </div>

        <div className="flex gap-4">
          {!isActive ? (
            <Button onClick={startTimer} className="flex-1 bg-primary hover:bg-primary/90">
              Start
            </Button>
          ) : (
            <Button onClick={pauseTimer} className="flex-1 bg-accent hover:bg-accent/90">
              Pause
            </Button>
          )}
          <Button onClick={resetTimer} variant="outline" className="flex-1">
            Reset
          </Button>
        </div>
      </div>
    </div>
  )
}

