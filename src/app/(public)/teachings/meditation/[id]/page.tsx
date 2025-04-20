"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import {
  ArrowLeft,
  Clock,
  Heart,
  Share2,
  Bookmark,
  Download,
  RefreshCw,
  MessageCircleQuestion,
  Star,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { meditationApi } from "@/utils/meditationApi";
import { toast } from "sonner";
import type { IMeditation } from "@/types/meditation.types";

export default function MeditationDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [meditation, setMeditation] = useState<IMeditation | null>(null);
  const [relatedMeditations, setRelatedMeditations] = useState<IMeditation[]>(
    []
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [viewIncremented, setViewIncremented] = useState(false);

  useEffect(() => {
    const fetchMeditation = async () => {
      if (!params?.id) return;

      try {
        setLoading(true);
        const meditationData = await meditationApi.getMeditation(
          params.id as string
        );
        setMeditation(meditationData);

        // Increment views only if not already done
        if (!viewIncremented) {
          await meditationApi.incrementViews(params.id as string);
          setViewIncremented(true);
        }

        // Fetch related meditations if available
        if (
          meditationData.relatedMeditations &&
          meditationData.relatedMeditations.length > 0
        ) {
          try {
            const allMeditations = await meditationApi.getPublicMeditations();
            const related = allMeditations
              .filter(
                (m) =>
                  meditationData.relatedMeditations
                    ?.map((id) => id.toString())
                    .includes(m._id.toString()) &&
                  m._id.toString() !== meditationData._id.toString()
              )
              .slice(0, 3);
            setRelatedMeditations(related);
          } catch (err) {
            console.error("Error fetching related meditations:", err);
          }
        }
      } catch (err) {
        console.error("Error fetching meditation:", err);
        setError("Failed to load meditation. Please try again later.");
        toast.error("Failed to load meditation");
      } finally {
        setLoading(false);
      }
    };

    fetchMeditation();
  }, [params]);

  const handleBookmark = () => {
    setIsBookmarked(!isBookmarked);
    toast.success(
      isBookmarked ? "Removed from favorites" : "Added to favorites"
    );
  };

  const handleDownload = () => {
    // In a real app, this would download the meditation
    toast.info("Downloading meditation for offline use...");
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-16 flex flex-col items-center justify-center min-h-[50vh]">
        <RefreshCw className="h-12 w-12 animate-spin text-primary mb-4" />
        <p className="text-lg text-muted-foreground">Loading meditation...</p>
      </div>
    );
  }

  if (error || !meditation) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <MessageCircleQuestion className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
        <h1 className="text-2xl font-bold mb-4">Meditation not found</h1>
        <p className="mb-8 text-muted-foreground">
          {error ||
            "The meditation you're looking for doesn't exist or has been removed."}
        </p>
        <Button asChild>
          <Link href="/teachings/meditation">Return to Meditations</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Breadcrumbs />
      <Link
        href="/teachings/meditation"
        className="inline-flex items-center text-sm font-medium mb-6 hover:underline"
      >
        <ArrowLeft className="h-4 w-4 mr-2" />
        Back to Meditations
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <div className="relative aspect-video rounded-lg overflow-hidden mb-6">
            <Image
              src={meditation.image || "/placeholder.svg?height=600&width=800"}
              alt={meditation.title}
              fill
              className="object-cover"
            />
          </div>

          <div className="flex justify-between items-center mb-4">
            <h1 className="text-3xl font-bold">{meditation.title}</h1>
            <div className="flex space-x-2">
              <Button
                variant="outline"
                size="icon"
                onClick={handleBookmark}
                className={isBookmarked ? "text-primary" : ""}
              >
                <Heart
                  className={`h-5 w-5 ${isBookmarked ? "fill-primary" : ""}`}
                />
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
              <span>{meditation.favorites || 0} favorites</span>
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
              {meditation.longDescription || meditation.description}
            </p>
          </div>

          {meditation.benefits && meditation.benefits.length > 0 && (
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
          )}

          {meditation.steps && meditation.steps.length > 0 && (
            <div className="mb-8">
              <h2 className="text-xl font-semibold mb-3">How to Practice</h2>
              <ol className="space-y-3">
                {meditation.steps.map((step, index) => (
                  <li key={index} className="flex items-start">
                    <div className="h-6 w-6 rounded-full bg-primary/20 text-primary flex items-center justify-center mr-3 mt-0.5 flex-shrink-0">
                      {index + 1}
                    </div>
                    <span>{step}</span>
                  </li>
                ))}
              </ol>
            </div>
          )}

          {relatedMeditations.length > 0 && (
            <div>
              <h2 className="text-xl font-semibold mb-4">
                You might also like
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {relatedMeditations.map((related) => (
                  <Link
                    href={`/teachings/meditation/${related._id}`}
                    key={related._id.toString()}
                    className="group"
                  >
                    <div className="bg-card rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                      <div className="relative h-32 w-full">
                        <Image
                          src={
                            related.image ||
                            "/placeholder.svg?height=200&width=300"
                          }
                          alt={related.title}
                          fill
                          className="object-cover"
                        />
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
          )}
        </div>

        <div className="lg:col-span-1">
          <div className="bg-card rounded-lg p-6 shadow-sm sticky top-6">
            {meditation.instructor && (
              <div className="flex items-center mb-6">
                <div className="relative h-12 w-12 rounded-full overflow-hidden mr-3">
                  <Image
                    src={
                      meditation.instructor.image ||
                      "/placeholder.svg?height=100&width=100"
                    }
                    alt={meditation.instructor.name}
                    fill
                    className="object-cover"
                  />
                </div>
                <div>
                  <h3 className="font-medium">Instructor</h3>
                  <p className="text-muted-foreground">
                    {meditation.instructor.name}
                  </p>
                </div>
              </div>
            )}

            {meditation.audioFile && (
              <div className="mb-6">
                <h3 className="font-medium mb-2">Preview</h3>
                <audio controls className="w-full">
                  <source src={meditation.audioFile} type="audio/mpeg" />
                  Your browser does not support the audio element.
                </audio>
              </div>
            )}

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
                  <span className="text-muted-foreground">Difficulty:</span>
                  <span className="font-medium">
                    {meditation.difficulty || "Beginner"}
                  </span>
                </li>
                {meditation.tags && meditation.tags.length > 0 && (
                  <li>
                    <span className="text-muted-foreground block mb-1">
                      Tags:
                    </span>
                    <div className="flex flex-wrap gap-1">
                      {meditation.tags.map((tag, index) => (
                        <span
                          key={index}
                          className="bg-muted text-muted-foreground text-xs px-2 py-0.5 rounded-full"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </li>
                )}
              </ul>
            </div>

            <div className="border-t mt-4 pt-4">
              <h3 className="font-medium mb-2">Statistics</h3>
              <ul className="space-y-2 text-sm">
                <li className="flex justify-between">
                  <span className="text-muted-foreground">Views:</span>
                  <span className="font-medium">{meditation.views || 0}</span>
                </li>
                <li className="flex justify-between">
                  <span className="text-muted-foreground">Sessions:</span>
                  <span className="font-medium">
                    {meditation.sessions || 0}
                  </span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
