"use client";
import React, { useEffect, useState } from "react";
import { FaGlobe, FaCalendarAlt, FaClock } from "react-icons/fa";
import ReactCountryFlag from "react-country-flag";
import Button from "@/components/ui/buttons/DefaultButton";
import { getUserProfile, getOwnProfile } from "@/lib/api";
import { getLanguageLabel, getCountryLabel, parseBookingDate } from "@/lib/utils";
import { useRouter } from "next/navigation";
import MyBookingCardSkeleton from "@/components/skeleton/MyBookingCardSkeleton";
import LoadingSpinner from "@/components/shared/common/LoadingSpinnerForCards";

const MyBookingCard = ({ booking, className }) => {
  const router = useRouter();
  const [rakiData, setRakiData] = useState(null);
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    async function fetchRakiData() {
      if (booking && booking.rakiId) {
        const rakiProfile = await getUserProfile(booking.rakiId);
        setRakiData(rakiProfile);
      }
      const data = await getOwnProfile();
      setUserData(data);
    }

    fetchRakiData();
  }, [booking]);

  if (!booking || !rakiData) {
    return null;
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
    const currentDate = new Date();
    const sessionDate = parseBookingDate(bookedDateTime);
    const timeDifference = sessionDate - currentDate;

    return timeDifference <= 3600000 && timeDifference > 0;
  };

  const isSessionActive = (bookedDateTime, duration) => {
    const currentDate = new Date();
    const sessionDate = parseBookingDate(bookedDateTime);
    return currentDate >= sessionDate && currentDate <= new Date(sessionDate.getTime() + duration * 60000);
  };

  const calculateTimeUntilSession = (bookedDateTime, duration) => {
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

  const bookedDateTime = booking.date;
  const bookedDuration = booking.bookedDuration || 60; // Assuming a default duration if not provided

  const formatTime = (date) => {
    return new Date(date).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", hour12: true });
  };

  const handleJoinMeeting = () => {
    router.push(`/Meeting/${booking.meetingId}/${userData._id}`);
  };

  if (!rakiData) {
    return (
      <div className={`bg-white rounded-xl mx-auto md:max-w-[450px] text-left p-2 mb-1 flex flex-col justify-between  w-full ${className}`}>
        <MyBookingCardSkeleton />
      </div>
    );
  }

  return (
    <div className={`bg-white rounded-xl w-full md:max-w-[450px] text-left p-2 mb-1 flex flex-col justify-between ${className}`}>
      <div className="flex flex-col gap-4 w-full">
        <div className="flex flex-row gap-4 w-full">
          <div className="col-span-2 rounded-lg">
            <img src={rakiData.image ? rakiData.image : "https://as2.ftcdn.net/v2/jpg/04/75/12/25/1000_F_475122535_WQkfB8bbLLu7pTanatEAIDt4ppIYgRb8.jpg"} alt={rakiData.name} className="rounded-xl w-48 h-32 object-cover object-top" />
          </div>

          <div className="flex flex-col w-full">
            <h1 className="text-left text-sm md:text-lg text-RuqyaGray leading-tight w-full" style={{ fontWeight: "900", color: "000000" }}>
              <span className="font-extrabold text-xl w-full">{rakiData.name}</span>
            </h1>
            <div className="grid grid-rows-3 mt-1 w-full">
              {rakiData.country && (
                <p className="text-gray-600 flex items-center my-1 w-full">
                  {rakiData.country ? <ReactCountryFlag countryCode={rakiData.country} svg className="mr-2 mb-1.5" /> : <FaGlobe className="mr-2  mb-1.5 text-RuqyaGreen" />}
                  {getCountryLabel(rakiData.country)}
                </p>
              )}
              <p className="text-gray-600 flex items-center my-1 w-full">
                <FaCalendarAlt className="mr-2 text-RuqyaGreen" /> {new Date(bookedDateTime).toLocaleDateString()}
              </p>
              <p className="text-gray-600 flex items-center my-1 w-full">
                <FaClock className="mr-2 text-RuqyaGreen" /> {formatTime(bookedDateTime)} - <br className="hidden" />
                {formatTime(new Date(new Date(bookedDateTime).getTime() + bookedDuration * 60000))}
              </p>
            </div>
          </div>
        </div>
        <div className="text-RuqyaGray text-left mb-2 ml-1 mt-auto">
          <p>{calculateTimeUntilSession(bookedDateTime, bookedDuration)}</p>
        </div>
      </div>
      {booking.meetingId &&  <Button text="Join Now" color="RuqyaGreen" bg={true} className="rounded-xl w-full" disabled={!isSessionWithinOneHour(bookedDateTime) &&   !isSessionActive(bookedDateTime, bookedDuration)} onClick={handleJoinMeeting} /> }
    </div>
  );
};

export default MyBookingCard;
