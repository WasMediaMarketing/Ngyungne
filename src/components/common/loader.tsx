"use client";

import { motion } from "framer-motion";
import Image from "next/image";

export function Loader() {
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-slate-100">
      <Image
        src="/logo.png"
        alt="Ngyungne Logo"
        width={200}
        height={140}
        className="mb-8"
      />
      <div className="flex space-x-2">
        {[0, 1, 2].map((index) => (
          <motion.div
            key={index}
            className="w-4 h-4 bg-slate-800 rounded-full"
            initial={{ opacity: 0.2 }}
            animate={{ opacity: 1 }}
            transition={{
              repeat: Number.POSITIVE_INFINITY,
              repeatType: "reverse",
              duration: 0.8,
              delay: index * 0.2,
            }}
          />
        ))}
      </div>
    </div>
  );
}
