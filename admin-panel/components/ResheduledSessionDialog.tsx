import {useEffect, useState} from "react"
import ReactDatePicker from "react-datepicker"
import "react-datepicker/dist/react-datepicker.css"
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { cn } from "@/lib/utils"
import {getRakiAvailability} from "@/lib/api";

interface RescheduleSessionDialogProps {
    isOpen: boolean
    onClose: () => void
    sessionRakiId:string | null
    onConfirm: (newStartDate: Date) => void
}

// const timeSlots = ["08:00", "09:00", "10:00", "11:00", "12:00", "14:00", "15:00", "16:00"]

interface timeSlots{
    "startTime":string,
    "isAvailable": boolean
}

export function RescheduleSessionDialog({ isOpen, onClose,sessionRakiId, onConfirm }: RescheduleSessionDialogProps) {
    const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date())
    const [selectedTime, setSelectedTime] = useState("09:00")
    const [loading, setLoading] = useState(false);
    const [availableTimes, setAvailableTimes] = useState<timeSlots[]>([]);


    const getLocalFormattedDate = (date:Date) => {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    };



    useEffect(() => {
        const fetchAvailability = async () => {
            if (selectedDate && sessionRakiId) {
                setLoading(true); // Start loading
                try {
                    const response = await getRakiAvailability(sessionRakiId, getLocalFormattedDate(selectedDate));

                    if (!response || response.message === "No availability found" || !Array.isArray(response.timeSlots)) {
                        setAvailableTimes([]);
                    } else {
                        // setAvailableTimes(response.timeSlots); // Store full timeSlots array
                        setAvailableTimes(
                            response.timeSlots
                                .filter((slot: timeSlots) => slot.isAvailable)
                        );
                    }
                } catch (error) {
                    console.error("Error fetching availability:", error);
                    setAvailableTimes([]);
                } finally {
                    setLoading(false);
                }
            } else {
                setAvailableTimes([]);
            }
        };

        fetchAvailability();
    }, [selectedDate, sessionRakiId]);

    const handleConfirm = () => {
        if (selectedDate) {
            const [hours, minutes] = selectedTime.split(":").map(Number)
            const newStartDate = new Date(selectedDate)
            newStartDate.setHours(hours, minutes)

            onConfirm(newStartDate)
        }
    }

    if (loading ) return <p>Loading</p>

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[380px] p-6 rounded-lg shadow-xl">
                <DialogHeader>
                    <DialogTitle className="text-xl font-semibold">📅 Reschedule Session</DialogTitle>
                </DialogHeader>

                {/* Date Selection with react-datepicker */}
                <div className="flex flex-col gap-3 mt-4">
                    <Label className="text-gray-600">Select a Date</Label>
                    <ReactDatePicker
                        selected={selectedDate}
                        onChange={(date:Date|null) => setSelectedDate(date as Date)}
                        dateFormat="MMMM d, yyyy"
                        className="w-full p-2 border rounded-md shadow-sm"
                        popperPlacement="bottom"
                    />
                </div>
                <div className="flex flex-col gap-3 mt-4">
                    <Label className="text-gray-600">Select Start Time</Label>
                    <div className="grid grid-cols-4 gap-2">
                        {availableTimes.map((time,index) => (
                            <Button
                                key={index}
                                variant="outline"
                                onClick={() => setSelectedTime(time.startTime)}
                                className={cn(
                                    "py-2 text-sm hover:bg-none",
                                    selectedTime === time.startTime && "bg-primary-500 text-white"
                                )}
                            >
                                {time?.startTime}
                            </Button>
                        ))}
                    </div>
                </div>

                {/* Action Buttons */}
                <div className="flex justify-end gap-2 mt-6">
                    <Button variant="outline" onClick={onClose}>Cancel</Button>
                    <Button onClick={handleConfirm} disabled={!selectedDate} className="bg-primary-700">Confirm</Button>
                </div>
            </DialogContent>
        </Dialog>
    )
}
