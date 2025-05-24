"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import ReactCountryFlag from "react-country-flag";
import Link from "next/link";
import Button from "@/components/ui/buttons/DefaultButton";
import { FaStarHalfAlt, FaStar } from "react-icons/fa";
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, LabelList, CartesianGrid } from "recharts";
import ReviewCard from "@/components/cards/ReviewCard";
import Forth from "@/components/ui/home/Forth";
import Loading from "@/components/shared/common/LoadingSpinner";
import { languages } from "@/lib/constance";
import { ChatWidgetWrapper } from "@/components/getStream/chat/ChatWidgetWrapper";
import { useChat } from "@/components/getStream/chat/ChatContextProvider";
import { getUserProfile, getRakis, getRakiAvailability, getReviews } from "@/lib/api";
import { getCountryLabel, getLanguageLabel } from "@/lib/utils";
import { useRouter } from "next/navigation";
import PleaseLogin from "@/components/ui/popup/pleaseLogin";
import {useAuth} from "@/contexts/AuthContexts";
import {
  Message,
  TrendDown,
  TrendUp,
  Star1,
  Home,
  Calendar,
} from 'iconsax-react';



const displayImage = "https://st3.depositphotos.com/12601206/35163/v/450/depositphotos_351635392-stock-illustration-muslim-man-arabic-smile-whit.jpg";

function Interpreters() {
  const [data, setData] = useState(null);
  const params = useParams();
  const Id = params.Id;
  const [showFullAbout, setShowFullAbout] = useState(false);
  const maxAboutLength = 300; // Set the maximum length for the about section
  const [raqiData, setRaqiData] = useState();
  const [availability, setAvailability] = useState(null);
  const [review, setReview] = useState({
    rakiId: "",
    totalReviews: 0,
    averageRating: 0,
    reviews: [],
  });
  const [visibleReviews, setVisibleReviews] = useState(5);
  const [showLoginPopup, setShowLoginPopup] = useState(false);
  const router = useRouter();
  const { user: currentUser } = useAuth();


  const handleLogin = () => {
    // Navigate to login page or show login form
    // router.push('/login');
  };

  useEffect(() => {
    async function fetchData() {
      try {
        const foundData = await getUserProfile(Id);
        setData(foundData);
        const rakis = await getRakis();
        setRaqiData(rakis);
        // const raqiAvailability = await getRakiAvailability(Id, new Date().toISOString().split("T")[0]);
        // setAvailability(raqiAvailability);
        const rakiReviews = await getReviews(Id);
        if (rakiReviews.message === "No reviews found for this Interpreter") {
        } else {
          setReview(rakiReviews);
        }
        console.log(rakiReviews);
      } catch (err) {
        if (err.response.status === 404) {
          setReview({
            averageRating: 0,
            totalReviews: 0,
            reviews: [],
          });
        } else {
          console.error(err);
        }
      }
    }

    fetchData();
  }, [Id]);

  const { setUserId: setChatUserId, setIsOpen: setOpenChatWidget } = useChat();

  // useEffect(() => {
  //   if (currentUser) setChatUserId(currentUser._id);
  // }, [currentUser]);

  const handleStartChat = (otherUser) => {
    console.log("Starting chat with user:", otherUser);
    setChatUserId(otherUser); // Set the other user ID
    setOpenChatWidget(true); // Open the chat widget

    setTimeout(() => {
      console.log("Chat state should be updated now");
    }, 100);
  };

  useEffect(() => {
    if (data) {
      setChatUserId(data._id);
    }
  }, [data]);

  if (!Id) {
    return <p className="min-h-screen text-black">No ID found.</p>;
  }

  if (data === null) {
    return <Loading />;
  }

  if (!data) {
    return (
      <div className="flex items-center justify-center min-h-screen text-black">
        <p>Data not available.</p>
      </div>
    );
  }

  const overallAverage = review && review.reviews.length > 0 ? review.reviews.reduce((sum, r) => sum + r.points, 0) / review.reviews.length : 0;

  const reviewCounts = [0, 0, 0, 0, 0];
  if (review && review.reviews.length > 0) {
    review.reviews.forEach((r) => {
      reviewCounts[r.points - 1]++;
    });
  }

  const chartData = [
    { name: "5", real: reviewCounts[4], value: reviewCounts[4], fill: "#4caf50" },
    { name: "4", real: reviewCounts[3], value: reviewCounts[3], fill: "#4caf50" },
    { name: "3", real: reviewCounts[2], value: reviewCounts[2], fill: "#4caf50" },
    { name: "2", real: reviewCounts[1], value: reviewCounts[1], fill: "#4caf50" },
    { name: "1", real: reviewCounts[0], value: reviewCounts[0], fill: "#4caf50" },
  ];

  const renderStars = (rating) => {
    return [...Array(5)].map((_, i) => {
      if (i < Math.floor(rating)) {
        return <Star1 key={i} color="#ffc107" />;
      } else if (i < rating) {
        return <FaStarHalfAlt key={i} color="#ffc107"  />;
      } else {
        return <Star1 key={i} color="#e4e5e9" />;
      }
    });
  };

  function formatReviewsCount(count) {
    if (count >= 1000) {
      return (count / 1000).toFixed(count % 1000 === 0 ? 0 : 1) + "k";
    }
    return count.toString();
  }

  const getLanguageLabel = (value) => {
    const language = languages.find((lang) => lang.value === value);
    return language ? language.label : value;
  };

  function saveRedirectPath(path) {
    localStorage.setItem("redirectPath", path);
    console.log("Redirect path saved:", path);
  }

  const handleBookNow = () => {
    const token = localStorage.getItem("fe-token");
    if (!token) {
      setShowLoginPopup(true);
      saveRedirectPath(`/Interpreter/${data._id}`);
      return;
    }
    router.push(`/Interpreter/${data._id}/book`);
  };

  const handleShowMore = () => {
    setVisibleReviews((prev) => prev + 5);
  };

  const token = localStorage.getItem("fe-token");

return (
  <div className="md:mx-[6%] px-3 py-5 md:pl-1 md:pr-3 min-h-screen bg-white relative">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 mb-20">

      {/* Main content */}
      <div className="relative ">
        {/* Minimalist breadcrumb */}
        <nav aria-label="Breadcrumb" className="mb-6 flex items-center text-sm text-gray-600 relative">
          <Link href="/" className="flex items-center hover:text-RuqyaLightGreen transition-colors">
            <Home className="w-4 h-4 mr-1"  color="currentColor" variant="Outline"/>
            <span>Home</span>
          </Link>
          <span className=" mx-2">/</span>
          <span className="transition-colors">Interpreter</span>
          <span className="mx-2">/</span>
          <span className=" font-semibold">{data.name}</span>
        </nav>

        {/* Modern card layout with shadow offset */}
        <div className="bg-white rounded-none lg:rounded-2xl shadow-2xl relative z-10 overflow-hidden">
          <div className="absolute h-2 top-0 left-0 right-0 bg-RuqyaGreen"></div>

          {/* Main profile grid */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 p-6 lg:p-8">
              {/* Left column - profile image with unique shape */}
              <div className="lg:col-span-3 animate-fade-in" style={{ animationDelay: "0.2s" }}>
                <div className="relative h-64 lg:h-80">
                  {/* Status pill */}
                  {data.status && (
                    <div className="absolute top-4 right-4 z-20">
                      <span
                        className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                          data.status === "Available" ? "bg-black text-RuqyaLightGreen" : "bg-black text-red-400"
                        }`}
                      >
                        <span
                          className={`w-2 h-2 rounded-full mr-2 ${
                            data.status === "Available" ? "bg-RuqyaLightGreen animate-pulse" : "bg-red-400"
                          }`}
                        ></span>
                        {data.status}
                      </span>
                    </div>
                  )}

                  {/* Profile image */}
                  <div className=" rounded-xl h-full w-full overflow-hidden">
                    <img
                      id="raqi-profile"
                      src={data.image || displayImage}
                      alt={data.name}
                      className="h-full w-full object-cover"
                    />
                  </div>
                </div>

                {/* Desktop action buttons */}
                <div className="hidden md:block mt-2 animate-fade-in px-4 lg:px-0" style={{ animationDelay: "0.3s" }}>
                  {token && (
                    <button
                      onClick={() => handleStartChat(data._id)}
                      className="flex items-center justify-center gap-2 w-full bg-RuqyaGreen hover:bg-RuqyaGreen/80 text-white rounded-none py-3 px-4 mb-3 transition-all duration-300 group"
                    >
                      <Message
                        size={20}
                        className="text-white  group-hover:scale-110 transition-transform"
                        color="currentColor"
                        variant="Outline"
                      />
                      <span className="font-medium">Chat with Interpreter</span>
                    </button>
                  )}
                </div>
              </div>

              {/* Middle column - profile details with bold typography */}
              <div
                className="lg:col-span-5 text-gray-800 animate-fade-in p-4 lg:p-0"
                style={{ animationDelay: "0.4s" }}
              >
                {data.name && <h1 className="text-4xl font-bold mb-3 text-RuqyaLightGreen tracking-tight">{data.name}</h1>}

                {/* Stats grid with consistent styling */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
                  <div className="space-y-6">
                    {data.country && (
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-RuqyaGreen/10 rounded-none flex items-center justify-center">
                          <ReactCountryFlag
                            countryCode={data.country}
                            svg
                            className="w-6 h-6"
                            title={getCountryLabel(data.country)}
                          />
                        </div>
                        <div>
                          <p className="text-RuqyaLightGreen text-xs uppercase tracking-wider font-bold">Country</p>
                          <p className="font-medium text-RuqyaGray">{getCountryLabel(data.country)}</p>
                        </div>
                      </div>
                    )}

                    {data.yearOfExperience && (
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-RuqyaGreen/10 rounded-none flex items-center justify-center text-RuqyaGray">
                          <Calendar size={20} color="currentColor" variant="Outline" />
                        </div>
                        <div>
                          <p className="text-RuqyaLightGreen text-xs uppercase tracking-wider font-bold">Experience</p>
                          <p className="font-medium text-RuqyaGray">{data.yearOfExperience} Years</p>
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="space-y-6">
                    {availability && (
                      <div className="flex items-start gap-3">
                        <div className="w-12 h-12 bg-RuqyaGreen/10 rounded-none flex items-center justify-center text-RuqyaGray mt-1">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-5 w-5"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                          >
                            <path
                              fillRule="evenodd"
                              d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z"
                              clipRule="evenodd"
                            />
                          </svg>
                        </div>
                        <div>
                          <p className="text-gray-400 text-xs uppercase tracking-wider font-bold">Availability</p>
                          <ul className="space-y-1.5 mt-1">
                            {availability.map((slot, index) => (
                              <li key={index} className="flex items-center text-sm">
                                <span className="w-1.5 h-1.5 bg-RuqyaGreen rounded-none mr-2"></span>
                                {slot}
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Languages with modern pill design */}
                {data.languages && (
                  <div className="mt-8">
                    <p className="text-RuqyaLightGreen text-xs uppercase tracking-wider font-bold mb-3">Languages</p>
                    <div className="flex flex-wrap gap-2">
                      {data.languages.map((lang, index) => (
                        <span
                          key={index}
                          className="px-4 py-2 bg-gray-100 border-l-4 border-RuqyaGreen text-sm font-medium"
                        >
                          {getLanguageLabel(lang)}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Right column - booking widget with bold design */}
              <div className="lg:col-span-4 animate-fade-in p-4 lg:p-0" style={{ animationDelay: "0.5s" }}>
                <div className="bg-RuqyaGreen/10   text-RuqyaGreen overflow-hidden relative">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-RuqyaLightGreen/30 rounded-bl-full"></div>
                  <div className="p-6 relative">
                    <h3 className="text-xl text-RuqyaGreen font-bold mb-4 flex items-center gap-2">
                      <Calendar size={20} color="currentColor" variant="Outline" />
                      Ready for a Session?
                    </h3>
                    <p className="text-RuqyaGreen mb-6">Book your appointment with {data.name} now.</p>
                    <Button
                      onClick={handleBookNow}
                      bg={true}
                      text="Book Now"
                      className="w-full rounded-xl bg-RuqyaLightGreen hover:bg-RuqyaDarkGreen  font-bold py-3 transition-all duration-300 text-center flex items-center justify-center"
                    />
                  </div>
                </div>
              </div>
            </div>
        </div>
      </div>
    {/* </div> */}



    {/* Content sections with bold geometric accents */}
    <div className=" relative z-20 mt-10">
      {/* About section with geometric accent */}
      {data.description && (
        <div className="mb-16 animate-fade-in" style={{ animationDelay: '0.7s' }}>
          <div className="flex items-center gap-3 mb-5">
            <div className="w-12 h-2 bg-RuqyaLightGreen"></div>
            <h3 className="text-2xl font-bold text-RuqyaGray">About {data.name}</h3>
          </div>

          <div className="bg-white border-l-4 border-RuqyaGreen shadow-lg">
            <div className="p-6">
              <p className="text-gray-700 leading-relaxed">
                {showFullAbout ? data.description : `${data.description.substring(0, maxAboutLength)}...`}
                {data.description.length > maxAboutLength && (
                  <button
                    onClick={() => setShowFullAbout(!showFullAbout)}
                    className="ml-2 text-RuqyaGreen hover:text-RuqyaLightGreen font-bold transition-colors"
                  >
                    {showFullAbout ? "See Less" : "See More"}
                  </button>
                )}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Review stats with bold geometric design */}
      <div className="mb-16 animate-fade-in" style={{ animationDelay: '0.8s' }}>
        <div className="flex items-center gap-3 mb-5">
          <div className="w-12 h-2 bg-RuqyaLightGreen"></div>
          <h3 className="text-2xl font-bold text-RuqyaGray">Client Feedback</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {review && review.averageRating !== undefined && (
            <div className="bg-white shadow-lg relative overflow-hidden group">
              {/* <div className="absolute top-0 left-0 w-full h-1 bg-RuqyaGreen"></div> */}
              <div className="absolute bottom-0 right-0 w-0 h-0 border-b-[40px] border-r-[40px] border-b-RuqyaLightPurple/20 border-r-transparent group-hover:border-b-RuqyaLightPurple/40 transition-colors"></div>

              <div className="border-b border-gray-200 p-4">
                <h2 className="text-gray-500 text-sm font-bold uppercase tracking-wider">Average Rating</h2>
              </div>
              <div className="p-5">
                <div className="flex items-end gap-3">
                  <div className="text-5xl font-bold text-RuqyaGray">{review.averageRating}</div>
                  <div className="flex text-yellow-400 text-xl pb-1">{renderStars(review.averageRating)}</div>
                </div>
                <div className="text-gray-500 mt-2 text-sm">Based on ratings this year</div>
              </div>
            </div>
          )}

          {review && review.totalReviews !== undefined && (
            <div className="bg-white shadow-lg relative overflow-hidden group">
              {/* <div className="absolute top-0 left-0 w-full h-1 bg-RuqyaLightGreen"></div> */}
              <div className="absolute bottom-0 right-0 w-0 h-0 border-b-[40px] border-r-[40px] border-b-RuqyaLightPurple/20 border-r-transparent group-hover:border-b-RuqyaLightPurple/40 transition-colors"></div>

              <div className="border-b border-gray-200 p-4">
                <h2 className="text-gray-500 text-sm font-bold uppercase tracking-wider">Total Reviews</h2>
              </div>
              <div className="p-5">
                <div className="flex items-center">
                  <div className="text-5xl font-bold text-RuqyaGray">{formatReviewsCount(review.totalReviews)}</div>
                  <span className={`text-sm ml-3 rounded-none py-1 px-3 flex items-center ${
                    review.totalReviews > 0 ? "bg-green-100 text-green-600" : "bg-red-100 text-red-500"
                  }`}>
                    {review.totalReviews}%
                    {review.totalReviews > 0 ?
                      <TrendUp className="ml-1" color="currentColor" variant="Outline"/> :
                      <TrendDown className="ml-1" color="currentColor" variant="Outline" />
                    }
                  </span>
                </div>
                <div className="text-gray-500 mt-2 text-sm">Growth in reviews this year</div>
              </div>
            </div>
          )}

          {review && review.totalReviews !== undefined && (
            <div className="hidden md:block bg-white shadow-lg relative overflow-hidden group">
              {/* <div className="absolute top-0 left-0 w-full h-1 bg-RuqyaGreen"></div> */}
              <div className="absolute bottom-0 right-0 w-0 h-0 border-b-[40px] border-r-[40px] border-b-RuqyaLightPurple/20 border-r-transparent group-hover:border-b-RuqyaLightPurple/40 transition-colors"></div>

              <div className="border-b border-gray-200 p-4">
                <h2 className="text-gray-500 text-sm font-bold uppercase tracking-wider">Rating Distribution</h2>
              </div>
              <div className="p-5 flex">
                <div className="flex flex-col gap-2 mr-4">
                  {[5, 4, 3, 2, 1].map((star) => (
                    <span key={star} className="flex items-center text-sm text-gray-500">
<FaStar className="text-yellow-400 mr-2" />{star}
                    </span>
                  ))}
                </div>
                <BarChart
                  width={180}
                  height={100}
                  data={chartData}
                  layout="vertical"
                  className="ml-2"
                  margin={{ left: 0, right: 40, top: 5, bottom: 5 }}
                >
                  <XAxis type="number" hide domain={[0, 'auto']} />
                  <YAxis type="category" dataKey="name" hide />
                  <CartesianGrid horizontal={false} vertical={false} />
                  <Bar
                    dataKey="value"
                    radius={[0, 0, 0, 0]}
                    barSize={8}
                    fill="#2DB573"
                  >
                    <LabelList
                      dataKey="real"
                      position="right"
                      offset={5}
                      formatter={(value) => `${value}`}
                      style={{ fill: "#111", fontSize: '14px', fontWeight: 'bold' }}
                    />
                  </Bar>
                </BarChart>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Customer reviews with bold styling */}
      <div className="mb-16 animate-fade-in" style={{ animationDelay: '0.9s' }}>
        <div className="flex items-center gap-3 mb-5">
          <div className="w-12 h-2 bg-RuqyaLightGreen"></div>
          <h3 className="text-2xl font-bold text-RuqyaGray">Client Reviews</h3>
        </div>

        <div className="bg-white shadow-lg relative">
          {/* <div className="absolute top-0 left-0 w-full h-1 bg-RuqyaGreen"></div> */}

          {review && review.reviews.length > 0 ? (
            <div className="p-6">
              <div className="space-y-8">
                {review.reviews.slice(0, visibleReviews).map((review, index) => (
                  <ReviewCard key={index} review={review} colorIndex={index} />
                ))}
              </div>

              {visibleReviews < review.reviews.length && (
                <div className="flex justify-center mt-8 pt-6 border-t border-gray-200">
                  <button
                    onClick={handleShowMore}
                    className="px-8 py-3 bg-RuqyaGray hover:bg-black text-white rounded-none font-medium transition-all duration-300 flex items-center gap-2"
                  >
                    Show More Reviews
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-16">
              <div className="bg-RuqyaGray p-6 rounded-none mb-4 text-RuqyaLightGreen">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                </svg>
              </div>
              <div className="text-RuqyaGray text-xl font-bold mb-1">No reviews yet</div>
              <p className="text-gray-500">Be the first to share your experience with {data.name}</p>
            </div>
          )}
        </div>
      </div>

      {/* Similar Raqis */}
      <div className="animate-fade-in mb-16" style={{ animationDelay: '1.0s' }}>
        <div className="flex items-center gap-3 mb-5">
          <div className="w-12 h-2 bg-RuqyaLightGreen"></div>
          <h3 className="text-2xl font-bold text-RuqyaGray">Similar Interpreters</h3>
        </div>

        <Forth
          raqiData={raqiData}
          title=""
          className="mb-12"
        />
      </div>

      {/* Chat widget with bold styling */}
      <div className="fixed bottom-0 right-0 z-50 animate-fade-in" style={{ animationDelay: '1.1s' }}>
        <ChatWidgetWrapper />
      </div>

      {/* Login popup */}
      <PleaseLogin
        isOpen={showLoginPopup}
        onClose={() => setShowLoginPopup(false)}
        onLogin={handleLogin}
      />
    </div>
  </div>
  </div>
);
}

export default Interpreters;
