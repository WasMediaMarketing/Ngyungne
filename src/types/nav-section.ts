import { TypeIcon as type, LucideIcon } from "lucide-react";

export interface NavSection {
  title: string;
  href: string;
  description: string;
  icon: keyof typeof import("lucide-react");
}
