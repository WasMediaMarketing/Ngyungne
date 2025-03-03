"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { useEffect, useState } from "react";

export function Loader() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Animation variants
  const containerVariants = {
    initial: { opacity: 0 },
    animate: {
      opacity: 1,
      transition: {
        duration: 0.5,
        when: "beforeChildren",
        staggerChildren: 0.2,
      },
    },
  };

  const logoVariants = {
    initial: { y: -20, opacity: 0 },
    animate: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 200,
        damping: 10,
      },
    },
  };

  const dotVariants = {
    initial: { scale: 0 },
    animate: {
      scale: [0, 1.2, 1],
      opacity: [0.2, 1, 0.2],
      transition: {
        repeat: Infinity,
        duration: 1.5,
        ease: "easeInOut",
      },
    },
  };

  // For server-side rendering
  if (!mounted) {
    return null;
  }

  return (
    <motion.div
      className="flex flex-col items-center justify-center min-h-screen w-full bg-gradient-to-b from-slate-50 to-slate-200 px-4"
      variants={containerVariants}
      initial="initial"
      animate="animate"
    >
      <motion.div variants={logoVariants} className="mb-12 md:mb-16 relative">
        <Image
          src="/logo.png"
          alt="Ngyungne Logo"
          width={200}
          height={140}
          className="w-48 md:w-64 h-auto"
          priority
        />
        <motion.div
          className="absolute -bottom-6 left-0 right-0 mx-auto w-16 h-1 bg-slate-800 rounded-full"
          initial={{ width: 0 }}
          animate={{ width: "100%", x: [-50, 0] }}
          transition={{ duration: 0.8, delay: 0.5 }}
        />
      </motion.div>

      <div className="flex items-center space-x-3 md:space-x-4">
        {[0, 1, 2].map((index) => (
          <motion.div
            key={index}
            variants={dotVariants}
            custom={index}
            className="w-3 h-3 md:w-4 md:h-4 bg-slate-800 rounded-full"
            style={{
              originX: 0.5,
              originY: 0.5,
              // Different colors for each dot
              backgroundColor:
                index === 0 ? "#1E40AF" : index === 1 ? "#1E3A8A" : "#0F172A",
            }}
            transition={{
              repeat: Infinity,
              repeatType: "reverse",
              duration: 1.2,
              delay: index * 0.25,
              ease: "easeInOut",
            }}
          />
        ))}
      </div>

      <motion.p
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1, duration: 0.5 }}
        className="mt-8 text-slate-600 font-medium text-sm md:text-base"
      >
        Loading your experience...
      </motion.p>
    </motion.div>
  );
}
