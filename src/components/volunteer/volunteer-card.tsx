"use client";

import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import SocialLinks from "./social-links";

interface Volunteer {
  id: number | string;
  fullname: string;
  phone: string;
  email: string;
  address: string;
  image: string | null;
  socialLinks?: Record<string, string>;
}

interface VolunteerCardProps {
  volunteer: Volunteer;
}

const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

export default function VolunteerCard({ volunteer }: VolunteerCardProps) {
  return (
    <AnimatePresence>
      <motion.div
        layout
        initial="hidden"
        animate="visible"
        exit={{ opacity: 0, scale: 0.8 }}
        variants={fadeIn}
        className="bg-white rounded-lg overflow-hidden shadow-md border border-gray-100 transition-all duration-300 hover:shadow-xl group"
      >
        {/* Full width image at top */}
        <div className="relative h-48 sm:h-56 md:h-64 w-full overflow-hidden">
          <Image
            src={volunteer.image || "/placeholder.svg?height=300&width=400"}
            alt={volunteer.fullname}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, 33vw"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        </div>

        <div className="p-6 text-center">
          <h3 className="text-xl font-bold text-gray-900 mb-2">
            {volunteer.fullname}
          </h3>

          {/* Social links - always visible */}
          <SocialLinks links={volunteer.socialLinks} className="mt-2 mb-3" />

          {/* Contact info container */}
          <div className="mt-4 space-y-0 overflow-hidden">
            {/* Email with hover effect */}
            <motion.a
              href={`mailto:${volunteer.email}`}
              className="flex items-center justify-center text-gray-600 hover:text-crimson-600 transition-all duration-300 py-1.5"
              whileHover={{ scale: 1.03, x: 3 }}
            >
              <svg
                className="h-4 w-4 text-saffron-500 mr-2 flex-shrink-0"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                />
              </svg>
              <span className="truncate text-sm">{volunteer.email}</span>
            </motion.a>

            {/* Phone with hover effect */}
            <motion.a
              href={`tel:${volunteer.phone}`}
              className="flex items-center justify-center text-gray-600 hover:text-crimson-600 transition-all duration-300 py-1.5"
              whileHover={{ scale: 1.03, x: 3 }}
            >
              <svg
                className="h-4 w-4 text-saffron-500 mr-2 flex-shrink-0"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                />
              </svg>
              <span className="text-sm">{volunteer.phone}</span>
            </motion.a>
          </div>

          {/* Address with hover effect */}
          <motion.div
            className="mt-4 pt-4 border-t border-gray-100"
            initial={{ opacity: 0.7 }}
            whileHover={{ opacity: 1 }}
          >
            <div className="flex items-start justify-center text-sm text-gray-600">
              <svg
                className="h-4 w-4 text-saffron-500 mr-2 mt-0.5 flex-shrink-0"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                />
              </svg>
              <span className="text-left">{volunteer.address}</span>
            </div>
          </motion.div>
        </div>

        {/* Decorative gradient bar at bottom */}
        <div className="h-1 w-full bg-gradient-to-r from-saffron-400 to-crimson-500 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></div>
      </motion.div>
    </AnimatePresence>
  );
}
