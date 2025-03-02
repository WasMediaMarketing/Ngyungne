"use client";

import React, { useState } from "react";
import Image from "next/image";
import Head from "next/head";
import Link from "next/link";
import { Facebook, Twitter, Instagram, Linkedin, Youtube } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Card, CardContent } from "@/components/ui/card";
import { Breadcrumbs } from "@/components/breadcrumbs";

type TeamMemberRole =
  | "Founder"
  | "Co-Founder"
  | "Executive Director"
  | "Ambassador"
  | "Program Coordinator"
  | "Community Liaison"
  | "Volunteer Coordinator";

interface TeamMember {
  id: number;
  name: string;
  role: TeamMemberRole;
  bio: string;
  image: string;
  socialLinks?: {
    linkedin?: string;
    twitter?: string;
    instagram?: string;
    facebook?: string;
  };
}

const AmbassadorsPage: React.FC = () => {
  const [selectedMember, setSelectedMember] = useState<TeamMember | null>(null);

  const teamMembers: TeamMember[] = [
    {
      id: 1,
      name: "Tenzin Dorjee",
      role: "Founder",
      bio: "Tenzin founded NgYungNe in 2018 with a vision to preserve Tibetan culture and support educational initiatives for Tibetan youth. With over 15 years of experience in community organizing and nonprofit management, he has dedicated his life to creating sustainable opportunities for marginalized communities.",
      image: "/images/team/tenzin-dorjee.jpg",
      socialLinks: {
        linkedin: "https://linkedin.com/in/tenzindorjee",
        twitter: "https://twitter.com/tenzindorjee",
      },
    },
    {
      id: 2,
      name: "Pema Yangchen",
      role: "Co-Founder",
      bio: "Pema brings her expertise in educational programming and curriculum development to NgYungNe. Her background in international development and passion for cultural preservation has been instrumental in shaping the organization's strategic vision and educational initiatives.",
      image: "/images/team/pema-yangchen.jpg",
      socialLinks: {
        linkedin: "https://linkedin.com/in/pemayangchen",
        instagram: "https://instagram.com/pemayangchen",
      },
    },
    // Add more team members here...
  ];

  const groupedMembers: Record<TeamMemberRole, TeamMember[]> = {
    Founder: [],
    "Co-Founder": [],
    "Executive Director": [],
    Ambassador: [],
    "Program Coordinator": [],
    "Community Liaison": [],
    "Volunteer Coordinator": [],
  };

  teamMembers.forEach((member) => {
    if (groupedMembers[member.role]) {
      groupedMembers[member.role].push(member);
    }
  });

  const roleOrder: TeamMemberRole[] = [
    "Founder",
    "Co-Founder",
    "Executive Director",
    "Ambassador",
    "Program Coordinator",
    "Community Liaison",
    "Volunteer Coordinator",
  ];

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <Breadcrumbs />

      <main className="container mx-auto px-4 py-12">
        {/* Hero Section */}
        <section className="mb-16 text-center">
          <h2 className="text-4xl font-bold text-primary mb-4">
            Our Team & Ambassadors
          </h2>
          <p className="max-w-3xl mx-auto text-muted-foreground text-lg">
            Meet the dedicated individuals who drive NgYungNe's mission forward.
            Our diverse team brings together expertise in cultural preservation,
            education, community outreach, and nonprofit management to create
            meaningful impact in Tibetan communities.
          </p>
        </section>

        {/* Team Members Section */}
        {roleOrder.map(
          (role) =>
            groupedMembers[role].length > 0 && (
              <section key={role} className="mb-16">
                <h3 className="text-2xl font-semibold text-primary mb-6 border-b border-border pb-2">
                  {role === "Ambassador"
                    ? "Ambassadors"
                    : role === "Founder"
                    ? "Founders"
                    : `${role}s`}
                </h3>

                {role === "Ambassador" && (
                  <div className="bg-accent text-accent-foreground p-6 rounded-lg mb-8 border-l-4 border-primary">
                    <h4 className="font-semibold text-primary mb-2">
                      About Our Ambassadors
                    </h4>
                    <p>
                      NgYungNe ambassadors are influential individuals who
                      represent our organization and advocate for our mission.
                      They use their platforms and networks to raise awareness
                      about Tibetan cultural preservation and educational
                      initiatives, helping us reach wider audiences and create
                      meaningful partnerships.
                    </p>
                  </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {groupedMembers[role].map((member) => (
                    <Card
                      key={member.id}
                      className="cursor-pointer transition-transform duration-300 hover:scale-105"
                      onClick={() => setSelectedMember(member)}
                    >
                      <CardContent className="p-6">
                        <div className="relative h-48 mb-4">
                          <Image
                            src={member.image || "/placeholder.svg"}
                            alt={member.name}
                            layout="fill"
                            objectFit="cover"
                            className="rounded-lg"
                          />
                        </div>
                        <h3 className="text-xl font-bold text-foreground">
                          {member.name}
                        </h3>
                        <p className="text-primary mb-3">{member.role}</p>
                        <div className="flex space-x-3">
                          {member.socialLinks?.linkedin && (
                            <a
                              href={member.socialLinks.linkedin}
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              <Linkedin className="h-5 w-5 text-muted-foreground hover:text-primary" />
                            </a>
                          )}
                          {member.socialLinks?.twitter && (
                            <a
                              href={member.socialLinks.twitter}
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              <Twitter className="h-5 w-5 text-muted-foreground hover:text-primary" />
                            </a>
                          )}
                          {member.socialLinks?.instagram && (
                            <a
                              href={member.socialLinks.instagram}
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              <Instagram className="h-5 w-5 text-muted-foreground hover:text-primary" />
                            </a>
                          )}
                          {member.socialLinks?.facebook && (
                            <a
                              href={member.socialLinks.facebook}
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              <Facebook className="h-5 w-5 text-muted-foreground hover:text-primary" />
                            </a>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </section>
            )
        )}

        {/* Join Our Team Section */}
        <section className="mt-16 bg-accent text-accent-foreground border border-primary rounded-lg p-8 text-center">
          <h3 className="text-2xl font-bold text-primary mb-4">
            Join Our Team
          </h3>
          <p className="text-muted-foreground mb-6 max-w-3xl mx-auto">
            Passionate about Tibetan culture and education? We're always looking
            for dedicated individuals to join our team, whether as staff
            members, volunteers, or ambassadors. Together, we can make a lasting
            difference.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link
              href="/volunteer"
              className="inline-block bg-card hover:bg-card/90 text-card-foreground border border-primary py-3 px-6 rounded-md transition-colors font-semibold"
            >
              Volunteer Opportunities
            </Link>
            <Link
              href="/contact"
              className="inline-block bg-primary hover:bg-primary/90 text-primary-foreground py-3 px-6 rounded-md transition-colors font-semibold"
            >
              Contact Us About Joining
            </Link>
          </div>
        </section>
      </main>

      <Dialog
        open={!!selectedMember}
        onOpenChange={() => setSelectedMember(null)}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{selectedMember?.name}</DialogTitle>
            <DialogDescription>{selectedMember?.role}</DialogDescription>
          </DialogHeader>
          <div className="mt-4">
            <div className="relative h-64 mb-4">
              <Image
                src={selectedMember?.image || ""}
                alt={selectedMember?.name || ""}
                layout="fill"
                objectFit="cover"
                className="rounded-lg"
              />
            </div>
            <p className="text-muted-foreground">{selectedMember?.bio}</p>
            <div className="flex space-x-3 mt-4">
              {selectedMember?.socialLinks?.linkedin && (
                <a
                  href={selectedMember.socialLinks.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Linkedin className="h-5 w-5 text-muted-foreground hover:text-primary" />
                </a>
              )}
              {selectedMember?.socialLinks?.twitter && (
                <a
                  href={selectedMember.socialLinks.twitter}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Twitter className="h-5 w-5 text-muted-foreground hover:text-primary" />
                </a>
              )}
              {selectedMember?.socialLinks?.instagram && (
                <a
                  href={selectedMember.socialLinks.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Instagram className="h-5 w-5 text-muted-foreground hover:text-primary" />
                </a>
              )}
              {selectedMember?.socialLinks?.facebook && (
                <a
                  href={selectedMember.socialLinks.facebook}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Facebook className="h-5 w-5 text-muted-foreground hover:text-primary" />
                </a>
              )}
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AmbassadorsPage;
