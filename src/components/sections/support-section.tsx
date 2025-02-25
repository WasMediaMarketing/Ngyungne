"use client"

import { motion } from "framer-motion"
import { useInView } from "framer-motion"
import { useRef } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Heart, Gift, BookOpen, Users } from "lucide-react"

const supportOptions = [
  {
    title: "Monthly Donation",
    description: "Support our ongoing programs and maintenance with a monthly contribution.",
    icon: Heart,
    options: ["$10/month", "$25/month", "$50/month", "$100/month"],
    benefits: [
      "Support daily operations",
      "Help maintain facilities",
      "Fund teaching programs",
      "Monthly merit dedication",
    ],
  },
  {
    title: "One-time Donation",
    description: "Make a one-time contribution to support our mission and activities.",
    icon: Gift,
    options: ["$50", "$100", "$250", "$500"],
    benefits: ["Support special projects", "Fund retreat scholarships", "Help with maintenance", "Merit dedication"],
  },
  {
    title: "Sponsor a Program",
    description: "Help make Buddhist teachings accessible to more people.",
    icon: BookOpen,
    options: ["$500", "$1000", "$2500", "$5000"],
    benefits: [
      "Fund teaching programs",
      "Support student scholarships",
      "Enable live streaming",
      "Special dedication ceremony",
    ],
  },
]

export function SupportSection() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true })

  return (
    <section className="py-20 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <Badge variant="secondary" className="mb-4">
              Support Our Mission
            </Badge>
            <h2 className="text-3xl font-bold mb-4">Help Us Spread Buddhist Teachings</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Your generous support helps us maintain our facilities, support our teachers, and make Buddhist teachings
              accessible to all.
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
          {supportOptions.map((option, index) => {
            const Icon = option.icon
            return (
              <motion.div
                key={option.title}
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                transition={{ duration: 0.8, delay: index * 0.2 }}
              >
                <Card className="h-full">
                  <CardHeader>
                    <div className="flex items-center gap-4 mb-4">
                      <div className="p-3 rounded-full bg-primary/10">
                        <Icon className="h-6 w-6 text-primary" />
                      </div>
                      <CardTitle>{option.title}</CardTitle>
                    </div>
                    <p className="text-muted-foreground">{option.description}</p>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 gap-2 mb-6">
                      {option.options.map((amount) => (
                        <Button key={amount} variant="outline" className="w-full">
                          {amount}
                        </Button>
                      ))}
                    </div>
                    <div className="space-y-2 mb-6">
                      {option.benefits.map((benefit, i) => (
                        <div key={i} className="flex items-center gap-2">
                          <Users className="h-4 w-4 text-primary" />
                          <span className="text-sm">{benefit}</span>
                        </div>
                      ))}
                    </div>
                    <Button className="w-full">Support Now</Button>
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

