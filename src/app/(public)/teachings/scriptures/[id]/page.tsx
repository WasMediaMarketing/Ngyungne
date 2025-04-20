"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { Button } from "@/components/ui/button";
import { ArrowLeft, MessageCircleQuestion } from "lucide-react";
import { createScriptureApi } from "@/utils/scriptureApi";
import type { IScripture } from "@/types/scripture.types";
import ScriptureInfo from "@/components/scripture/ScriptureInfo";
import ScriptureContent from "@/components/scripture/ScriptureContent";
import { toast } from "sonner";

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const scriptureApi = createScriptureApi();

export default function ScriptureDetail() {
  const router = useRouter();
  const params = useParams();
  const [scripture, setScripture] = useState<IScripture | null>(null);
  const [loading, setLoading] = useState(true);
  const [readingProgress, setReadingProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);

  // Fetch the scripture data based on ID
  useEffect(() => {
    async function fetchScripture() {
      if (!params?.id) return;

      try {
        setLoading(true);
        const scriptureData = await scriptureApi.getScriptureById(
          params.id as string
        );
        setScripture(scriptureData);

        // Increment view count
        try {
          await scriptureApi.incrementViews(params.id as string);
        } catch (viewError) {
          console.error("Failed to increment view count:", viewError);
          // Don't show error to user for this non-critical operation
        }
      } catch (err) {
        console.error("Error fetching scripture:", err);
        setError("Failed to load scripture. Please try again later.");
        toast.error("Failed to load scripture");
      } finally {
        setLoading(false);
      }
    }

    fetchScripture();
  }, [params]);

  // Track reading progress
  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const docHeight =
        document.documentElement.scrollHeight - window.innerHeight;
      const progress = (scrollTop / docHeight) * 100;
      setReadingProgress(progress);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Handle back to list
  const handleBackToList = () => {
    router.push("/teachings/scriptures");
  };

  if (loading) {
    return <LoadingState />;
  }

  if (error || !scripture) {
    return (
      <NotFoundState onBackClick={handleBackToList} errorMessage={error} />
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50 to-amber-100">
      {/* Reading progress bar */}
      <div
        className="fixed top-0 left-0 h-1 bg-gradient-to-r from-amber-400 to-crimson-500 z-50 transition-all duration-300 ease-out"
        style={{ width: `${readingProgress}%` }}
      ></div>

      <div className="container mx-auto px-4 py-8 md:py-12">
        <Breadcrumbs />

        <Button
          variant="ghost"
          onClick={handleBackToList}
          className="mb-6 text-maroon-600 hover:text-maroon-800 hover:bg-amber-100"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Scripture List
        </Button>

        <div className="grid md:grid-cols-3 gap-8">
          {/* Left sidebar with scripture info */}
          <div className="md:col-span-1">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
            >
              <ScriptureInfo scripture={scripture} />
            </motion.div>
          </div>

          {/* Main content area */}
          <div className="md:col-span-2">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <ScriptureContent scripture={scripture} />
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}

function LoadingState() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50 to-amber-100 flex items-center justify-center">
      <div className="animate-pulse flex flex-col items-center">
        <div className="h-16 w-16 bg-saffron-200 rounded-full mb-4"></div>
        <div className="h-8 w-64 bg-saffron-200 rounded mb-4"></div>
        <div className="h-4 w-48 bg-saffron-100 rounded"></div>
      </div>
    </div>
  );
}

interface NotFoundStateProps {
  onBackClick: () => void;
  errorMessage?: string | null;
}

function NotFoundState({ onBackClick, errorMessage }: NotFoundStateProps) {
  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50 to-amber-100 p-8">
      <Button variant="outline" onClick={onBackClick} className="mb-8">
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to Scriptures
      </Button>
      <div className="text-center py-12">
        <MessageCircleQuestion className="mx-auto h-16 w-16 text-crimson-300 mb-4" />
        <h2 className="text-2xl font-bold text-crimson-800 mb-2">
          {errorMessage || "Scripture not found"}
        </h2>
        <p className="text-maroon-600 mb-6">
          {errorMessage
            ? "There was a problem loading this scripture."
            : "We couldn't find the scripture you're looking for."}
        </p>
        <Button
          onClick={onBackClick}
          className="bg-crimson-600 hover:bg-crimson-700"
        >
          View All Scriptures
        </Button>
      </div>
    </div>
  );
}
