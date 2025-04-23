import React, { useState } from "react";
import { FaStar } from "react-icons/fa";

const RatingInput = ({ rating, setRating, className }) => {
  const [hover, setHover] = useState(null);

  const handleRatingClick = (ratingValue) => {
    setRating(rating === ratingValue ? 0 : ratingValue);
  };

  return (
      <div className="flex items-center justify-center space-x-1 z-0">
        {[...Array(5)].map((_, index) => {
          const ratingValue = index + 1;
          return (
              <button
                  key={index}
                  onClick={() => handleRatingClick(ratingValue)}
                  onMouseEnter={() => setHover(ratingValue)}
                  onMouseLeave={() => setHover(null)}
                  className="transition-transform transform hover:scale-110 focus:outline-none"
              >
                <FaStar
                    size={30}
                    className={`transition-colors duration-200 ${className}`}
                    color={ratingValue <= (hover || rating) ? "#FFC107" : "#8e8e8f"}
                />
              </button>
          );
        })}
        {/* <span className="ml-2 text-gray-600 text-lg font-medium">{rating || "0"}</span> */}
      </div>
  );
};

export default RatingInput;
