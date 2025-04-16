"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import * as LucideIcons from "lucide-react";
import { cn } from "@/lib/utils";
import { siteConfig } from "@/config/site";
import { pageApi } from "@/utils/pageApi";
import type { PageUI } from "@/utils/pageApi";
import type { LucideIcon } from "lucide-react";

export function MainNav() {
  const pathname = usePathname();
  const [pages, setPages] = useState<PageUI[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPages = async () => {
      try {
        const allPages = await pageApi.getPublishedPages();
        setPages(allPages);
      } catch (error) {
        console.error("Failed to fetch pages:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPages();
  }, []);

  // Filter pages for header location
  const headerPages = pages.filter(
    (page) => page.location === "header" && page.status === "published"
  );

  // Function to build the page URL based on parentPage
  const getPageUrl = (page: PageUI) => {
    // If parentPage is 'none' or undefined/null, just use the slug directly
    if (!page.parentPage || page.parentPage === "none") {
      return `/${page.slug}`;
    }

    // Find the parent page
    const parentPage = pages.find((p) => p.id === page.parentPage);
    if (!parentPage) {
      return `/${page.slug}`;
    }

    // Construct URL with parent slug
    return `/${parentPage.slug}/${page.slug}`;
  };

  // Group pages by parent section
  const getPagesBySection = (section: string) => {
    return headerPages.filter((page) => page.parentPage === section);
  };

  // Get top-level pages (no parent)
  const topLevelPages = headerPages.filter(
    (page) => !page.parentPage || page.parentPage === "none"
  );

  // Get child pages grouped by parent ID
  const childPagesByParent: Record<string, PageUI[]> = {};
  headerPages.forEach((page) => {
    if (page.parentPage && page.parentPage !== "none") {
      if (!childPagesByParent[page.parentPage]) {
        childPagesByParent[page.parentPage] = [];
      }
      childPagesByParent[page.parentPage].push(page);
    }
  });

  return (
    <NavigationMenu>
      <NavigationMenuList>
        <NavigationMenuItem>
          <Link href="/" legacyBehavior passHref>
            <NavigationMenuLink className={navigationMenuTriggerStyle()}>
              Home
            </NavigationMenuLink>
          </Link>
        </NavigationMenuItem>

        <NavigationMenuItem>
          <Link href="/about" legacyBehavior passHref>
            <NavigationMenuLink className={navigationMenuTriggerStyle()}>
              About
            </NavigationMenuLink>
          </Link>
        </NavigationMenuItem>

        {/* Teachings Dropdown */}
        <NavigationMenuItem>
          <NavigationMenuTrigger>Teachings</NavigationMenuTrigger>
          <NavigationMenuContent>
            <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px]">
              {siteConfig.mainNav.teachings.map((item) => {
                const Icon =
                  item.icon && typeof item.icon === "string"
                    ? (LucideIcons[
                        item.icon as keyof typeof LucideIcons
                      ] as LucideIcon)
                    : item.icon || LucideIcons.FileText;

                return (
                  <li key={item.title}>
                    <NavigationMenuLink asChild>
                      <Link
                        href={item.href}
                        className={cn(
                          "block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
                          pathname === item.href
                            ? "bg-accent text-accent-foreground"
                            : ""
                        )}
                      >
                        <div className="flex items-center gap-2">
                          <Icon className="h-4 w-4" />
                          <div className="text-sm font-medium leading-none">
                            {item.title}
                          </div>
                        </div>
                        <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                          {item.description}
                        </p>
                      </Link>
                    </NavigationMenuLink>
                  </li>
                );
              })}

              {/* Dynamic pages in teachings section */}
              {getPagesBySection("teachings").map((page) => (
                <li key={page.id}>
                  <NavigationMenuLink asChild>
                    <Link
                      href={getPageUrl(page)}
                      className={cn(
                        "block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
                        pathname === getPageUrl(page)
                          ? "bg-accent text-accent-foreground"
                          : ""
                      )}
                    >
                      <div className="flex items-center gap-2">
                        <LucideIcons.FileText className="h-4 w-4" />
                        <div className="text-sm font-medium leading-none">
                          {page.title}
                        </div>
                      </div>
                      {page.metaDescription && (
                        <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                          {page.metaDescription}
                        </p>
                      )}
                    </Link>
                  </NavigationMenuLink>
                </li>
              ))}
            </ul>
          </NavigationMenuContent>
        </NavigationMenuItem>

        {/* Programs Dropdown */}
        <NavigationMenuItem>
          <NavigationMenuTrigger>Programs</NavigationMenuTrigger>
          <NavigationMenuContent>
            <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px]">
              {siteConfig.mainNav.programs.map((item) => {
                const Icon =
                  item.icon && typeof item.icon === "string"
                    ? (LucideIcons[
                        item.icon as keyof typeof LucideIcons
                      ] as LucideIcon)
                    : item.icon || LucideIcons.FileText;

                return (
                  <li key={item.title}>
                    <NavigationMenuLink asChild>
                      <Link
                        href={item.href}
                        className={cn(
                          "block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
                          pathname === item.href
                            ? "bg-accent text-accent-foreground"
                            : ""
                        )}
                      >
                        <div className="flex items-center gap-2">
                          <Icon className="h-4 w-4" />
                          <div className="text-sm font-medium leading-none">
                            {item.title}
                          </div>
                        </div>
                        <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                          {item.description}
                        </p>
                      </Link>
                    </NavigationMenuLink>
                  </li>
                );
              })}

              {/* Dynamic pages in programs section */}
              {getPagesBySection("programs").map((page) => (
                <li key={page.id}>
                  <NavigationMenuLink asChild>
                    <Link
                      href={getPageUrl(page)}
                      className={cn(
                        "block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
                        pathname === getPageUrl(page)
                          ? "bg-accent text-accent-foreground"
                          : ""
                      )}
                    >
                      <div className="flex items-center gap-2">
                        <LucideIcons.FileText className="h-4 w-4" />
                        <div className="text-sm font-medium leading-none">
                          {page.title}
                        </div>
                      </div>
                      {page.metaDescription && (
                        <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                          {page.metaDescription}
                        </p>
                      )}
                    </Link>
                  </NavigationMenuLink>
                </li>
              ))}
            </ul>
          </NavigationMenuContent>
        </NavigationMenuItem>

        {/* Resources Dropdown */}
        <NavigationMenuItem>
          <NavigationMenuTrigger>Resources</NavigationMenuTrigger>
          <NavigationMenuContent>
            <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px]">
              {siteConfig.mainNav.resources.map((item) => {
                const Icon =
                  item.icon && typeof item.icon === "string"
                    ? (LucideIcons[
                        item.icon as keyof typeof LucideIcons
                      ] as LucideIcon)
                    : item.icon || LucideIcons.FileText;

                return (
                  <li key={item.title}>
                    <NavigationMenuLink asChild>
                      <Link
                        href={item.href}
                        className={cn(
                          "block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
                          pathname === item.href
                            ? "bg-accent text-accent-foreground"
                            : ""
                        )}
                      >
                        <div className="flex items-center gap-2">
                          <Icon className="h-4 w-4" />
                          <div className="text-sm font-medium leading-none">
                            {item.title}
                          </div>
                        </div>
                        <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                          {item.description}
                        </p>
                      </Link>
                    </NavigationMenuLink>
                  </li>
                );
              })}

              {/* Dynamic pages in resources section */}
              {getPagesBySection("resources").map((page) => (
                <li key={page.id}>
                  <NavigationMenuLink asChild>
                    <Link
                      href={getPageUrl(page)}
                      className={cn(
                        "block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
                        pathname === getPageUrl(page)
                          ? "bg-accent text-accent-foreground"
                          : ""
                      )}
                    >
                      <div className="flex items-center gap-2">
                        <LucideIcons.FileText className="h-4 w-4" />
                        <div className="text-sm font-medium leading-none">
                          {page.title}
                        </div>
                      </div>
                      {page.metaDescription && (
                        <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                          {page.metaDescription}
                        </p>
                      )}
                    </Link>
                  </NavigationMenuLink>
                </li>
              ))}
            </ul>
          </NavigationMenuContent>
        </NavigationMenuItem>

        {/* Top-level dynamic pages with dropdowns if they have children */}
        {topLevelPages
          .filter(
            (page) =>
              // Filter only real top-level pages that aren't in the static sections
              !["teachings", "programs", "resources"].includes(page.id)
          )
          .map((page) => {
            const hasChildren = childPagesByParent[page.id]?.length > 0;

            if (hasChildren) {
              return (
                <NavigationMenuItem key={page.id}>
                  <NavigationMenuTrigger>{page.title}</NavigationMenuTrigger>
                  <NavigationMenuContent>
                    <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px]">
                      {/* Parent page itself */}
                      <li className="col-span-2">
                        <NavigationMenuLink asChild>
                          <Link
                            href={`/${page.slug}`}
                            className={cn(
                              "block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
                              pathname === `/${page.slug}`
                                ? "bg-accent text-accent-foreground"
                                : ""
                            )}
                          >
                            <div className="flex items-center gap-2">
                              <LucideIcons.LayoutDashboard className="h-4 w-4" />
                              <div className="text-sm font-medium leading-none">
                                {page.title} Overview
                              </div>
                            </div>
                            {page.metaDescription && (
                              <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                                {page.metaDescription}
                              </p>
                            )}
                          </Link>
                        </NavigationMenuLink>
                      </li>

                      {/* Child pages */}
                      {childPagesByParent[page.id].map((childPage) => (
                        <li key={childPage.id}>
                          <NavigationMenuLink asChild>
                            <Link
                              href={getPageUrl(childPage)}
                              className={cn(
                                "block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
                                pathname === getPageUrl(childPage)
                                  ? "bg-accent text-accent-foreground"
                                  : ""
                              )}
                            >
                              <div className="flex items-center gap-2">
                                <LucideIcons.FileText className="h-4 w-4" />
                                <div className="text-sm font-medium leading-none">
                                  {childPage.title}
                                </div>
                              </div>
                              {childPage.metaDescription && (
                                <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                                  {childPage.metaDescription}
                                </p>
                              )}
                            </Link>
                          </NavigationMenuLink>
                        </li>
                      ))}
                    </ul>
                  </NavigationMenuContent>
                </NavigationMenuItem>
              );
            } else {
              // Top-level pages with no children
              return (
                <NavigationMenuItem key={page.id}>
                  <Link href={`/${page.slug}`} legacyBehavior passHref>
                    <NavigationMenuLink
                      className={navigationMenuTriggerStyle()}
                    >
                      {page.title}
                    </NavigationMenuLink>
                  </Link>
                </NavigationMenuItem>
              );
            }
          })}
      </NavigationMenuList>
    </NavigationMenu>
  );
}
