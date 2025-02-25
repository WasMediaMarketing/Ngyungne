"use client"

import type React from "react"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Heart, Share2 } from "lucide-react"

export function MeritDedication() {
  const [dedications, setDedications] = useState([
    {
      id: 1,
      author: "Tenzin",
      message: "May all beings be free from suffering",
      likes: 12,
      timestamp: new Date().toISOString(),
    },
    // Add more dedications
  ])

  const [newDedication, setNewDedication] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newDedication.trim()) return

    setDedications([
      {
        id: Date.now(),
        author: "You",
        message: newDedication,
        likes: 0,
        timestamp: new Date().toISOString(),
      },
      ...dedications,
    ])
    setNewDedication("")
  }

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h3 className="text-2xl font-bold text-primary mb-2">Merit Dedication Wall</h3>
        <p className="text-primary/60">Share your practice merit and dedications with the community</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <Textarea
          placeholder="Write your dedication..."
          value={newDedication}
          onChange={(e) => setNewDedication(e.target.value)}
          className="min-h-[100px]"
        />
        <Button type="submit" className="w-full">
          Share Dedication
        </Button>
      </form>

      <div className="space-y-4">
        <AnimatePresence>
          {dedications.map((dedication) => (
            <motion.div
              key={dedication.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="bg-white p-4 rounded-lg shadow"
            >
              <p className="text-primary mb-2">{dedication.message}</p>
              <div className="flex items-center justify-between text-sm text-primary/60">
                <span>{dedication.author}</span>
                <div className="flex items-center gap-4">
                  <button className="flex items-center gap-1">
                    <Heart className="h-4 w-4" />
                    {dedication.likes}
                  </button>
                  <button className="flex items-center gap-1">
                    <Share2 className="h-4 w-4" />
                    Share
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  )
}

