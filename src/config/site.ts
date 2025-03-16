import type { NavSection } from "@/types/nav-section";

// Icon Mapping (Update invalid icons with valid ones from Lucide)
import {
  BookOpen,
  Sparkle,
  ScrollText,
  GraduationCap,
  Calendar,
  CalendarDays,
  Handshake,
  Flame,
  Users,
  Newspaper,
  Image,
  HelpCircle,
  BookMarked,
  Mountain,
} from "lucide-react";

export const siteConfig = {
  name: "Ngyungne Practice",
  description: "Tibetan Buddhist teachings, events, and practices",
  mainNav: {
    teachings: [
      {
        title: "Buddhist Philosophy",
        href: "/teachings/philosophy",
        description: "Explore fundamental Buddhist concepts and teachings",
        icon: "BookOpen", // Changed from "Lotus"
      },
      {
        title: "Meditation",
        href: "/teachings/meditation",
        description: "Learn various meditation techniques and practices",
        icon: "Sparkle", // Changed from "Sparkles"
      },
      {
        title: "Scriptures",
        href: "/teachings/scriptures",
        description: "Study Tibetan Buddhist texts and commentaries",
        icon: "ScrollText",
      },
      {
        title: "Courses",
        href: "/teachings/courses",
        description: "Enroll in structured learning programs",
        icon: "GraduationCap",
      },
    ] as NavSection[],
    programs: [
      {
        title: "Events",
        href: "/programs/events",
        description: "View our calendar of upcoming teachings and ceremonies",
        icon: "Calendar",
      },
      {
        title: "Causes",
        href: "/programs/causes",
        description: "Support our charitable initiatives and projects",
        icon: "Handshake", // Changed from "HeartHandshake"
      },
      {
        title: "Retreats",
        href: "/programs/retreats",
        description: "Join our meditation and contemplation retreats",
        icon: "Users", // Changed from "Tent"
      },
    ] as NavSection[],
    resources: [
      {
        title: "Practice Journal",
        href: "/resources/practice-journal",
        description: "Track your meditation and spiritual progress",
        icon: "BookMarked",
      },
      {
        title: "Buddhist Calendar",
        href: "/resources/buddhist-calendar",
        description: "View important dates in the Tibetan Buddhist calendar",
        icon: "CalendarDays",
      },
      {
        title: "Practices",
        href: "/resources/practices",
        description: "Learn various Tibetan Buddhist practices and rituals",
        icon: "Flame",
      },
      // {
      //   title: "Sponsors",
      //   href: "/resources/sponsors",
      //   description: "Support our sangha and ongoing projects",
      //   icon: "Handshake",
      // },
      {
        title: "Ambassadors",
        href: "/resources/ambassadors",
        description: "Meet our dharma ambassadors and teachers",
        icon: "Users",
      },
      {
        title: "Volunteers",
        href: "/resources/volunteers",
        description: "Meet our dedicated volunteers and staff",
        icon: "Users",
      },
      {
        title: "Blog",
        href: "/resources/blog",
        description: "Read articles on Buddhist philosophy and practice",
        icon: "Newspaper",
      },
      {
        title: "Gallery",
        href: "/resources/gallery",
        description: "View photos and videos of our events and retreats",
        icon: "Image",
      },
      {
        title: "FAQ",
        href: "/resources/faq",
        description: "Find answers to common questions about our practices",
        icon: "HelpCircle",
      },
    ] as NavSection[],
    bookings: [
      {
        title: "Event Bookings",
        href: "/bookings/events",
        description:
          "Reserve your spot for upcoming events, teachings, and ceremonies.",
        icon: CalendarDays, // More suitable for scheduling events
      },
      {
        title: "Course Enrollments",
        href: "/bookings/courses",
        description:
          "Enroll in our upcoming courses and expand your knowledge.",
        icon: GraduationCap, // Represents education and learning
      },
      {
        title: "Retreat Bookings",
        href: "/bookings/retreats",
        description: "Book your place for peaceful and rejuvenating retreats.",
        icon: Mountain, // Symbolizes retreats, nature, and relaxation
      },
    ],
  },
  links: {
    facebook: "https://facebook.com/ngyungnepractice",
    twitter: "https://twitter.com/ngyungnepractice",
    instagram: "https://instagram.com/ngyungnepractice",
    youtube: "https://youtube.com/ngyungnepractice",
  },
};
