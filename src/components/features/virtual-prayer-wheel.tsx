"use client";

import { useState, useEffect } from "react";
import { motion, useAnimation } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";

export function VirtualPrayerWheel() {
  const [rotations, setRotations] = useState<number>(0);
  const [isSpinning, setIsSpinning] = useState<boolean>(false);
  const [spinSpeed, setSpinSpeed] = useState<number>(2);
  const [autoSpin, setAutoSpin] = useState<boolean>(false);
  const [mantraCount, setMantraCount] = useState<number>(0);
  const controls = useAnimation();

  const handleSpin = async () => {
    setIsSpinning(true);
    setRotations((prev) => prev + 1);
    setMantraCount((prev) => prev + 108); // Each rotation = 108 mantras

    await controls.start({
      rotate: 360 * (rotations + 1),
      transition: { duration: spinSpeed, ease: "easeInOut" },
    });

    setIsSpinning(false);
  };

  const handleContinuousSpin = () => {
    setAutoSpin((prev) => !prev);
  };

  // Effect for continuous spinning
  useEffect(() => {
    let intervalId: NodeJS.Timeout | undefined;

    if (autoSpin) {
      controls.start({
        rotate: 360 * 1000, // Large number of rotations
        transition: {
          duration: spinSpeed * 500,
          ease: "linear",
          repeat: Infinity,
        },
      });

      intervalId = setInterval(() => {
        setRotations((prev) => prev + 1);
        setMantraCount((prev) => prev + 108);
      }, spinSpeed * 1000);
    } else {
      controls.stop();
      setIsSpinning(false);
      if (intervalId) clearInterval(intervalId);
    }

    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, [autoSpin, spinSpeed, controls]);

  return (
    <div className="text-center p-6 max-w-md mx-auto bg-slate-50 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold text-primary mb-4">
        Virtual Prayer Wheel
      </h2>

      <div className="relative w-64 h-64 mx-auto mb-6">
        {/* Outer wheel frame */}
        <div className="absolute inset-0 rounded-full border-8 border-amber-700 bg-amber-100"></div>

        {/* Spinning wheel */}
        <motion.div
          animate={controls}
          className="absolute inset-2 rounded-full bg-amber-600 flex items-center justify-center"
          style={{ originX: 0.5, originY: 0.5 }}
        >
          {/* Decorative elements */}
          <div className="absolute inset-4 rounded-full bg-amber-500 flex items-center justify-center">
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-full h-full rounded-full border-4 border-amber-800 flex items-center justify-center">
                <span className="text-primary font-bold text-3xl text-amber-900">
                  ཨོཾ་མ་ཎི་པདྨེ་ཧཱུྃ
                </span>
              </div>
            </div>

            {/* Decorative lines */}
            {[...Array(8)].map((_, i) => (
              <div
                key={i}
                className="absolute h-full w-px bg-amber-800"
                style={{ transform: `rotate(${i * 45}deg)` }}
              ></div>
            ))}
          </div>
        </motion.div>

        {/* Center axis */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="w-6 h-6 rounded-full bg-amber-900 shadow-inner"></div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-4">
        <div className="text-left">
          <p className="text-primary/80 font-medium">Rotations: {rotations}</p>
          <p className="text-primary/80 font-medium">
            Mantras: {mantraCount.toLocaleString()}
          </p>
        </div>
        <div className="text-left">
          <p className="text-primary/80 font-medium mb-1">Speed:</p>
          <Slider
            defaultValue={[2]}
            min={0.5}
            max={5}
            step={0.5}
            value={[spinSpeed]} // Ensure it's an array
            onValueChange={(value: number[]) => setSpinSpeed(value[0])} // Explicitly define type
            disabled={isSpinning && !autoSpin}
            className="mb-4"
          />
        </div>
      </div>

      <div className="flex space-x-4 justify-center">
        <Button
          onClick={handleSpin}
          disabled={isSpinning || autoSpin}
          className="bg-amber-600 hover:bg-amber-700 text-white"
        >
          Spin Once
        </Button>

        <Button
          onClick={handleContinuousSpin}
          className={`${
            autoSpin
              ? "bg-red-500 hover:bg-red-600"
              : "bg-amber-800 hover:bg-amber-900"
          } text-white`}
        >
          {autoSpin ? "Stop Spinning" : "Continuous Spin"}
        </Button>
      </div>

      <div className="mt-6 text-sm text-primary/70 italic">
        In Tibetan Buddhism, prayer wheels are believed to spread spiritual
        blessings and well-being. Each rotation is traditionally counted as
        reciting the enclosed mantra 108 times.
      </div>
    </div>
  );
}
