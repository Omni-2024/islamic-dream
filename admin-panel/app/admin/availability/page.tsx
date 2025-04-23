'use client'
import { useState, useEffect } from "react";
import { format, startOfDay, isBefore } from "date-fns";
import { CalendarIcon, Plus, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { toast } from "@/components/ui/use-toast";
import {
  getRakiAvailability,
  setRakiAvailability,
  removeRakiAvailability,
} from "@/lib/api";
import { useAuth } from "@/contexts/AuthContexts";
import { motion } from "framer-motion";
import withAuth from "@/hoc/withAuth";

export interface TimeSlot {
  startTime: string;
  isAvailable:boolean
}

export interface DayAvailability {
  date: string;
  timeSlots: TimeSlot[];
}

const HOURS = Array.from({ length: 24 }, (_, i) => i);

const AvailabilityPage=()=> {
  const { user: currentUser } = useAuth();
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [availability, setAvailability] = useState<DayAvailability | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (selectedDate && currentUser) {
      fetchAvailability(selectedDate);
    }
  }, [selectedDate, currentUser]);

  const fetchAvailability = async (date: Date) => {
    setIsLoading(true);
    try {
      const dateKey = format(date, "yyyy-MM-dd");
      const data = await getRakiAvailability(currentUser?._id, dateKey);

      setAvailability(data ? { ...data, timeSlots: data.timeSlots || [] } : null);
    } catch (error) {
      setAvailability(null);
      console.error("Failed to fetch availability:", error);
      toast({
        title: "Error",
        description: "Failed to fetch availability. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddTimeSlot = async (hour: number) => {
    if (!selectedDate || !currentUser) return;

    setIsLoading(true);
    const dateKey = format(selectedDate, "yyyy-MM-dd");

    try {
      const newTimeSlot: TimeSlot = {
        startTime: `${hour.toString().padStart(2, "0")}:00`,
        isAvailable:true
      };
      const newAvailability: DayAvailability = {
        date: dateKey,
        timeSlots: availability
            ? [...availability.timeSlots, newTimeSlot]
            : [newTimeSlot], // Default to new time slot if availability is null
      };

      await setRakiAvailability(newAvailability.date, [newTimeSlot]);
      setAvailability(newAvailability);

      toast({
        title: "Time slot added",
        description: `Added ${hour}:00 to ${format(selectedDate, "MMMM d, yyyy")}`,
      });
    } catch (error) {
      console.error("Failed to add time slot:", error);
      toast({
        title: "Error",
        description: "Failed to add time slot. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleRemoveTimeSlot = async (startTime: string) => {
    if (!availability || !currentUser) return;

    setIsLoading(true);

    try {
      const updatedTimeSlots = availability.timeSlots.filter(
          (slot) => slot.startTime !== startTime
      );
      const updatedAvailability: DayAvailability = {
        ...availability,
        timeSlots: updatedTimeSlots,
      };

      const dateKey = format(new Date(availability.date), "yyyy-MM-dd");

      await removeRakiAvailability(dateKey, startTime);
      setAvailability(updatedAvailability);

      toast({
        title: "Time slot removed",
        description: `Removed time slot from ${format(new Date(availability.date), "MMMM d, yyyy")}`,
      });
    } catch (error) {
      console.error("Failed to remove time slot:", error);
      toast({
        title: "Error",
        description: "Failed to remove time slot. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const isDateInPast = (date: Date) => {
    return isBefore(startOfDay(date), startOfDay(new Date()));
  };

  const now = new Date();
  const currentHour = now.getHours();
  const isToday = format(selectedDate, "yyyy-MM-dd") === format(now, "yyyy-MM-dd");

  return (
      <div className="container mx-auto px-4 py-8 max-w-2xl">
        <h1 className="text-3xl font-bold mb-6 text-primary-700">
          Manage Your Availability
        </h1>

        <div className="mb-6">
          <Popover>
            <PopoverTrigger asChild>
              <Button
                  variant={"outline"}
                  className={cn(
                      "w-full justify-start text-left font-normal",
                      !selectedDate && "text-muted-foreground"
                  )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {selectedDate ? format(selectedDate, "PPP") : <span>Pick a date</span>}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar
                  mode="single"
                  selected={selectedDate}
                  onSelect={(date) => date && setSelectedDate(date)}
                  initialFocus
                  disabled={(date) => isDateInPast(date)}
              />
            </PopoverContent>
          </Popover>
        </div>

        {isDateInPast(selectedDate) ? (
            <p className="text-muted-foreground text-center">
              Cannot edit availability for past dates.
            </p>
        ) : (
            <div className="space-y-4">
              <h2 className="text-xl font-semibold mb-4">Available Time Slots</h2>
              <div className="grid grid-cols-4 gap-2">
                {HOURS.map((hour) => {
                  const timeSlot = `${hour.toString().padStart(2, "0")}:00`;
                  const isAvailable = availability?.timeSlots && availability?.timeSlots.some(
                      (slot) => slot.startTime.replace(".", ":") === timeSlot
                  );

                  const isBooked = availability?.timeSlots.some(
                      (slot) => slot.startTime.replace(".", ":") === timeSlot && !slot.isAvailable
                  );




                  const isPastTime = isToday && hour < currentHour;

                  return (
                      <motion.div
                          key={hour}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.3, delay: hour * 0.02 }}
                      >
                        <Button
                            variant={isAvailable ? "default" : "outline"}
                            className={cn(
                                "w-full h-12",
                                isAvailable && "bg-primary-700 text-primary-foreground hover:bg-primary-500"
                            )}
                            onClick={() =>
                                isAvailable
                                    ? handleRemoveTimeSlot(timeSlot)
                                    : handleAddTimeSlot(hour)
                            }
                            disabled={isLoading || isPastTime || isBooked}
                        >
                          {timeSlot}
                          {isAvailable ? (
                              <Trash2 className="ml-2 h-4 w-4" />
                          ) : (
                              <Plus className="ml-2 h-4 w-4" />
                          )}
                        </Button>
                      </motion.div>
                  );
                })}
              </div>
            </div>
        )}
      </div>
  );
}

export default withAuth(AvailabilityPage, ["admin"]);

