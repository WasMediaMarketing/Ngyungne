"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Facebook,
  Twitter,
  Instagram,
  Linkedin,
  Mail,
  Globe,
  ExternalLink,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { cn } from "@/lib/utils";
import { TeamMember, TeamMemberRole } from "@/types/team-member";
import MemberCard from "@/components/ambassador/MemberCard";

const AmbassadorsPage: React.FC = () => {
  const [selectedMember, setSelectedMember] = useState<TeamMember | null>(null);
  const [activeTab, setActiveTab] = useState<string>("all");

  const teamMembers: TeamMember[] = [
    {
      id: 1,
      name: "Tenzin Dorjee",
      role: "Founder",
      bio: "Tenzin founded NgYungNe in 2018 with a vision to preserve Tibetan culture and support educational initiatives for Tibetan youth. With over 15 years of experience in community organizing and nonprofit management, he has dedicated his life to creating sustainable opportunities for marginalized communities.",
      image: "/placeholder.svg",
      location: "Dharamshala, India",
      quote:
        "Our cultural heritage is not just our past, but the foundation for our future.",
      achievements: [
        "Established 5 educational centers across India and Nepal",
        "Recipient of the Cultural Preservation Award 2022",
        "Published author on Tibetan cultural preservation",
      ],
      socialLinks: {
        linkedin: "https://linkedin.com/in/tenzindorjee",
        twitter: "https://twitter.com/tenzindorjee",
        email: "tenzin@ngyungne.org",
        website: "https://tenzindorjee.com",
      },
    },
    {
      id: 2,
      name: "Pema Yangchen",
      role: "Co-Founder",
      bio: "Pema brings her expertise in educational programming and curriculum development to NgYungNe. Her background in international development and passion for cultural preservation has been instrumental in shaping the organization's strategic vision and educational initiatives.",
      image: "/placeholder.svg",
      location: "New York, USA",
      quote:
        "Education is the most powerful tool we have to ensure cultural continuity.",
      achievements: [
        "Developed comprehensive Tibetan language curriculum",
        "Led educational workshops in 12 countries",
        "Former UNESCO education consultant",
      ],
      socialLinks: {
        linkedin: "https://linkedin.com/in/pemayangchen",
        instagram: "https://instagram.com/pemayangchen",
        email: "pema@ngyungne.org",
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

  const getRolePlural = (role: TeamMemberRole): string => {
    switch (role) {
      case "Founder":
        return "Founders";
      case "Co-Founder":
        return "Co-Founders";
      case "Executive Director":
        return "Executive Directors";
      case "Ambassador":
        return "Ambassadors";
      case "Program Coordinator":
        return "Program Coordinators";
      case "Community Liaison":
        return "Community Liaisons";
      case "Volunteer Coordinator":
        return "Volunteer Coordinators";
      default:
        return `${role}s`;
    }
  };

  const getRoleDescription = (role: TeamMemberRole): string => {
    switch (role) {
      case "Founder":
        return "Ngyungne founders are the driving force behind our vision and mission. They have a deep understanding of buddhist culture and its importance in preserving our heritage.";
      case "Co-Founder":
        return "Our leadership team guides NgYungNe's strategic vision and mission with passion and dedication.";
      case "Executive Director":
        return "Our Executive Directors oversee the day-to-day operations and implementation of our organizational strategy.";
      case "Ambassador":
        return "NgYungNe ambassadors are influential individuals who represent our organization and advocate for our mission. They use their platforms to raise awareness about Tibetan cultural preservation.";
      case "Program Coordinator":
        return "Program Coordinators develop and manage our various initiatives focused on education, cultural preservation, and community outreach.";
      case "Community Liaison":
        return "Community Liaisons serve as vital connections between NgYungNe and the communities we serve, ensuring our programs meet real needs.";
      case "Volunteer Coordinator":
        return "Volunteer Coordinators manage our network of dedicated volunteers who contribute their time and skills to advancing our mission.";
      default:
        return "";
    }
  };

  const roleColorMap: Record<TeamMemberRole, string> = {
    Founder: "bg-amber-100 text-amber-800 border-amber-300",
    "Co-Founder": "bg-amber-100 text-amber-800 border-amber-300",
    "Executive Director": "bg-blue-100 text-blue-800 border-blue-300",
    Ambassador: "bg-purple-100 text-purple-800 border-purple-300",
    "Program Coordinator": "bg-green-100 text-green-800 border-green-300",
    "Community Liaison": "bg-pink-100 text-pink-800 border-pink-300",
    "Volunteer Coordinator": "bg-orange-100 text-orange-800 border-orange-300",
  };

  const getFilteredMembers = () => {
    if (activeTab === "all") {
      return teamMembers;
    }

    return teamMembers.filter((member) => member.role === activeTab);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-maroon-100 py-12">
        <div className="container mx-auto px-4 max-w-6xl">
          <Breadcrumbs />

          {/* Hero Section */}
          <section className="mb-12 text-center">
            <h1 className="text-5xl font-bold text-primary mb-4">
              Our Team & Ambassadors
            </h1>
            <p className="max-w-3xl mx-auto text-muted-foreground text-lg">
              Meet the dedicated individuals who drive NgYungNe's mission
              forward. Our diverse team brings together expertise in cultural
              preservation, education, community outreach, and nonprofit
              management to create meaningful impact in Tibetan communities.
            </p>
          </section>
        </div>
      </div>

      <main className="container mx-auto px-4 py-12 max-w-6xl">
        {/* Tabs for filtering */}
        <Tabs defaultValue="all" className="mb-12" onValueChange={setActiveTab}>
          <TabsList className="mb-8 flex flex-wrap justify-center gap-2">
            <TabsTrigger value="all">All Team Members</TabsTrigger>
            {roleOrder.map(
              (role) =>
                groupedMembers[role].length > 0 && (
                  <TabsTrigger key={role} value={role}>
                    {getRolePlural(role)}
                  </TabsTrigger>
                )
            )}
          </TabsList>

          <TabsContent value="all">
            {/* Show all members grouped by role */}
            {roleOrder.map(
              (role) =>
                groupedMembers[role].length > 0 && (
                  <section key={role} className="mb-16">
                    <div className="flex items-center justify-between mb-6 border-b border-border pb-2">
                      <h2 className="text-2xl font-semibold text-primary">
                        {getRolePlural(role)}
                      </h2>
                      <Badge
                        variant="outline"
                        className={cn("px-3 py-1", roleColorMap[role])}
                      >
                        {groupedMembers[role].length}{" "}
                        {groupedMembers[role].length === 1
                          ? "Member"
                          : "Members"}
                      </Badge>
                    </div>

                    {getRoleDescription(role) && (
                      <div className="bg-maroon-200 text-accent-foreground p-6 rounded-lg mb-8 border-l-4 border-primary shadow-sm">
                        <p>{getRoleDescription(role)}</p>
                      </div>
                    )}

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                      {groupedMembers[role].map((member) => (
                        <MemberCard
                          key={member.id}
                          member={member}
                          onClick={() => setSelectedMember(member)}
                          roleColor={roleColorMap[member.role]}
                        />
                      ))}
                    </div>
                  </section>
                )
            )}
          </TabsContent>

          {/* Individual role tabs */}
          {roleOrder.map((role) => (
            <TabsContent key={role} value={role}>
              <section className="mb-12">
                <div className="bg-maroon-200 text-accent-foreground p-6 rounded-lg mb-8 border-l-4 border-primary shadow-sm">
                  <h3 className="font-semibold text-primary mb-2">
                    About Our {getRolePlural(role)}
                  </h3>
                  <p>{getRoleDescription(role)}</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {groupedMembers[role].map((member) => (
                    <MemberCard
                      key={member.id}
                      member={member}
                      onClick={() => setSelectedMember(member)}
                      roleColor={roleColorMap[member.role]}
                    />
                  ))}
                </div>
              </section>
            </TabsContent>
          ))}
        </Tabs>
      </main>

      {/* Member Detail Dialog */}
      <Dialog
        open={!!selectedMember}
        onOpenChange={(open) => !open && setSelectedMember(null)}
      >
        <DialogContent className="max-w-3xl p-0 overflow-hidden">
          {selectedMember && (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-0">
                <div className="relative h-full min-h-80">
                  <Image
                    src={selectedMember.image || "/placeholder.svg"}
                    alt={selectedMember.name}
                    layout="fill"
                    objectFit="cover"
                    className="w-full h-full"
                  />
                </div>
                <div className="p-6">
                  <DialogHeader>
                    <Badge
                      className={cn(
                        "mb-2 px-3 py-1",
                        roleColorMap[selectedMember.role]
                      )}
                    >
                      {selectedMember.role}
                    </Badge>
                    <DialogTitle className="text-2xl font-bold">
                      {selectedMember.name}
                    </DialogTitle>
                    {selectedMember.location && (
                      <DialogDescription className="text-sm flex items-center gap-1">
                        <span className="w-2 h-2 rounded-full bg-primary inline-block"></span>{" "}
                        {selectedMember.location}
                      </DialogDescription>
                    )}
                  </DialogHeader>

                  <div className="mt-4 space-y-6">
                    {selectedMember.quote && (
                      <div className="italic text-primary border-l-4 border-primary pl-4 py-1">
                        "{selectedMember.quote}"
                      </div>
                    )}

                    <div className="text-muted-foreground">
                      <p>{selectedMember.bio}</p>
                    </div>

                    {selectedMember.achievements &&
                      selectedMember.achievements.length > 0 && (
                        <div>
                          <h4 className="font-semibold text-foreground mb-2">
                            Key Achievements
                          </h4>
                          <ul className="list-disc pl-5 space-y-1">
                            {selectedMember.achievements.map(
                              (achievement, index) => (
                                <li key={index}>{achievement}</li>
                              )
                            )}
                          </ul>
                        </div>
                      )}

                    <div className="flex flex-wrap gap-3 mt-4">
                      {selectedMember.socialLinks?.linkedin && (
                        <Button variant="outline" size="sm" asChild>
                          <a
                            href={selectedMember.socialLinks.linkedin}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            <Linkedin className="h-4 w-4 mr-2" /> LinkedIn
                          </a>
                        </Button>
                      )}
                      {selectedMember.socialLinks?.twitter && (
                        <Button variant="outline" size="sm" asChild>
                          <a
                            href={selectedMember.socialLinks.twitter}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            <Twitter className="h-4 w-4 mr-2" /> Twitter
                          </a>
                        </Button>
                      )}
                      {selectedMember.socialLinks?.instagram && (
                        <Button variant="outline" size="sm" asChild>
                          <a
                            href={selectedMember.socialLinks.instagram}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            <Instagram className="h-4 w-4 mr-2" /> Instagram
                          </a>
                        </Button>
                      )}
                      {selectedMember.socialLinks?.facebook && (
                        <Button variant="outline" size="sm" asChild>
                          <a
                            href={selectedMember.socialLinks.facebook}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            <Facebook className="h-4 w-4 mr-2" /> Facebook
                          </a>
                        </Button>
                      )}
                      {selectedMember.socialLinks?.website && (
                        <Button variant="outline" size="sm" asChild>
                          <a
                            href={selectedMember.socialLinks.website}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            <Globe className="h-4 w-4 mr-2" /> Website
                          </a>
                        </Button>
                      )}
                      {selectedMember.socialLinks?.email && (
                        <Button variant="outline" size="sm" asChild>
                          <a
                            href={`mailto:${selectedMember.socialLinks.email}`}
                          >
                            <Mail className="h-4 w-4 mr-2" /> Email
                          </a>
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              <DialogFooter className="px-6 py-4 bg-muted">
                <Button
                  variant="secondary"
                  onClick={() => setSelectedMember(null)}
                >
                  Close
                </Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AmbassadorsPage;
