'use client'
import { clsx, ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { format } from "date-fns";
import { languages, countries } from "@/lib/constance";

// export function cn(...inputs: ClassValue[]) {
//   return twMerge(clsx(inputs))
// }

export function cn(...classes) {
  return classes.filter(Boolean).join(" ");
}

export const getUserTimeZone = () => {
  return Intl.DateTimeFormat().resolvedOptions().timeZone;
};

export const getLanguageLabel = (code) => {
  if (!code) return "Unknown";
  const language = languages.find((lang) => lang.value === code.toLowerCase());
  return language ? language.label : code;
};

export const getCountryLabel = (code) => {
  if (!code) return "Unknown";
  const country = countries.find((c) => c.value === code.toLowerCase());
  return country ? country.label : code;
};

export const formatDateTimeWithOffset = (date) => {
  if (!date) return undefined;
  const timezoneOffset = -date.getTimezoneOffset();
  const offsetHours = String(Math.floor(Math.abs(timezoneOffset) / 60)).padStart(2, "0");
  const offsetMinutes = String(Math.abs(timezoneOffset) % 60).padStart(2, "0");
  const offsetSign = timezoneOffset >= 0 ? "+" : "-";

  return `${format(date, "yyyy-MM-dd HH:mm:ss")}${offsetSign}${offsetHours}:${offsetMinutes}`;
};

export const parseBookingDate = (dateString) => {
  if (!dateString) return null;
  return new Date(dateString.replace(" ", "T"));
};

export const sortBookingsByDate = (bookings) => {
  if (!bookings) return [];
  return [...bookings].sort((a, b) => {
    const dateA = parseBookingDate(a.date);
    const dateB = parseBookingDate(b.date);
    return dateA - dateB;
  });
};

export const removeOldBookings = (bookings) => {
  if (!bookings) return [];
  const now = new Date();
  return bookings.filter(booking => {
    const bookingDate = parseBookingDate(booking.date);
    return bookingDate >= now;
  });
};
