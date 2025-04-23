"use client";
import React, { useEffect, useState } from "react";
import { FaGlobe, FaCalendarAlt } from "react-icons/fa";
import ReactCountryFlag from "react-country-flag";
import Button from "@/components/ui/buttons/DefaultButton";
import ReviewRaqiPopup from "@/components/ui/popup/ReviewRaqiPopup";
import LoadingSpinner from "@/components/shared/common/LoadingSpinnerForCards";
import { getUserProfile } from "@/lib/api";
import { getLanguageLabel, getCountryLabel, parseBookingDate } from "@/lib/utils";
import MyBookingCardSkeleton from "@/components/skeleton/MyBookingCardSkeleton";

const CompletedMyBookingCard = ({ booking = {}, show = false, className, onValueChange }) => {
  const [showPopup, setShowPopup] = useState(false);
  const [rakiData, setRakiData] = useState(null);

  useEffect(() => {
    async function fetchRakiData() {
      if (booking && booking.rakiId) {
        const rakiProfile = await getUserProfile(booking.rakiId);
        setRakiData(rakiProfile);
      }
    }

    fetchRakiData();
  }, [booking]);

  const handleButtonClick = () => {
    if (onValueChange) {
      onValueChange(booking._id, booking.meetingId);
    }
    setShowPopup(true);
  };

  const isSessionWithinOneHour = (bookedDateTime) => {
    const currentDate = new Date();
    const sessionDate = parseBookingDate(bookedDateTime);
    const timeDifference = sessionDate - currentDate;

    return timeDifference <= 3600000 && timeDifference > 0;
  };

  const isSessionActive = (bookedDateTime) => {
    const currentDate = new Date();
    const sessionDate = parseBookingDate(bookedDateTime);
    return currentDate >= sessionDate && currentDate <= new Date(sessionDate.getTime() + 60 * 60000); // Assuming a default duration of 60 minutes
  };

  const canSetReview = (bookedDateTime) => {
    const currentDate = new Date();
    const sessionDate = parseBookingDate(bookedDateTime);
    return currentDate >= new Date(sessionDate.getTime() + 60 * 60000); // Allow review one hour after the session
  };

  const calculateTimeUntilSession = (bookedDateTime) => {
    const currentDate = new Date();
    const sessionDate = parseBookingDate(bookedDateTime);
    const timeDifference = sessionDate - currentDate;

    if (isSessionActive(bookedDateTime)) {
      return "Ongoing";
    }

    if (timeDifference <= 0) {
      const completedDate = new Date(sessionDate.getTime() + 60 * 60000); // Assuming a default duration of 60 minutes
      const daysSinceCompletion = Math.floor((currentDate - completedDate) / (1000 * 60 * 60 * 24));

      if (daysSinceCompletion < 7) {
        const dayOfWeek = completedDate.toLocaleDateString("en-US", { weekday: "long" });
        return `Completed on  ${`Last ` + dayOfWeek}`;
      } else {
        return `Completed on ${completedDate.toLocaleDateString()}`;
      }
    }

    const days = Math.floor(timeDifference / (1000 * 60 * 60 * 24));
    const hours = Math.floor((timeDifference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((timeDifference % (1000 * 60 * 60)) / (1000 * 60));

    let timeString = "";
    if (days > 0) timeString += `${days} Days `;
    if (hours > 0) timeString += `${hours} Hours `;
    if (minutes > 0) timeString += `${minutes} Mins `;
    timeString += "More...";

    return timeString;
  };

  if (!rakiData) {
    return (
      <div className={`bg-white rounded-xl mx-auto md:max-w-[450px] text-left p-2 mb-1 flex flex-col justify-between  w-full ${className}`}>
        <MyBookingCardSkeleton />
      </div>
    );
  }

  return (
    <div className={`bg-white rounded-xl  mx-auto md:max-w-[450px] text-left p-2 mb-1 flex flex-col justify-between  w-full ${className}`}>
      <div className="flex flex-col gap-4">
        <div className="flex flex-row gap-4 mb-0">
          <div className="col-span-3 rounded-lg">
            <img src={rakiData?.image ? rakiData.image : "https://as2.ftcdn.net/v2/jpg/04/75/12/25/1000_F_475122535_WQkfB8bbLLu7pTanatEAIDt4ppIYgRb8.jpg"} alt={rakiData?.name} className="rounded-xl w-36 h-36 object-cover object-top" />
          </div>

          <div className="flex flex-col">
            <h1 className="text-left text-sm md:text-lg text-RuqyaGray leading-tight" style={{ fontWeight: "900", color: "000000" }}>
              <span className="font-extrabold text-xl">{rakiData?.name || " "}</span>
            </h1>
            <div className="flex flex-col mt-1">
              {rakiData?.country && (
                <p className="text-gray-600 flex items-center my-0.5">
                  {rakiData.country ? <ReactCountryFlag countryCode={rakiData.country} svg className="mr-2 mb-1.5" /> : <FaGlobe className="mr-2 text-RuqyaGreen mb-1.5" />}
                  {getCountryLabel(rakiData.country)}
                </p>
              )}
              <p className="text-gray-600 flex items-center my-1 text-xs rounded-md relative z-10">
                {rakiData?.languages ? (
                  rakiData.languages.length > 2 ? (
                    <div className="w-[155px] overflow-hidden">
                      <div className="languages-scroll animate">
                        <div className="flex gap-2 pr-4">
                          {rakiData.languages.map((lang, index) => (
                            <span key={index} className="px-2 py-1 bg-[#F4D6AA99] rounded-md whitespace-nowrap flex-shrink-0">
                              {getLanguageLabel(lang)}
                            </span>
                          ))}
                        </div>
                        <div className="flex gap-2 pr-4">
                          {rakiData.languages.map((lang, index) => (
                            <span key={`clone-${index}`} className="px-2 py-1 bg-[#F4D6AA99] rounded-md whitespace-nowrap flex-shrink-0">
                              {getLanguageLabel(lang)}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="flex gap-2">
                      {rakiData.languages.map((lang, index) => (
                        <span key={index} className="px-2 py-1 bg-[#F4D6AA99] rounded-md whitespace-nowrap">
                          {getLanguageLabel(lang)}
                        </span>
                      ))}
                    </div>
                  )
                ) : (
                  <span className="px-4 py-1 bg-[#F4D6AA99] rounded-md">English</span>
                )}
              </p>
              <p className="text-gray-600 flex items-center my-2">
                <FaCalendarAlt className="mr-2 text-RuqyaGreen mb-1.5" /> <div className="">{calculateTimeUntilSession(booking.date)}</div>
              </p>
            </div>
          </div>
        </div>
      </div>
      {show && <Button text="Add a Review" color="RuqyaGreen" bg={true} className="rounded-xl mt-3" disabled={!canSetReview(booking.date)} onClick={handleButtonClick} />}
    </div>
  );
};

export default CompletedMyBookingCard;
