// components/DynamicHead.tsx
"use client";

import { useEffect, useState } from "react";
import { getSettings } from "@/utils/settingsApi";
import type { Setting } from "@/types/setting.types";

export default function DynamicHead() {
  const [settings, setSettings] = useState<Setting | null>(null);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const data = await getSettings();
        setSettings(data);

        if (data.metaInfo) {
          document.title = data.metaInfo.title;

          const updateMeta = (name: string, content: string, attr = "name") => {
            let tag = document.querySelector(`meta[${attr}="${name}"]`);
            if (!tag) {
              tag = document.createElement("meta");
              tag.setAttribute(attr, name);
              document.head.appendChild(tag);
            }
            tag.setAttribute("content", content);
          };

          updateMeta("description", data.metaInfo.description);
          updateMeta("keywords", data.metaInfo.keywords?.join(", ") || "");

          if (data.metaInfo.favicon) {
            let link = document.querySelector('link[rel="icon"]');
            if (!link) {
              link = document.createElement("link");
              link.setAttribute("rel", "icon");
              document.head.appendChild(link);
            }
            link.setAttribute("href", data.metaInfo.favicon);
          }

          updateMeta("og:image", data?.metaInfo?.ogImage ?? "", "property");
          updateMeta("twitter:card", "summary_large_image");
          updateMeta("twitter:site", data.metaInfo.twitterHandle ?? "");
        }
      } catch (err) {
        console.error("Failed to fetch settings:", err);
      }
    };

    fetchSettings();
  }, []);

  return null;
}
