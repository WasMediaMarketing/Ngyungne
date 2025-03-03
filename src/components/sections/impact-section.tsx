"use client";

import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef, useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Users, Globe, BookOpen, Heart } from "lucide-react";

const impactStats = [
  {
    number: 10000,
    label: "Students Taught",
    icon: Users,
    description: "Students from around the world",
  },
  {
    number: 50,
    label: "Countries Reached",
    icon: Globe,
    description: "Global community of practitioners",
  },
  {
    number: 1000,
    label: "Teaching Hours",
    icon: BookOpen,
    description: "Hours of Buddhist teachings",
  },
  {
    number: 100,
    label: "Retreats Conducted",
    icon: Heart,
    description: "Transformative meditation retreats",
  },
];

export function ImpactSection() {
  const ref = useRef(null);
  // Change `once: true` to `once: false` to trigger animation on scroll in both directions
  const isInView = useInView(ref, { once: false });

  return (
    <section className="py-20 bg-primary text-primary-foreground">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Badge variant="secondary" className="mb-4">
              Our Impact
            </Badge>
            <h2 className="text-3xl font-bold mb-4">Making a Difference</h2>
            <p className="text-primary-foreground/80 max-w-2xl mx-auto">
              Through our teachings and programs, we've touched countless lives
              and spread Buddhist wisdom across the globe.
            </p>
          </motion.div>
        </div>

        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.8 }}
          className="grid md:grid-cols-2 lg:grid-cols-4 gap-8"
        >
          {impactStats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                animate={
                  isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }
                }
                transition={{ duration: 0.8, delay: index * 0.2 }}
              >
                <Card className="bg-primary-foreground/10 border-primary-foreground/20">
                  <CardContent className="p-6 text-center">
                    <div className="flex justify-center mb-4">
                      <div className="p-3 rounded-full bg-primary-foreground/10">
                        <Icon className="h-6 w-6 text-saffron-500" />
                      </div>
                    </div>
                    <Counter number={stat.number} isInView={isInView} />
                    <div className="text-lg font-medium mb-2 text-saffron-300">
                      {stat.label}
                    </div>
                    <p className="text-primary-foreground/80 text-sm">
                      {stat.description}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}

// Counter component to animate the numbers
const Counter = ({
  number,
  isInView,
}: {
  number: number;
  isInView: boolean;
}) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (isInView) {
      let start = 0;
      const end = number;
      const duration = 2000; // 2 seconds
      const increment = Math.ceil(end / (duration / 50)); // Adjust the interval speed
      const timer = setInterval(() => {
        start += increment;
        if (start >= end) {
          start = end;
          clearInterval(timer);
        }
        setCount(start);
      }, 50); // 50ms interval for smooth counting
    }
  }, [isInView, number]);

  return (
    <div className="text-3xl font-bold mb-2 text-saffron-300">
      {count.toLocaleString()} +
    </div>
  );
};
