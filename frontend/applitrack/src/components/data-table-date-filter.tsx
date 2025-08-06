import { IconCalendar, IconX } from "@tabler/icons-react";
import { format } from "date-fns";
import type { DateRange } from "react-day-picker";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

interface DataTableDateFilterProps {
  dateRange: DateRange | undefined;
  onDateRangeChange: (range: DateRange | undefined) => void;
}

export function DataTableDateFilter({
  dateRange,
  onDateRangeChange,
}: DataTableDateFilterProps) {
  return (
    <div className="flex items-center space-x-2">
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            size="sm"
            className={cn(
              "h-8 border-dashed",
              dateRange && "border-solid"
            )}
          >
            <IconCalendar className="mr-2 h-4 w-4" />
            Date Range
            {dateRange?.from && (
              <>
                {dateRange.to ? (
                  <span className="ml-2 text-xs">
                    {format(dateRange.from, "MMM dd")} - {format(dateRange.to, "MMM dd")}
                  </span>
                ) : (
                  <span className="ml-2 text-xs">
                    {format(dateRange.from, "MMM dd")}
                  </span>
                )}
              </>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            initialFocus
            mode="range"
            defaultMonth={dateRange?.from}
            selected={dateRange}
            onSelect={onDateRangeChange}
            numberOfMonths={2}
          />
        </PopoverContent>
      </Popover>
      {dateRange && (
        <Button
          variant="ghost"
          size="sm"
          className="h-8 px-2"
          onClick={() => onDateRangeChange(undefined)}
        >
          <IconX className="h-4 w-4" />
        </Button>
      )}
    </div>
  );
}