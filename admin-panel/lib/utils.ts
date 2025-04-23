import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import {format} from "date-fns";
import {countries, languages} from "@/lib/constance";


export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const getUserTimeZone = (): string => {
  return Intl.DateTimeFormat().resolvedOptions().timeZone;
};

export  const formatDateTimeWithOffset = (date: Date | undefined): string | undefined => {
  if (!date) return undefined;
  const timezoneOffset = -date.getTimezoneOffset();
  const offsetHours = String(Math.floor(Math.abs(timezoneOffset) / 60)).padStart(2, '0');
  const offsetMinutes = String(Math.abs(timezoneOffset) % 60).padStart(2, '0');
  const offsetSign = timezoneOffset >= 0 ? '+' : '-';

  return `${format(date, 'yyyy-MM-dd HH:mm:ss')}${offsetSign}${offsetHours}:${offsetMinutes}`;
};

export const getLanguageLabel = (code:string) => {
  if (!code) return code;
  const language = languages.find((lang) => lang.value === code.toLowerCase());
  return language ? language.label : code;
};

export const getCountryLabel = (code:string) => {
  if (!code) return "Unknown";
  const country = countries.find((c) => c.value === code.toLowerCase());
  return country ? country.label : code;
};


export const getNameById = (id: string, data: any[], idKey: string, nameKey: string) => {
  const item = data.find((item) => item[idKey] === id);
  return item ? item[nameKey] : null;
};