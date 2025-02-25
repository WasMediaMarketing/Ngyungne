"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { OrbitingCircles } from "@/components/magicui/orbiting-circles";
import {
  CalendarDays,
  Users,
  Globe,
  BookOpen,
  Heart,
  NotebookIcon as Lotus,
  Brain,
  Zap,
  Feather,
  Sunrise,
  Leaf,
} from "lucide-react";

const MotionCard = motion(Card);

const orbitItems = [
  {
    id: "fasting",
    icon: <Lotus className="w-8 h-8 text-crimson-600" />,
    title: "Fasting",
    description:
      "Abstain from food and water for 24 hours, purifying body and mind.",
  },
  {
    id: "silence",
    icon: <Zap className="w-8 h-8 text-crimson-600" />,
    title: "Silence",
    description:
      "Observe silence to foster deep introspection and mindfulness.",
  },
  {
    id: "meditation",
    icon: <Brain className="w-8 h-8 text-crimson-600" />,
    title: "Meditation",
    description:
      "Engage in extended periods of meditation, focusing on Avalokiteshvara.",
  },
  {
    id: "mantra",
    icon: <Heart className="w-8 h-8 text-crimson-600" />,
    title: "Mantra",
    description:
      "Recite Avalokiteshvara's mantra to purify speech and cultivate compassion.",
  },
  {
    id: "compassion",
    icon: <Feather className="w-8 h-8 text-crimson-600" />,
    title: "Compassion",
    description: "Develop boundless compassion for all sentient beings.",
  },
  {
    id: "awakening",
    icon: <Sunrise className="w-8 h-8 text-crimson-600" />,
    title: "Awakening",
    description: "Strive for spiritual awakening and enlightenment.",
  },
];
export default function About() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  return (
    <div className="container mx-auto px-4 py-12">
      <Breadcrumbs />
      <motion.h1
        className="text-5xl font-bold mb-8 text-crimson-800 text-center"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        About Ngyungne Practice
      </motion.h1>

      <motion.div
        ref={ref}
        initial={{ opacity: 0, y: 20 }}
        animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
        transition={{ duration: 0.8 }}
        className="space-y-16"
      >
        {/* Hero Section */}
        <section className="grid md:grid-cols-2 gap-12 items-center">
          <div className="relative h-[600px] rounded-lg overflow-hidden shadow-xl">
            <Image
              src="https://www.dharmaideal.org/api/image/1736165623116.jpeg"
              alt="About Ngyungne"
              fill
              className="object-cover"
            />
          </div>
          <div className="space-y-8">
            <h2 className="text-4xl font-bold text-crimson-700">
              Discover the Ancient Practice of Ngyungne
            </h2>
            <p className="text-maroon-600 text-xl leading-relaxed">
              Ngyungne is a profound fasting and purification practice
              associated with Avalokiteshvara, the Buddha of Compassion. This
              sacred tradition has been preserved and transmitted through an
              unbroken lineage of masters for over a millennium, offering
              practitioners a powerful method for spiritual transformation and
              the cultivation of boundless compassion.
            </p>
            <div className="grid grid-cols-2 gap-8">
              <div className="flex items-center space-x-4">
                <CalendarDays className="w-12 h-12 text-crimson-600" />
                <div>
                  <div className="text-3xl font-bold text-crimson-600">
                    1000+
                  </div>
                  <p className="text-maroon-600">Years of Tradition</p>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <Users className="w-12 h-12 text-crimson-600" />
                <div>
                  <div className="text-3xl font-bold text-crimson-600">
                    10000+
                  </div>
                  <p className="text-maroon-600">Practitioners Worldwide</p>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <BookOpen className="w-12 h-12 text-crimson-600" />
                <div>
                  <div className="text-3xl font-bold text-crimson-600">
                    100+
                  </div>
                  <p className="text-maroon-600">Qualified Teachers</p>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <Globe className="w-12 h-12 text-crimson-600" />
                <div>
                  <div className="text-3xl font-bold text-crimson-600">50+</div>
                  <p className="text-maroon-600">Countries Reached</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* History Section */}
        <section>
          <h2 className="text-3xl font-bold text-crimson-700 mb-6">
            The Rich History of Ngyungne
          </h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="space-y-4">
              <p className="text-maroon-600">
                Ngyungne practice traces its origins to the 11th century,
                emerging from the profound spiritual experiences of the great
                female practitioner Gelongma Palmo. Afflicted with leprosy,
                Gelongma Palmo's unwavering devotion to Avalokiteshvara led to
                her miraculous healing and spiritual awakening.
              </p>
              <p className="text-maroon-600">
                Following her transformation, Gelongma Palmo codified the
                Ngyungne practice, establishing a structured approach to
                cultivating compassion and purifying negative karma. This
                practice quickly gained recognition for its potency and
                accessibility, spreading throughout Tibet and beyond.
              </p>
            </div>
            <div className="space-y-4">
              <p className="text-maroon-600">
                Over the centuries, Ngyungne has been preserved and transmitted
                by a lineage of realized masters, each contributing to its rich
                tapestry of teachings and methods. Today, it stands as a
                cornerstone of Tibetan Buddhist practice, offering practitioners
                a time-tested path to spiritual growth and the awakening of
                boundless compassion.
              </p>
              <p className="text-maroon-600">
                The practice has survived political upheavals, geographical
                dispersion of Tibetan Buddhism, and the challenges of modernity,
                testament to its enduring power and relevance.
              </p>
            </div>
          </div>
        </section>

        <Separator className="bg-saffron-200" />

        {/* Practice Section with OrbitingCircles */}
        <section className="text-center">
          <h2 className="text-3xl font-bold text-crimson-700 mb-6">
            Understanding the Ngyungne Practice
          </h2>
          <p className="text-maroon-600 text-xl mb-8 max-w-2xl mx-auto">
            Ngyungne is typically practiced over a two-day period, though longer
            retreats are common. The practice is characterized by its intensive
            nature, combining several powerful elements of Buddhist practice:
          </p>
          <div className="relative flex h-[500px] w-full flex-col items-center justify-center overflow-hidden">
            <OrbitingCircles iconSize={40} items={orbitItems}>
              <Brain />
              <Lotus />
              <Zap />
              <Heart />
              <Feather />
              <Sunrise />
            </OrbitingCircles>
            <OrbitingCircles
              iconSize={30}
              radius={100}
              reverse
              speed={2}
              items={orbitItems}
            >
              <Brain />
              <Lotus />
              <Zap />
              <Heart />
              <Feather />
              <Sunrise />
            </OrbitingCircles>
          </div>
          <p className="text-maroon-600 mt-6 max-w-2xl mx-auto">
            These elements work together to create a transformative experience,
            purifying body, speech, and mind while cultivating deep compassion
            and wisdom.
          </p>
        </section>

        <Separator className="bg-saffron-200" />

        {/* Benefits Section */}
        <section>
          <h2 className="text-3xl font-bold text-crimson-700 mb-6">
            The Benefits of Ngyungne
          </h2>
          <p className="text-maroon-600 text-xl mb-8">
            Practitioners of Ngyungne report a wide array of benefits that
            extend far beyond the practice period itself. These benefits
            encompass spiritual growth, emotional well-being, and even physical
            health:
          </p>
          <div className="grid md:grid-cols-3 gap-6">
            <MotionCard
              className="bg-saffron-50 border-saffron-200"
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <CardHeader>
                <CardTitle className="flex items-center text-crimson-700">
                  <Heart className="w-6 h-6 mr-2" />
                  Spiritual Growth
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="list-disc pl-6 space-y-2 text-maroon-600">
                  <li>Increased compassion and empathy towards all beings</li>
                  <li>Deepened spiritual insights</li>
                  <li>Purification of negative karma</li>
                </ul>
              </CardContent>
            </MotionCard>
            <MotionCard
              className="bg-saffron-50 border-saffron-200"
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <CardHeader>
                <CardTitle className="flex items-center text-crimson-700">
                  <Brain className="w-6 h-6 mr-2" />
                  Mental Well-being
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="list-disc pl-6 space-y-2 text-maroon-600">
                  <li>Enhanced mental clarity and focus</li>
                  <li>Improved emotional regulation</li>
                  <li>Strengthened self-discipline and willpower</li>
                </ul>
              </CardContent>
            </MotionCard>
            <MotionCard
              className="bg-saffron-50 border-saffron-200"
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              <CardHeader>
                <CardTitle className="flex items-center text-crimson-700">
                  <Leaf className="w-6 h-6 mr-2" />
                  Physical Health
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="list-disc pl-6 space-y-2 text-maroon-600">
                  <li>Physical detoxification through fasting</li>
                  <li>Improved sleep quality</li>
                  <li>Increased energy and vitality</li>
                </ul>
              </CardContent>
            </MotionCard>
          </div>
          <p className="text-maroon-600 mt-6">
            Moreover, the collective practice of Ngyungne is believed to
            generate tremendous merit, not only for the practitioners but for
            all sentient beings. This accumulation of positive energy is seen as
            a powerful force for peace and harmony in the world.
          </p>
        </section>

        {/* CTA Section */}
        <section className="bg-saffron-100 py-12 px-6 rounded-lg shadow-inner text-center">
          <h3 className="text-3xl font-bold text-crimson-700 mb-4">
            Ready to Experience Ngyungne?
          </h3>
          <p className="text-maroon-600 text-xl mb-8 max-w-2xl mx-auto">
            Embark on a transformative journey through our upcoming retreats or
            learn how to incorporate this profound practice into your daily
            life. Discover the power of Ngyungne and unlock your potential for
            boundless compassion.
          </p>
          <div className="space-x-4">
            <Button
              asChild
              size="lg"
              className="bg-crimson-600 hover:bg-crimson-700 text-white text-lg px-8 py-3 rounded-full transition-all duration-300 ease-in-out transform hover:scale-105"
            >
              <Link href="/programs/retreats">Explore Our Retreats</Link>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="border-crimson-600 text-crimson-600 hover:bg-crimson-50 text-lg px-8 py-3 rounded-full transition-all duration-300 ease-in-out transform hover:scale-105"
            >
              <Link href="/resources/blog">Read Our Blog</Link>
            </Button>
          </div>
        </section>
      </motion.div>
    </div>
  );
}
