'use client';
import React from "react";
import Link from "next/link";
import { ArrowRight } from 'iconsax-react';
import MyBookingCard from "@/components/cards/MyBookingCard";
import ResponsiveGrid from "@/components/ui/layout/ResponsiveGrid";

function Third(props) {
  const { raqiData } = props;

  if (!raqiData) {
    return null;
  }

  return (
      <section className="mb-5  bg-gradient-to-br from-slate-50 to-gray-100 relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-20 left-10 w-32 h-32 bg-RuqyaGreen rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-10 w-40 h-40 bg-RuqyaLightGreen rounded-full blur-3xl"></div>
      </div>

      <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Section */}
        <div className="text-center mb-5 animate-fade-in" style={{ animationDelay: '0.1s' }}>
          <h2 className="text-3xl text-RuqyaGreen md:text-4xl pt-5 lg:text-5xl font-bold text-center leading-tight mb-2 transition-all duration-700 delay-100">
            My Bookings
          </h2>
          <p className="text-gray-600  text-lg max-w-2xl mx-auto">
            Manage your upcoming sessions and track your spiritual journey
          </p>
        </div>

        {/* Simple Header with View All Link */}
        <div className="flex justify-between items-center mb-8 animate-fade-in" style={{ animationDelay: '0.2s' }}>
          <div></div>
          {raqiData.length > 3 && (
            <Link 
              href="/MyBookings" 
              className="inline-flex items-center text-RuqyaLightGreen hover:text-RuqyaDarkGreen  transition-colors duration-200"
            >
              See all 
              <ArrowRight size={20} className="inline mb-1"  color="currentColor" variant="Outline"/>
            </Link>
          )}
        </div>

        {/* Bookings Grid */}
        <div className="animate-fade-in">
          <div className="bg-RuqyaGray/10 rounded-2xl shadow-xl border border-gray-100 p-6 md:p-8">
            <ResponsiveGrid 
              data={raqiData.slice(0, 6)} 
              breakpoints={{ 
                mobile: 1, 
                ipad: 2, 
                'ipad-landscape': 2, 
                lg: 2, 
                xl: 3, 
                '2xl': 3, 
                '3xl': 4, 
                '4xl': 4, 
                '5xl': 5 
              }}
              className="gap-6"
            >
              {(data) => (
                <div className=" ">
                  <MyBookingCard key={data._id} booking={data} />
                </div>
              )}
            </ResponsiveGrid>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Third;
