"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useParams, useRouter } from "next/navigation";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { Button } from "@/components/ui/button";
import { AlertCircle, ChevronLeft } from "lucide-react";
import { CauseHeader } from "@/components/causes/CauseHeader";
import { CauseProgress } from "@/components/causes/CauseProgress";
import { CauseTabs } from "@/components/causes/CauseTabs";
import { causeApi, type CauseUI } from "@/utils/causeApi";
import { ImageGallery } from "@/components/causes/ImageGallery";
import { DonationSheet } from "@/components/causes/DonationSheet";
import { Loader } from "@/components/common/loader";

export default function CauseDetail() {
  const params = useParams();
  const router = useRouter();
  const [isGalleryOpen, setIsGalleryOpen] = useState(false);
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [cause, setCause] = useState<CauseUI | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCause = async () => {
      setIsLoading(true);
      try {
        const id =
          typeof params.id === "string"
            ? params.id
            : Array.isArray(params.id)
            ? params.id[0]
            : "";

        console.log("Fetching cause with ID:", id);

        if (!id) {
          setError("Invalid cause ID");
          setIsLoading(false);
          return;
        }

        const causeData = await causeApi.getCauseById(id);
        console.log("API returned cause data:", causeData);

        if (!causeData) {
          setError("Cause not found");
          return;
        }

        setCause(causeData);
      } catch (err) {
        console.error("Error fetching cause:", err);
        setError("Failed to load cause details");
      } finally {
        setIsLoading(false);
      }
    };

    fetchCause();
  }, [params.id]);

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

  if (isLoading) {
    return <Loader />;
  }

  if (error || !cause) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <AlertCircle className="mx-auto h-16 w-16 text-crimson-500 mb-4" />
        <h2 className="text-2xl font-bold text-crimson-800 mb-4">
          Cause Not Found
        </h2>
        <p className="text-maroon-600 mb-6">
          {error ||
            "The cause you're looking for doesn't exist or has been removed."}
        </p>
        <Button
          onClick={() => router.push("/programs/causes")}
          className="bg-crimson-600 hover:bg-crimson-700 text-white"
        >
          <ChevronLeft className="mr-2 h-4 w-4" /> Back to All Causes
        </Button>
      </div>
    );
  }

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
              cause={{
                ...cause,
                categories: cause.tags,
              }}
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

      {/* Gallery Modal */}
      {isGalleryOpen && cause.gallery && (
        <ImageGallery
          images={cause.gallery}
          isOpen={isGalleryOpen}
          onClose={() => setIsGalleryOpen(false)}
        />
      )}

      {/* Donation Sheet */}
      <DonationSheet
        cause={cause}
        isOpen={isSheetOpen}
        onClose={() => setIsSheetOpen(false)}
      />
    </div>
  );
}
