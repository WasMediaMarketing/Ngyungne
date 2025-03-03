export interface Verse {
  number: number;
  chapter: string;
  text: string;
  commentary?: string;
}

export interface Author {
  name: string;
  bio: string;
}

export interface Scripture {
  id: string;
  title: string;
  description: string;
  tradition: string;
  language: string;
  period: string;
  overview: string;
  significance: string;
  historicalContext: string;
  verses: Verse[];
  author?: Author;
}

export const scriptures: Scripture[] = [
  {
    id: "1",
    title: "Dhammapada",
    description: "A collection of sayings of the Buddha in verse form",
    tradition: "Theravada",
    language: "Pali",
    period: "3rd century BCE",
    overview:
      "The Dhammapada is one of the most widely read and best known Buddhist scriptures. It consists of 423 verses, arranged into 26 chapters. These verses are believed to be the actual words spoken by the Buddha on various occasions.",
    significance:
      "The Dhammapada is considered one of the most succinct expressions of the Buddha's teachings, covering a wide range of topics including ethics, happiness, and the nature of the mind. It's often recommended as a starting point for those new to Buddhist philosophy.",
    historicalContext:
      "The Dhammapada was likely compiled from various sources shortly after the Buddha's death, as part of the effort to preserve his teachings. It has since become one of the most influential texts in the Theravada Buddhist tradition.",
    verses: [
      {
        number: 1,
        chapter: "Yamakavagga: Pairs",
        text: "Mind precedes all mental states. Mind is their chief; they are all mind-wrought. If with an impure mind a person speaks or acts suffering follows him like the wheel that follows the foot of the ox.",
        commentary:
          "This verse emphasizes the importance of the mind in shaping our experiences and actions. It suggests that our thoughts and intentions are the root of our suffering or happiness.",
      },
      {
        number: 2,
        chapter: "Yamakavagga: Pairs",
        text: "Mind precedes all mental states. Mind is their chief; they are all mind-wrought. If with a pure mind a person speaks or acts happiness follows him like his never-departing shadow.",
        commentary:
          "This verse is the positive counterpart to the first, highlighting that positive thoughts and intentions lead to happiness and well-being.",
      },
      // Add more verses as needed
    ],
    author: {
      name: "Gautama Buddha",
      bio: "Siddhartha Gautama, also known as the Buddha or 'Enlightened One', was a spiritual teacher who lived in ancient India. He is the founder of Buddhism and is regarded as a supreme buddha according to Buddhist traditions.",
    },
  },
  {
    id: "2",
    title: "Heart Sutra",
    description: "One of the most popular sutras of Mahayana Buddhism",
    tradition: "Mahayana",
    language: "Sanskrit",
    period: "1st century BCE to 5th century CE",
    overview:
      "The Heart Sutra is a short but profound text that encapsulates the essence of the Buddhist concept of emptiness (sunyata). Despite its brevity, it's considered one of the most important texts in Mahayana Buddhism.",
    significance:
      "The Heart Sutra is recited daily by many Mahayana Buddhists. It's known for its concise exposition of the concept of emptiness and its paradoxical statement that 'form is emptiness, emptiness is form'.",
    historicalContext:
      "The exact origin of the Heart Sutra is unclear, but it likely developed during the early centuries of the Common Era as Mahayana Buddhism was expanding. It's part of the larger Prajnaparamita (Perfection of Wisdom) literature.",
    verses: [
      {
        number: 1,
        chapter: "Main Text",
        text: "Form is emptiness, emptiness is form. Emptiness is not other than form, form is not other than emptiness.",
        commentary:
          "This is perhaps the most famous line from the Heart Sutra. It expresses the non-dual nature of reality from the Mahayana perspective.",
      },
      {
        number: 2,
        chapter: "Main Text",
        text: "Here, Sariputra, all dharmas are marked with emptiness; they are neither produced nor destroyed, neither defiled nor pure, neither deficient nor complete.",
        commentary:
          "This verse elaborates on the concept of emptiness, suggesting that all phenomena lack inherent existence and are beyond our conceptual categories.",
      },
      // Add more verses as needed
    ],
    author: {
      name: "Unknown",
      bio: "The Heart Sutra is traditionally attributed to the Buddha, but its actual authorship is unknown. It's believed to have been composed by Indian Buddhist monks and scholars over a period of time.",
    },
  },
  // You can add more scriptures here
];
