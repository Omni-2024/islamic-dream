import React from "react";
import { FaGlobe, FaCalendarAlt, FaClock } from "react-icons/fa";
import ReactCountryFlag from "react-country-flag";
import Button from "@/components/ui/buttons/DefaultButton";
import { getLanguageLabel, getCountryLabel, parseBookingDate } from "@/lib/utils";

const BookingCard = ({ Booking, selectedDate, selectedTime }) => {
  if (!Booking) {
    return <p className="flex items-center justify-center">No booking data available.</p>;
  }

  const calculateEndTime = (startTime, duration) => {
    if (!startTime) return "N/A";
    const [hours, minutes] = startTime.split(":").map(Number);
    const endTime = new Date();
    endTime.setHours(hours);
    endTime.setMinutes(minutes + parseInt(duration, 10));
    const endHours = endTime.getHours().toString().padStart(2, "0");
    const endMinutes = endTime.getMinutes().toString().padStart(2, "0");
    return `${endHours}:${endMinutes}`;
  };

  const isSessionWithinOneHour = (bookedDateTime) => {
    if (!bookedDateTime) return false;
    const currentDate = new Date();
    const sessionDate = parseBookingDate(bookedDateTime);
    const timeDifference = sessionDate - currentDate;

    return timeDifference <= 3600000 && timeDifference > 0;
  };

  const isSessionActive = (bookedDateTime, duration) => {
    if (!bookedDateTime || !duration) return false;
    const currentDate = new Date();
    const sessionDate = parseBookingDate(bookedDateTime);
    return currentDate >= sessionDate && currentDate <= new Date(sessionDate.getTime() + duration * 60000);
  };

  const calculateTimeUntilSession = (bookedDateTime, duration) => {
    if (!bookedDateTime || !duration) return "N/A";
    const currentDate = new Date();
    const sessionDate = parseBookingDate(bookedDateTime);
    const timeDifference = sessionDate - currentDate;

    if (isSessionActive(bookedDateTime, duration)) {
      return "Ongoing";
    }

    if (timeDifference <= 0) {
      return "Completed";
    }

    const days = Math.floor(timeDifference / (1000 * 60 * 60 * 24));
    const hours = Math.floor((timeDifference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((timeDifference % (1000 * 60 * 60)) / (1000 * 60));

    let timeString = "";
    if (days > 0) timeString += `${days} Days `;
    if (hours > 0) timeString += `${hours} Hours `;
    if (minutes > 0) timeString += `${minutes} Mins `;
    timeString += " More...";

    return timeString;
  };

  const formatTime = (date) => {
    return new Date(date).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", hour12: true });
  };

  const formatDate = (date) => {
    const d = new Date(date);
    const month = (d.getMonth() + 1).toString().padStart(2, '0');
    const day = d.getDate().toString().padStart(2, '0');
    const year = d.getFullYear();
    return `${month}/${day}/${year}`;
  };

  const bookedDateTime = selectedDate && selectedTime ? `${selectedDate.toISOString().split('T')[0]}T${selectedTime.padStart(5, '0')}` : Booking.date;
  const bookedDuration = Booking.bookedDuration || 60; // Assuming a default duration if not provided

  const endTime = new Date(new Date(bookedDateTime).getTime() + 60 * 60000); // Adding 1 hour

  const addOneHourToTime = (time) => {
    const [timeString, period] = time.split(" ");
    let [hours, minutes] = timeString.split(":").map(Number);
    if (period === "PM" && hours !== 12) hours += 12;
    if (period === "AM" && hours === 12) hours = 0;
    const date = new Date();
    date.setHours(hours);
    date.setMinutes(minutes + 60);
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", hour12: true });
  };

  return (
    <div className="bg-white rounded-xl md:max-w-[400px] mt-10 md:mt-0 text-left">
      <div className="flex flex-col gap-4">
        <div className="flex flex-row gap-4 mb-2">
          <div className="col-span-3 rounded-lg">
            <img src={Booking.image ? Booking.image : "https://as2.ftcdn.net/v2/jpg/04/75/12/25/1000_F_475122535_WQkfB8bbLLu7pTanatEAIDt4ppIYgRb8.jpg"} alt={Booking.name} className="rounded-xl w-36 h-36 min-w-36 min-h-36 object-cover object-top" />
          </div>

          <div className="flex flex-col">
            <h1 className="text-left text-sm md:text-lg text-RuqyaGray leading-tight" style={{ fontWeight: "900", color: "000000" }}>
              <span className="font-extrabold text-xl">{Booking.name}</span>
            </h1>
            <div className="flex flex-col mt-1">
              {Booking.country && (
                <p className="text-gray-600 flex items-center my-0.5">
                  {Booking.country ? <ReactCountryFlag countryCode={Booking.country} svg className="mr-2" /> : <FaGlobe className="mr-2 text-RuqyaGreen" />}
                  {getCountryLabel(Booking.country)}
                </p>
              )}
              <p className="text-gray-600 flex items-center my-1 text-xs rounded-md relative z-10">
                {Booking.languages ? (
                  Booking.languages.length > 2 ? (
                    <div className="md:w-36 w-[120px] overflow-hidden">
                      <div className="languages-scroll animate">
                        <div className="flex gap-1 md:gap-2 pr-4">
                          {Booking.languages.map((lang, index) => (
                            <span key={index} className="px-1 md:px-2 py-1 bg-[#F4D6AA99] rounded-md whitespace-nowrap flex-shrink-0 text-[11px] md:text-xs">
                              {getLanguageLabel(lang)}
                            </span>
                          ))}
                        </div>
                        <div className="flex gap-1 md:gap-2 pr-4">
                          {Booking.languages.map((lang, index) => (
                            <span key={`clone-${index}`} className="px-1 md:px-2 py-1 bg-[#F4D6AA99] rounded-md whitespace-nowrap flex-shrink-0 text-[11px] md:text-xs">
                              {getLanguageLabel(lang)}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="flex gap-1 md:gap-2">
                      {Booking.languages.map((lang, index) => (
                        <span key={index} className="px-1 md:px-2 py-1 bg-[#F4D6AA99] rounded-md whitespace-nowrap text-[11px] md:text-xs">
                          {getLanguageLabel(lang)}
                        </span>
                      ))}
                    </div>
                  )
                ) : (
                  <span className="px-2 md:px-4 py-1 bg-[#F4D6AA99] rounded-md text-[11px] md:text-xs">English</span>
                )}
              </p>
              
              {selectedDate && (
                <p className="text-gray-600 flex items-center my-1">
                  <FaCalendarAlt className="mr-2 text-RuqyaGreen" /> {formatDate(selectedDate)}
                </p>
              )}
              {selectedTime && (
                <p className="text-gray-600 flex items-center my-1">
                  <FaClock className="mr-2 text-RuqyaGreen" /> {selectedTime} - {addOneHourToTime(selectedTime)}
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingCard;
