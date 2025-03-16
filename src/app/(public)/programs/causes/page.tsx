"use client";

import { motion } from "framer-motion";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { CausesSection } from "@/components/sections/causes-section";
import { CausesSidebar } from "@/components/causes/CauseSidebar";
import { Button } from "@/components/ui/button";
import { Search, Calendar, Users, HeartHandshake, Loader2 } from "lucide-react";
import { useState, useEffect } from "react";
import { causeApi, type CauseUI } from "@/utils/causeApi";

export default function Causes() {
  const [activeTab, setActiveTab] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [causes, setCauses] = useState<CauseUI[]>([]);
  const [filteredCauses, setFilteredCauses] = useState<CauseUI[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Categories for filtering causes
  const categories = [
    { id: "all", name: "All Causes", icon: HeartHandshake },
    { id: "temple", name: "Temple", icon: Calendar },
    { id: "education", name: "Education", icon: Users },
  ];

  // Fetch causes on component mount
  useEffect(() => {
    const fetchCauses = async () => {
      setIsLoading(true);
      try {
        const data = await causeApi.getCauses();
        setCauses(data);
        setFilteredCauses(data);
      } catch (error) {
        console.error("Failed to fetch causes:", error);
        // Initialize with empty arrays on error
        setCauses([]);
        setFilteredCauses([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCauses();
  }, []);

  // Handle category filter changes
  useEffect(() => {
    const filterCauses = async () => {
      setIsLoading(true);
      try {
        const filtered = await causeApi.filterCausesByCategory(activeTab);
        setFilteredCauses(filtered);
      } catch (error) {
        console.error("Failed to filter causes:", error);
      } finally {
        setIsLoading(false);
      }
    };

    filterCauses();
  }, [activeTab]);

  // Handle search input changes
  const handleSearch = async (query: string) => {
    setSearchQuery(query);

    if (!query.trim()) {
      // If search is cleared, reapply the current category filter
      const filtered = await causeApi.filterCausesByCategory(activeTab);
      setFilteredCauses(filtered);
      return;
    }

    setIsLoading(true);
    try {
      // First filter by category
      const categoryFiltered =
        activeTab === "all"
          ? causes
          : causes.filter(
              (cause) =>
                cause.categories?.includes(activeTab) ||
                cause.tags.includes(activeTab)
            );

      // Then search within the category filtered results
      const searchResults = categoryFiltered.filter(
        (cause) =>
          cause.title.toLowerCase().includes(query.toLowerCase()) ||
          cause.subtitle.toLowerCase().includes(query.toLowerCase()) ||
          cause.location.toLowerCase().includes(query.toLowerCase()) ||
          cause.tags.some((tag) =>
            tag.toLowerCase().includes(query.toLowerCase())
          )
      );

      setFilteredCauses(searchResults);
    } catch (error) {
      console.error("Failed to search causes:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6 },
    },
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-saffron-50/50 to-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
        <Breadcrumbs />

        <div className="grid lg:grid-cols-5 gap-8 mb-12">
          <CausesSidebar
            categories={categories}
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            searchQuery={searchQuery}
            onSearch={handleSearch}
          />

          {/* Main content */}
          <div className="lg:col-span-4">
            {/* Mobile filter tabs */}
            <motion.div
              className="lg:hidden mb-6 overflow-x-auto scrollbar-hide flex space-x-2"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
            >
              {categories.map((category) => (
                <Button
                  key={category.id}
                  variant={activeTab === category.id ? "default" : "outline"}
                  onClick={() => setActiveTab(category.id)}
                  className="whitespace-nowrap rounded-full"
                >
                  <category.icon size={16} className="mr-2" />
                  {category.name}
                </Button>
              ))}
            </motion.div>

            <motion.div variants={fadeIn} initial="hidden" animate="visible">
              <motion.h1
                className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4 text-crimson-800 leading-tight"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                Support Our <span className="text-saffron-600">Dharma</span>{" "}
                Causes
              </motion.h1>

              <motion.p
                className="text-lg mb-6 text-maroon-700 max-w-3xl"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                Explore the various causes we support and how you can contribute
                to making a difference in preserving Dharma traditions and
                supporting spiritual communities around the world.
              </motion.p>

              <motion.div
                className="flex flex-col sm:flex-row gap-4 mb-10"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
              ></motion.div>

              {/* Mobile search */}
              <motion.div
                className="lg:hidden mb-8"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.4 }}
              >
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search causes..."
                    className="w-full pl-10 pr-4 py-3 border border-saffron-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-crimson-500"
                    value={searchQuery}
                    onChange={(e) => handleSearch(e.target.value)}
                  />
                  <Search
                    size={18}
                    className="absolute left-3 top-1/2 transform -translate-y-1/2 text-maroon-400"
                  />
                </div>
              </motion.div>
            </motion.div>
          </div>
        </div>

        {isLoading ? (
          <div className="flex justify-center items-center py-20">
            <Loader2 className="h-10 w-10 text-crimson-600 animate-spin" />
            <span className="ml-4 text-lg text-maroon-700">
              Loading causes...
            </span>
          </div>
        ) : (
          <CausesSection causes={filteredCauses} showAll={true} />
        )}

        <motion.div
          className="mt-16 text-center"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.7 }}
        >
          <h3 className="text-2xl font-semibold text-crimson-800 mb-4">
            Can't Find What You're Looking For?
          </h3>
          <p className="text-maroon-600 mb-6 max-w-2xl mx-auto">
            If you have a specific cause in mind that you don't see listed, or
            would like to make a general donation, please reach out to us.
          </p>
          <Button className="bg-crimson-600 text-white hover:bg-crimson-700">
            Contact Our Team
          </Button>
        </motion.div>
      </div>
    </div>
  );
}
