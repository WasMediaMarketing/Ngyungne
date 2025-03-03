"use client";

import { motion } from "framer-motion";
import { Breadcrumbs } from "@/components/breadcrumbs";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useState } from "react";
import {
  ScrollText,
  Search,
  Book,
  Bookmark,
  HeartHandshake,
  BookOpenText,
  History,
  MessageCircleQuestion,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import Link from "next/link";

const scriptures = [
  {
    id: "1",
    title: "The Dhammapada",
    tradition: "Theravada",
    period: "3rd century BCE",
    language: "Pali",
    description:
      "A collection of sayings of the Buddha in verse form, one of the most widely read and best known Buddhist scriptures.",
    overview:
      "The Dhammapada consists of 423 verses in 26 chapters, organized by topic. It covers ethical and spiritual principles such as the nature of mind, the importance of virtuous action, and the path to enlightenment. The text emphasizes the importance of training the mind and following the Noble Eightfold Path.",
    verses: [
      {
        number: 1,
        chapter: "Twin Verses",
        text: "Mind precedes all mental states. Mind is their chief; they are all mind-wrought. If with an impure mind a person speaks or acts, suffering follows him like the wheel that follows the foot of the ox.",
        commentary:
          "This verse emphasizes that our thoughts shape our reality. When we act with a corrupted mind, negative consequences naturally follow, just as a cart wheel follows the ox that pulls it.",
      },
      {
        number: 2,
        chapter: "Twin Verses",
        text: "Mind precedes all mental states. Mind is their chief; they are all mind-wrought. If with a pure mind a person speaks or acts, happiness follows him like his never-departing shadow.",
        commentary:
          "The counterpart to the first verse, this teaching shows that positive actions stemming from a pure mind create happiness that stays with us like our own shadow.",
      },
      {
        number: 5,
        chapter: "Twin Verses",
        text: "Hatred is never appeased by hatred in this world. By non-hatred alone is hatred appeased. This is a law eternal.",
        commentary:
          "One of the Buddha's most famous teachings, this verse reminds us that responding to anger with more anger only creates a cycle of suffering. Only compassion and understanding can truly end hostility.",
      },
      {
        number: 183,
        chapter: "The Buddha",
        text: "To avoid all evil, to cultivate good, and to cleanse one's mind — this is the teaching of the Buddhas.",
        commentary:
          "This verse summarizes the entirety of Buddhist practice in three simple principles: refrain from harmful actions, develop wholesome qualities, and purify the mind through meditation.",
      },
    ],
    significance:
      "The Dhammapada is often the first Buddhist text that newcomers encounter. Its clear, direct language and practical wisdom make it accessible and relevant across cultures and time periods. Many verses have become widely quoted even outside Buddhist contexts.",
    historicalContext:
      "Compiled after the Buddha's death as part of the effort to preserve his teachings, the Dhammapada represents some of the earliest recorded Buddhist teachings. Similar collections exist in Sanskrit and other languages, though the Pali version is the most well-known.",
  },
  {
    id: "2",
    title: "The Heart Sutra",
    tradition: "Mahayana",
    period: "1st century CE",
    language: "Sanskrit",
    description:
      "One of the most popular and important sutras in Mahayana Buddhism, known for its profound teachings on emptiness (śūnyatā).",
    overview:
      "Despite being one of the shortest Buddhist sutras at only about 260 words in Sanskrit, the Heart Sutra contains the essence of Mahayana Buddhist wisdom. It presents the doctrine of emptiness (śūnyatā) through a dialogue between the bodhisattva Avalokiteśvara and the disciple Śāriputra.",
    verses: [
      {
        number: 1,
        chapter: "Introduction",
        text: "Thus have I heard. Once the Blessed One was dwelling in Rajagriha at Vulture Peak mountain, together with a great gathering of the sangha of monks and a great gathering of the sangha of bodhisattvas. At that time the Blessed One entered the samadhi that expresses the dharma called profound illumination.",
        commentary:
          "The traditional opening establishes the setting and authority of the teaching, placing the Buddha in deep meditation on Vulture Peak, surrounded by both disciples and advanced practitioners.",
      },
      {
        number: 2,
        chapter: "Main Discourse",
        text: "Form is emptiness, emptiness is form. Form is not other than emptiness, emptiness is not other than form. The same is true of feelings, perceptions, formations, and consciousness.",
        commentary:
          "This is the most famous passage in the sutra, expressing the non-duality of emptiness and form. It states that the five aggregates (skandhas) that constitute a person have no inherent, separate existence, yet they still functionally appear.",
      },
      {
        number: 3,
        chapter: "Main Discourse",
        text: "Therefore, Śāriputra, in emptiness there is no form, no feelings, no perceptions, no formations, no consciousness; no eye, no ear, no nose, no tongue, no body, no mind; no appearance, no sound, no smell, no taste, no touch, no dharmas; no eye element up to no mind consciousness element.",
        commentary:
          "This passage systematically negates the components of experience, teaching that all phenomena lack inherent existence. It covers the five aggregates, six sense faculties, six sense objects, and eighteen elements of perception.",
      },
      {
        number: 4,
        chapter: "Conclusion",
        text: "Therefore, Śāriputra, since bodhisattvas have no attainments, they rely on the perfection of wisdom and dwell without mental obstructions. Since there are no mental obstructions, they have no fear. They transcend falsity and attain complete nirvana.",
        commentary:
          "This concludes the practical implications of emptiness, explaining that realizing emptiness leads to freedom from suffering and fear. The bodhisattva path is presented as relying on wisdom rather than conceptual attainments.",
      },
    ],
    significance:
      "The Heart Sutra is recited daily in many Mahayana temples and is considered the essence of the larger Perfection of Wisdom literature. Its teaching on emptiness has profoundly influenced Buddhist philosophy, particularly in East Asian traditions.",
    historicalContext:
      "The Heart Sutra emerged during the development of Mahayana Buddhism, when new sutras were appearing that emphasized emptiness, compassion, and the bodhisattva path. It became especially prominent in China, Japan, and Korea.",
  },
  {
    id: "3",
    title: "The Diamond Sutra",
    tradition: "Mahayana",
    period: "1st-2nd century CE",
    language: "Sanskrit",
    description:
      "A Mahayana sutra that teaches the practice of non-abiding and non-attachment to any concept, including those of Buddhism itself.",
    overview:
      "The Diamond Sutra (Vajracchedikā Prajñāpāramitā Sūtra) focuses on the practice of non-attachment. Through a dialogue between the Buddha and his disciple Subhuti, it systematically deconstructs notions of self, other beings, life, and teachings, showing that clinging to any fixed concept obstructs enlightenment.",
    verses: [
      {
        number: 1,
        chapter: "Introduction",
        text: "Thus have I heard. At one time the Buddha was staying in the Jeta Grove, in Anathapindika's park, together with a large community of monks, 1,250 in all.",
        commentary:
          "The traditional opening establishes the historical context of the teaching, placing it at a monastery grove donated by the wealthy patron Anathapindika, with a large assembly of monks present.",
      },
      {
        number: 8,
        chapter: "The Merit of This Teaching",
        text: "What do you think, Subhuti? If someone filled this billion-world galaxy with the seven treasures and gave it all away as a gift, would they create much merit by this act of giving?",
        commentary:
          "This passage begins a famous analogy comparing material generosity with the merit of understanding and sharing the sutra's wisdom. It establishes that spiritual wisdom surpasses even the most extravagant material generosity.",
      },
      {
        number: 14,
        chapter: "Dwelling in Peace",
        text: "Subhuti, if bodhisattvas should have perception of either a dharma or a non-dharma, they would be grasping at a self, a being, a soul, or a person. Why? Because a bodhisattva should not grasp at a dharma or a non-dharma.",
        commentary:
          "This highlights the middle way between nihilism and eternalism. True understanding avoids both extremes, neither clinging to phenomena as real nor dismissing them as unreal.",
      },
      {
        number: 32,
        chapter: "Conclusion",
        text: "All conditioned phenomena are like dreams, illusions, bubbles, shadows, like dew or a flash of lightning; thus we shall perceive them.",
        commentary:
          "This concluding verse beautifully summarizes the sutra's teaching on the impermanent, insubstantial nature of all phenomena, comparing them to various transient experiences. It reminds practitioners to maintain this perspective in daily life.",
      },
    ],
    significance:
      "The Diamond Sutra had enormous influence in East Asian Buddhism, particularly in the Chan/Zen tradition. A copy dated to 868 CE found in Dunhuang, China, is the oldest known printed book in the world, showing its historical importance.",
    historicalContext:
      "Like the Heart Sutra, the Diamond Sutra developed during the growth of Mahayana Buddhism in India and gained prominence as Buddhism spread throughout Asia. It was translated multiple times into Chinese, becoming particularly influential in Chinese Buddhism.",
  },
  {
    id: "4",
    title: "The Lotus Sutra",
    tradition: "Mahayana",
    period: "1st-2nd century CE",
    language: "Sanskrit",
    description:
      "A revered Mahayana text that reveals the Buddha's most profound teachings on universal Buddhahood and the single vehicle to enlightenment.",
    overview:
      "The Lotus Sutra (Saddharmapuṇḍarīka Sūtra) is known for its parables and declarations that all beings have the potential for Buddhahood. It teaches that previous Buddhist teachings were skillful means to prepare disciples for the ultimate teaching of the One Vehicle (ekayāna), which unifies all Buddhist paths.",
    verses: [
      {
        number: 1,
        chapter: "Introduction",
        text: "Thus have I heard. At one time the Buddha was staying at Rajagriha on Gridhrakuta Mountain with a great assembly of twelve thousand monks...",
        commentary:
          "The opening sets the scene on Vulture Peak with an assembly of disciples, bodhisattvas, and divine beings, establishing the cosmic significance of the teaching that follows.",
      },
      {
        number: 2,
        chapter: "Skillful Means",
        text: "Shariputra, I use countless skillful means and various causes and conditions, along with similes, parables, and phrases to expound the teachings to sentient beings.",
        commentary:
          "This introduces the concept of 'upaya' or skillful means, explaining that the Buddha adapts his teaching methods according to the capacities of his listeners, rather than teaching a single rigid doctrine.",
      },
      {
        number: 3,
        chapter: "Parable of the Burning House",
        text: "Imagine a dilapidated old house inhabited by many people. Suddenly it catches fire. A man standing outside realizes his children are inside playing, oblivious to the danger...",
        commentary:
          "This famous parable illustrates how the Buddha uses provisional teachings (like the promise of different carts to lure children from a burning house) to guide beings toward ultimate liberation, which is likened to a single magnificent cart.",
      },
      {
        number: 4,
        chapter: "Prophecies of Enlightenment",
        text: "At that time the World-Honored One spoke to Shariputra, saying: 'In a future age, after innumerable, unlimited, and inconceivable kalpas, you will become a Buddha named Flower Light Tathagata...'",
        commentary:
          "The Buddha predicts the future Buddhahood of his disciples, illustrating the sutra's central teaching that all beings—including those previously thought to be incapable—have Buddha-nature and will eventually attain enlightenment.",
      },
    ],
    significance:
      "The Lotus Sutra became foundational for several important Buddhist schools, including Tendai in Japan and Tiantai in China. It is particularly revered in East Asian Buddhism, where entire schools are dedicated to its practice and study.",
    historicalContext:
      "Composed during the development of Mahayana Buddhism, the Lotus Sutra represents a shift toward universal soteriology—the idea that all beings can achieve complete enlightenment. It became especially influential as Buddhism spread throughout East Asia.",
  },
];

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      type: "spring",
      stiffness: 100,
    },
  },
};

export default function Scriptures() {
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("all");
  const [viewMode, setViewMode] = useState("grid");

  // Filter scriptures based on search term and active tab
  const filteredScriptures = scriptures.filter((scripture) => {
    const matchesSearch =
      scripture.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      scripture.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      scripture.verses.some((verse) =>
        verse.text.toLowerCase().includes(searchTerm.toLowerCase())
      );

    const matchesTab =
      activeTab === "all" ||
      scripture.tradition.toLowerCase() === activeTab.toLowerCase();

    return matchesSearch && matchesTab;
  });

  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50 to-amber-100">
      <div className="container mx-auto px-4 py-12">
        <Breadcrumbs />

        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
        >
          <motion.div
            className="inline-block p-4 bg-saffron-100 rounded-full mb-4"
            whileHover={{ scale: 1.1 }}
            transition={{ duration: 0.3 }}
          >
            <ScrollText className="h-12 w-12 text-crimson-700" />
          </motion.div>
          <motion.h1
            className="text-5xl font-bold mb-4 text-crimson-800 tracking-tight"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            Buddhist Scriptures
          </motion.h1>
          <motion.p
            className="text-xl mb-8 text-maroon-700 max-w-3xl mx-auto leading-relaxed"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            Explore the sacred texts that have preserved Buddha's wisdom for
            over two millennia, offering profound insights into the nature of
            mind, reality, and the path to enlightenment.
          </motion.p>

          {/* Search and filter controls */}
          <motion.div
            className="flex flex-col sm:flex-row justify-center items-center gap-4 mb-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7 }}
          >
            <div className="relative w-full max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <Input
                type="text"
                placeholder="Search scriptures..."
                className="pl-10 bg-white/90 border-saffron-200 focus:border-crimson-500"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <div className="flex items-center space-x-2">
              <Button
                variant={viewMode === "grid" ? "default" : "outline"}
                size="sm"
                onClick={() => setViewMode("grid")}
                className={
                  viewMode === "grid"
                    ? "bg-crimson-600 hover:bg-crimson-700"
                    : ""
                }
              >
                Grid
              </Button>
              <Button
                variant={viewMode === "list" ? "default" : "outline"}
                size="sm"
                onClick={() => setViewMode("list")}
                className={
                  viewMode === "list"
                    ? "bg-crimson-600 hover:bg-crimson-700"
                    : ""
                }
              >
                List
              </Button>
            </div>
          </motion.div>

          {/* Tradition tabs */}
          <motion.div
            className="mb-10"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
          >
            <Tabs
              defaultValue="all"
              value={activeTab}
              onValueChange={setActiveTab}
            >
              <TabsList className="bg-saffron-100 p-1 rounded-lg inline-flex">
                <TabsTrigger
                  value="all"
                  className="data-[state=active]:bg-saffron-300 data-[state=active]:text-crimson-800"
                >
                  All Traditions
                </TabsTrigger>
                <TabsTrigger
                  value="theravada"
                  className="data-[state=active]:bg-saffron-300 data-[state=active]:text-crimson-800"
                >
                  Theravada
                </TabsTrigger>
                <TabsTrigger
                  value="mahayana"
                  className="data-[state=active]:bg-saffron-300 data-[state=active]:text-crimson-800"
                >
                  Mahayana
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </motion.div>
        </motion.div>

        {/* Scripture display - Grid or List view */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className={
            viewMode === "grid"
              ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
              : "space-y-6"
          }
        >
          {filteredScriptures.length > 0 ? (
            filteredScriptures.map((scripture, index) => (
              <motion.div
                key={scripture.id}
                variants={itemVariants}
                className={viewMode === "list" ? "w-full" : ""}
              >
                <Card className="bg-saffron-50 border-saffron-200 h-full flex flex-col overflow-hidden shadow-md hover:shadow-lg transition-shadow">
                  <CardHeader className="border-b border-saffron-200 bg-gradient-to-r from-saffron-100 to-amber-100">
                    <div className="flex justify-between items-start mb-2">
                      <CardTitle className="text-2xl text-crimson-700">
                        {scripture.title}
                      </CardTitle>
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-100 text-amber-800">
                        {scripture.tradition}
                      </span>
                    </div>
                    <CardDescription className="text-maroon-600">
                      {scripture.description}
                    </CardDescription>
                    <div className="flex items-center gap-4 mt-3 text-sm text-maroon-600">
                      <div className="flex items-center gap-1">
                        <History className="h-4 w-4" />
                        <span>{scripture.period}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <BookOpenText className="h-4 w-4" />
                        <span>{scripture.language}</span>
                      </div>
                    </div>
                  </CardHeader>

                  <CardContent className="flex-grow pt-6">
                    {viewMode === "grid" ? (
                      <>
                        <h3 className="font-medium text-lg text-crimson-700 mb-3 flex items-center gap-2">
                          <Book className="h-5 w-5" />
                          Overview
                        </h3>
                        <p className="text-maroon-700 mb-6 line-clamp-3">
                          {scripture.overview}
                        </p>
                      </>
                    ) : (
                      <>
                        <h3 className="font-medium text-lg text-crimson-700 mb-3 flex items-center gap-2">
                          <Book className="h-5 w-5" />
                          Overview
                        </h3>
                        <p className="text-maroon-700 mb-6">
                          {scripture.overview}
                        </p>

                        <h3 className="font-medium text-lg text-crimson-700 mb-3 flex items-center gap-2">
                          <HeartHandshake className="h-5 w-5" />
                          Significance
                        </h3>
                        <p className="text-maroon-700 mb-6">
                          {scripture.significance}
                        </p>

                        <h3 className="font-medium text-lg text-crimson-700 mb-3 flex items-center gap-2">
                          <History className="h-5 w-5" />
                          Historical Context
                        </h3>
                        <p className="text-maroon-700 mb-6">
                          {scripture.historicalContext}
                        </p>
                      </>
                    )}

                    <h3 className="font-medium text-lg text-crimson-700 mb-3 flex items-center gap-2">
                      <Bookmark className="h-5 w-5" />
                      Key Verses
                    </h3>

                    <Accordion type="single" collapsible className="w-full">
                      {scripture.verses.map((verse, verseIndex) => (
                        <AccordionItem
                          key={verseIndex}
                          value={`verse-${verseIndex}`}
                          className="border-saffron-200"
                        >
                          <AccordionTrigger className="text-crimson-600 hover:text-crimson-700 py-3">
                            <span className="flex items-center gap-2">
                              {verse.chapter && (
                                <span className="text-sm text-maroon-600">
                                  {verse.chapter}:
                                </span>
                              )}
                              <span>Verse {verse.number}</span>
                            </span>
                          </AccordionTrigger>
                          <AccordionContent className="text-maroon-800 space-y-3">
                            <p className="italic">{verse.text}</p>
                            {verse.commentary && (
                              <div className="pt-2 text-sm bg-amber-50 p-3 rounded-md border-l-2 border-amber-300">
                                <span className="font-medium text-amber-800">
                                  Commentary:
                                </span>{" "}
                                {verse.commentary}
                              </div>
                            )}
                          </AccordionContent>
                        </AccordionItem>
                      ))}
                    </Accordion>
                  </CardContent>

                  <CardFooter className="bg-saffron-50 border-t border-saffron-200 p-4">
                    <div className="flex justify-between items-center w-full">
                      <Link href={`/teachings/scriptures/${scripture.id}`}>
                        <Button
                          variant="ghost"
                          className="text-crimson-600 hover:text-crimson-800 hover:bg-saffron-100"
                        >
                          <BookOpenText className="mr-2 h-4 w-4" />
                          Read Full Text
                        </Button>
                      </Link>
                      <Button
                        variant="outline"
                        className="text-crimson-600 border-crimson-300 hover:bg-crimson-50"
                      >
                        <Bookmark className="mr-2 h-4 w-4" />
                        Bookmark
                      </Button>
                    </div>
                  </CardFooter>
                </Card>
              </motion.div>
            ))
          ) : (
            <motion.div
              className="col-span-full text-center py-12"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <MessageCircleQuestion className="mx-auto h-12 w-12 text-crimson-300 mb-4" />
              <h3 className="text-xl font-medium text-crimson-700 mb-2">
                No scriptures found
              </h3>
              <p className="text-maroon-600">
                Try adjusting your search or filters
              </p>
            </motion.div>
          )}
        </motion.div>

        {/* Study recommendations */}
        <motion.div
          className="mt-16 bg-gradient-to-r from-saffron-100 to-amber-200 rounded-xl p-8 shadow-md"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          viewport={{ once: true }}
        >
          <h2 className="text-2xl font-bold text-crimson-800 mb-4">
            How to Study Buddhist Scriptures
          </h2>
          <p className="text-maroon-700 mb-6">
            Buddhist texts are meant to be contemplated deeply rather than
            merely read. Here are some traditional approaches to scripture
            study:
          </p>

          <div className="grid md:grid-cols-3 gap-6">
            <motion.div
              whileHover={{ y: -5 }}
              className="bg-white/80 p-6 rounded-lg shadow-sm"
            >
              <h3 className="font-semibold text-xl text-crimson-700 mb-2 flex items-center gap-2">
                <Book className="h-5 w-5" />
                Threefold Approach
              </h3>
              <ol className="space-y-2 text-maroon-700 list-decimal pl-5">
                <li>
                  <span className="font-medium">Listening/Reading</span> - First
                  encounter with the teaching
                </li>
                <li>
                  <span className="font-medium">Contemplation</span> -
                  Reflecting deeply on the meaning
                </li>
                <li>
                  <span className="font-medium">Meditation</span> -
                  Internalizing wisdom through practice
                </li>
              </ol>
            </motion.div>

            <motion.div
              whileHover={{ y: -5 }}
              className="bg-white/80 p-6 rounded-lg shadow-sm"
            >
              <h3 className="font-semibold text-xl text-crimson-700 mb-2 flex items-center gap-2">
                <MessageCircleQuestion className="h-5 w-5" />
                Key Questions
              </h3>
              <ul className="space-y-2 text-maroon-700 list-disc pl-5">
                <li>What is the historical context of this teaching?</li>
                <li>How does it relate to core Buddhist principles?</li>
                <li>How might I apply this wisdom in daily life?</li>
                <li>What obstacles prevent me from realizing this truth?</li>
              </ul>
            </motion.div>

            <motion.div
              whileHover={{ y: -5 }}
              className="bg-white/80 p-6 rounded-lg shadow-sm"
            >
              <h3 className="font-semibold text-xl text-crimson-700 mb-2 flex items-center gap-2">
                <HeartHandshake className="h-5 w-5" />
                Community Support
              </h3>
              <ul className="space-y-2 text-maroon-700 list-disc pl-5">
                <li>Study with qualified teachers when possible</li>
                <li>Discuss interpretations with fellow practitioners</li>
                <li>Attend dharma talks and scripture study groups</li>
                <li>Read traditional commentaries for deeper insights</li>
              </ul>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
