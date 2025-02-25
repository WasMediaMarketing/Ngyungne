import { TypeIcon as type, LucideIcon } from "lucide-react";

export interface NavItem {
  title: string;
  href: string;
  description?: string;
  icon: LucideIcon;
}

export interface NavSection {
  title: string;
  href: string;
  description: string;
  icon: keyof typeof import("lucide-react");
}

export interface TeachingEvent {
  id: string;
  title: string;
  teacher: string;
  date: string;
  time: string;
  location: string;
  description: string;
  image: string;
}

export interface TeachingEvent {
  id: string;
  title: string;
  teacher: string;
  date: string;
  time: string;
  location: string;
  description: string;
  image: string;
}

export interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  date: string;
  author: string;
  category: string;
  image: string;
  slug: string;
}

export interface Teacher {
  id: string;
  name: string;
  title: string;
  bio: string;
  image: string;
  specialties: string[];
  teachings: {
    title: string;
    date: string;
    type: string;
  }[];
}
