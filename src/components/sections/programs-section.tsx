"use client";

import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock, Users, GraduationCap } from "lucide-react";

const programs = [
  {
    title: "Buddhist Philosophy Course",
    description: "Comprehensive study of Buddhist philosophy and concepts",
    duration: "12 weeks",
    schedule: "Every Monday & Wednesday",
    capacity: "30 students",
    level: "Beginner",
    teacher: "Ven. Khen Rinpoche",
    image: "https://hsj.com.np/uploads/0000/1/2024/02/11/yoga-21.jpg",
  },
  {
    title: "Meditation Retreat",
    description: "Intensive meditation practice in a peaceful environment",
    duration: "7 days",
    schedule: "Monthly",
    capacity: "20 practitioners",
    level: "All Levels",
    teacher: "H.E. Choknyi Rinpoche",
    image: "https://hsj.com.np/uploads/0000/1/2024/02/11/yoga-21.jpg",
  },
  {
    title: "Tibetan Language",
    description: "Learn to read and write classical Tibetan texts",
    duration: "16 weeks",
    schedule: "Every Tuesday & Thursday",
    capacity: "15 students",
    level: "Beginner",
    teacher: "Ven. Dolpo Tulku Rinpoche",
    image: "https://hsj.com.np/uploads/0000/1/2024/02/11/yoga-21.jpg",
  },
];

export function ProgramsSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  return (
    <section id="programs" className="py-20 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Badge variant="secondary" className="mb-4">
              Our Programs
            </Badge>
            <h2 className="text-3xl font-bold mb-4">
              Learn and Practice Buddhism
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Join our comprehensive programs designed to help you develop your
              understanding and practice of Buddhism through structured learning
              and guidance.
            </p>
          </motion.div>
        </div>

        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.8 }}
          className="grid md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {programs.map((program, index) => (
            <motion.div
              key={program.title}
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              transition={{ duration: 0.8, delay: index * 0.2 }}
            >
              <Card className="h-full">
                <div className="aspect-video relative">
                  <img
                    src={program.image || "/placeholder.svg"}
                    alt={program.title}
                    className="w-full h-full object-cover rounded-t-lg"
                  />
                  <div className="absolute top-4 right-4">
                    <Badge>{program.level}</Badge>
                  </div>
                </div>
                <CardHeader>
                  <CardTitle>{program.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground mb-6">
                    {program.description}
                  </p>
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 text-sm">
                      <Clock className="h-4 w-4 text-primary" />
                      <span>{program.duration}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Calendar className="h-4 w-4 text-primary" />
                      <span>{program.schedule}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Users className="h-4 w-4 text-primary" />
                      <span>{program.capacity}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <GraduationCap className="h-4 w-4 text-primary" />
                      <span>Teacher: {program.teacher}</span>
                    </div>
                  </div>
                  <Button className="w-full mt-6">Enroll Now</Button>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
