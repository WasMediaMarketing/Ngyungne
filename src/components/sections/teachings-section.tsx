"use client";

import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar, Clock, Users, Book } from "lucide-react";
import { teachings } from "@/data/teachings";
import { RegisterForm } from "@/components/sections/register-form";

export function TeachingsSection() {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  return (
    <section
      id="teachings"
      className="py-20 bg-gradient-to-b from-saffron-100 to-transparent"
    >
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
            className="inline-block bg-crimson-100 px-4 py-2 rounded-full mb-4"
          >
            <span className="text-crimson-700 font-medium">Our Teachings</span>
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-4xl font-bold text-crimson-800 mb-4"
          >
            Buddhist Teachings & Classes
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="text-maroon-700 max-w-2xl mx-auto"
          >
            Explore our comprehensive range of Buddhist teachings, from
            introductory courses to advanced philosophical studies.
          </motion.p>
        </div>

        <div ref={ref} className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {teachings.map((teaching, index) => {
            const Icon = teaching.icon;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: index * 0.1 + 0.6 }}
              >
                <Card className="group hover:shadow-lg transition-shadow duration-300 bg-white">
                  <CardHeader>
                    <div className="flex items-center gap-4 mb-4">
                      <div className="p-3 rounded-full bg-saffron-100 text-crimson-600">
                        <Icon className="h-6 w-6" />
                      </div>
                      <CardTitle className="text-crimson-700">
                        {teaching.title}
                      </CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-maroon-600 mb-6">
                      {teaching.description}
                    </p>
                    <div className="space-y-3">
                      <div className="flex items-center gap-2 text-maroon-500">
                        <Calendar className="h-4 w-4" />
                        <span>{teaching.schedule}</span>
                      </div>
                      <div className="flex items-center gap-2 text-maroon-500">
                        <Clock className="h-4 w-4" />
                        <span>{teaching.duration}</span>
                      </div>
                      <div className="flex items-center gap-2 text-maroon-500">
                        <Users className="h-4 w-4" />
                        <span>{teaching.level}</span>
                      </div>
                      <p className="font-medium text-crimson-700">
                        Teacher: {teaching.teacher}
                      </p>
                      <RegisterForm teaching={teaching} />
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
