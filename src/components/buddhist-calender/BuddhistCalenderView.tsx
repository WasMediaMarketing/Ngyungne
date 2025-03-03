import React, { useState } from "react";
import dayjs from "dayjs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Calendar as CalendarIcon,
  ChevronLeft,
  ChevronRight,
  Moon,
  Sun,
  ChevronDown,
} from "lucide-react";
import {
  getBuddhistDate,
  getLunarPhase,
  isUposathaDay,
  getBuddhistYear,
} from "@/utils/buddhistCalender";
import type { EventType } from "@/types/buddhist-event";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

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
  const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);
  const [isYearPickerOpen, setIsYearPickerOpen] = useState(false);

  const goToPreviousMonth = () =>
    onMonthChange(dayjs(currentMonth).subtract(1, "month").toDate());

  const goToNextMonth = () =>
    onMonthChange(dayjs(currentMonth).add(1, "month").toDate());

  const goToCurrentMonth = () => {
    onMonthChange(new Date());
    onSelectDate(new Date());
  };

  const handleMonthChange = (month: string) => {
    const newDate = dayjs(currentMonth)
      .month(parseInt(month) - 1)
      .toDate();
    onMonthChange(newDate);
  };

  const handleYearChange = (year: string) => {
    // Convert Buddhist year to Gregorian
    const gregorianYear = parseInt(year) - 543;
    const newDate = dayjs(currentMonth).year(gregorianYear).toDate();
    onMonthChange(newDate);
  };

  const handleDatePickerSelect = (date: Date | undefined) => {
    if (date) {
      onMonthChange(date);
      onSelectDate(date);
      setIsDatePickerOpen(false);
    }
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
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              className={`w-full h-full aspect-square flex flex-col items-center justify-center p-1 ${
                isSelected ? "bg-primary text-primary-foreground" : ""
              } ${isToday ? "border border-primary" : ""} ${
                isUposatha ? "bg-amber-50" : ""
              }`}
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
          </TooltipTrigger>
          <TooltipContent>
            <p>{getBuddhistDate(date)}</p>
            {lunarPhase && <p>Moon: {lunarPhase}</p>}
            {isUposatha && <p>Uposatha Day</p>}
            {eventCount > 0 && <p>{eventCount} events</p>}
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  };

  // Generate month options
  const monthOptions = Array.from({ length: 12 }, (_, i) => {
    const monthNumber = i + 1;
    const monthName = dayjs().month(i).format("MMMM");
    return { value: monthNumber.toString(), label: monthName };
  });

  // Generate year options (10 years before and after current year)
  const currentBuddhistYear = getBuddhistYear(new Date());
  const yearOptions = Array.from({ length: 21 }, (_, i) => {
    const year = currentBuddhistYear - 10 + i;
    return { value: year.toString(), label: year.toString() };
  });

  const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const currentBuddhistMonth = dayjs(currentMonth).format("MMMM");
  const currentGregorianYear = dayjs(currentMonth).year();
  const currentBudYear = getBuddhistYear(currentMonth);

  return (
    <Card className="shadow-md">
      <CardHeader className="flex flex-col space-y-2 pb-2">
        <div className="flex flex-row items-center justify-between">
          <CardTitle className="flex items-center">
            <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2">
              {/* Month Selector */}
              <Select
                value={(dayjs(currentMonth).month() + 1).toString()}
                onValueChange={handleMonthChange}
              >
                <SelectTrigger className="w-32 h-8">
                  <SelectValue>{currentBuddhistMonth}</SelectValue>
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    {monthOptions.map((month) => (
                      <SelectItem key={month.value} value={month.value}>
                        {month.label}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>

              {/* Year Selector */}
              <Select
                value={currentBudYear.toString()}
                onValueChange={handleYearChange}
              >
                <SelectTrigger className="w-28 h-8">
                  <SelectValue>{currentBudYear}</SelectValue>
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    {yearOptions.map((year) => (
                      <SelectItem key={year.value} value={year.value}>
                        {year.label}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>

              <span className="text-muted-foreground text-sm ml-1">
                / {currentGregorianYear} CE
              </span>
            </div>
          </CardTitle>

          <div className="flex items-center space-x-1">
            <Button size="icon" variant="outline" onClick={goToPreviousMonth}>
              <ChevronLeft className="h-4 w-4" />
            </Button>

            <Popover open={isDatePickerOpen} onOpenChange={setIsDatePickerOpen}>
              <PopoverTrigger asChild>
                <Button size="icon" variant="outline">
                  <CalendarIcon className="h-4 w-4" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="end">
                <Calendar
                  mode="single"
                  selected={selectedDate}
                  onSelect={handleDatePickerSelect}
                  initialFocus
                />
              </PopoverContent>
            </Popover>

            <Button size="sm" variant="outline" onClick={goToCurrentMonth}>
              Today
            </Button>

            <Button size="icon" variant="outline" onClick={goToNextMonth}>
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <div className="text-sm text-muted-foreground">
          {getBuddhistDate(currentMonth)}
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
            className="cursor-pointer"
          >
            🎉 Festival
          </Badge>
          <Badge
            variant={
              activeFilters?.includes("teaching") ? "secondary" : "outline"
            }
            className="cursor-pointer"
          >
            📚 Teaching
          </Badge>
          <Badge
            variant={
              activeFilters?.includes("practice") ? "default" : "outline"
            }
            className="cursor-pointer"
          >
            🧘‍♂️ Practice
          </Badge>
          <Badge
            variant={activeFilters?.includes("moon") ? "outline" : "secondary"}
            className="cursor-pointer"
          >
            🌕 Moon Ceremony
          </Badge>
        </div>
      </CardContent>
    </Card>
  );
}
