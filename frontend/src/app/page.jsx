'use client'
import { useState, useEffect } from "react";
import '@/styles/globals.css';
import {getRakis,getMyBookings} from "@/lib/api"
import { sortBookingsByDate , removeOldBookings } from "@/lib/utils";


import First from "@/components/ui/home/First";
import Search from "@/components/ui/home/Search";
import Second from "@/components/ui/home/Second";
import Third from "@/components/ui/home/Third";
import Forth from "@/components/ui/home/Forth";
import Fifth from "@/components/ui/home/Fifth";

import LoadingSpinner from "@/components/shared/common/LoadingSpinner";


export default function Home() {
  const [raqiData, setRaqiData] = useState();
  const [myBookings, setMyBookings] = useState();

  useEffect(() => {
    async function fetchRakis() {
      const rakis = await getRakis();
      setRaqiData(rakis);

      const bookings = await getMyBookings();
      const sortedAndFilteredBookings = removeOldBookings(sortBookingsByDate(bookings));
      setMyBookings(sortedAndFilteredBookings);
    }

    fetchRakis();
  }, []);

  // if (!raqiData && !myBookings) {
  //   return <LoadingSpinner />;
  // }

  return (
    <div className="bg-white color-header min-h-screen text-center md:text-left">
      <First className="animate-fade-in" style={{ animationDelay: '0.1s' }} />
      <Search className="animate-fade-in" style={{ animationDelay: '0.3s' }} />
      <Second className="animate-fade-in" style={{ animationDelay: '0.4s' }} />
      {myBookings && myBookings.length !== 0 && <Third raqiData={myBookings} className="animate-fade-in" style={{ animationDelay: '0.5s' }} />}
      {raqiData && <Forth  raqiData={raqiData} title="Meet Our Expert Interpreters" className=" animate-fade-in" style={{ animationDelay: '0.6s' }} />}
      <Fifth className="animate-fade-in" style={{ animationDelay: '0.6s' }}/>
    </div>
  );
}
