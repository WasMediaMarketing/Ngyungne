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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { ChevronDown, Flower, Book, History, Compass } from "lucide-react";

const philosophyTopics = [
  {
    title: "The Four Noble Truths",
    icon: <Flower className="h-5 w-5" />,
    description:
      "Understanding suffering, its origin, cessation, and the path to its cessation.",
    content: `The Four Noble Truths are the foundation of Buddhist philosophy, first taught by the Buddha after his enlightenment:
    
1. Dukkha (Suffering): Life inherently involves suffering, dissatisfaction, and stress. This includes physical pain, emotional distress, and the general unsatisfactoriness that comes from impermanence.

2. Samudaya (Origin of Suffering): Suffering arises from craving, attachment, and ignorance. Our desires for pleasure, existence, and non-existence create conditions for suffering.

3. Nirodha (Cessation of Suffering): It is possible to end suffering by eliminating craving and attachment. This state of liberation is called Nirvana.

4. Magga (Path to Cessation): The Eightfold Path provides a practical guide to end suffering through ethical conduct, mental discipline, and wisdom.

These truths follow a medical model: identifying the ailment, diagnosing its cause, establishing that a cure exists, and prescribing the treatment.`,
    quotes: [
      {
        text: "All conditioned things are impermanent. When one sees this with wisdom, one turns away from suffering.",
        author: "The Buddha (Dhammapada)",
      },
      {
        text: "Pain is inevitable; suffering is optional.",
        author: "Buddhist saying",
      },
    ],
    practices: [
      "Mindfulness meditation to observe suffering without attachment",
      "Contemplation of impermanence",
      "Cultivating compassion for all beings",
    ],
  },
  {
    title: "The Eightfold Path",
    icon: <Compass className="h-5 w-5" />,
    description:
      "A practical guideline for ethical and mental development to end suffering.",
    content: `The Eightfold Path is the Buddha's prescription for ending suffering, consisting of eight interconnected practices grouped into three essential categories:

Wisdom (Pañña)
1. Right View: Understanding the Four Noble Truths and seeing reality as it is.
2. Right Intention: Commitment to ethical and mental self-improvement, renunciation, good will, and harmlessness.

Ethical Conduct (Sīla)
3. Right Speech: Refraining from lying, divisive speech, harsh language, and idle chatter.
4. Right Action: Abstaining from killing, stealing, and sexual misconduct.
5. Right Livelihood: Making one's living in a way that doesn't harm others.

Mental Discipline (Samādhi)
6. Right Effort: Preventing unwholesome states and cultivating wholesome ones.
7. Right Mindfulness: Awareness of body, feelings, mind, and phenomena.
8. Right Concentration: Developing one-pointedness of mind through meditation.

The path is not linear but cyclical, with each factor strengthening the others. It's a lifelong journey of refinement, not a set of commandments.`,
    quotes: [
      {
        text: "To walk safely through the maze of human life, one needs the light of wisdom and the guidance of virtue.",
        author: "Buddha",
      },
      {
        text: "Your work is to discover your work and then with all your heart to give yourself to it.",
        author: "Buddha",
      },
    ],
    practices: [
      "Daily meditation to develop concentration",
      "Ethical reflection before speech and action",
      "Mindful awareness throughout daily activities",
    ],
  },
  {
    title: "Karma and Rebirth",
    icon: <History className="h-5 w-5" />,
    description:
      "The law of moral causation and its effects on the cycle of rebirth.",
    content: `Karma is the law that every cause has an effect. Our actions, whether good or bad, create imprints on our consciousness that influence future experiences:

Understanding Karma
- Karma (Sanskrit) or Kamma (Pali) literally means "action" or "doing"
- It refers to the universal principle of cause and effect, action and reaction
- Every intentional action creates a corresponding effect
- The quality of the effect depends on the intention behind the action

The Process of Rebirth
- According to Buddhist teaching, rebirth is not the transmigration of a soul but a continuation of a changing process
- Death is followed by rebirth of consciousness in a new form
- This process is driven by karma and craving
- One's mental state at the time of death influences the next rebirth

Breaking the Cycle
- The ultimate goal is to break free from the cycle of rebirth (samsara)
- This liberation (nirvana) comes through eliminating craving and ignorance
- Enlightenment ends the production of karma that perpetuates rebirth

Buddhism teaches that understanding karma helps us make better choices, leading to better present and future experiences.`,
    quotes: [
      {
        text: "According to the seed that's sown, So is the fruit you reap therefrom. Doer of good will gather good, Doer of evil, evil reaps.",
        author: "Samyutta Nikaya",
      },
      {
        text: "Not in the sky, nor in the midst of the sea, nor by entering mountain clefts, is there a place on earth where one may escape from the consequences of an evil deed.",
        author: "Dhammapada",
      },
    ],
    practices: [
      "Reflection on the consequences of actions",
      "Cultivation of positive intentions",
      "Accepting responsibility for one's choices",
    ],
  },
  {
    title: "Mindfulness & Meditation",
    icon: <Book className="h-5 w-5" />,
    description:
      "Cultivating present-moment awareness and mental development techniques.",
    content: `Mindfulness (Sati) and meditation (Bhavana) are central practices in Buddhism for developing awareness and insight:

Foundations of Mindfulness (Satipatthana)
- Body (Kaya): Awareness of breathing, postures, activities, and physical composition
- Feelings (Vedana): Observing pleasant, unpleasant, or neutral sensations
- Mind (Citta): Recognizing mental states like concentration, distraction, calm, or agitation
- Mental Objects (Dhamma): Awareness of thought patterns and how they relate to Buddhist teachings

Meditation Techniques
- Samatha (Concentration): Developing mental focus and tranquility, often through breath awareness
- Vipassana (Insight): Cultivating clear seeing into the nature of reality, especially impermanence, suffering, and non-self
- Metta (Loving-kindness): Generating feelings of benevolence toward all beings

Benefits of Practice
- Reduced stress and emotional reactivity
- Increased awareness and present-moment clarity
- Development of compassion and equanimity
- Gradual insight into the nature of mind and reality

The Buddha described mindfulness as "the direct path for the purification of beings, for the surmounting of sorrow and lamentation, for the disappearance of pain and grief, for the attainment of the true way, for the realization of Nibbana."`,
    quotes: [
      {
        text: "Do not dwell in the past, do not dream of the future, concentrate the mind on the present moment.",
        author: "Buddha",
      },
      {
        text: "The mind is everything. What you think you become.",
        author: "Buddha",
      },
    ],
    practices: [
      "Daily seated meditation practice",
      "Mindful walking and eating",
      "Body scan meditation",
    ],
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

export default function BuddhistPhilosophy() {
  const [expandedSection, setExpandedSection] = useState(null);

  const toggleSection = (index: any) => {
    if (expandedSection === index) {
      setExpandedSection(null);
    } else {
      setExpandedSection(index);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50 to-amber-100">
      <div className="container mx-auto px-4 py-12">
        <Breadcrumbs />

        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
        >
          <motion.div
            className="inline-block p-4 bg-saffron-100 rounded-full mb-4"
            whileHover={{ rotate: 360 }}
            transition={{ duration: 1.5, ease: "easeInOut" }}
          >
            <Flower className="h-12 w-12 text-crimson-700" />
          </motion.div>
          <motion.h1
            className="text-5xl font-bold mb-4 text-crimson-800 tracking-tight"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            Buddhist Philosophy
          </motion.h1>
          <motion.p
            className="text-xl mb-8 text-maroon-700 max-w-3xl mx-auto leading-relaxed"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            Explore the profound wisdom and compassionate teachings of Buddhism,
            a philosophy that has guided countless individuals toward inner
            peace and enlightenment for over 2,500 years.
          </motion.p>
        </motion.div>

        <Tabs defaultValue="the-four-noble-truths" className="w-full">
          <TabsList className="grid w-full md:grid-cols-4 grid-cols-2 bg-saffron-100 rounded-xl p-1 mb-8">
            {philosophyTopics.map((topic, index) => (
              <TabsTrigger
                key={index}
                value={topic.title.toLowerCase().replace(/\s+/g, "-")}
                className="data-[state=active]:bg-saffron-300 data-[state=active]:text-crimson-800 py-3 flex items-center justify-center gap-2"
              >
                {topic.icon}
                <span className="hidden sm:inline">{topic.title}</span>
              </TabsTrigger>
            ))}
          </TabsList>

          {philosophyTopics.map((topic, index) => (
            <TabsContent
              key={index}
              value={topic.title.toLowerCase().replace(/\s+/g, "-")}
            >
              <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
              >
                <Card className="bg-saffron-50 border-saffron-200 shadow-lg overflow-hidden mb-8">
                  <CardHeader className="border-b border-saffron-200 bg-gradient-to-r from-saffron-100 to-amber-100">
                    <motion.div
                      variants={itemVariants}
                      className="flex items-center gap-3 mb-2"
                    >
                      {topic.icon}
                      <CardTitle className="text-3xl text-crimson-700">
                        {topic.title}
                      </CardTitle>
                    </motion.div>
                    <motion.div variants={itemVariants}>
                      <CardDescription className="text-lg text-maroon-600">
                        {topic.description}
                      </CardDescription>
                    </motion.div>
                  </CardHeader>
                  <CardContent className="text-maroon-800 pt-6">
                    <motion.div
                      variants={itemVariants}
                      className="prose prose-maroon max-w-none"
                    >
                      <div className="whitespace-pre-line text-lg">
                        {topic.content}
                      </div>
                    </motion.div>

                    <motion.div variants={itemVariants} className="mt-8">
                      <h3 className="text-xl font-semibold text-crimson-700 mb-4 flex items-center gap-2">
                        <Book className="h-5 w-5" />
                        Notable Quotes
                      </h3>
                      <div className="space-y-4">
                        {topic.quotes.map((quote, i) => (
                          <motion.blockquote
                            key={i}
                            initial={{ opacity: 0, x: -20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            transition={{ delay: i * 0.2 }}
                            className="border-l-4 border-saffron-300 pl-4 italic"
                          >
                            <p className="text-lg">{quote.text}</p>
                            <footer className="text-maroon-600 mt-2">
                              — {quote.author}
                            </footer>
                          </motion.blockquote>
                        ))}
                      </div>
                    </motion.div>
                  </CardContent>
                  <CardFooter className="flex flex-col items-start bg-saffron-50 border-t border-saffron-200 px-6 py-4">
                    <motion.div variants={itemVariants} className="w-full">
                      <Button
                        variant="ghost"
                        onClick={() => toggleSection(index)}
                        className="flex items-center justify-between w-full text-left text-crimson-700 hover:text-crimson-900 hover:bg-saffron-100"
                      >
                        <span className="font-semibold">Practices to Try</span>
                        <ChevronDown
                          className={`h-5 w-5 transition-transform ${
                            expandedSection === index ? "rotate-180" : ""
                          }`}
                        />
                      </Button>

                      {expandedSection === index && (
                        <motion.ul
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          exit={{ opacity: 0, height: 0 }}
                          className="mt-4 space-y-2 pl-6 list-disc text-maroon-700"
                        >
                          {topic.practices.map((practice, i) => (
                            <motion.li
                              key={i}
                              initial={{ opacity: 0, x: 20 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: i * 0.1 }}
                            >
                              {practice}
                            </motion.li>
                          ))}
                        </motion.ul>
                      )}
                    </motion.div>
                  </CardFooter>
                </Card>
              </motion.div>
            </TabsContent>
          ))}
        </Tabs>

        <motion.div
          className="mt-16 bg-gradient-to-r from-saffron-100 to-amber-200 rounded-xl p-8 shadow-md"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          viewport={{ once: true }}
        >
          <h2 className="text-2xl font-bold text-crimson-800 mb-4">
            Begin Your Journey
          </h2>
          <p className="text-maroon-700 mb-6">
            Buddhism is not merely a philosophy to be studied, but a path to be
            practiced. Consider these resources to deepen your understanding:
          </p>

          <div className="grid md:grid-cols-3 gap-6">
            <motion.div
              whileHover={{ y: -5 }}
              className="bg-white/80 p-6 rounded-lg shadow-sm"
            >
              <h3 className="font-semibold text-xl text-crimson-700 mb-2">
                Recommended Books
              </h3>
              <ul className="space-y-2 text-maroon-700">
                <li>"What the Buddha Taught" by Walpola Rahula</li>
                <li>"The Heart of the Buddha's Teaching" by Thich Nhat Hanh</li>
                <li>"Buddhism Without Beliefs" by Stephen Batchelor</li>
              </ul>
            </motion.div>

            <motion.div
              whileHover={{ y: -5 }}
              className="bg-white/80 p-6 rounded-lg shadow-sm"
            >
              <h3 className="font-semibold text-xl text-crimson-700 mb-2">
                Meditation Centers
              </h3>
              <ul className="space-y-2 text-maroon-700">
                <li>Local Vipassana centers</li>
                <li>Zen Buddhist temples</li>
                <li>Tibetan Buddhist communities</li>
              </ul>
            </motion.div>

            <motion.div
              whileHover={{ y: -5 }}
              className="bg-white/80 p-6 rounded-lg shadow-sm"
            >
              <h3 className="font-semibold text-xl text-crimson-700 mb-2">
                Online Resources
              </h3>
              <ul className="space-y-2 text-maroon-700">
                <li>Access to Insight (Theravada texts)</li>
                <li>Dharma Seed (free meditation talks)</li>
                <li>Buddhist meditation apps</li>
              </ul>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
