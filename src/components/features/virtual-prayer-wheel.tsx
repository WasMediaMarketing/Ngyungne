"use client"

import { useState } from "react"
import { motion, useAnimation } from "framer-motion"
import { Button } from "@/components/ui/button"

export function VirtualPrayerWheel() {
  const [rotations, setRotations] = useState(0)
  const [isSpinning, setIsSpinning] = useState(false)
  const controls = useAnimation()

  const handleSpin = async () => {
    setIsSpinning(true)
    setRotations((prev) => prev + 1)

    await controls.start({
      rotate: 360 * (rotations + 1),
      transition: { duration: 2, ease: "linear" },
    })

    setIsSpinning(false)
  }

  return (
    <div className="text-center p-6">
      <div className="relative w-48 h-48 mx-auto mb-4">
        <motion.div animate={controls} className="w-full h-full">
          <img src="/prayer-wheel.svg" alt="Prayer Wheel" className="w-full h-full" />
        </motion.div>
        <div className="absolute top-0 left-0 w-full h-full flex items-center justify-center pointer-events-none">
          <span className="text-primary font-tibetan text-2xl">ཨོཾ་མ་ཎི་པདྨེ་ཧཱུྃ</span>
        </div>
      </div>
      <p className="text-primary/80 mb-2">Rotations: {rotations}</p>
      <Button onClick={handleSpin} disabled={isSpinning} className="bg-secondary hover:bg-secondary/90">
        Spin Prayer Wheel
      </Button>
    </div>
  )
}

