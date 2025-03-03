import { TypeIcon as type, LucideIcon } from "lucide-react";

export interface NavItem {
  title: string;
  href: string;
  description?: string;
  icon: LucideIcon;
}
