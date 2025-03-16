"use client";

import type React from "react";
import { motion } from "framer-motion";
import { Search } from "lucide-react";
import { useState, useEffect } from "react";

interface CausesSidebarProps {
  activeTab: string;
  setActiveTab: (id: string) => void;
  searchQuery?: string;
  onSearch?: (query: string) => void;
}

export function CausesSidebar({
  searchQuery = "",
  onSearch,
}: CausesSidebarProps) {
  const [localSearchQuery, setLocalSearchQuery] = useState(searchQuery);

  // Update local state when prop changes
  useEffect(() => {
    setLocalSearchQuery(searchQuery);
  }, [searchQuery]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setLocalSearchQuery(value);

    // Debounce search to avoid too many API calls
    const timeoutId = setTimeout(() => {
      if (onSearch) {
        onSearch(value);
      }
    }, 300);

    return () => clearTimeout(timeoutId);
  };

  return (
    <motion.div
      className="hidden lg:block w-full"
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
    >
      <div className="sticky ">
        <div className="relative w-full">
          <input
            type="text"
            placeholder="Search causes..."
            className="w-full pl-10 pr-4 py-2 border border-saffron-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-crimson-500"
            value={localSearchQuery}
            onChange={handleSearchChange}
          />
          <Search
            size={18}
            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-maroon-400"
          />
        </div>
      </div>
    </motion.div>
  );
}
