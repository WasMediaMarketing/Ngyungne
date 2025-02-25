"use client"

import { motion } from "framer-motion"
import { useInView } from "framer-motion"
import { useRef } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Calendar } from "lucide-react"
import Link from "next/link"

const blogPosts = [
  {
    title: "Understanding Buddhist Meditation Techniques",
    excerpt: "Learn about different meditation techniques and their benefits for daily practice.",
    date: "Feb 25, 2024",
    author: "Ven. Khen Rinpoche",
    category: "Meditation",
    image: "/placeholder.svg",
    slug: "understanding-buddhist-meditation",
  },
  {
    title: "The Four Noble Truths Explained",
    excerpt: "A comprehensive guide to understanding the fundamental teachings of Buddhism.",
    date: "Feb 20, 2024",
    author: "H.E. Choknyi Rinpoche",
    category: "Philosophy",
    image: "/placeholder.svg",
    slug: "four-noble-truths",
  },
  {
    title: "Mindfulness in Daily Life",
    excerpt: "Practical tips for incorporating mindfulness into your everyday activities.",
    date: "Feb 15, 2024",
    author: "Ven. Dolpo Tulku Rinpoche",
    category: "Practice",
    image: "/placeholder.svg",
    slug: "mindfulness-daily-life",
  },
]

export function BlogSection() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true })

  return (
    <section className="py-20">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center mb-12">
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5 }}>
            <Badge variant="secondary" className="mb-4">
              Latest Articles
            </Badge>
            <h2 className="text-3xl font-bold">From Our Blog</h2>
          </motion.div>
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5 }}>
            <Button variant="outline" asChild>
              <Link href="/resources/blog">View All Posts</Link>
            </Button>
          </motion.div>
        </div>

        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.8 }}
          className="grid md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {blogPosts.map((post, index) => (
            <motion.div
              key={post.slug}
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              transition={{ duration: 0.8, delay: index * 0.2 }}
            >
              <Card className="h-full">
                <div className="aspect-video relative">
                  <img
                    src={post.image || "/placeholder.svg"}
                    alt={post.title}
                    className="w-full h-full object-cover rounded-t-lg"
                  />
                  <div className="absolute top-4 right-4">
                    <Badge>{post.category}</Badge>
                  </div>
                </div>
                <CardHeader>
                  <CardTitle className="line-clamp-2">
                    <Link href={`/resources/blog/${post.slug}`}>{post.title}</Link>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground mb-4 line-clamp-2">{post.excerpt}</p>
                  <div className="flex items-center justify-between">
                    <div className="text-sm text-muted-foreground">By {post.author}</div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Calendar className="h-4 w-4" />
                      {post.date}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}

