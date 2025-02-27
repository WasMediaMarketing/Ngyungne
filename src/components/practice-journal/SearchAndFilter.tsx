import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search, Filter } from "lucide-react";
import { practiceTypes } from "@/data/practice-types";

interface SearchAndFilterProps {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  filterType: string | null;
  setFilterType: (type: string | null) => void;
}

export default function SearchAndFilter({
  searchTerm,
  setSearchTerm,
  filterType,
  setFilterType,
}: SearchAndFilterProps) {
  return (
    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
      <div className="relative">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-primary/40" />
        <Input
          type="search"
          placeholder="Search entries..."
          className="pl-9 w-full md:w-60"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <Select
        value={filterType || "all"}
        onValueChange={(value) => setFilterType(value === "all" ? null : value)}
      >
        <SelectTrigger className="w-full md:w-48">
          <div className="flex items-center">
            <Filter className="mr-2 h-4 w-4" />
            <span>{filterType || "All types"}</span>
          </div>
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All types</SelectItem>
          {practiceTypes.map((type) => (
            <SelectItem key={type.value} value={type.value}>
              <span className="flex items-center">
                <span className="mr-2">{type.icon}</span>
                {type.value}
              </span>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
