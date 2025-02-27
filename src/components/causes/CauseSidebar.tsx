import { motion } from "framer-motion";
import { Search } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Category {
  id: string;
  name: string;
  icon: React.ElementType;
}

interface CausesSidebarProps {
  categories: Category[];
  activeTab: string;
  setActiveTab: (id: string) => void;
}

export function CausesSidebar({
  categories,
  activeTab,
  setActiveTab,
}: CausesSidebarProps) {
  return (
    <motion.div
      className="hidden lg:block lg:col-span-1"
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
    >
      <div className="sticky top-24 bg-white rounded-xl border border-saffron-200 p-5 shadow-sm">
        <h3 className="text-lg font-semibold text-crimson-800 mb-4">
          Categories
        </h3>
        <div className="space-y-2">
          {categories.map((category) => (
            <Button
              key={category.id}
              variant="ghost"
              onClick={() => setActiveTab(category.id)}
              className={`w-full justify-start px-3 py-2 rounded-lg ${
                activeTab === category.id
                  ? "bg-crimson-50 text-crimson-700 font-medium"
                  : "text-maroon-600 hover:bg-saffron-50"
              }`}
            >
              <category.icon size={18} className="mr-2" />
              {category.name}
            </Button>
          ))}
        </div>

        <div className="mt-6 pt-6 border-t border-saffron-200">
          <h3 className="text-lg font-semibold text-crimson-800 mb-4">
            Search
          </h3>
          <div className="relative">
            <input
              type="text"
              placeholder="Search causes..."
              className="w-full pl-10 pr-4 py-2 border border-saffron-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-crimson-500"
            />
            <Search
              size={18}
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-maroon-400"
            />
          </div>
        </div>
      </div>
    </motion.div>
  );
}
