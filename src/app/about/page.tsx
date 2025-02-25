"use client";

import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";
import Image from "next/image";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function About() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  return (
    <div className="container mx-auto px-4 py-8">
      <Breadcrumbs />
      <motion.h1
        className="text-4xl font-bold mb-6 text-crimson-800"
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
      >
        <div className="grid md:grid-cols-2 gap-12 items-center mb-12">
          <div className="relative h-[500px] rounded-lg overflow-hidden">
            <Image
              src="https://www.dharmaideal.org/api/image/1736165623116.jpeg"
              alt="About Ngyungne"
              fill
              className="object-cover"
            />
          </div>
          <div className="space-y-6">
            <h2 className="text-3xl font-bold text-crimson-700">
              Discover the Ancient Practice of Ngyungne
            </h2>
            <p className="text-maroon-600 text-lg">
              Ngyungne is a special fasting and purification practice associated
              with Avalokiteshvara, the Buddha of Compassion. This profound
              practice has been passed down through an unbroken lineage of
              masters for over a thousand years.
            </p>
            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-2">
                <div className="text-3xl font-bold text-crimson-600">1000+</div>
                <p className="text-maroon-600">Years of Tradition</p>
              </div>
              <div className="space-y-2">
                <div className="text-3xl font-bold text-crimson-600">
                  10000+
                </div>
                <p className="text-maroon-600">Practitioners Worldwide</p>
              </div>
              <div className="space-y-2">
                <div className="text-3xl font-bold text-crimson-600">100+</div>
                <p className="text-maroon-600">Qualified Teachers</p>
              </div>
              <div className="space-y-2">
                <div className="text-3xl font-bold text-crimson-600">50+</div>
                <p className="text-maroon-600">Countries Reached</p>
              </div>
            </div>
          </div>
        </div>

        <Tabs defaultValue="history" className="w-full mb-12">
          <TabsList className="grid w-full grid-cols-3 bg-saffron-100">
            <TabsTrigger
              value="history"
              className="data-[state=active]:bg-saffron-300 data-[state=active]:text-crimson-800"
            >
              History
            </TabsTrigger>
            <TabsTrigger
              value="practice"
              className="data-[state=active]:bg-saffron-300 data-[state=active]:text-crimson-800"
            >
              The Practice
            </TabsTrigger>
            <TabsTrigger
              value="benefits"
              className="data-[state=active]:bg-saffron-300 data-[state=active]:text-crimson-800"
            >
              Benefits
            </TabsTrigger>
          </TabsList>
          <TabsContent value="history">
            <Card className="bg-saffron-50 border-saffron-200">
              <CardHeader>
                <CardTitle className="text-2xl text-crimson-700">
                  The Rich History of Ngyungne
                </CardTitle>
              </CardHeader>
              <CardContent className="text-maroon-600">
                <p>
                  Ngyungne practice dates back to the 11th century, originating
                  from the great female practitioner Gelongma Palmo. It has
                  since been preserved and transmitted through generations of
                  Buddhist masters, becoming an integral part of Tibetan
                  Buddhism.
                </p>
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="practice">
            <Card className="bg-saffron-50 border-saffron-200">
              <CardHeader>
                <CardTitle className="text-2xl text-crimson-700">
                  Understanding the Ngyungne Practice
                </CardTitle>
              </CardHeader>
              <CardContent className="text-maroon-600">
                <p>
                  Ngyungne is typically practiced over a two-day period. It
                  involves fasting, maintaining silence, and engaging in
                  intensive meditation and prayer. The practice focuses on
                  cultivating compassion and purifying negative karma through
                  the recitation of mantras and visualization of
                  Avalokiteshvara.
                </p>
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="benefits">
            <Card className="bg-saffron-50 border-saffron-200">
              <CardHeader>
                <CardTitle className="text-2xl text-crimson-700">
                  The Benefits of Ngyungne
                </CardTitle>
              </CardHeader>
              <CardContent className="text-maroon-600">
                <p>
                  Practitioners report numerous benefits from Ngyungne,
                  including increased compassion, mental clarity, and spiritual
                  insight. The practice is also believed to purify negative
                  karma, strengthen one's connection to the Buddha of
                  Compassion, and create merit for oneself and all beings.
                </p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <div className="text-center">
          <h3 className="text-2xl font-bold text-crimson-700 mb-4">
            Ready to Experience Ngyungne?
          </h3>
          <p className="text-maroon-600 mb-6">
            Join our upcoming retreats or learn more about how to incorporate
            this practice into your life.
          </p>
          <Button
            size="lg"
            className="bg-crimson-600 hover:bg-crimson-700 text-white"
          >
            Explore Our Programs
          </Button>
        </div>
      </motion.div>
    </div>
  );
}
