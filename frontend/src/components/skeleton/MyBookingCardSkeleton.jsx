import React from "react";

const MyBookingCardSkeleton = () => {
  return (
    <div className="animate-pulse flex flex-col gap-4 w-full">
      <div className="flex flex-row gap-4 w-full">
        <div className="col-span-2 rounded-lg bg-gray-300 w-48 h-32"></div>
        <div className="flex flex-col w-full">
          <div className="h-6 bg-gray-300 rounded w-3/4 mb-2"></div>
          <div className="grid grid-rows-3 mt-1 w-full gap-2">
            <div className="h-4 bg-gray-300 rounded w-1/2"></div>
            <div className="h-4 bg-gray-300 rounded w-1/3"></div>
            <div className="h-4 bg-gray-300 rounded w-1/4"></div>
          </div>
        </div>
      </div>
      <div className="h-4 bg-gray-300 rounded w-1/2 mt-auto"></div>
    </div>
  );
};

export default MyBookingCardSkeleton;
