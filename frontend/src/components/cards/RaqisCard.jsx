"use client";

import Link from "next/link";
import { useState } from "react";
import { FaStar, FaGlobe, FaRegCalendarAlt, FaTwitter, FaInstagram, FaFacebookF, FaDribbble } from "react-icons/fa";
import ReactCountryFlag from "react-country-flag";
import { languages, countries } from "@/lib/constance";

export default function RaqisCard({ raqi }) {
  const [isHovered, setIsHovered] = useState(false);

  if (!raqi) {
    return null;
  }

  function formatRating(rating) {
    return rating.toFixed(1);
  }

  function getLanguageLabel(code) {
    if (!code) return "Unknown";
    const language = languages.find((lang) => lang.value === code.toLowerCase());
    return language ? language.label : code;
  }

  function getCountryLabel(code) {
    if (!code) return "Unknown";
    const country = countries.find((c) => c.value === code.toLowerCase());
    return country ? country.label : code;
  }

  const { name, country: CountryCode, languages: Languages, yearOfExperience: Experience, _id: id, averageRating } = raqi;
  const displayImage = "https://as2.ftcdn.net/v2/jpg/04/75/12/25/1000_F_475122535_WQkfB8bbLLu7pTanatEAIDt4ppIYgRb8.jpg";
  const countryLabel = getCountryLabel(CountryCode);

  // Social media icons - would come from raqi data in real implementation
  const socialLinks = [
    { icon: <FaDribbble className="text-gray-400 hover:text-RuqyaGreen transition-colors" />, url: "#" },
    { icon: <FaTwitter className="text-gray-400 hover:text-RuqyaGreen transition-colors" />, url: "#" },
    { icon: <FaFacebookF className="text-gray-400 hover:text-RuqyaGreen transition-colors" />, url: "#" },
    { icon: <FaInstagram className="text-gray-400 hover:text-RuqyaGreen transition-colors" />, url: "#" },
  ];

  return (
    <div 
      className="relative w-full max-w-sm mx-auto h-[480px]" /* Fixed height added here */
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Card with round corners and gradient background */}
      <div className="relative rounded-3xl shadow-lg bg-white overflow-hidden h-full flex flex-col">
        {/* Curved gradient background - matching the colorful wave shape */}
        <div className="absolute top-0 left-0 right-0 h-40 bg-gradient-to-r from-RuqyaLightPurple via-RuqyaGreen/40 to-RuqyaLightPurple/70">
          {/* Adding the wave effect at bottom of the gradient */}
          <div className="absolute bottom-0 left-0 right-0 h-12 bg-white rounded-t-[100%]"></div>
        </div>

        {/* Rating badge - added from first design */}
        <div className="absolute top-4 right-4 flex items-center justify-center z-20">
          <div className="bg-white rounded-full px-3 py-1 shadow-md flex items-center gap-1 border border-gray-100">
            <FaStar className="text-RuqyaGreen" />
            <p className="font-semibold">{averageRating ? formatRating(averageRating) : "0.0"}</p>
          </div>
        </div>

        {/* Card content */}
        <div className="relative pt-24 pb-6 px-6 z-10 flex-1 flex flex-col">
          {/* Profile image - positioned to overlap with the gradient */}
          <div className="absolute top-8 left-1/2 transform -translate-x-1/2">
            <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-white shadow-md" style={{backgroundColor: "#a8d5e5"}}>
              <img 
                src={displayImage} 
                alt={name}
                className="w-full h-full object-cover"
              />
            </div>
          </div>
          
          {/* Content below the image */}
          <div className="flex flex-col items-center mt-14 flex-1">
            {/* Name */}
            <h2 className="text-xl font-bold text-RuqyaGray mb-2">{name}</h2>
            
            {/* Country indicator with flag - from first design */}
            <div className="flex items-center gap-2 mb-4">
              {CountryCode ? (
                <ReactCountryFlag countryCode={CountryCode} svg className="w-5 h-5" />
              ) : (
                <FaGlobe className="text-RuqyaGray w-5 h-5" />
              )}
              <span className="text-gray-600 text-sm">{countryLabel}</span>
            </div>
            
            {/* Info section with clean design - from first design */}
            <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 mb-auto w-full flex-1">
              <div className="grid gap-3 h-full">
                {/* Languages */}
                <div className="pb-0 border-b border-gray-100">
                  <span className="text-sm text-gray-500 mb-2 block">Languages</span>
                  <div className="flex flex-wrap gap-2">
                    {Languages && Languages.length > 0 ? (
                      Languages.map((lang, index) => (
                        <span 
                          key={index} 
                          className="px-2 py-1 bg-RuqyaLightPurple text-RuqyaGreen rounded-full text-sm whitespace-nowrap"
                        >
                          {getLanguageLabel(lang)}
                        </span>
                      ))
                    ) : (
                      <span className="px-3 py-1 bg-RuqyaLightPurple/20 text-RuqyaGreen rounded-full text-sm">English</span>
                    )}
                  </div>
                </div>
                
                {/* Experience - in a row as requested */}
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-500 mt-0">Experience</span>
                  <span className="mt-0 px-3 py-0 bg-gray-100 text-RuqyaGray rounded-full text-sm font-medium">
                    {Experience ? `${Experience} Year${Experience > 1 ? "s" : ""}` : "Not Available"}
                  </span>
                </div>
              </div>
            </div>

            {/* Book Now button with calendar icon */}
            <Link 
              href={id ? "/Raqi/" + id : "#"} 
              className="relative block w-full py-3 rounded-xl text-center font-semibold text-white bg-RuqyaGreen shadow-md transition-all duration-300 hover:shadow-lg mt-4"
            >
              <div className={`absolute inset-0 bg-black opacity-0 transition-opacity duration-300 ${
                isHovered ? "opacity-10" : ""
              }`}></div>
              
              <span className="relative flex items-center justify-center gap-2">
                <FaRegCalendarAlt />
                Book Now
              </span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}