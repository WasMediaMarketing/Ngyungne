"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { pageApi } from "@/utils/pageApi";
import { siteConfig } from "@/config/site";

interface FooterPagesProps {
  section: string;
}

interface FooterLink {
  title: string;
  href: string;
  isStatic?: boolean;
}

export function FooterPages({ section }: FooterPagesProps) {
  const [pages, setPages] = useState<FooterLink[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPages = async () => {
      try {
        // Get static pages from site config
        let staticPages: FooterLink[] = [];

        if (section === "quick-links") {
          staticPages = [
            { title: "About Us", href: "/about-us", isStatic: true },
            { title: "Teachings", href: "/teachings", isStatic: true },
            { title: "Courses", href: "/courses", isStatic: true },
            { title: "Events", href: "/events", isStatic: true },
            { title: "Donate", href: "/donate", isStatic: true },
            { title: "Contact Us", href: "/contact-us", isStatic: true },
          ];
        } else if (section === "resources") {
          staticPages = siteConfig.mainNav.resources.map((item) => ({
            title: item.title,
            href: item.href,
            isStatic: true,
          }));
        }

        // Get dynamic pages from API
        const allPages = await pageApi.getPublishedPages();

        // Filter pages that belong to the footer and the specified section
        const dynamicPages = allPages
          .filter(
            (page) =>
              page.location === "footer" &&
              page.parentPage === section &&
              page.status === "published"
          )
          .map((page) => ({
            title: page.title,
            href: `/${page.slug}`,
            isStatic: false,
          }));

        // Combine static and dynamic pages
        setPages([...staticPages, ...dynamicPages]);
      } catch (error) {
        console.error(`Failed to fetch ${section} pages:`, error);
      } finally {
        setLoading(false);
      }
    };

    fetchPages();
  }, [section]);

  if (loading) {
    return <div>Loading pages...</div>;
  }

  if (pages.length === 0) {
    return null;
  }

  return (
    <ul className="space-y-2">
      {pages.map((page, index) => (
        <li
          key={index}
          className="flex items-center space-x-2 hover:tracking-wide transition-all duration-300 ease-in-out"
        >
          <ChevronRight className="h-4 w-4 text-gray-400" />
          <Link
            href={page.href}
            className="hover:text-amber-500 transition-colors"
          >
            {page.title}
          </Link>
        </li>
      ))}
    </ul>
  );
}
