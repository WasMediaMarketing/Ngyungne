"use client";

import * as React from "react";
import {
  BookOpen,
  Calendar,
  BookMarked,
  Settings,
  HelpCircle,
  FileText,
  Mail,
  UsersIcon,
  FileQuestion,
  HandCoins,
  LayoutDashboard,
} from "lucide-react";

import { NavMain } from "@/components/nav-main";
import { NavSecondary } from "@/components/nav-secondary";
import { NavDashboard } from "@/components/nav-dashboard";
import { NavUser } from "@/components/nav-user";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar";
import Image from "next/image";
// Import site config
import { siteConfig } from "@/config/site";
import { title } from "process";

// Organization data
const data = {
  user: {
    name: "Ngyungne",
    email: "ngyungne@gmail.com",
    avatar: "/logo.png",
  },
  navDashboard: [
    {
      title: "Dashboard",
      url: "/admin/dashboard",
      icon: LayoutDashboard,
    },
  ],

  navMain: [
    {
      title: "Teachings",
      url: "/admin/teachings",
      icon: BookOpen,
      isActive: true,
      items: siteConfig.mainNav.teachings.map((item) => ({
        title: item.title,
        url: `/admin/${item.href}`,
        isActive: item.href === "/admin/teachings/philosophy", // Set first item as active by default
      })),
    },
    {
      title: "Programs",
      url: "/admin/programs",
      icon: Calendar,
      items: siteConfig.mainNav.programs.map((item) => ({
        title: item.title,
        url: `/admin/${item.href}`,
      })),
    },
    {
      title: "Resources",
      url: "/admin/resources",
      icon: BookMarked,
      items: siteConfig.mainNav.resources.map((item) => ({
        title: item.title,
        url: `/admin/${item.href}`,
      })),
    },
    {
      title: "Bookings",
      url: "/admin/bookings",
      icon: BookMarked,
      items: siteConfig.mainNav.bookings.map((item) => ({
        title: item.title,
        url: `/admin/${item.href}`,
      })),
    },
  ],

  navSecondary: [
    {
      title: "About",
      url: "/admin/about",
      icon: FileText,
    },
    {
      title: "Users",
      url: "/admin/users",
      icon: UsersIcon,
    },
    {
      title: "Enquiries",
      url: "/admin/enquiries",
      icon: FileQuestion,
    },
    {
      title: "Donations",
      url: "/admin/donations",
      icon: HandCoins,
    },
    {
      title: "Newsletter",
      url: "/admin/newsletter",
      icon: Mail,
    },
    {
      title: "Pages",
      url: "/admin/pages",
      icon: FileText,
    },
    {
      title: "Settings",
      url: "/admin/settings",
      icon: Settings,
    },
    {
      title: "Help",
      url: "/admin/help",
      icon: HelpCircle,
    },
  ],
};

export function AppSidebar({
  activePath = "/teachings/philosophy",
  ...props
}: React.ComponentProps<typeof Sidebar> & { activePath?: string }) {
  // Update active states based on the current path
  const navDashboardWithActive = React.useMemo(() => {
    return data.navDashboard.map((item) => ({
      ...item,
      isActive: item.url === activePath,
    }));
  }, [activePath]);

  const navMainWithActive = React.useMemo(() => {
    return data.navMain.map((section) => {
      // Check if this section is active (starts with the section path)
      const sectionActive = activePath.startsWith(section.url);

      // Update items based on active state
      const updatedItems = section?.items?.map((item) => ({
        ...item,
        isActive: item.url === activePath,
      }));

      return {
        ...section,
        isActive: sectionActive,
        items: updatedItems,
      };
    });
  }, [activePath]);

  const navSecondaryWithActive = React.useMemo(() => {
    return data.navSecondary.map((item) => ({
      ...item,
      isActive: item.url === activePath,
    }));
  }, [activePath]);

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <Image
          src="/logo.png"
          alt="Logo"
          height={80}
          width={120}
          className="w-full"
        />
      </SidebarHeader>
      <SidebarContent>
        <NavDashboard items={navDashboardWithActive} />
        <NavMain items={navMainWithActive} />
        <NavSecondary items={navSecondaryWithActive} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
