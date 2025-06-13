"use client";

import { useRouter } from "next/navigation";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useEffect, useState } from "react";

interface DateSelectorProps {
  currentYear: number;
  currentMonth: number;
}

export function DateSelector({ currentYear, currentMonth }: DateSelectorProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  // Reset loading state when props change (i.e., after navigation)
  useEffect(() => {
    setIsLoading(false);
  }, [currentYear, currentMonth]);

  // Only show years from 2 years ago up to current year
  const years = Array.from(
    { length: 3 },
    (_, i) => currentYear - 2 + i
  ).filter(year => year <= new Date().getFullYear());

  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const handleYearChange = async (year: string) => {
    setIsLoading(true);
    // Add artificial delay
    await new Promise(resolve => setTimeout(resolve, 3000));
    router.push(`/dashboard/transactions?year=${year}&month=${currentMonth}`);
  };

  const handleMonthChange = async (month: string) => {
    setIsLoading(true);
    // Add artificial delay
    await new Promise(resolve => setTimeout(resolve, 3000));
    const monthIndex = months.indexOf(month) + 1;
    router.push(`/dashboard/transactions?year=${currentYear}&month=${monthIndex}`);
  };

  return (
    <div className="flex gap-2">
      <Select
        value={months[currentMonth - 1]}
        onValueChange={handleMonthChange}
        disabled={isLoading}
      >
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Select month" />
        </SelectTrigger>
        <SelectContent>
          {months.map((month) => (
            <SelectItem key={month} value={month}>
              {month}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select
        value={currentYear.toString()}
        onValueChange={handleYearChange}
        disabled={isLoading}
      >
        <SelectTrigger className="w-[120px]">
          <SelectValue placeholder="Select year" />
        </SelectTrigger>
        <SelectContent>
          {years.map((year) => (
            <SelectItem key={year} value={year.toString()}>
              {year}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
} 