import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, CalendarIcon } from "lucide-react";

interface EventsSearchAndFilterProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  activeFilter: string;
  setActiveFilter: (filter: string) => void;
  selectedDate: Date | null;
  resetDateFilter: () => void;
}

export function EventsSearchAndFilter({
  searchQuery,
  setSearchQuery,
  activeFilter,
  setActiveFilter,
  selectedDate,
  resetDateFilter,
}: EventsSearchAndFilterProps) {
  return (
    <div className="mb-8">
      <Card className="bg-white shadow-sm border-0">
        <CardContent className="pt-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <Input
                placeholder="Search events..."
                className="pl-10 border-gray-200"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="flex items-center space-x-2 overflow-x-auto">
              <Button
                variant={activeFilter === "all" ? "default" : "outline"}
                className={
                  activeFilter === "all"
                    ? "bg-crimson-600 hover:bg-crimson-700"
                    : "border-gray-200"
                }
                onClick={() => setActiveFilter("all")}
              >
                All
              </Button>
              <Button
                variant={activeFilter === "workshop" ? "default" : "outline"}
                className={
                  activeFilter === "workshop"
                    ? "bg-crimson-600 hover:bg-crimson-700"
                    : "border-gray-200"
                }
                onClick={() => setActiveFilter("workshop")}
              >
                Workshops
              </Button>
              <Button
                variant={activeFilter === "retreat" ? "default" : "outline"}
                className={
                  activeFilter === "retreat"
                    ? "bg-crimson-600 hover:bg-crimson-700"
                    : "border-gray-200"
                }
                onClick={() => setActiveFilter("retreat")}
              >
                Retreats
              </Button>
              <Button
                variant={activeFilter === "discussion" ? "default" : "outline"}
                className={
                  activeFilter === "discussion"
                    ? "bg-crimson-600 hover:bg-crimson-700"
                    : "border-gray-200"
                }
                onClick={() => setActiveFilter("discussion")}
              >
                Discussions
              </Button>
            </div>
            <div className="flex justify-end">
              {selectedDate && (
                <Button
                  variant="outline"
                  className="border-gray-200 text-sm flex items-center"
                  onClick={resetDateFilter}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {selectedDate.toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  })}
                  <span className="ml-2 text-gray-500">×</span>
                </Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
