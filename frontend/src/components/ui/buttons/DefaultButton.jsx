'use client'
import React from "react";
import { useRouter } from "next/navigation";

function Button (props) {
  const { text, link, disabled = false, type, bg, color, className, children, onClick } = props;
  const router = useRouter();

  const handleClick = (e) => {
    if (disabled) {
      e.preventDefault();
      return;
    }
    if (onClick) onClick(e);
    if (link) router.push(link);
  };

  const setting = disabled 
    ? "border border-[#36454F] text-[#36454F] opacity-50 cursor-not-allowed" 
    : bg 
      ? `bg-RuqyaGreen text-white hover:bg-teal-700`   //Note: Dynamic button color changes is remove due to some reaso it not working
      : "";
// border border-[#36454F] text-[#36454F]
  return (
    <button onClick={handleClick} type={type} disabled={disabled} className={`px-4 flex text-center items-center justify-center gap-0 cursor-pointer opacity-100 min-h-10 ${setting} ${className}`}>
        {text ? text : children ? children : "Click Here"}
    </button>
  );
};

export default Button;
