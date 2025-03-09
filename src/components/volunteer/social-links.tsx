"use client";

import { motion } from "framer-motion";
import { InstagramIcon } from "lucide-react";

interface SocialLinksProps {
  links?: {
    instagram?: string;
    facebook?: string;
    linkedin?: string;
  };
  className?: string;
}

export default function SocialLinks({
  links,
  className = "",
}: SocialLinksProps) {
  if (!links || (!links.instagram && !links.facebook && !links.linkedin))
    return null;

  return (
    <div className={`flex space-x-4 justify-center ${className}`}>
      {links.instagram && (
        <motion.a
          href={links.instagram}
          target="_blank"
          rel="noopener noreferrer"
          whileHover={{ scale: 1.2, y: -2 }}
          whileTap={{ scale: 0.95 }}
          className="text-gray-400 hover:text-blue-400 transition-colors duration-200"
          aria-label="instagram"
        >
          <InstagramIcon className="h-5 w-5" />
        </motion.a>
      )}

      {links.facebook && (
        <motion.a
          href={links.facebook}
          target="_blank"
          rel="noopener noreferrer"
          whileHover={{ scale: 1.2, y: -2 }}
          whileTap={{ scale: 0.95 }}
          className="text-gray-400 hover:text-blue-600 transition-colors duration-200"
          aria-label="Facebook"
        >
          <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
            <path
              fillRule="evenodd"
              d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z"
              clipRule="evenodd"
            />
          </svg>
        </motion.a>
      )}

      {links.linkedin && (
        <motion.a
          href={links.linkedin}
          target="_blank"
          rel="noopener noreferrer"
          whileHover={{ scale: 1.2, y: -2 }}
          whileTap={{ scale: 0.95 }}
          className="text-gray-400 hover:text-blue-700 transition-colors duration-200"
          aria-label="LinkedIn"
        >
          <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
            <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
          </svg>
        </motion.a>
      )}
    </div>
  );
}
