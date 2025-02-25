"use client";

import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";

const causes = [
  {
    id: 1,
    title: "Temple Renovation",
    description: "Help us restore and maintain our sacred temple spaces.",
    goal: 50000,
    raised: 35000,
    image: "/placeholder.svg?height=200&width=400",
  },
  {
    id: 2,
    title: "Monastic Education",
    description: "Support the education of young monks and nuns.",
    goal: 30000,
    raised: 20000,
    image: "/placeholder.svg?height=200&width=400",
  },
  {
    id: 3,
    title: "Community Outreach",
    description: "Expand our Buddhist teachings to more communities.",
    goal: 25000,
    raised: 15000,
    image: "/placeholder.svg?height=200&width=400",
  },
];

export function CausesSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  return (
    <section id="causes" className="py-20 bg-saffron-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4 text-crimson-800">
            Support Our Causes
          </h2>
          <p className="text-maroon-600 max-w-2xl mx-auto">
            Your generous support helps us maintain our temples, support
            monastic education, and spread Buddhist teachings to more
            communities.
          </p>
        </div>

        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.8 }}
          className="grid md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {causes.map((cause, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              transition={{ duration: 0.8, delay: index * 0.2 }}
            >
              <Card className="bg-white border-saffron-200">
                <CardHeader>
                  <CardTitle className="text-crimson-700">
                    {cause.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="aspect-video relative mb-4 rounded-lg overflow-hidden">
                    <img
                      src={cause.image || "/placeholder.svg"}
                      alt={cause.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <p className="text-maroon-600 mb-4">{cause.description}</p>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm text-maroon-700">
                      <span>Raised: ${cause.raised.toLocaleString()}</span>
                      <span>Goal: ${cause.goal.toLocaleString()}</span>
                    </div>
                    <Progress
                      value={(cause.raised / cause.goal) * 100}
                      className="h-2 bg-saffron-200"
                    />
                    <div className="flex justify-between mt-4">
                      <Link href={`/programs/causes/${cause.id}`}>
                        <Button
                          variant="outline"
                          className="border-crimson-600 text-crimson-600 hover:bg-crimson-50"
                        >
                          Learn More
                        </Button>
                      </Link>
                      <Link href={`/programs/causes/${cause.id}`}>
                        <Button className="bg-crimson-600 text-white hover:bg-crimson-700">
                          Donate Now
                        </Button>
                      </Link>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
