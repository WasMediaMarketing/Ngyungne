"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { useParams, useRouter } from "next/navigation";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { Button } from "@/components/ui/button";
import { AlertCircle, ChevronLeft } from "lucide-react";
import { CauseHeader } from "@/components/causes/CauseHeader";
import { CauseProgress } from "@/components/causes/CauseProgress";
import { CauseTabs } from "@/components/causes/CauseTabs";
import { causes } from "@/data/causes"; // Assuming you have a causes data file

export default function CauseDetail() {
  const params = useParams();
  const router = useRouter();
  const [isGalleryOpen, setIsGalleryOpen] = useState(false);
  const [isSheetOpen, setIsSheetOpen] = useState(false);

  const cause = causes.find((c) => c.id === Number(params.id));

  if (!cause) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <AlertCircle className="mx-auto h-16 w-16 text-crimson-500 mb-4" />
        <h2 className="text-2xl font-bold text-crimson-800 mb-4">
          Cause Not Found
        </h2>
        <p className="text-maroon-600 mb-6">
          The cause you're looking for doesn't exist or has been removed.
        </p>
        <Button
          onClick={() => router.push("/causes")}
          className="bg-crimson-600 hover:bg-crimson-700 text-white"
        >
          <ChevronLeft className="mr-2 h-4 w-4" /> Back to All Causes
        </Button>
      </div>
    );
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.5 },
    },
  };

  return (
    <div className="bg-gradient-to-b from-saffron-50/50 to-white min-h-screen pb-16">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-8">
        <Breadcrumbs />
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="flex justify-center items-center"
        >
          {/* Main content - Centered */}
          <motion.div
            variants={itemVariants}
            className="w-full max-w-3xl lg:max-w-5xl" // Restrict width for better readability
          >
            <CauseHeader
              cause={cause}
              onOpenGallery={() => setIsGalleryOpen(true)}
            />
            <CauseProgress
              cause={cause}
              onDonate={() => setIsSheetOpen(true)}
            />
            <CauseTabs cause={cause} />
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}
