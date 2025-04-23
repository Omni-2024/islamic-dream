import React, { useState } from 'react'
import { format } from 'date-fns'
import { CalendarIcon } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"

interface DateRangeFilterProps {
    onFilterChange: (filter: { type: string; start?: Date; end?: Date }) => void;
}

export function DateRangeFilter({ onFilterChange }: DateRangeFilterProps) {
    const [filterType, setFilterType] = useState('all')
    const [dateRange, setDateRange] = useState<{ from: Date ; to: Date  }>({
        from: new Date(),
        to: new Date(),
    })
    const [month, setMonth] = useState<string | undefined>(undefined)

    const handleFilterTypeChange = (value: string) => {
        console.log("value",value)
        setFilterType(value)
        if (value === 'all') {
            onFilterChange({ type: 'all' })
        } else if (value === 'last_week') {
            const end = new Date()
            const start = new Date(end.getTime() - 7 * 24 * 60 * 60 * 1000)
            onFilterChange({ type: 'range', start, end })
        }
    }

    type DateRange = { from?: Date; to?: Date };

    const handleDateRangeChange = (range: DateRange | undefined) => {
        if (range?.from && range.to) {
            setDateRange({ from: range.from, to: range.to });
            onFilterChange({ type: 'range', start: range.from, end: range.to });
        }
    };


    const handleMonthChange = (value: string) => {
        setMonth(value)
        const [year, month] = value.split('-')
        const start = new Date(parseInt(year), parseInt(month) - 1, 1)
        const end = new Date(parseInt(year), parseInt(month), 0)
        onFilterChange({ type: 'range', start, end })
    }

    return (
        <div className="flex items-center space-x-2">
            <Select value={filterType} onValueChange={handleFilterTypeChange}>
                <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Select filter type" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="all">All Time</SelectItem>
                    <SelectItem value="last_week">Last Week</SelectItem>
                    <SelectItem value="custom">Custom Range</SelectItem>
                    <SelectItem value="month">Specific Month</SelectItem>
                </SelectContent>
            </Select>

            {filterType === 'custom' && (
                <Popover>
                    <PopoverTrigger asChild>
                        <Button variant="outline" className="w-[280px] justify-start text-left font-normal">
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {dateRange.from ? (
                                dateRange.to ? (
                                    <>
                                        {format(dateRange.from, "LLL dd, y")} - {format(dateRange.to, "LLL dd, y")}
                                    </>
                                ) : (
                                    format(dateRange.from, "LLL dd, y")
                                )
                            ) : (
                                <span>Pick a date range</span>
                            )}
                        </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                            initialFocus
                            mode="range"
                            defaultMonth={dateRange.from}
                            selected={dateRange}
                            onSelect={handleDateRangeChange}
                            numberOfMonths={2}
                        />
                    </PopoverContent>
                </Popover>
            )}

            {filterType === 'month' && (
                <Select value={month} onValueChange={handleMonthChange}>
                    <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Select month" />
                    </SelectTrigger>
                    <SelectContent>
                        {Array.from({ length: 12 }, (_, i) => {
                            const date = new Date(new Date().getFullYear(), i, 1)
                            return (
                                <SelectItem key={i} value={format(date, 'yyyy-MM')}>
                                    {format(date, 'MMMM yyyy')}
                                </SelectItem>
                            )
                        })}
                    </SelectContent>
                </Select>
            )}
        </div>
    )
}

