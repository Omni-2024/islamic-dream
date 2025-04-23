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
    <div className="mx-[9%] py-4 min-h-screen flex flex-col md:flex-row relative">
      {showError && <div className="fixed top-0 left-0 right-0 z-50">
        <ErrorMessage message={errorMessage} />
      </div>}
      <div className="w-full border border-gray-300 rounded-lg shadow-lg p-4 order-1">
        <div className="mb-4 border-b pb-4">
          <h1 className="text-2xl font-bold ">Book Your Ruqyah Session</h1>
          <p>Choose your preferred date & time.</p>
        </div>
        <form className="space-y-4">
          {/* <div>
            <label className="block text-gray-700">Session Type</label>
            <select value={sessionType} onChange={handleSessionTypeChange} className="mt-3 p-3 block w-full bg-LightGray border border-gray-300 rounded-md shadow-sm focus:ring-RuqyaGreen focus:border-RuqyaGreen text-sm md:text-md appearance-none">
              <option value="Standard">Standard</option>
              <option value="Premium">Premium</option>
              <option value="VIP">VIP</option>
            </select>
          </div> */}
          <div ref={dateRef}>
            <label className="block text-gray-700">Select Date:</label>
            <div className="mt-3 grid grid-cols-3 md:flex gap-2 overflow-x-auto w-full place-items-center">
              {getUpcomingDates().map((date, index) => (
                <div key={index} className={`flex-1 p-3 mt-2 border rounded-md cursor-pointer text-center w-full ${selectedDate && selectedDate.toDateString() === date.toDateString() ? "bg-RuqyaGreen text-white" : "bg-LightGray"}`} onClick={() => handleDateChange(date)}>
                  {date.getDate()} {date.toLocaleDateString("en-US", { weekday: "short" })}
                </div>
              ))}
            </div>
            {errors.date && <p className="text-red-500 text-sm">{errors.date}</p>}
          </div>
          <div ref={timeRef}>
            <label className="block text-gray-700 mt-14">Select Time:</label>
            {loading ? (
              <LoadingDots />
            ) : (
              <div className="mt-3 grid grid-cols-3 md:grid-cols-4 gap-2 place-items-center">
                {getAvailableTimes().map((time, index) => (
                  <div 
                    key={index} 
                    className={`p-3 border rounded-md text-center mt-2 w-full ${
                      time === "No available time slots" 
                        ? "bg-gray-200 text-gray-500 cursor-not-allowed col-span-3 md:col-span-4" 
                        : `cursor-pointer ${selectedTime === time ? "bg-RuqyaGreen text-white" : "bg-LightGray"}`
                    }`}
                    onClick={() => time !== "No available time slots" && handleTimeChange({ target: { value: time } })}
                  >
                    {time}
                  </div>
                ))}
              </div>
            )}
            {errors.time && <p className="text-red-500 text-sm">{errors.time}</p>}
          </div>
        </form>
      </div>



      <div className="w-full md:w-1/2 md:mx-5 order-2 mt-10 md:mt-0 max-w-[450px]" ref={bookingRef}>
        <div className="border border-gray-300 rounded-lg shadow-lg p-4">
          <h3 className="border-b mb-3 pb-5 text-2xl">Summary</h3>
          {rakiData ? (
            <>
              <BookingCard Booking={rakiData} selectedDate={selectedDate} selectedTime={selectedTime} />
              <Button text="Book a Session" color="RuqyaGreen" bg={true} className="rounded-xl py-3 mt-4 w-full" onClick={handleButtonClick} />
            </>
          ) : (
            <p>No booking data available.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default BookSessionPage;
