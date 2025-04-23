import React from 'react';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { FaCalendarAlt } from "react-icons/fa";

export const Input = ({ type, placeholder, name, className, value, onChange }) => {
  return (
    <input
      type={type}
      placeholder={placeholder}
      name={name}
      className={`rounded w-full text-sm p-2 focus:outline-none ${className}`}
      value={value}
      onChange={onChange}
    />
  );
};

export const BorderInput = ({ label, type, name, placeholder, className, value, onChange }) => {
  return (
      <div className="relative mb-4">
      <label className="text-sm text-gray-600 absolute -top-3 left-8 bg-white px-1">{label}</label>
      <div className="flex justify-center items-center rounded-full border px-2 py-1 pl-6  border-teal-500 focus:ring-teal-500">
        <Input type={type} name={name} placeholder={placeholder} className={className} value={value} onChange={onChange} />
      </div>
    </div>
  )
}

export const DateInput = ({ selected, onChange, placeholderText, max, min }) => {
  const CustomInput = ({ value, onClick }) => (
    <div className="relative">
      <input
        type="text"
        value={value}
        onClick={onClick}
        {...(max && { max })}
        {...(min && { min })}
        readOnly
        className="w-full rounded-md border border-gray-300 text-sm p-2 pl-10 focus:border-primary focus:ring-primary cursor-pointer bg-white"
        placeholder="Select date"
      />
      <FaCalendarAlt className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
    </div>
  );

  return (
    <DatePicker
      selected={selected}
      onChange={onChange}
      customInput={<CustomInput />}
      dateFormat="MMMM d, yyyy"
      isClearable={true}
      placeholderText={placeholderText}
      className="w-full text-sm"
      calendarClassName="custom-datepicker"
      wrapperClassName="w-full relative"
      popperClassName="custom-popper"
      popperPlacement="bottom-start"
      showPopperArrow={false}
      minDate={min}
      maxDate={max}
    />
  );
};


