import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, List, Clock, Star, BookOpen } from "lucide-react";
import { Stats } from "@/types/practice-journal";
import { practiceTypes } from "@/data/practice-types";

interface StatisticsCardsProps {
  stats: Stats;
}

export default function StatisticsCards({ stats }: StatisticsCardsProps) {
  const getTypeIcon = (type: string) => {
    const practiceType = practiceTypes.find((p) => p.value === type);
    return practiceType ? practiceType.icon : "📝";
  };

  const topPractice = Object.entries(stats.practiceTypeCounts).sort(
    (a, b) => b[1] - a[1]
  )[0];

  return (
    <div className="grid md:grid-cols-5 gap-6">
      <Card className="md:col-span-1 bg-gradient-to-br from-blue-50 to-blue-100 border-blue-100">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm text-blue-700 flex items-center">
            <Calendar className="h-4 w-4 mr-2 text-blue-600" />
            Current Streak
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-baseline">
            <p className="text-3xl font-bold text-blue-700">
              {stats.currentStreak}
            </p>
            <p className="ml-2 text-blue-600/80 text-sm">days</p>
          </div>
        </CardContent>
      </Card>

      <Card className="md:col-span-1 bg-gradient-to-br from-purple-50 to-purple-100 border-purple-100">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm text-purple-700 flex items-center">
            <List className="h-4 w-4 mr-2 text-purple-600" />
            Total Sessions
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-baseline">
            <p className="text-3xl font-bold text-purple-700">
              {stats.totalSessions}
            </p>
            <p className="ml-2 text-purple-600/80 text-sm">entries</p>
          </div>
        </CardContent>
      </Card>

      <Card className="md:col-span-1 bg-gradient-to-br from-amber-50 to-amber-100 border-amber-100">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm text-amber-700 flex items-center">
            <Clock className="h-4 w-4 mr-2 text-amber-600" />
            Practice Time
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-baseline">
            <p className="text-3xl font-bold text-amber-700">
              {stats.totalMinutes}
            </p>
            <p className="ml-2 text-amber-600/80 text-sm">minutes</p>
          </div>
          <p className="text-xs text-amber-600/70 mt-1">
            {stats.weeklyPracticeTime} min this week
          </p>
        </CardContent>
      </Card>

      <Card className="md:col-span-1 bg-gradient-to-br from-green-50 to-green-100 border-green-100">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm text-green-700 flex items-center">
            <Star className="h-4 w-4 mr-2 text-green-600" />
            Average Quality
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center">
            <p className="text-3xl font-bold text-green-700 mr-2">
              {stats.avgMood}
            </p>
            <div className="flex">
              {[1, 2, 3, 4, 5].map((i) => (
                <Star
                  key={i}
                  className={`h-4 w-4 ${
                    parseFloat(stats.avgMood) >= i
                      ? "text-yellow-500 fill-yellow-500"
                      : "text-green-200"
                  }`}
                />
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="md:col-span-1 bg-gradient-to-br from-indigo-50 to-indigo-100 border-indigo-100">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm text-indigo-700 flex items-center">
            <BookOpen className="h-4 w-4 mr-2 text-indigo-600" />
            Top Practice
          </CardTitle>
        </CardHeader>
        <CardContent>
          {topPractice ? (
            <div className="flex items-center">
              <span className="text-xl mr-2">
                {getTypeIcon(topPractice[0])}
              </span>
              <div>
                <p className="font-medium text-indigo-700">{topPractice[0]}</p>
                <p className="text-xs text-indigo-600/70">
                  {topPractice[1]} sessions
                </p>
              </div>
            </div>
          ) : (
            <p>No entries yet</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
