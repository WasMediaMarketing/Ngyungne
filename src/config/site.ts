import { type NavSection } from "@/types";

export const siteConfig = {
  name: "Ngyungne Practice",
  description: "Buddhist teachings, events, and practices",
  mainNav: {
    teachings: [
      {
        title: "Buddhist Philosophy",
        href: "/teachings/philosophy",
        description: "Learn fundamental Buddhist concepts and teachings",
        icon: "Book",
      },
      {
        title: "Meditation",
        href: "/teachings/meditation",
        description: "Guided meditation sessions and techniques",
        icon: "Heart",
      },
      {
        title: "Scriptures",
        href: "/teachings/scriptures",
        description: "Study Buddhist texts and commentaries",
        icon: "ScrollText",
      },
    ] as NavSection[],
    programs: [
      {
        title: "Events",
        href: "/programs/events",
        description: "View our calendar of upcoming teachings",
        icon: "Calendar",
      },
      {
        title: "Causes",
        href: "/programs/causes",
        description: "Support our causes",
        icon: "Calendar",
      },
      {
        title: "Retreats",
        href: "/programs/retreats",
        description: "Join our meditation retreats",
        icon: "Users",
      },
      {
        title: "Courses",
        href: "/programs/courses",
        description: "Structured learning programs",
        icon: "GraduationCap",
      },
    ] as NavSection[],
    resources: [
      {
        title: "Practice Journal",
        href: "/resources/practice-journal",
        description: "Study Buddhist texts and commentaries",
        icon: "ScrollText",
      },
      {
        title: "Buddhist Calender",
        href: "/resources/buddhist-calendar",
        description: "Study Buddhist texts and commentaries",
        icon: "ScrollText",
      },
      {
        title: "Blog",
        href: "/resources/blog",
        description: "Articles and updates",
        icon: "Newspaper",
      },
      {
        title: "Gallery",
        href: "/resources/gallery",
        description: "Photos and videos",
        icon: "Image",
      },
      {
        title: "FAQ",
        href: "/resources/faq",
        description: "Common questions",
        icon: "HelpCircle",
      },
    ] as NavSection[],
  },
  links: {
    facebook: "https://facebook.com",
    twitter: "https://twitter.com",
    instagram: "https://instagram.com",
  },
};
