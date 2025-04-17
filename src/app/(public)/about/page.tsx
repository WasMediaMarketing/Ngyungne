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
  ArrowRight,
  CheckCircle,
} from "lucide-react";

const MotionCard = motion(Card);
const MotionImage = motion(Image);

// Animation variants
const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

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
  const heroRef = useRef(null);
  const historyRef = useRef(null);
  const practiceRef = useRef(null);
  const benefitsRef = useRef(null);
  const ctaRef = useRef(null);

  const isHeroInView = useInView(heroRef, { once: true });
  const isHistoryInView = useInView(historyRef, { once: true });
  const isPracticeInView = useInView(practiceRef, {
    once: true,
  });
  const isBenefitsInView = useInView(benefitsRef, {
    once: true,
  });
  const isCtaInView = useInView(ctaRef, { once: true });

  return (
    <div className="bg-gradient-to-b from-amber-50 to-white min-h-screen">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <Breadcrumbs />

        <motion.h1
          className="text-4xl md:text-5xl xl:text-6xl font-bold py-4 mb-4 text-crimson-800 text-center bg-clip-text text-transparent bg-gradient-to-r from-crimson-700 to-crimson-900"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
        >
          About Ngyungne Practice
        </motion.h1>

        {/* Hero Section */}
        <motion.section
          ref={heroRef}
          variants={staggerContainer}
          initial="hidden"
          animate={isHeroInView ? "visible" : "hidden"}
          className="mb-20"
        >
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              variants={fadeIn}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="relative h-96 md:h-[500px] lg:h-[600px] rounded-2xl overflow-hidden shadow-2xl transform hover:scale-[1.01] transition-transform duration-500"
            >
              <div className="absolute inset-0 bg-gradient-to-t from-crimson-900/40 to-transparent z-10"></div>
              <Image
                src="https://www.dharmaideal.org/api/image/1736165623116.jpeg"
                alt="About Ngyungne"
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 50vw"
                priority
              />
            </motion.div>

            <motion.div
              variants={fadeIn}
              transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
              className="space-y-8"
            >
              <h2 className="text-3xl md:text-4xl font-bold text-crimson-700 leading-tight">
                Discover the Ancient Practice of{" "}
                <span className="italic">Ngyungne</span>
              </h2>
              <p className="text-maroon-600 text-lg md:text-xl leading-relaxed">
                Ngyungne is a profound fasting and purification practice
                associated with Avalokiteshvara, the Buddha of Compassion. This
                sacred tradition has been preserved and transmitted through an
                unbroken lineage of masters for over a millennium, offering
                practitioners a powerful method for spiritual transformation and
                the cultivation of boundless compassion.
              </p>

              <div className="grid sm:grid-cols-2 gap-8">
                <div className="flex items-center space-x-4 group">
                  <div className="p-3 bg-crimson-50 rounded-full text-crimson-600 group-hover:bg-crimson-100 transition-colors duration-300">
                    <CalendarDays className="w-8 h-8 sm:w-10 sm:h-10" />
                  </div>
                  <div>
                    <div className="text-2xl sm:text-3xl font-bold text-crimson-600 group-hover:text-crimson-700 transition-colors duration-300">
                      1000+
                    </div>
                    <p className="text-maroon-600">Years of Tradition</p>
                  </div>
                </div>

                <div className="flex items-center space-x-4 group">
                  <div className="p-3 bg-crimson-50 rounded-full text-crimson-600 group-hover:bg-crimson-100 transition-colors duration-300">
                    <Users className="w-8 h-8 sm:w-10 sm:h-10" />
                  </div>
                  <div>
                    <div className="text-2xl sm:text-3xl font-bold text-crimson-600 group-hover:text-crimson-700 transition-colors duration-300">
                      10000+
                    </div>
                    <p className="text-maroon-600">Practitioners Worldwide</p>
                  </div>
                </div>

                <div className="flex items-center space-x-4 group">
                  <div className="p-3 bg-crimson-50 rounded-full text-crimson-600 group-hover:bg-crimson-100 transition-colors duration-300">
                    <BookOpen className="w-8 h-8 sm:w-10 sm:h-10" />
                  </div>
                  <div>
                    <div className="text-2xl sm:text-3xl font-bold text-crimson-600 group-hover:text-crimson-700 transition-colors duration-300">
                      100+
                    </div>
                    <p className="text-maroon-600">Qualified Teachers</p>
                  </div>
                </div>

                <div className="flex items-center space-x-4 group">
                  <div className="p-3 bg-crimson-50 rounded-full text-crimson-600 group-hover:bg-crimson-100 transition-colors duration-300">
                    <Globe className="w-8 h-8 sm:w-10 sm:h-10" />
                  </div>
                  <div>
                    <div className="text-2xl sm:text-3xl font-bold text-crimson-600 group-hover:text-crimson-700 transition-colors duration-300">
                      50+
                    </div>
                    <p className="text-maroon-600">Countries Reached</p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </motion.section>

        {/* History Section */}
        <motion.section
          ref={historyRef}
          variants={staggerContainer}
          initial="hidden"
          animate={isHistoryInView ? "visible" : "hidden"}
          className="mb-24"
        >
          <motion.h2
            variants={fadeIn}
            className="text-3xl font-bold text-crimson-700 mb-8 text-center"
          >
            The Rich History of <span className="italic">Ngyungne</span>
          </motion.h2>

          <div className="relative">
            <div className="absolute left-1/2 transform -translate-x-1/2 h-full w-1 bg-gradient-to-b from-crimson-300 to-saffron-300 hidden md:block"></div>

            <div className="grid md:grid-cols-2 gap-8 relative">
              <motion.div
                variants={fadeIn}
                transition={{ delay: 0.1 }}
                className="md:pr-12 space-y-4 relative"
              >
                <div className="hidden md:block absolute right-0 top-0 w-6 h-6 bg-crimson-600 rounded-full transform translate-x-3"></div>
                <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 border-l-4 border-crimson-500">
                  <h3 className="text-xl font-semibold text-crimson-700 mb-3">
                    Origins
                  </h3>
                  <p className="text-maroon-600">
                    Ngyungne practice traces its origins to the 11th century,
                    emerging from the profound spiritual experiences of the
                    great female practitioner Gelongma Palmo. Afflicted with
                    leprosy, Gelongma Palmo's unwavering devotion to
                    Avalokiteshvara led to her miraculous healing and spiritual
                    awakening.
                  </p>
                </div>
              </motion.div>

              <motion.div
                variants={fadeIn}
                transition={{ delay: 0.2 }}
                className="md:pl-12 space-y-4 relative"
              >
                <div className="hidden md:block absolute left-0 top-0 w-6 h-6 bg-crimson-600 rounded-full transform -translate-x-3"></div>
                <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 border-l-4 border-crimson-500">
                  <h3 className="text-xl font-semibold text-crimson-700 mb-3">
                    Codification
                  </h3>
                  <p className="text-maroon-600">
                    Following her transformation, Gelongma Palmo codified the
                    Ngyungne practice, establishing a structured approach to
                    cultivating compassion and purifying negative karma. This
                    practice quickly gained recognition for its potency and
                    accessibility, spreading throughout Tibet and beyond.
                  </p>
                </div>
              </motion.div>

              <motion.div
                variants={fadeIn}
                transition={{ delay: 0.3 }}
                className="md:pr-12 space-y-4 relative"
              >
                <div className="hidden md:block absolute right-0 top-0 w-6 h-6 bg-crimson-600 rounded-full transform translate-x-3"></div>
                <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 border-l-4 border-crimson-500">
                  <h3 className="text-xl font-semibold text-crimson-700 mb-3">
                    Lineage
                  </h3>
                  <p className="text-maroon-600">
                    Over the centuries, Ngyungne has been preserved and
                    transmitted by a lineage of realized masters, each
                    contributing to its rich tapestry of teachings and methods.
                    Today, it stands as a cornerstone of Tibetan Buddhist
                    practice, offering practitioners a time-tested path to
                    spiritual growth and the awakening of boundless compassion.
                  </p>
                </div>
              </motion.div>

              <motion.div
                variants={fadeIn}
                transition={{ delay: 0.4 }}
                className="md:pl-12 space-y-4 relative"
              >
                <div className="hidden md:block absolute left-0 top-0 w-6 h-6 bg-crimson-600 rounded-full transform -translate-x-3"></div>
                <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 border-l-4 border-crimson-500">
                  <h3 className="text-xl font-semibold text-crimson-700 mb-3">
                    Preservation
                  </h3>
                  <p className="text-maroon-600">
                    The practice has survived political upheavals, geographical
                    dispersion of Tibetan Buddhism, and the challenges of
                    modernity, testament to its enduring power and relevance.
                    Today, it continues to inspire practitioners worldwide,
                    offering a profound path to compassion and awakening.
                  </p>
                </div>
              </motion.div>
            </div>
          </div>
        </motion.section>

        <Separator className="bg-gradient-to-r from-saffron-200 via-crimson-300 to-saffron-200 h-1 rounded-full my-12" />

        {/* Practice Section with OrbitingCircles */}
        <motion.section
          ref={practiceRef}
          variants={staggerContainer}
          initial="hidden"
          animate={isPracticeInView ? "visible" : "hidden"}
          className="mb-24"
        >
          <motion.h2
            variants={fadeIn}
            className="text-3xl font-bold text-crimson-700 mb-6 text-center"
          >
            Understanding the <span className="italic">Ngyungne</span> Practice
          </motion.h2>

          <motion.p
            variants={fadeIn}
            transition={{ delay: 0.1 }}
            className="text-maroon-600 text-lg md:text-xl mb-12 max-w-3xl mx-auto text-center"
          >
            Ngyungne is typically practiced over a two-day period, though longer
            retreats are common. The practice is characterized by its intensive
            nature, combining several powerful elements of Buddhist practice:
          </motion.p>

          <motion.div
            variants={fadeIn}
            transition={{ delay: 0.2 }}
            className="relative flex h-[500px] w-full flex-col items-center justify-center overflow-hidden mb-12"
          >
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-saffron-50 to-transparent"></div>
            <OrbitingCircles iconSize={40} items={orbitItems} className="z-10">
              <div className="p-4 bg-gradient-to-br from-crimson-500 to-crimson-700 rounded-full text-white">
                <Lotus className="w-12 h-12" />
              </div>
            </OrbitingCircles>
            <OrbitingCircles
              iconSize={30}
              radius={100}
              reverse
              speed={2}
              items={orbitItems}
              className="z-10"
            >
              <div className="p-4 bg-gradient-to-br from-saffron-400 to-saffron-600 rounded-full text-white">
                <Heart className="w-8 h-8" />
              </div>
            </OrbitingCircles>
          </motion.div>

          <motion.div
            variants={fadeIn}
            transition={{ delay: 0.3 }}
            className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 max-w-4xl mx-auto mb-8"
          >
            {orbitItems.map((item, index) => (
              <div
                key={item.id}
                className="bg-white p-4 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 text-center hover:scale-105"
              >
                <div className="mx-auto mb-2 w-12 h-12 flex items-center justify-center bg-crimson-50 rounded-full text-crimson-600">
                  {item.icon}
                </div>
                <h3 className="font-semibold text-crimson-700 mb-1">
                  {item.title}
                </h3>
              </div>
            ))}
          </motion.div>

          <motion.p
            variants={fadeIn}
            transition={{ delay: 0.4 }}
            className="text-maroon-600 max-w-3xl mx-auto text-center"
          >
            These elements work together to create a transformative experience,
            purifying body, speech, and mind while cultivating deep compassion
            and wisdom.
          </motion.p>
        </motion.section>

        <Separator className="bg-gradient-to-r from-saffron-200 via-crimson-300 to-saffron-200 h-1 rounded-full my-12" />

        {/* Benefits Section */}
        <motion.section
          ref={benefitsRef}
          variants={staggerContainer}
          initial="hidden"
          animate={isBenefitsInView ? "visible" : "hidden"}
          className="mb-24"
        >
          <motion.h2
            variants={fadeIn}
            className="text-3xl font-bold text-crimson-700 mb-6 text-center"
          >
            The Benefits of <span className="italic">Ngyungne</span>
          </motion.h2>

          <motion.p
            variants={fadeIn}
            transition={{ delay: 0.1 }}
            className="text-maroon-600 text-lg md:text-xl mb-12 max-w-3xl mx-auto text-center"
          >
            Practitioners of Ngyungne report a wide array of benefits that
            extend far beyond the practice period itself. These benefits
            encompass spiritual growth, emotional well-being, and even physical
            health:
          </motion.p>

          <div className="grid md:grid-cols-3 gap-6 lg:gap-8">
            <MotionCard
              className="bg-gradient-to-b from-white to-saffron-50 border-saffron-200 overflow-hidden hover:shadow-lg transition-shadow duration-300"
              variants={fadeIn}
              transition={{ delay: 0.2 }}
            >
              <div className="h-2 bg-gradient-to-r from-crimson-500 to-crimson-600"></div>
              <CardHeader>
                <CardTitle className="flex items-center text-crimson-700">
                  <Heart className="w-6 h-6 mr-2 text-crimson-600" />
                  Spiritual Growth
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3 text-maroon-600">
                  <li className="flex items-start">
                    <CheckCircle className="w-5 h-5 mr-2 text-crimson-500 flex-shrink-0 mt-0.5" />
                    <span>
                      Increased compassion and empathy towards all beings
                    </span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="w-5 h-5 mr-2 text-crimson-500 flex-shrink-0 mt-0.5" />
                    <span>Deepened spiritual insights and connection</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="w-5 h-5 mr-2 text-crimson-500 flex-shrink-0 mt-0.5" />
                    <span>Purification of negative karma and obstacles</span>
                  </li>
                </ul>
              </CardContent>
            </MotionCard>

            <MotionCard
              className="bg-gradient-to-b from-white to-saffron-50 border-saffron-200 overflow-hidden hover:shadow-lg transition-shadow duration-300"
              variants={fadeIn}
              transition={{ delay: 0.3 }}
            >
              <div className="h-2 bg-gradient-to-r from-crimson-600 to-crimson-700"></div>
              <CardHeader>
                <CardTitle className="flex items-center text-crimson-700">
                  <Brain className="w-6 h-6 mr-2 text-crimson-600" />
                  Mental Well-being
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3 text-maroon-600">
                  <li className="flex items-start">
                    <CheckCircle className="w-5 h-5 mr-2 text-crimson-500 flex-shrink-0 mt-0.5" />
                    <span>Enhanced mental clarity and focus in daily life</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="w-5 h-5 mr-2 text-crimson-500 flex-shrink-0 mt-0.5" />
                    <span>Improved emotional regulation and resilience</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="w-5 h-5 mr-2 text-crimson-500 flex-shrink-0 mt-0.5" />
                    <span>Strengthened self-discipline and willpower</span>
                  </li>
                </ul>
              </CardContent>
            </MotionCard>

            <MotionCard
              className="bg-gradient-to-b from-white to-saffron-50 border-saffron-200 overflow-hidden hover:shadow-lg transition-shadow duration-300"
              variants={fadeIn}
              transition={{ delay: 0.4 }}
            >
              <div className="h-2 bg-gradient-to-r from-crimson-700 to-crimson-800"></div>
              <CardHeader>
                <CardTitle className="flex items-center text-crimson-700">
                  <Leaf className="w-6 h-6 mr-2 text-crimson-600" />
                  Physical Health
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3 text-maroon-600">
                  <li className="flex items-start">
                    <CheckCircle className="w-5 h-5 mr-2 text-crimson-500 flex-shrink-0 mt-0.5" />
                    <span>Physical detoxification through mindful fasting</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="w-5 h-5 mr-2 text-crimson-500 flex-shrink-0 mt-0.5" />
                    <span>Improved sleep quality and natural rhythms</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="w-5 h-5 mr-2 text-crimson-500 flex-shrink-0 mt-0.5" />
                    <span>Increased energy and vitality after practice</span>
                  </li>
                </ul>
              </CardContent>
            </MotionCard>
          </div>

          <motion.p
            variants={fadeIn}
            transition={{ delay: 0.5 }}
            className="text-maroon-600 mt-8 max-w-3xl mx-auto text-center"
          >
            Moreover, the collective practice of Ngyungne is believed to
            generate tremendous merit, not only for the practitioners but for
            all sentient beings. This accumulation of positive energy is seen as
            a powerful force for peace and harmony in the world.
          </motion.p>
        </motion.section>

        {/* CTA Section */}
        <motion.section
          ref={ctaRef}
          variants={fadeIn}
          initial="hidden"
          animate={isCtaInView ? "visible" : "hidden"}
          transition={{ duration: 0.8 }}
          className="bg-gradient-to-r from-saffron-100 to-amber-100 py-12 px-6 rounded-2xl shadow-xl text-center relative overflow-hidden"
        >
          <div className="absolute top-0 left-0 w-full h-full bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cGF0aCBkPSJNMTAwIDEwMG0tOTAgMGE5MCA5MCAwIDEgMCAxODAgMCA5MCA5MCAwIDEgMC0xODAgMHoiIGZpbGw9Im5vbmUiIHN0cm9rZT0iI2ZkYmE3NCIgc3Ryb2tlLXdpZHRoPSIyIiBvcGFjaXR5PSIwLjIiLz48L3N2Zz4=')] bg-repeat opacity-50"></div>

          <div className="relative z-10">
            <h3 className="text-3xl font-bold text-crimson-700 mb-4">
              Ready to Experience <span className="italic">Ngyungne</span>?
            </h3>

            <p className="text-maroon-600 text-lg md:text-xl mb-10 max-w-2xl mx-auto">
              Embark on a transformative journey through our upcoming retreats
              or learn how to incorporate this profound practice into your daily
              life. Discover the power of Ngyungne and unlock your potential for
              boundless compassion.
            </p>

            <div className="flex flex-col sm:flex-row justify-center gap-4 md:gap-6">
              <Button
                asChild
                size="lg"
                className="bg-gradient-to-r from-crimson-600 to-crimson-700 hover:from-crimson-700 hover:to-crimson-800 text-white text-lg px-8 py-6 rounded-full transition-all duration-300 ease-in-out transform hover:scale-105 hover:shadow-lg flex items-center justify-center gap-2"
              >
                <Link href="/programs/retreats">
                  Explore Our Retreats
                  <ArrowRight className="w-5 h-5 ml-1" />
                </Link>
              </Button>

              <Button
                asChild
                size="lg"
                variant="outline"
                className="border-2 border-crimson-600 text-crimson-600 hover:bg-crimson-50 text-lg px-8 py-6 rounded-full transition-all duration-300 ease-in-out transform hover:scale-105 hover:shadow-lg flex items-center justify-center gap-2"
              >
                <Link href="/resources/blog">
                  Read Our Blog
                  <ArrowRight className="w-5 h-5 ml-1" />
                </Link>
              </Button>
            </div>
          </div>
        </motion.section>
      </div>
    </div>
  );
}
