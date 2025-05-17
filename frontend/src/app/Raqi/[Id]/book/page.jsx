"use client";
import React, { useState, useEffect, useRef } from "react";
import { useRouter, useParams } from "next/navigation";
import Button from "@/components/ui/buttons/DefaultButton";
import BookingCard from "@/components/cards/BookingCard";
import { ErrorMessage } from "@/components/shared/common/ErrorMessage";
import {addSession, checkoutSession, getRakiAvailability, getUserProfile, setRakiAvailability} from "@/lib/api";

const BookSessionPage = () => {
  const router = useRouter();
  const params = useParams();
  const Id = params.Id;
  const [selectedDate, setSelectedDate] = useState(null); // Changed from new Date() to null
  const [selectedTime, setSelectedTime] = useState("");
  const [rakiData, setRakiData] = useState(null);
  // const [sessionType, setSessionType] = useState("Standard");
  const [errors, setErrors] = useState({});
  const dateRef = useRef(null);
  const timeRef = useRef(null);
  const bookingRef = useRef(null);
  const [errorMessage, setErrorMessage] = useState("");
  const [showError, setShowError] = useState(false);
  const [availableTimes, setAvailableTimes] = useState([]);
  const [loading, setLoading] = useState(false); // Add loading state

  useEffect(() => {
    if (Id) {
      console.log("ID:", Id);
      const fetchUserProfile = async () => {
        try {
          const userProfile = await getUserProfile(Id);
          setRakiData(userProfile);
        } catch (error) {
          showError("Error fetching user profile:", error);
          console.error("Error fetching user profile:", error);
        }
      };
      fetchUserProfile();
    }
  }, [Id]);

  useEffect(() => {
    const upcomingDates = getUpcomingDates();
    if (upcomingDates.length > 0) {
      handleDateChange(upcomingDates[0]); // Auto-click the first date
    }
  }, []);

  useEffect(() => {
    // Clear error message after 3 seconds
    if (showError) {
      const timer = setTimeout(() => {
        setShowError(false);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [showError]);

  useEffect(() => {
    const fetchAvailability = async () => {
      if (selectedDate) {
        setLoading(true); // Start loading
        try {
          const response = await getRakiAvailability(Id, getLocalFormattedDate(selectedDate));
          
          // Check if response is valid and has data
          if (!response || response.message === "No availability found" || !Array.isArray(response)) {
            setAvailableTimes([]); 
          } else {
            // Only map if response is an array
            setAvailableTimes(response
                .filter(slot => slot.isAvailable)
                .map(slot => slot.startTime)
                .sort((a, b) => new Date(`1970-01-01T${a}:00Z`) - new Date(`1970-01-01T${b}:00Z`))
            );          
          }
        } catch (error) {
          console.error("Error fetching availability:", error);
          setAvailableTimes([]);  
        } finally {
          setLoading(false); // End loading
        }
      } else {
        setAvailableTimes([]);
      }
    };

    fetchAvailability();
  }, [selectedDate, Id]);

  const handleDateChange = (date) => {
    console.log(date)
    setSelectedDate(date);
    setSelectedTime("");
    setAvailableTimes([]); 
  };

  const handleTimeChange = (event) => {
    setSelectedTime(event.target.value);
  };

  // const handleSessionTypeChange = (event) => {
  //   setSessionType(event.target.value);
  // };

  const scrollToRef = (ref) => {
    if (window.innerWidth <= 768) {
      setTimeout(() => {
        const yOffset = -100; // Adjust this value to control the scroll position
        const element = ref.current;
        const y = element.getBoundingClientRect().top + window.pageYOffset + yOffset;
        
        window.scrollTo({
          top: y,
          behavior: 'smooth'
        });
      }, 100);
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!selectedDate) {
      newErrors.date = "Date is required";
      setErrorMessage("Please select a date");
      setShowError(true);
      scrollToRef(dateRef);
      return false;
    }
    if (!selectedTime) {
      newErrors.time = "Time is required";
      setErrorMessage("Please select a time");
      setShowError(true);
      scrollToRef(timeRef);
      return false;
    }

    console.log("Have fun",selectedDate,new Date())

    if (selectedDate) {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const selected = new Date(selectedDate);
      selected.setHours(0, 0, 0, 0);

      if (selected < today) {
        newErrors.date = "Date must be in the future";
        setErrorMessage("Date must be in the future");
        setShowError(true);
        scrollToRef(dateRef);
        return false;
      }
    }


    setErrors(newErrors);
    setShowError(false);
    return true;
  };

  const formatTime = (selectedTime) => {
    let [time, modifier] = selectedTime.split(' ');
    let [hours, minutes] = time.split(':');

    if (modifier === 'PM' && hours !== '12') {
      hours = String(Number(hours) + 12);
    } else if (modifier === 'AM' && hours === '12') {
      hours = '00';
    }

    return `${hours.padStart(2, '0')}:${minutes}:00`;
  };

  const getLocalFormattedDate = (date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const handleButtonClick = async () => {
    if (!validateForm()) return;
    try {
      const formattedDate = getLocalFormattedDate(selectedDate);
      const formattedTime = formatTime(selectedTime);
      const finalDateTime = `${formattedDate} ${formattedTime}`;
      const sessionIdentifier = `${rakiData.name}'s Session`;


      const meetingResponse = await addSession(sessionIdentifier, finalDateTime, rakiData._id);

      const { email: rakiEmail, name: rakiName } = meetingResponse.raki;
      const { email: userEmail, name: userName } = meetingResponse.user;


      const sessionResponse = await checkoutSession(sessionIdentifier, finalDateTime, rakiData._id,rakiEmail,rakiName,userEmail,userName);

      if (sessionResponse?.url) {
        window.location.href = sessionResponse.url;
      } else {
        console.error("Invalid session response:", sessionResponse);
      }
    } catch (error) {
      console.error("Error booking session:", error);
      router.push(`/Raqi/${Id}/book/failed`);
    }
  };

  const getUpcomingDates = () => {
    const dates = [];
    const today = new Date();
    for (let i = 0; i < 7; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      dates.push(date);
    }
    return dates;
  };

  const getAvailableTimes = () => {
    if (availableTimes.length === 0) {
      return ["No available time slots"];
    }
    return availableTimes.map(time => {
      const [hour, minute] = time.split(":");
      const hourInt = parseInt(hour, 10);
      const ampm = hourInt >= 12 ? "PM" : "AM";
      const formattedHour = hourInt % 12 || 12;
      const formattedMinute = minute ? minute.padStart(2, '0') : '00';
      return `${formattedHour}:${formattedMinute} ${ampm}`;
    });
  };

  const LoadingDots = () => (
    <div className="flex justify-center items-center mt-4">
      <div className="dot bg-RuqyaGreen"></div>
      <div className="dot bg-RuqyaGreen"></div>
      <div className="dot bg-RuqyaGreen"></div>
      <style jsx>{`
        .dot {
          width: 8px;
          height: 8px;
          margin: 0 4px;
          border-radius: 50%;
          animation: dot-blink 1s infinite;
        }
        .dot:nth-child(1) {
          animation-delay: 0s;
        }
        .dot:nth-child(2) {
          animation-delay: 0.2s;
        }
        .dot:nth-child(3) {
          animation-delay: 0.4s;
        }
        @keyframes dot-blink {
          0%, 100% {
            opacity: 0.2;
          }
          50% {
            opacity: 1;
          }
        }
      `}</style>
    </div>
  );

return (
  <div className="bg-white min-h-screen py-8 px-4 mt-5">
    <div className="max-w-6xl mx-auto">
      {showError && (
        <div className="fixed top-0 left-0 right-0 z-50">
          <ErrorMessage message={errorMessage} />
        </div>
      )}
      
      <div className="flex flex-col md:flex-row gap-6">
        {/* Left Column - Booking Form */}
        <div className="w-full md:w-2/3 bg-white rounded-2xl shadow-xl overflow-hidden">
          {/* Header with gradient background */}
          <div className="bg-RuqyaGreen p-6 text-white">
            <h1 className="text-3xl">Book Your Ruqyah Session</h1>
            <p className="mt-1">Select your preferred date & time below</p>
          </div>
          
          <form className="p-6 space-y-8">
            {/* Date Selection */}
            <div ref={dateRef} className="space-y-3">
              <div className="flex items-center">
                <label className="text-RuqyaGray font-semibold text-lg">Select Date</label>
              </div>
              
              <div className="mt-3 grid grid-cols-3 sm:grid-cols-4 md:grid-cols-7 gap-2">
                {getUpcomingDates().map((date, index) => (
                  <div 
                    key={index} 
                    className={`py-3 px-1 border rounded-xl cursor-pointer text-center transition-all duration-200 hover:shadow-md ${
                      selectedDate && selectedDate.toDateString() === date.toDateString() 
                        ? "bg-RuqyaGreen text-white border-RuqyaGreen shadow-md" 
                        : "bg-white border-gray-200 hover:border-RuqyaGreen"
                    }`} 
                    onClick={() => handleDateChange(date)}
                  >
                    <p className="text-xs mb-1">{date.toLocaleDateString("en-US", { weekday: "short" })}</p>
                    <p className="text-lg ">{date.getDate()}</p>
                    <p className="text-xs">{date.toLocaleDateString("en-US", { month: "short" })}</p>
                  </div>
                ))}
              </div>
              {errors.date && <p className="text-red-500 text-sm">{errors.date}</p>}
            </div>
            
            {/* Time Selection */}
            <div ref={timeRef} className="space-y-3">
              <div className="flex items-center">
                <label className="text-RuqyaGray font-semibold text-lg">Select Time</label>
              </div>
              
              {loading ? (
                <div className="flex justify-center py-10">
                  <LoadingDots />
                </div>
              ) : (
                <div className="mt-3 grid grid-cols-3 md:grid-cols-4 gap-3">
                  {getAvailableTimes().map((time, index) => (
                    <div 
                      key={index} 
                      className={`py-3 px-2 border rounded-xl text-center transition-all duration-200 ${
                        time === "No available time slots" 
                          ? "bg-RuqyaLightPurple text-gray-500 cursor-not-allowed col-span-3 md:col-span-4" 
                          : `cursor-pointer hover:shadow-md ${
                              selectedTime === time 
                                ? "bg-RuqyaGreen text-white border-RuqyaGreen shadow-md" 
                                : "bg-white border-gray-200 hover:border-RuqyaGreen"
                            }`
                      }`}
                      onClick={() => time !== "No available time slots" && handleTimeChange({ target: { value: time } })}
                    >
                      <span className="">{time}</span>
                    </div>
                  ))}
                </div>
              )}
              {errors.time && <p className="text-red-500 text-sm">{errors.time}</p>}
            </div>
          </form>
        </div>
        
        {/* Right Column - Booking Summary */}
        <div className="w-full md:w-1/3" ref={bookingRef}>
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
            <div className="bg-RuqyaGray p-6 text-white">
              <h3 className="text-2xl ">Session Summary</h3>
              <p className="text-sm opacity-80 mt-1">Review your booking details</p>
            </div>
            
            <div className="p-6">
              {rakiData ? (
                <>
                  <div className="bg-RuqyaLightPurple/30 p-4 rounded-xl mb-6">
                    <BookingCard Booking={rakiData} selectedDate={selectedDate} selectedTime={selectedTime} />
                  </div>
                  
                  <div className="pt-4 border-t border-gray-200">
                    <Button 
                      text="Confirm Booking" 
                      color="white" 
                      bg={true} 
                      className="bg-RuqyaGreen rounded-xl py-2 w-full text-lg transition-all duration-200" 
                      onClick={handleButtonClick} 
                    />
                  </div>
                </>
              ) : (
                <div className="flex flex-col items-center justify-center py-10">
                  <div className="w-16 h-16 rounded-full bg-RuqyaLightPurple flex items-center justify-center mb-4">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-8 h-8 text-RuqyaGray">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <p className="text-RuqyaGray ">Select a date and time to continue</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
);
};

export default BookSessionPage;
