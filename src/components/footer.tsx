"use client";

import type React from "react";

import { useState, useEffect, type FormEvent } from "react";
import Link from "next/link";
import {
  Facebook,
  Twitter,
  Instagram,
  Youtube,
  Mail,
  Phone,
  MapPin,
  ChevronRight,
  Linkedin,
  Send,
  Loader2,
  Globe,
} from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { getSettings } from "@/utils/settingsApi";
import { newsletterApi } from "@/utils/newsletterApi";
import type { Setting, SocialLink } from "@/types/setting.types";

// Map of social media platform names to Lucide icons
const socialIcons: Record<string, React.ReactNode> = {
  Facebook: <Facebook className="h-6 w-6" />,
  Twitter: <Twitter className="h-6 w-6" />,
  Instagram: <Instagram className="h-6 w-6" />,
  Youtube: <Youtube className="h-6 w-6" />,
  LinkedIn: <Linkedin className="h-6 w-6" />,
  // Add fallback for any other platforms
  Default: <Globe className="h-6 w-6" />,
};

export function Footer() {
  const [settings, setSettings] = useState<Setting | null>(null);
  const [loading, setLoading] = useState(true);
  const [email, setEmail] = useState("");
  const [subscribing, setSubscribing] = useState(false);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const data = await getSettings();
        setSettings(data);
      } catch (error) {
        console.error("Failed to fetch settings:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchSettings();
  }, []);

  const handleNewsletterSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!email || !email.trim()) return;

    setSubscribing(true);
    try {
      const success = await newsletterApi.subscribe(email.trim());
      if (success) {
        setEmail(""); // Clear the input on success
      }
    } finally {
      setSubscribing(false);
    }
  };

  // Render social media links based on platform names from settings
  const renderSocialLinks = (socialLinks: SocialLink[]) => {
    return socialLinks.map((link, index) => (
      <Link
        key={index}
        href={link.url}
        className="text-gray-400 hover:text-white transition-colors"
        target="_blank"
        rel="noopener noreferrer"
        aria-label={`Visit our ${link.platform} page`}
      >
        {socialIcons[link.platform] || socialIcons.Default}
      </Link>
    ));
  };

  return (
    <footer className="bg-slate-800 text-gray-100">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-4">
            <Image
              src="/logo.png"
              alt={settings?.organizationInfo.name || "Ngyungne Logo"}
              height={0}
              width={0}
              priority
              className="h-16 w-auto"
            />
            <ul className="space-y-2">
              <li className="flex items-start">
                <MapPin className="h-5 w-5 mr-2 text-gray-400 mt-1 flex-shrink-0" />
                <span>
                  {settings?.organizationInfo.address || "Loading address..."}
                </span>
              </li>
              <li className="flex items-center">
                <Phone className="h-5 w-5 mr-2 text-gray-400" />
                <span>
                  {settings?.organizationInfo.phone || "Loading phone..."}
                </span>
              </li>
              <li className="flex items-center">
                <Mail className="h-5 w-5 mr-2 text-gray-400" />
                <span>
                  {settings?.organizationInfo.email || "Loading email..."}
                </span>
              </li>
            </ul>
            <div className="flex space-x-4">
              {settings?.organizationInfo.socialLinks &&
              settings.organizationInfo.socialLinks.length > 0 ? (
                renderSocialLinks(settings.organizationInfo.socialLinks)
              ) : (
                <span className="text-gray-400">Loading social links...</span>
              )}
            </div>
          </div>

          <div>
            <h3 className="text-lg font-bold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              {[
                "About Us",
                "Teachings",
                "Courses",
                "Events",
                "Donate",
                "Contact Us",
              ].map((item, index) => (
                <li
                  key={index}
                  className="flex items-center space-x-2 hover:tracking-wide transition-all duration-300 ease-in-out"
                >
                  <ChevronRight className="h-4 w-4 text-gray-400" />
                  <Link
                    href={`/${item.toLowerCase().replace(/\s+/g, "-")}`}
                    className="hover:text-[#FDBE33] transition-colors"
                  >
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-bold mb-4">Resources</h3>
            <ul className="space-y-2">
              {[
                "Blog",
                "FAQ",
                "Ambassadors",
                "Sponsors",
                "Practices",
                "Gallery",
                "Buddhist Calendar",
                "Practice Journal",
                "Volunteers",
              ].map((item, index) => (
                <li
                  key={index}
                  className="flex items-center space-x-2 hover:tracking-wide transition-all duration-300 ease-in-out"
                >
                  <ChevronRight className="h-4 w-4 text-gray-400" />
                  <Link
                    href={`/resources/${item
                      .toLowerCase()
                      .replace(/\s+/g, "-")}`}
                    className="hover:text-amber-500 transition-colors"
                  >
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-bold mb-4">Newsletter</h3>
            <p className="text-gray-300 mb-4">
              Subscribe to our newsletter to receive updates on our activities,
              events, and teachings.
            </p>
            <form onSubmit={handleNewsletterSubmit} className="space-y-3">
              <div className="flex">
                <Input
                  type="email"
                  placeholder="Your email address"
                  className="bg-slate-700 border-slate-600 text-white rounded-r-none focus-visible:ring-amber-500"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  aria-label="Email for newsletter"
                />
                <Button
                  type="submit"
                  className="bg-amber-500 hover:bg-amber-600 rounded-l-none"
                  disabled={subscribing}
                  aria-label="Subscribe to newsletter"
                >
                  {subscribing ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Send className="h-4 w-4" />
                  )}
                </Button>
              </div>
              <p className="text-xs text-gray-400">
                By subscribing, you agree to our privacy policy and consent to
                receive updates from our organization.
              </p>
            </form>
          </div>
        </div>

        <Separator className="my-8 bg-gray-700" />

        <div className="text-center text-gray-400">
          <p>
            &copy; {new Date().getFullYear()}{" "}
            {settings?.organizationInfo.name || "Ngyungne Organization"}. All
            rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
