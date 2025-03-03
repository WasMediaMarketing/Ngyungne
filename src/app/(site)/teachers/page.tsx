"use client"

import { motion } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import Image from "next/image"

interface Teacher {
  id: string
  name: string
  title: string
  bio: string
  image: string
  teachings: {
    title: string
    date: string
    type: string
  }[]
  specialties: string[]
}

const teachers: Teacher[] = [
  {
    id: "1",
    name: "Ven. Khen Rinpoche",
    title: "Senior Buddhist Teacher",
    bio: "Venerable Khen Rinpoche has been teaching Buddhism for over 30 years...",
    image: "/placeholder.svg",
    teachings: [
      {
        title: "Introduction to Buddhist Philosophy",
        date: "2024-03-01",
        type: "Online",
      },
      // Add more teachings
    ],
    specialties: ["Meditation", "Buddhist Philosophy", "Tibetan Language"],
  },
  // Add more teachers
]

export default function TeachersPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-primary mb-2">Our Teachers</h1>
          <p className="text-primary/60">Learn from our experienced Buddhist teachers and practitioners</p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {teachers.map((teacher) => (
            <Card key={teacher.id} className="overflow-hidden">
              <div className="aspect-[3/4] relative">
                <Image src={teacher.image || "/placeholder.svg"} alt={teacher.name} fill className="object-cover" />
              </div>
              <CardHeader>
                <CardTitle>{teacher.name}</CardTitle>
                <p className="text-primary/60">{teacher.title}</p>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="bio" className="space-y-4">
                  <TabsList>
                    <TabsTrigger value="bio">Bio</TabsTrigger>
                    <TabsTrigger value="teachings">Teachings</TabsTrigger>
                  </TabsList>

                  <TabsContent value="bio">
                    <div className="space-y-4">
                      <p className="text-primary/80">{teacher.bio}</p>
                      <div>
                        <h4 className="font-medium mb-2">Specialties</h4>
                        <div className="flex flex-wrap gap-2">
                          {teacher.specialties.map((specialty, index) => (
                            <span key={index} className="px-3 py-1 bg-secondary/10 text-secondary rounded-full text-sm">
                              {specialty}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </TabsContent>

                  <TabsContent value="teachings">
                    <div className="space-y-4">
                      {teacher.teachings.map((teaching, index) => (
                        <div key={index} className="flex justify-between items-center p-3 bg-muted rounded-lg">
                          <div>
                            <h4 className="font-medium">{teaching.title}</h4>
                            <p className="text-sm text-primary/60">
                              {teaching.date} • {teaching.type}
                            </p>
                          </div>
                          <Button variant="outline" size="sm">
                            Register
                          </Button>
                        </div>
                      ))}
                    </div>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          ))}
        </div>
      </motion.div>
    </div>
  )
}

