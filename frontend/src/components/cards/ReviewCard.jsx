"use client";
import React, { useState, useEffect } from "react";
import { FaStar, FaStarHalfAlt } from "react-icons/fa";
import { getUserProfile } from "@/lib/api";

const ReviewCard = ({ review, colorIndex }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const wordLimit = 40;
  const [user, setUser] = useState();

  useEffect(() => {
    const fetchUser = async () => {
      const user = await getUserProfile(review.userId);
      setUser(user);
    };

    fetchUser();
  }, []);

  if(!user){
    return null;
  }

  const renderStars = (rating) => {
    return [...Array(5)].map((_, i) => {
      if (i < Math.floor(rating)) {
        return <FaStar key={i} color="#ffc107" />;
      } else if (i < rating) {
        return <FaStarHalfAlt key={i} color="#ffc107" />;
      } else {
        return <FaStar key={i} color="#e4e5e9" />;
      }
    });
  };

  const getInitials = (name) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("");
  };

  const formatRating = (rating) => {
    return rating % 1 === 0 ? `${rating}.0` : rating.toFixed(1);
  };

  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
  };

  const renderComment = (comment) => {
    const words = comment.split(" ");
    if (words.length <= wordLimit) {
      return comment;
    }
    if (isExpanded) {
      return (
        <>
          {comment}
          <span className="text-blue-500 cursor-pointer" onClick={toggleExpand}>
            Show less
          </span>
        </>
      );
    }
    return (
      <>
        {words.slice(0, wordLimit).join(" ")}...{" "}
        <span className="text-blue-500 cursor-pointer" onClick={toggleExpand}>
          Show more
        </span>
      </>
    );
  };

  const colors = ["#D97BFC1A", "#31B69E1A", "#F4BB371A", "#FF57331A", "#C700391A"];
  const backgroundColor = colors[colorIndex % colors.length];
  const darkColors = ["#D97BFC", "#31B69E", "#F4BB37", "#FF5733", "#C70039"];
  const circleColor = darkColors[colorIndex % darkColors.length];

  return (
    <div className="p-4 rounded-lg shadow-md mb-4 font-normal" style={{ backgroundColor }}>
      <div className="flex items-center mb-2">
        <div className="flex items-center justify-center w-10 h-10 rounded-full text-white font-bold mr-3" style={{ backgroundColor: circleColor }}>
          {getInitials(user.name)}
        </div>
        <div>
          <div className="text-lg font-semibold">{user.name}</div>
          <div className="text-gray-600 text-xs">{review.date}</div>
        </div>
        <div className="ml-auto flex items-center text-yellow-500">
          <span className="mr-2 text-xl font-bold text-gray-800 ">{formatRating(review.points)}</span>
          {renderStars(review.points)}
        </div>
      </div>
      <div className="mt-2">{renderComment(review.comment)}</div>
    </div>
  );
};

export default ReviewCard;
