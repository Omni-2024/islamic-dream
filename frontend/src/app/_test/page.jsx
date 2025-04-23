"use client";
import React, { useState, useEffect } from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, LabelList, CartesianGrid } from "recharts";
import { FaStar } from "react-icons/fa";
import { ErrorMessage } from "@/components/shared/common/ErrorMessage";
import ReviewRaqiPopup from "@/components/ui/popup/ReviewRaqiPopup";

const ReviewsSection = () => {
  const [data, setData] = useState({
    averageRating: 4.0,
    totalReviews: 10000,
    reviewsGrowth: 21,
    reviewBreakdown: [50, 30, 10, 0, 0],
  });
  const [showError, setShowError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [showPopup, setShowPopup] = useState(false);

  const testErrorMessage = () => {
    setErrorMessage("This is a test error message!");
    setShowError(true);
    // Reset after 3 seconds
    setTimeout(() => {
      setShowError(false);
    }, 3000);
  };

  useEffect(() => {
    // Fetch data from an API or database
    // and update the state accordingly
  }, []);

  const chartData = [
    { name: "5 ★", value: data.reviewBreakdown[0], fill: "#4caf50" },
    { name: "4 ★", value: data.reviewBreakdown[1], fill: "#9c27b0" },
    { name: "3 ★", value: data.reviewBreakdown[2], fill: "#ffeb3b" },
    { name: "2 ★", value: data.reviewBreakdown[3], fill: "#03a9f4" },
    { name: "1 ★", value: data.reviewBreakdown[4], fill: "#ffeb3b" },
  ];

  return (
    <div className="p-4">
      {showError && <ErrorMessage message={errorMessage} />}
      
      <button 
        onClick={testErrorMessage}
        className="mb-4 bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
      >
        Test Error Message
      </button>

      <button 
        onClick={() => setShowPopup(true)}
        className="mb-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
      >
        Add Review
      </button>

      {showPopup && (
        <ReviewRaqiPopup 
          raqiData={data} 
          onClose={() => setShowPopup(false)} 
        />
      )}

      <div className="bg-gray-100 rounded-md p-4 mb-4">
        <h2 className="text-lg font-medium">Average Rating</h2>
        <div className="text-4xl font-bold">{data.averageRating}</div>
        <div className="flex text-yellow-500">
          {[...Array(5)].map((_, i) => (
            <i key={i} className="fas fa-star"></i>
          ))}
        </div>
      </div>

      <div className="bg-gray-100 rounded-md p-4 mb-4">
        <h2 className="text-lg font-medium">Total Reviews</h2>
        <div className="text-4xl font-bold">{data.totalReviews.toLocaleString()}</div>
        <div className="text-green-500">{data.reviewsGrowth}% growth in reviews on this year</div>
      </div>

      <div className="bg-gray-100 rounded-md p-4 m-auto">
        <h2 className="text-lg font-medium">Review Breakdown</h2>
        <div className="flex flex-row font-bold items-center">
          <div className="flex flex-col gap-0">
            <span className="flex flex-row items-center">
              <FaStar className="text-gray-400 mr-2" />5
            </span>
            <span className="flex flex-row items-center">
              <FaStar className="text-gray-400 mr-2" />4
            </span>
            <span className="flex flex-row items-center">
              <FaStar className="text-gray-400 mr-2" />3
            </span>
            <span className="flex flex-row items-center">
              <FaStar className="text-gray-400 mr-2" />2
            </span>
            <span className="flex flex-row items-center">
              <FaStar className="text-gray-400 mr-2" />1
            </span>

          </div>
          <BarChart width={300} height={105} data={chartData} layout="vertical" className="mt-[3px]">
            <XAxis type="number" hide />
            <YAxis type="category" dataKey="name" hide />
            <CartesianGrid horizontal={false} vertical={false} />
            <Bar dataKey="value" radius={[30, 30, 30, 30]} barSize={10}>
              <LabelList dataKey="value" position="right" />
              {chartData.map((entry, index) => (
                <Bar key={`bar-${index}`} dataKey="value" fill={entry.fill} />
              ))}
            </Bar>
          </BarChart>
        </div>
      </div>
    </div>
  );
};

export default ReviewsSection;
