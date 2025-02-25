"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { MainNav } from "@/components/navigation/main-nav";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import * as LucideIcons from "lucide-react";
import { Menu } from "lucide-react";
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
  return (
    <div className="flex flex-col space-y-4">
      <Link
        href="/"
        className={`text-lg font-medium ${
          pathname === "/" ? "text-primary" : "text-primary/60"
        }`}
      >
        Home
      </Link>

      <div>
        <h4 className="mb-2 text-sm font-medium text-primary/60">Teachings</h4>
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

      <div>
        <h4 className="mb-2 text-sm font-medium text-primary/60">Programs</h4>
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

      <div>
        <h4 className="mb-2 text-sm font-medium text-primary/60">Resources</h4>
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

      <Link
        href="/contact"
        className={`text-lg font-medium ${
          pathname === "/contact" ? "text-primary" : "text-primary/60"
        }`}
      >
        Contact
      </Link>

      <div className="flex flex-col gap-2 pt-4">
        <Button className="w-full">
          <Link href="/donate">Donate Now</Link>
        </Button>
      </div>
    </div>
  );
}
