import Link from "next/link";
import Image from "next/image";
import {
  ArrowLeft,
  Clock,
  Heart,
  Share2,
  Play,
  Bookmark,
  Download,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Breadcrumbs } from "@/components/breadcrumbs";

interface MeditationDetailPageProps {
  params: {
    id: string;
  };
}

export default function MeditationDetailPage({
  params,
}: MeditationDetailPageProps) {
  // In a real app, you would fetch this data based on the ID
  // For this example, we'll use hardcoded data
  const meditationId = params.id;

  // Sample meditation data
  const meditations = {
    "1": {
      id: "1",
      title: "Morning Calm",
      description: "Start your day with clarity and purpose",
      longDescription:
        "This meditation is designed to help you begin your day with a clear mind and a sense of purpose. By focusing on your breath and setting intentions for the day ahead, you'll cultivate a sense of calm that can carry you through whatever challenges arise.",
      duration: 10,
      category: "Morning",
      image: "/placeholder.svg?height=600&width=800",
      instructor: "Sarah Johnson",
      instructorImage: "/placeholder.svg?height=200&width=200",
      favorites: 1245,
      benefits: [
        "Reduced morning anxiety",
        "Increased focus throughout the day",
        "Better emotional regulation",
        "Improved decision-making",
      ],
      relatedMeditations: ["2", "4", "6"],
    },
    "2": {
      id: "2",
      title: "Stress Relief",
      description: "Release tension and find your center",
      longDescription:
        "This meditation guides you through a series of breathing exercises and visualizations designed to release physical and mental tension. By the end, you'll feel more centered and better equipped to handle stressful situations with grace.",
      duration: 15,
      category: "Stress Management",
      image: "/placeholder.svg?height=600&width=800",
      instructor: "Michael Chen",
      instructorImage: "/placeholder.svg?height=200&width=200",
      favorites: 2189,
      benefits: [
        "Reduced cortisol levels",
        "Decreased muscle tension",
        "Improved stress response",
        "Enhanced emotional resilience",
      ],
      relatedMeditations: ["1", "3", "5"],
    },
    "3": {
      id: "3",
      title: "Deep Sleep",
      description: "Prepare your mind and body for restful sleep",
      longDescription:
        "This meditation uses gentle guidance and soothing visualizations to help you transition from wakefulness to deep, restorative sleep. By calming your nervous system and quieting your mind, you'll drift off more easily and enjoy more restful sleep throughout the night.",
      duration: 20,
      category: "Sleep",
      image: "/placeholder.svg?height=600&width=800",
      instructor: "Emma Wilson",
      instructorImage: "/placeholder.svg?height=200&width=200",
      favorites: 3421,
      benefits: [
        "Faster sleep onset",
        "Reduced nighttime waking",
        "Deeper sleep cycles",
        "Waking feeling more refreshed",
      ],
      relatedMeditations: ["2", "5", "6"],
    },
    "4": {
      id: "4",
      title: "Focus & Concentration",
      description: "Sharpen your mind and improve productivity",
      longDescription:
        "This meditation helps you develop laser-like focus and sustained concentration. Through mindfulness techniques and attention training, you'll learn to direct your mental energy more effectively and resist distractions.",
      duration: 12,
      category: "Productivity",
      image: "/placeholder.svg?height=600&width=800",
      instructor: "David Kim",
      instructorImage: "/placeholder.svg?height=200&width=200",
      favorites: 1876,
      benefits: [
        "Improved attention span",
        "Enhanced cognitive performance",
        "Reduced mental fatigue",
        "Better task completion",
      ],
      relatedMeditations: ["1", "2", "5"],
    },
    "5": {
      id: "5",
      title: "Loving Kindness",
      description: "Cultivate compassion for yourself and others",
      longDescription:
        "This meditation guides you through the practice of loving-kindness (metta), helping you develop compassion for yourself and others. By nurturing positive emotions and intentions, you'll foster greater connection and empathy in your relationships.",
      duration: 18,
      category: "Compassion",
      image: "/placeholder.svg?height=600&width=800",
      instructor: "Lisa Patel",
      instructorImage: "/placeholder.svg?height=200&width=200",
      favorites: 2543,
      benefits: [
        "Increased self-compassion",
        "Greater empathy for others",
        "Reduced negative judgments",
        "Improved relationships",
      ],
      relatedMeditations: ["2", "3", "6"],
    },
    "6": {
      id: "6",
      title: "Body Scan",
      description: "Connect with your body and release tension",
      longDescription:
        "This meditation guides you through a systematic scan of your entire body, bringing awareness to each area and inviting relaxation. By tuning into physical sensations, you'll release tension you may not even realize you're holding and develop a deeper mind-body connection.",
      duration: 15,
      category: "Relaxation",
      image: "/placeholder.svg?height=600&width=800",
      instructor: "James Wilson",
      instructorImage: "/placeholder.svg?height=200&width=200",
      favorites: 1932,
      benefits: [
        "Reduced physical tension",
        "Increased body awareness",
        "Better stress recognition",
        "Improved physical comfort",
      ],
      relatedMeditations: ["1", "3", "5"],
    },
  };

  const meditation = meditations[meditationId as keyof typeof meditations];

  if (!meditation) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h1 className="text-2xl font-bold mb-4">Meditation not found</h1>
        <p className="mb-8">
          The meditation you're looking for doesn't exist or has been removed.
        </p>
        <Button asChild>
          <Link href="/teachings/meditation">Return to Meditations</Link>
        </Button>
      </div>
    );
  }

  // Get related meditations
  const relatedMeditationsData = meditation.relatedMeditations.map(
    (id) => meditations[id as keyof typeof meditations]
  );

  return (
    <div className="container mx-auto px-4 py-8">
      <Breadcrumbs />
      <Link
        href="/"
        className="inline-flex items-center text-sm font-medium mb-6 hover:underline"
      >
        <ArrowLeft className="h-4 w-4 mr-2" />
        Back to Meditations
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <div className="relative aspect-video rounded-lg overflow-hidden mb-6">
            <Image
              src={meditation.image || "/placeholder.svg"}
              alt={meditation.title}
              fill
              className="object-cover"
            />
            <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
              <Button
                size="lg"
                className="rounded-full h-16 w-16 flex items-center justify-center"
              >
                <Play className="h-8 w-8" />
              </Button>
            </div>
          </div>

          <div className="flex justify-between items-center mb-4">
            <h1 className="text-3xl font-bold">{meditation.title}</h1>
            <div className="flex space-x-2">
              <Button variant="outline" size="icon">
                <Heart className="h-5 w-5" />
              </Button>
              <Button variant="outline" size="icon">
                <Bookmark className="h-5 w-5" />
              </Button>
              <Button variant="outline" size="icon">
                <Share2 className="h-5 w-5" />
              </Button>
            </div>
          </div>

          <div className="flex items-center mb-6 text-sm text-muted-foreground">
            <div className="flex items-center mr-4">
              <Clock className="h-4 w-4 mr-1" />
              <span>{meditation.duration} minutes</span>
            </div>
            <div className="flex items-center mr-4">
              <Heart className="h-4 w-4 mr-1" />
              <span>{meditation.favorites.toLocaleString()} favorites</span>
            </div>
            <span className="bg-primary/10 text-primary px-2 py-1 rounded-full text-xs font-medium">
              {meditation.category}
            </span>
          </div>

          <div className="mb-8">
            <h2 className="text-xl font-semibold mb-3">
              About this meditation
            </h2>
            <p className="text-muted-foreground">
              {meditation.longDescription}
            </p>
          </div>

          <div className="mb-8">
            <h2 className="text-xl font-semibold mb-3">Benefits</h2>
            <ul className="grid grid-cols-1 md:grid-cols-2 gap-2">
              {meditation.benefits.map((benefit, index) => (
                <li key={index} className="flex items-start">
                  <div className="h-5 w-5 rounded-full bg-primary/20 text-primary flex items-center justify-center mr-2 mt-0.5">
                    <span className="text-xs">✓</span>
                  </div>
                  <span>{benefit}</span>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h2 className="text-xl font-semibold mb-4">You might also like</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {relatedMeditationsData.map((related) => (
                <Link
                  href={`/teachings/meditation/${related.id}`}
                  key={related.id}
                  className="group"
                >
                  <div className="bg-card rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                    <div className="relative h-32 w-full">
                      <Image
                        src={related.image || "/placeholder.svg"}
                        alt={related.title}
                        fill
                        className="object-cover"
                      />
                      <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <Play className="h-8 w-8 text-white" />
                      </div>
                    </div>
                    <div className="p-3">
                      <h3 className="font-medium text-sm">{related.title}</h3>
                      <div className="flex items-center text-xs text-muted-foreground mt-1">
                        <Clock className="h-3 w-3 mr-1" />
                        <span>{related.duration} min</span>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>

        <div className="lg:col-span-1">
          <div className="bg-card rounded-lg p-6 shadow-sm sticky top-6">
            <div className="flex items-center mb-6">
              <div className="relative h-12 w-12 rounded-full overflow-hidden mr-3">
                <Image
                  src={meditation.instructorImage || "/placeholder.svg"}
                  alt={meditation.instructor}
                  fill
                  className="object-cover"
                />
              </div>
              <div>
                <h3 className="font-medium">Instructor</h3>
                <p className="text-muted-foreground">{meditation.instructor}</p>
              </div>
            </div>

            <div className="space-y-3 mb-6">
              <Button className="w-full">
                <Play className="h-4 w-4 mr-2" />
                Begin Meditation
              </Button>
              <Button variant="outline" className="w-full">
                <Download className="h-4 w-4 mr-2" />
                Download for Offline
              </Button>
            </div>

            <div className="border-t pt-4">
              <h3 className="font-medium mb-2">Session Details</h3>
              <ul className="space-y-2 text-sm">
                <li className="flex justify-between">
                  <span className="text-muted-foreground">Duration:</span>
                  <span className="font-medium">
                    {meditation.duration} minutes
                  </span>
                </li>
                <li className="flex justify-between">
                  <span className="text-muted-foreground">Category:</span>
                  <span className="font-medium">{meditation.category}</span>
                </li>
                <li className="flex justify-between">
                  <span className="text-muted-foreground">Audio Quality:</span>
                  <span className="font-medium">High Definition</span>
                </li>
                <li className="flex justify-between">
                  <span className="text-muted-foreground">
                    Background Music:
                  </span>
                  <span className="font-medium">Yes</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
