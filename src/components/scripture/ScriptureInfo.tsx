import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Eye,
  Clock,
  BookOpenText,
  History,
  HeartHandshake,
} from "lucide-react";
import Image from "next/image";
import type { IScripture } from "@/types/scripture.types";

interface ScriptureInfoProps {
  scripture: IScripture;
}

export default function ScriptureInfo({ scripture }: ScriptureInfoProps) {
  const formatDate = (date?: Date) => {
    if (!date) return "";
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <Card className="bg-saffron-50 border-saffron-200 overflow-hidden sticky top-4">
      <div className="relative h-48 w-full bg-gradient-to-r from-amber-100 to-amber-200 flex items-center justify-center">
        {scripture.image ? (
          <Image
            src={scripture.image || "/placeholder.svg"}
            alt={scripture.title}
            fill
            className="object-cover"
          />
        ) : (
          <BookOpenText className="h-16 w-16 text-amber-400" />
        )}
      </div>

      <div className="p-6">
        <h1 className="text-2xl font-bold text-crimson-800 mb-2">
          {scripture.title}
        </h1>

        <div className="flex flex-wrap gap-2 mb-4">
          <Badge variant="outline" className="bg-amber-100 text-amber-800">
            {scripture.tradition}
          </Badge>
          <Badge variant="outline" className="bg-saffron-100 text-amber-800">
            {scripture.period}
          </Badge>
          <Badge variant="outline" className="bg-amber-50 text-amber-800">
            {scripture.language}
          </Badge>
        </div>

        <p className="text-maroon-700 mb-6">{scripture.description}</p>

        <div className="space-y-4">
          {scripture.significance && (
            <div>
              <h3 className="font-medium text-lg text-crimson-700 mb-2 flex items-center gap-2">
                <HeartHandshake className="h-5 w-5" />
                Significance
              </h3>
              <p className="text-maroon-600 text-sm">
                {scripture.significance}
              </p>
            </div>
          )}

          {scripture.historicalContext && (
            <div>
              <h3 className="font-medium text-lg text-crimson-700 mb-2 flex items-center gap-2">
                <History className="h-5 w-5" />
                Historical Context
              </h3>
              <p className="text-maroon-600 text-sm">
                {scripture.historicalContext}
              </p>
            </div>
          )}

          <div className="pt-4 border-t border-amber-100">
            <div className="flex items-center justify-between text-sm text-maroon-600">
              <div className="flex items-center gap-1">
                <Eye className="h-4 w-4" />
                <span>{scripture.views || 0} views</span>
              </div>
              <div className="flex items-center gap-1">
                <Clock className="h-4 w-4" />
                <span>
                  {scripture.updatedAt
                    ? `Updated: ${formatDate(scripture.updatedAt)}`
                    : scripture.createdAt
                    ? `Added: ${formatDate(scripture.createdAt)}`
                    : ""}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
}
