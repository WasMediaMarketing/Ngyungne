import React from "react";
import dayjs from "dayjs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ChevronLeft, ChevronRight, Moon, Sun } from "lucide-react";
import {
  getBuddhistDate,
  getLunarPhase,
  isUposathaDay,
} from "@/utils/buddhistCalender";
import type { EventType } from "@/types/buddhist-event";

interface BuddhistCalendarViewProps {
  currentMonth: Date;
  selectedDate: Date | undefined;
  onSelectDate: (date: Date | undefined) => void;
  onMonthChange: (date: Date) => void;
  getEventCountForDate: (date: Date) => number;
  activeFilters?: EventType[];
}

export function BuddhistCalendarView({
  currentMonth,
  selectedDate,
  onSelectDate,
  onMonthChange,
  getEventCountForDate,
  activeFilters = [],
}: BuddhistCalendarViewProps) {
  const goToPreviousMonth = () =>
    onMonthChange(dayjs(currentMonth).subtract(1, "month").toDate());
  const goToNextMonth = () =>
    onMonthChange(dayjs(currentMonth).add(1, "month").toDate());
  const goToCurrentMonth = () => {
    onMonthChange(new Date());
    onSelectDate(new Date());
  };

  const getDaysInMonth = (date: Date) => {
    const daysInMonth = dayjs(date).daysInMonth();
    const firstDayOfMonth = dayjs(date).startOf("month");
    const days = [];

    for (let i = 0; i < firstDayOfMonth.day(); i++) {
      days.push(null);
    }

    for (let i = 1; i <= daysInMonth; i++) {
      days.push(dayjs(date).date(i).toDate());
    }

    return days;
  };

  const renderDay = (date: Date | null) => {
    if (!date) return <div className="p-2"></div>;

    const isSelected = selectedDate && dayjs(date).isSame(selectedDate, "day");
    const isToday = dayjs(date).isSame(new Date(), "day");
    const lunarPhase = getLunarPhase(date);
    const eventCount = getEventCountForDate(date);
    const isUposatha = isUposathaDay(date);

    return (
      <Button
        variant="ghost"
        className={`w-full h-full aspect-square flex flex-col items-center justify-center p-1 ${
          isSelected ? "bg-primary text-primary-foreground" : ""
        } ${isToday ? "border border-primary" : ""}`}
        onClick={() => onSelectDate(date)}
      >
        <span className="text-xs text-muted-foreground">
          {getBuddhistDate(date).split(" ")[0]}
        </span>
        <span className="text-sm font-medium">{date.getDate()}</span>
        {isUposatha && <Moon className="w-3 h-3 text-yellow-500" />}
        {eventCount > 0 && (
          <Badge variant="secondary" className="mt-1 text-xs">
            {eventCount}
          </Badge>
        )}
      </Button>
    );
  };

  const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle>
          {dayjs(currentMonth).format("MMMM YYYY")} /{" "}
          {getBuddhistDate(currentMonth)}
        </CardTitle>
        <div className="flex items-center space-x-2">
          <Button size="sm" variant="outline" onClick={goToPreviousMonth}>
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button size="sm" variant="outline" onClick={goToCurrentMonth}>
            Today
          </Button>
          <Button size="sm" variant="outline" onClick={goToNextMonth}>
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>

      <CardContent>
        <div className="grid grid-cols-7 gap-1">
          {daysOfWeek.map((day) => (
            <div key={day} className="text-center font-medium text-sm py-2">
              {day}
            </div>
          ))}
          {getDaysInMonth(currentMonth).map((date, index) => (
            <div key={index}>{renderDay(date)}</div>
          ))}
        </div>

        <div className="flex gap-2 flex-wrap mt-4">
          <Badge variant="outline" className="flex items-center gap-1">
            <Moon className="h-3 w-3" /> Uposatha Day
          </Badge>
          <Badge
            variant={
              activeFilters?.includes("festival") ? "destructive" : "outline"
            }
          >
            🎉 Festival
          </Badge>
          <Badge
            variant={
              activeFilters?.includes("teaching") ? "secondary" : "outline"
            }
          >
            📚 Teaching
          </Badge>
          <Badge
            variant={
              activeFilters?.includes("practice") ? "default" : "outline"
            }
          >
            🧘‍♂️ Practice
          </Badge>
          <Badge
            variant={activeFilters?.includes("moon") ? "outline" : "secondary"}
          >
            🌕 Moon Ceremony
          </Badge>
        </div>
      </CardContent>
    </Card>
  );
}
