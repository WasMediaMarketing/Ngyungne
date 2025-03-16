"use client";

import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef, useState } from "react";
import Link from "next/link";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Heart, Info, ArrowRight } from "lucide-react";
import { usePathname } from "next/navigation";
import type { CauseUI } from "@/utils/causeApi";

interface CausesSectionProps {
  causes?: CauseUI[];
  showAll?: boolean; // New prop to control whether to show all causes or just 3
}

export function CausesSection({
  causes = [],
  showAll = false,
}: CausesSectionProps) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.2 });
  const [hoveredCard, setHoveredCard] = useState<string | null>(null);
  const pathname = usePathname();

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.3,
      },
    },
  };

  const item = {
    hidden: { opacity: 0, y: 30 },
    show: { opacity: 1, y: 0, transition: { duration: 0.8 } },
  };

  // Ensure causes is an array before checking length
  const causesArray = Array.isArray(causes) ? causes : [];

  // Limit to 3 causes if not showing all
  const displayCauses = showAll ? causesArray : causesArray.slice(0, 3);

  if (causesArray.length === 0) {
    return (
      <div className="py-16 text-center">
        <h3 className="text-xl font-medium text-maroon-700 mb-4">
          No causes found
        </h3>
        <p className="text-maroon-600">
          Try adjusting your search or filter criteria.
        </p>
      </div>
    );
  }

  return (
    <section id="causes" className="py-8 md:py-12 container mx-auto px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
        transition={{ duration: 0.7 }}
        className="text-center mb-12 md:mb-16"
      >
        <span className="inline-block px-4 py-1 rounded-full bg-saffron-100 text-crimson-700 text-sm font-medium mb-4">
          Make A Difference
        </span>
        <h2 className="text-3xl md:text-4xl font-bold mb-4 text-crimson-800">
          Support Our Causes
        </h2>
        <p className="text-maroon-600 max-w-2xl mx-auto text-base md:text-lg">
          Your generous support helps us maintain our temples, support monastic
          education, and spread Buddhist teachings to communities in need.
        </p>
      </motion.div>
      <motion.div
        ref={ref}
        variants={container}
        initial="hidden"
        animate={isInView ? "show" : "hidden"}
        className="grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8"
      >
        {displayCauses.map((cause) => (
          <motion.div
            key={cause.id}
            variants={item}
            onMouseEnter={() => setHoveredCard(cause.id)}
            onMouseLeave={() => setHoveredCard(null)}
            className="h-full"
          >
            <Card className="h-full bg-white border-saffron-200 overflow-hidden transition-all duration-300 hover:shadow-lg hover:border-crimson-300 flex flex-col">
              <div className="aspect-video relative overflow-hidden">
                <motion.img
                  src={cause.image || "/placeholder.svg"}
                  alt={cause.title}
                  className="w-full h-full object-cover"
                  animate={
                    hoveredCard === cause.id ? { scale: 1.05 } : { scale: 1 }
                  }
                  transition={{ duration: 0.4 }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-70"></div>
                <div className="absolute bottom-3 left-3 right-3">
                  <div className="px-3 py-1 bg-crimson-600 text-white text-xs font-medium rounded-full inline-block">
                    {cause.daysLeft} days left
                  </div>
                </div>
              </div>

              <CardHeader className="pb-2">
                <CardTitle className="text-xl md:text-2xl text-crimson-700 font-semibold">
                  {cause.title}
                </CardTitle>
              </CardHeader>

              <CardContent className="pb-4 flex-grow">
                <p className="text-maroon-600 mb-4 text-sm md:text-base line-clamp-3">
                  {cause.subtitle}
                </p>
                <div className="space-y-3 mt-auto">
                  <div className="flex justify-between text-sm text-maroon-700">
                    <span className="font-medium">
                      ${cause.raised.toLocaleString()}
                    </span>
                    <span>Goal: ${cause.goal.toLocaleString()}</span>
                  </div>
                  <Progress
                    value={cause.progress}
                    className="h-2 bg-saffron-100"
                  />
                  <div className="flex items-center text-xs text-maroon-500 mt-2">
                    <Heart size={14} className="mr-1 text-crimson-500" />
                    <span>{cause.totalDonors} donors</span>
                  </div>
                </div>
              </CardContent>

              <CardFooter className="pt-0 flex flex-col sm:flex-row gap-2 sm:justify-between">
                <Link
                  href={`/programs/causes/${cause.id}`}
                  className="w-full sm:w-auto"
                >
                  <Button
                    variant="outline"
                    size="sm"
                    className="border-crimson-600 text-crimson-600 hover:bg-crimson-50 w-full"
                  >
                    <Info size={16} className="mr-2" /> Learn More
                  </Button>
                </Link>
                <Link
                  href={`/programs/causes/${cause.id}`}
                  className="w-full sm:w-auto"
                >
                  <Button
                    size="sm"
                    className="bg-crimson-600 text-white hover:bg-crimson-700 w-full"
                  >
                    Donate Now
                  </Button>
                </Link>
              </CardFooter>
            </Card>
          </motion.div>
        ))}
      </motion.div>

      {/* Show "View All Causes" button only when not on the causes page and not showing all causes */}
      {!showAll && causesArray.length > 3 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.7, delay: 0.6 }}
          className="mt-12 text-center"
        >
          <Link href="/programs/causes">
            <Button
              variant="outline"
              size="lg"
              className="border-2 border-crimson-600 text-crimson-700 hover:bg-crimson-50 rounded-full px-8"
            >
              View All Causes <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </motion.div>
      )}
    </section>
  );
}
