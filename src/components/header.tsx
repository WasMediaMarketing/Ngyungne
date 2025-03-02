"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { MainNav } from "@/components/navigation/main-nav";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import * as LucideIcons from "lucide-react";
import { Menu, ChevronDown, ChevronRight } from "lucide-react";
import { siteConfig } from "@/config/site";
import type { LucideIcon } from "lucide-react";

export function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={`sticky top-0 z-50 w-full transition-all duration-300 ${
        isScrolled
          ? "bg-background/80 backdrop-blur-md shadow-sm"
          : "bg-background"
      }`}
    >
      <div className="container mx-auto px-4 py-2">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center gap-8">
            <Link href="/" className="flex items-center gap-2">
              <Image
                src="/logo.png"
                alt="Ngyungne Logo"
                height={100}
                width={140}
                priority
              />
            </Link>
          </div>

          <div className="flex items-center gap-4">
            <div className="hidden lg:flex">
              <MainNav />
            </div>
            <Button asChild className="hidden sm:flex">
              <Link href="/contact">Contact Us</Link>
            </Button>
            <Button className="hidden sm:flex">
              <Link href="/donate">Donate Now</Link>
            </Button>
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="lg:hidden">
                  <Menu className="h-6 w-6" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[300px] sm:w-[400px]">
                <div className="flex flex-col gap-4 py-4">
                  <MobileNav pathname={pathname} />
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  );
}

function MobileNav({ pathname }: { pathname: string }) {
  const [openSections, setOpenSections] = useState<{
    teachings: boolean;
    programs: boolean;
    resources: boolean;
  }>({
    teachings: false,
    programs: false,
    resources: false,
  });

  const toggleSection = (section: keyof typeof openSections) => {
    setOpenSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  return (
    <div className="flex flex-col space-y-4">
      <Link
        href="/"
        className={`text-base font-medium ${
          pathname === "/" ? "text-primary" : "text-primary/60"
        }`}
      >
        Home
      </Link>

      <Link
        href="/about"
        className={`text-base font-medium ${
          pathname === "/about" ? "text-primary" : "text-primary/60"
        }`}
      >
        About
      </Link>

      <div>
        <button
          onClick={() => toggleSection("teachings")}
          className="flex w-full items-center justify-between mb-2 text-base font-medium text-primary/60 hover:text-primary transition-colors"
        >
          <span>Teachings</span>
          {openSections.teachings ? (
            <ChevronDown className="h-4 w-4" />
          ) : (
            <ChevronRight className="h-4 w-4" />
          )}
        </button>

        {openSections.teachings && (
          <div className="pl-2 border-l border-primary/10">
            {siteConfig.mainNav.teachings.map((item) => {
              const Icon = LucideIcons[
                item.icon as keyof typeof LucideIcons
              ] as LucideIcon;
              return (
                <Link
                  key={item.title}
                  href={item.href}
                  className={`block py-2 text-sm hover:text-primary transition-colors ${
                    pathname === item.href ? "text-primary" : "text-primary/60"
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <Icon className="h-4 w-4" />
                    {item.title}
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </div>

      <div>
        <button
          onClick={() => toggleSection("programs")}
          className="flex w-full items-center justify-between mb-2 text-base font-medium text-primary/60 hover:text-primary transition-colors"
        >
          <span>Programs</span>
          {openSections.programs ? (
            <ChevronDown className="h-4 w-4" />
          ) : (
            <ChevronRight className="h-4 w-4" />
          )}
        </button>

        {openSections.programs && (
          <div className="pl-2 border-l border-primary/10">
            {siteConfig.mainNav.programs.map((item) => {
              const Icon = LucideIcons[
                item.icon as keyof typeof LucideIcons
              ] as LucideIcon;
              return (
                <Link
                  key={item.title}
                  href={item.href}
                  className={`block py-2 text-sm hover:text-primary transition-colors ${
                    pathname === item.href ? "text-primary" : "text-primary/60"
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <Icon className="h-4 w-4" />
                    {item.title}
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </div>

      <div>
        <button
          onClick={() => toggleSection("resources")}
          className="flex w-full items-center justify-between mb-2 text-base font-medium text-primary/60 hover:text-primary transition-colors"
        >
          <span>Resources</span>
          {openSections.resources ? (
            <ChevronDown className="h-4 w-4" />
          ) : (
            <ChevronRight className="h-4 w-4" />
          )}
        </button>

        {openSections.resources && (
          <div className="pl-2 border-l border-primary/10">
            {siteConfig.mainNav.resources.map((item) => {
              const Icon = LucideIcons[
                item.icon as keyof typeof LucideIcons
              ] as LucideIcon;
              return (
                <Link
                  key={item.title}
                  href={item.href}
                  className={`block py-2 text-sm hover:text-primary transition-colors ${
                    pathname === item.href ? "text-primary" : "text-primary/60"
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <Icon className="h-4 w-4" />
                    {item.title}
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </div>

      <div className="flex flex-col gap-2 pt-4">
        <Button className="w-full">
          <Link href="/contact">Contact Us</Link>
        </Button>
      </div>

      <div className="flex flex-col gap-2">
        <Button className="w-full">
          <Link href="/donate">Donate Now</Link>
        </Button>
      </div>
    </div>
  );
}
