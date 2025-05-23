"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import Grid from "@/components/ui/layout/GridForMyBooking";
import MyBookingCard from "@/components/cards/MyBookingCard";
import CompletedMyBookingCard from "@/components/cards/CompletedMyBookingCard";
import ReviewRaqiPopup from "@/components/ui/popup/ReviewRaqiPopup";
import { getMyBookings } from "@/lib/api";
import { ErrorMessage } from "@/components/shared/common/ErrorMessage";
import { parseBookingDate } from "@/lib/utils";
import LoadingSpinner from "@/components/shared/common/LoadingSpinner";
import {
  
  ArrowRight2,
  User,
  WaveSquare,
  MagicStar,
  Home,
  ArrowRight3,
  Component,
} from 'iconsax-react';
function MyBookings() {
  const [bookings, setBookings] = useState([]);
  const [showUpcoming, setShowUpcoming] = useState(true);
  const [error, setError] = useState(null);
  const [selectedBooking, setSelectedBooking] = useState(null);

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const data = await getMyBookings();
        setBookings(data);
      } catch (error) {
        console.error("Failed to fetch bookings:", error);
        setError("Failed to fetch bookings. Please try again later.");
      }
    };

    fetchBookings();
  }, []);

  const handleValueChange = (bookingId, meetingId) => {
    const booking = bookings.find((b) => b._id === bookingId && b.meetingId === meetingId);
    setSelectedBooking(booking);
  };

  const handleClosePopup = () => {
    setSelectedBooking(null);
  };

  const currentDate = new Date();
  const fourHoursInMs = 2 * 60 * 60 * 1000; // 2 hours in milliseconds

  const upcomingBookings = bookings.filter((booking) => {
    const bookingDate = parseBookingDate(booking.date);
    return bookingDate && bookingDate.getTime() + fourHoursInMs >= currentDate.getTime();
  });

  const completedBookings = bookings.filter((booking) => {
    const bookingDate = parseBookingDate(booking.date);
    return bookingDate && bookingDate.getTime() + fourHoursInMs < currentDate.getTime();
  });

  if (error) {
    return <ErrorMessage message={error} />;
  }

  if (!bookings) {
    return <LoadingSpinner />;
  }

  // if (bookings.length === 0) {
  //   return <p className="min-h-screen flex justify-center items-center text-black">No bookings found.</p>;
  // }

  return (
    <>
      <div className="" style={{ animationDelay: "0.8s" }}>
        {selectedBooking && <ReviewRaqiPopup raqiData={selectedBooking} onClose={handleClosePopup} />}
      </div>
    <div className="md:mx-[6%] px-3 py-5 md:pl-1 md:pr-3 min-h-screen bg-white relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 mb-20">
        {/* Responsive Breadcrumb */}
        <nav aria-label="Breadcrumb" className="mb-4 sm:mb-6 flex items-center text-xs sm:text-sm text-gray-600 animate-fade-in" style={{ animationDelay: "0.2s" }}>
          <Link href="/" className="flex items-center hover:text-RuqyaGreen transition-colors">
            <Home color="#6B7280" className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
            <span>Home</span>
          </Link>
          <ArrowRight2 color="#6B7280" className="w-3 h-3 sm:w-4 sm:h-4 mx-1 sm:mx-2" />
          <Link href="/MyProfile" className="flex items-center hover:text-RuqyaGreen transition-colors">
            <span>My Profile</span>
          </Link>
          <ArrowRight2 color="#6B7280" className="w-3 h-3 sm:w-4 sm:h-4 mx-1 sm:mx-2" />
          <span className="font-medium text-RuqyaGray">My Booking</span>
        </nav>

        <h1 className="text-3xl font-bold text-RuqyaGreen mb-6 animate-fade-in" style={{ animationDelay: "0.3s" }}>
          My Bookings
        </h1>
        <div className="flex justify-center mb-6 animate-fade-in" style={{ animationDelay: "0.4s" }}>
          <div className="bg-gray-200 p-2 rounded-lg flex">
            <button className={`px-4 py-2 mr-2 transition-colors duration-300 rounded-lg ${showUpcoming ? "bg-white text-black shadow-inner" : "bg-gray-200 text-black hover:shadow-lg shadow-inner"}`} onClick={() => setShowUpcoming(true)}>
              Upcoming Sessions
            </button>
            <button className={`px-4 py-2 transition-colors duration-300 rounded-lg ${!showUpcoming ? "bg-white text-black shadow-inner" : "bg-gray-200 text-black hover:shadow-lg shadow-inner"}`} onClick={() => setShowUpcoming(false)}>
              Completed Sessions
            </button>
          </div>
        </div>
        {showUpcoming && upcomingBookings.length > 0 && (
          <Grid className="animate-fade-in" style={{ animationDelay: "0.5s" }}>
            {upcomingBookings.map((booking, index) => (
              <MyBookingCard key={index} className="border drop-shadow-xl shadow-lg" booking={booking} />
            ))}
          </Grid>
        )}
        {!showUpcoming && completedBookings.length > 0 && (
          <Grid className="animate-fade-in" style={{ animationDelay: "0.6s" }}>
            {completedBookings.map((booking, index) => (
              <CompletedMyBookingCard className="border drop-shadow-xl shadow-lg" key={index} booking={booking} show={true} onValueChange={handleValueChange} />
            ))}
          </Grid>
        )}
        <div className="animate-fade-in" style={{ animationDelay: "0.7s" }}>
          {showUpcoming && upcomingBookings.length === 0 && <p className="flex w-full col-span-10 items-center justify-center text-center text-gray-500 font-xl mt-4">No upcoming bookings found.</p>}
          {!showUpcoming && completedBookings.length === 0 && <p className="flex w-full col-span-3 items-center justify-center text-center text-gray-500 font-xl mt-4">No completed bookings found.</p>}
        </div>
      </div>
      </div>
    </>
  );
}

export default MyBookings;
