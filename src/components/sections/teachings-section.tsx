"use client"

import { motion } from "framer-motion"
import { useInView } from "framer-motion"
import { useRef } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Calendar, Clock, Users, Book } from "lucide-react"

const teachings = [
  {
    title: "Introduction to Buddhism",
    description: "Learn the fundamental principles of Buddhist philosophy and practice.",
    schedule: "Every Monday",
    duration: "2 hours",
    level: "Beginner",
    teacher: "Ven. Khen Ripoche",
    icon: Book,
  },
  {
    title: "Meditation Techniques",
    description: "Explore various meditation methods from the Tibetan Buddhist tradition.",
    schedule: "Every Wednesday",
    duration: "1.5 hours",
    level: "All Levels",
    teacher: "H.E. Choknyi Rinpoche",
    icon: Users,
  },
  {
    title: "Advanced Buddhist Philosophy",
    description: "Deep dive into complex philosophical concepts and their practical applications.",
    schedule: "Weekends",
    duration: "3 hours",
    level: "Advanced",
    teacher: "Ven. Dolpo Tulku Rinpoche",
    icon: Book,
  },
]

export function TeachingsSection() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true })

  return (
    <section id="teachings" className="py-20 bg-gradient-to-b from-secondary/5 to-transparent">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <div className="inline-block bg-accent/10 px-4 py-2 rounded-full mb-4">
            <span className="text-accent font-medium">Our Teachings</span>
          </div>
          <h2 className="text-4xl font-bold text-primary mb-4">Buddhist Teachings & Classes</h2>
          <p className="text-primary/80 max-w-2xl mx-auto">
            Explore our comprehensive range of Buddhist teachings, from introductory courses to advanced philosophical
            studies.
          </p>
        </div>

        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.8 }}
          className="grid md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {teachings.map((teaching, index) => {
            const Icon = teaching.icon
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                transition={{ duration: 0.8, delay: index * 0.2 }}
              >
                <Card className="group hover:shadow-lg transition-shadow duration-300">
                  <CardHeader>
                    <div className="flex items-center gap-4 mb-4">
                      <div className="p-3 rounded-full bg-secondary/10 text-secondary">
                        <Icon className="h-6 w-6" />
                      </div>
                      <CardTitle>{teaching.title}</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-primary/80 mb-6">{teaching.description}</p>
                    <div className="space-y-3">
                      <div className="flex items-center gap-2 text-primary/60">
                        <Calendar className="h-4 w-4" />
                        <span>{teaching.schedule}</span>
                      </div>
                      <div className="flex items-center gap-2 text-primary/60">
                        <Clock className="h-4 w-4" />
                        <span>{teaching.duration}</span>
                      </div>
                      <div className="flex items-center gap-2 text-primary/60">
                        <Users className="h-4 w-4" />
                        <span>{teaching.level}</span>
                      </div>
                      <p className="font-medium text-primary">Teacher: {teaching.teacher}</p>
                      <Button className="w-full mt-4 bg-primary hover:bg-primary/90">Register for Class</Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )
          })}
        </motion.div>
      </div>
    </section>
  )
}

