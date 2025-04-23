"use client";
import { useEffect, useState } from "react";
import RaqiCard from "@/components/cards/CompletedMyBookingCard";
import RatingInput from "@/components/ui/input/rating";
import { addReviews } from "@/lib/api";
import { ErrorMessage } from "@/components/shared/common/ErrorMessage";

function ReviewRaqiPopup(props) {
  const { raqiData = [], title, onClose } = props;
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [error, setError] = useState(null);
  const [existingReview, setExistingReview] = useState(null);

  useEffect(() => {
    // Prevent scrolling when the popup is open
    document.body.style.overflow = "hidden";
    return () => {
      // Re-enable scrolling when the popup is closed
      document.body.style.overflow = "auto";
    };
  }, []);

  const handleClosePopup = () => {
    if (onClose) {
      onClose();
    }
  };

  const handleSubmit = async () => {
    try {
      await addReviews(raqiData.rakiId, raqiData.meetingId, rating, comment);
      handleClosePopup();
    } catch (error) {
      if (error.response && error.response.status === 409) {
        setError(error.response.data.message);
        setExistingReview(error.response.data.existingReview);
      } else {
        setError(error.response.data.message);
      }
    }
  };

  if (!raqiData) {
    return null;
  }

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white rounded-lg relative mx-4 md:mx-0 shadow-xl max-w-lg ">
        {/* Header */}
        <div className="bg-gray-100 p-4 flex justify-between rounded-t-lg items-center">
          <span className="text-gray-700 text-xl font-semibold">Add Review</span>
          <button onClick={handleClosePopup} className="hover:text-gray-600 focus:outline-none p-1 text-white bg-red-500 rounded-lg">
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="px-6 py-4">
          {error && <ErrorMessage message={error} />}
          {existingReview && (
            <div className="bg-yellow-50 border border-yellow-200 p-4 rounded-lg mb-4">
              <h3 className="text-lg font-semibold text-yellow-700">Existing Review</h3>
              <p>
                <strong>Rating:</strong> {existingReview.points}
              </p>
              <p>
                <strong>Comment:</strong> {existingReview.comment}
              </p>
            </div>
          )}

          <div className="flex flex-col items-center mb-4">
            <h3 className="text-xl md:text-2xl text-center my-2 font-fullsansbold text-gray-800">Add a review on your session</h3>
            <div className="mb-4">
              <RaqiCard className="rounded-md shadow-md border border-gray-200 p-4 m-2" booking={raqiData} />
            </div>

            {/* Rating Input Box */}
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 w-full max-w-md">
              <div className="flex flex-row items-center justify-center gap-4">
                <h3 className="text-lg font-semibold text-gray-700">Your Rating:</h3>
                <RatingInput rating={rating} className="w-6 md:w-10 h-10 text-yellow-400" setRating={setRating} />
              </div>
            </div>
          </div>

          {/* Comment Input */}
          <div className="mb-4">
            <h3 className="text-lg font-semibold text-gray-700 mb-2">Add a Comment</h3>
            <textarea
              className="w-full h-32 border border-gray-300 rounded-lg p-3 focus:outline-none focus:border-blue-500"
              placeholder="Write your review here"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
            ></textarea>
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-2">
            <button onClick={handleClosePopup} className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">
              Close
            </button>
            <button onClick={handleSubmit} className="bg-RuqyaGreen hover:bg-teal-800 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">
              Submit
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ReviewRaqiPopup;
