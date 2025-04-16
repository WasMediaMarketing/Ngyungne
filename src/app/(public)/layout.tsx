"use client";

import type React from "react";

import { useEffect, useState } from "react";
import { Poppins } from "next/font/google";
import "@/app/globals.css";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { Toaster } from "@/components/ui/sonner";
import { getSettings } from "@/utils/settingsApi";
import type { Setting } from "@/types/setting.types";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [settings, setSettings] = useState<Setting | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const data = await getSettings();
        setSettings(data);

        // Update document title and meta description dynamically
        if (data.metaInfo) {
          document.title = data.metaInfo.title;

          // Update meta description
          const metaDescription = document.querySelector(
            'meta[name="description"]'
          );
          if (metaDescription) {
            metaDescription.setAttribute("content", data.metaInfo.description);
          } else {
            const meta = document.createElement("meta");
            meta.name = "description";
            meta.content = data.metaInfo.description;
            document.head.appendChild(meta);
          }

          // Update favicon if it exists
          if (data.metaInfo.favicon) {
            const existingFavicon = document.querySelector('link[rel="icon"]');
            if (existingFavicon) {
              existingFavicon.setAttribute("href", data.metaInfo.favicon);
            } else {
              const link = document.createElement("link");
              link.rel = "icon";
              link.href = data.metaInfo.favicon;
              document.head.appendChild(link);
            }
          }

          // Update Open Graph image if it exists
          if (data.metaInfo.ogImage) {
            let ogImage = document.querySelector('meta[property="og:image"]');
            if (ogImage) {
              ogImage.setAttribute("content", data.metaInfo.ogImage);
            } else {
              ogImage = document.createElement("meta");
              ogImage.setAttribute("property", "og:image");
              ogImage.setAttribute("content", data.metaInfo.ogImage);
              document.head.appendChild(ogImage);
            }
          }

          // Update Twitter meta tags if Twitter handle exists
          if (data.metaInfo.twitterHandle) {
            let twitterCard = document.querySelector(
              'meta[name="twitter:card"]'
            );
            if (!twitterCard) {
              twitterCard = document.createElement("meta");
              twitterCard.setAttribute("name", "twitter:card");
              twitterCard.setAttribute("content", "summary_large_image");
              document.head.appendChild(twitterCard);
            }

            let twitterSite = document.querySelector(
              'meta[name="twitter:site"]'
            );
            if (twitterSite) {
              twitterSite.setAttribute("content", data.metaInfo.twitterHandle);
            } else {
              twitterSite = document.createElement("meta");
              twitterSite.setAttribute("name", "twitter:site");
              twitterSite.setAttribute("content", data.metaInfo.twitterHandle);
              document.head.appendChild(twitterSite);
            }
          }

          // Add keywords meta tag if keywords exist
          if (data.metaInfo.keywords && data.metaInfo.keywords.length > 0) {
            let keywordsMeta = document.querySelector('meta[name="keywords"]');
            if (keywordsMeta) {
              keywordsMeta.setAttribute(
                "content",
                data.metaInfo.keywords.join(", ")
              );
            } else {
              keywordsMeta = document.createElement("meta");
              keywordsMeta.setAttribute("name", "keywords");
              keywordsMeta.setAttribute(
                "content",
                data.metaInfo.keywords.join(", ")
              );
              document.head.appendChild(keywordsMeta);
            }
          }
        }
      } catch (error) {
        console.error("Failed to fetch settings:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchSettings();
  }, []);

  return (
    <html lang="en" className="scroll-smooth">
      <body className={`${poppins.className} flex flex-col min-h-screen`}>
        <Header />
        <main className="flex-grow">{children}</main>
        <Toaster />
        <Footer />
      </body>
    </html>
  );
}
