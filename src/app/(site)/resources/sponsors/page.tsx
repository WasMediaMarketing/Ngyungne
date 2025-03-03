"use client";

import type React from "react";
import { useState } from "react";
import Head from "next/head";
import Link from "next/link";
import Image from "next/image";
import {
  Facebook,
  Twitter,
  Instagram,
  Youtube,
  ExternalLink,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Card, CardContent } from "@/components/ui/card";
import { Breadcrumbs } from "@/components/breadcrumbs";

interface Sponsor {
  id: number;
  name: string;
  description: string;
  logo: string;
  tier: "Platinum" | "Gold" | "Silver" | "Bronze" | "Partner";
  website: string;
  since?: number;
  contribution?: string;
}

const SponsorsPage: React.FC = () => {
  const [selectedSponsor, setSelectedSponsor] = useState<Sponsor | null>(null);

  const sponsors: Sponsor[] = [
    {
      id: 1,
      name: "TechForGood Inc.",
      description:
        "A leading technology company committed to social impact and cultural preservation.",
      logo: "/images/sponsors/techforgood.jpg",
      tier: "Platinum",
      website: "https://techforgood.com",
      since: 2019,
      contribution:
        "Provides cutting-edge technology solutions for our digital archiving projects.",
    },
    {
      id: 2,
      name: "Global Heritage Foundation",
      description:
        "An international non-profit dedicated to preserving cultural heritage worldwide.",
      logo: "/images/sponsors/globalheritage.jpg",
      tier: "Gold",
      website: "https://globalheritage.org",
      since: 2020,
      contribution:
        "Supports our educational programs and cultural exchange initiatives.",
    },
    // Add more sponsors here...
  ];

  // Group sponsors by tier
  const groupedSponsors: Record<Sponsor["tier"], Sponsor[]> = {
    Platinum: [],
    Gold: [],
    Silver: [],
    Bronze: [],
    Partner: [],
  };

  sponsors.forEach((sponsor) => {
    groupedSponsors[sponsor.tier].push(sponsor);
  });

  // Order for displaying sponsor tiers
  const tierOrder = ["Platinum", "Gold", "Silver", "Bronze", "Partner"];

  // Benefits for each tier
  const tierBenefits: Record<Sponsor["tier"], string[]> = {
    Platinum: [
      "Prominent logo placement on our website",
      "Dedicated blog post highlighting your company",
      "Speaking opportunity at our annual conference",
      "Exclusive access to our network of cultural leaders",
    ],
    Gold: [
      "Logo placement on our website",
      "Social media shout-outs",
      "Opportunity to host a workshop or webinar",
      "Access to our network of educators and researchers",
    ],
    Silver: [
      "Listing on our website",
      "Recognition in our newsletter",
      "Opportunity to participate in our volunteer programs",
      "Access to our library of cultural resources",
    ],
    Bronze: [
      "Acknowledgement on our website",
      "Subscription to our newsletter",
      "Invitation to our annual events",
    ],
    Partner: [
      "Joint press releases",
      "Cross-promotion on social media",
      "Collaborative projects and initiatives",
      "Shared resources and expertise",
    ],
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <Breadcrumbs />

      <main className="container mx-auto px-4 py-12">
        {/* Hero Section */}
        <section className="mb-16 text-center">
          <h2 className="text-4xl font-bold text-primary mb-4">
            Our Sponsors & Partners
          </h2>
          <p className="max-w-3xl mx-auto text-muted-foreground text-lg">
            NgYungNe's work is made possible by the generous support of our
            sponsors and partners. We are deeply grateful for their commitment
            to preserving Tibetan culture and supporting educational initiatives
            for future generations.
          </p>
        </section>

        {/* Impact Summary */}
        <section className="mb-16 bg-card text-card-foreground rounded-lg shadow-md p-8">
          <h3 className="text-2xl font-semibold text-primary mb-6">
            Your Support Makes a Difference
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center p-4 border-r border-border">
              <div className="text-4xl font-bold text-primary mb-2">12+</div>
              <p className="text-muted-foreground">
                Cultural preservation projects funded
              </p>
            </div>
            <div className="text-center p-4 border-r border-border">
              <div className="text-4xl font-bold text-primary mb-2">500+</div>
              <p className="text-muted-foreground">
                Students supported through educational programs
              </p>
            </div>
            <div className="text-center p-4">
              <div className="text-4xl font-bold text-primary mb-2">8</div>
              <p className="text-muted-foreground">
                Communities reached across the Tibetan diaspora
              </p>
            </div>
          </div>
        </section>

        {/* Sponsors by Tier */}
        {tierOrder.map(
          (tier) =>
            groupedSponsors[tier as Sponsor["tier"]].length > 0 && (
              <section key={tier} className="mb-12">
                <h2 className="text-2xl font-semibold text-primary mb-6 border-b border-border pb-2">
                  {tier} {tier === "Partner" ? "Partners" : "Sponsors"}
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {groupedSponsors[tier as Sponsor["tier"]].map((sponsor) => (
                    <Card
                      key={sponsor.id}
                      className="cursor-pointer transition-transform duration-300 hover:scale-105"
                      onClick={() => setSelectedSponsor(sponsor)}
                    >
                      <CardContent className="p-6">
                        <div className="relative h-48 mb-4">
                          <Image
                            src={sponsor.logo || "/placeholder.svg"}
                            alt={sponsor.name}
                            layout="fill"
                            objectFit="contain"
                            className="rounded-lg"
                          />
                        </div>
                        <h3 className="text-xl font-bold text-foreground">
                          {sponsor.name}
                        </h3>
                        <p className="text-primary mb-3">
                          {tier} {tier === "Partner" ? "Partner" : "Sponsor"}{" "}
                          since {sponsor.since}
                        </p>
                        <a
                          href={sponsor.website}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-muted-foreground hover:text-primary flex items-center"
                          onClick={(e) => e.stopPropagation()}
                        >
                          Visit Website
                          <ExternalLink className="h-4 w-4 ml-1" />
                        </a>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </section>
            )
        )}

        <Dialog
          open={!!selectedSponsor}
          onOpenChange={() => setSelectedSponsor(null)}
        >
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{selectedSponsor?.name}</DialogTitle>
              <DialogDescription>
                {selectedSponsor?.tier}{" "}
                {selectedSponsor?.tier === "Partner" ? "Partner" : "Sponsor"}{" "}
                since {selectedSponsor?.since}
              </DialogDescription>
            </DialogHeader>
            <div className="mt-4">
              <div className="relative h-64 mb-4">
                <Image
                  src={selectedSponsor?.logo || ""}
                  alt={selectedSponsor?.name || ""}
                  layout="fill"
                  objectFit="contain"
                  className="rounded-lg"
                />
              </div>
              <p className="text-muted-foreground mb-4">
                {selectedSponsor?.description}
              </p>
              {selectedSponsor?.contribution && (
                <div className="mb-4">
                  <h4 className="font-semibold text-foreground">
                    How They Support Us:
                  </h4>
                  <p className="text-muted-foreground">
                    {selectedSponsor.contribution}
                  </p>
                </div>
              )}
              <a
                href={selectedSponsor?.website}
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:text-primary/90 flex items-center"
              >
                Visit Website
                <ExternalLink className="h-4 w-4 ml-1" />
              </a>
            </div>
          </DialogContent>
        </Dialog>

        {/* Sponsorship Tiers Information */}
        <section className="mb-16">
          <h3 className="text-2xl font-semibold text-primary mb-6 border-b border-border pb-2">
            Sponsorship Opportunities
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {tierOrder.slice(0, 4).map((tier) => (
              <div
                key={tier}
                className="bg-card text-card-foreground rounded-lg shadow-md p-6 border-t-4 border-primary"
              >
                <h4 className="text-xl font-bold text-primary mb-3">
                  {tier} Level
                </h4>
                <ul className="text-muted-foreground space-y-2 mb-4">
                  {tierBenefits[tier as Sponsor["tier"]]
                    .slice(0, 3)
                    .map((benefit, index) => (
                      <li key={index} className="flex items-start">
                        <svg
                          className="h-5 w-5 text-primary mr-2 mt-0.5"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M5 13l4 4L19 7"
                          />
                        </svg>
                        {benefit}
                      </li>
                    ))}
                  {tierBenefits[tier as Sponsor["tier"]].length > 3 && (
                    <li className="text-primary font-medium">
                      + {tierBenefits[tier as Sponsor["tier"]].length - 3} more
                      benefits
                    </li>
                  )}
                </ul>
                <Link
                  href="/sponsorship-details"
                  className="text-primary hover:text-primary-foreground font-medium flex items-center"
                >
                  Learn More
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 ml-1"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z"
                      clipRule="evenodd"
                    />
                  </svg>
                </Link>
              </div>
            ))}
          </div>
        </section>

        {/* Call to Action */}
        <section className="mb-16 bg-primary text-primary-foreground rounded-lg shadow-md p-8 text-center">
          <h3 className="text-2xl font-bold mb-4">Become a Sponsor</h3>
          <p className="mb-6">
            Join us in our mission to preserve Tibetan culture and empower
            future generations. Your support makes a lasting impact.
          </p>
          <Link
            href="/contact"
            className="inline-block bg-background text-foreground py-2 px-6 rounded-md font-semibold hover:bg-secondary hover:text-secondary-foreground transition-colors"
          >
            Contact Us to Learn More
          </Link>
        </section>
      </main>
    </div>
  );
};

export default SponsorsPage;
