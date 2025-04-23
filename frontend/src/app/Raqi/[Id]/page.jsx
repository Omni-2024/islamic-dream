"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import ReactCountryFlag from "react-country-flag";
import Link from "next/link";
import { MdOutlineMessage, MdTrendingDown, MdOutlineTrendingUp } from "react-icons/md";
import Button from "@/components/ui/buttons/DefaultButton";
import { FaStar, FaStarHalfAlt } from "react-icons/fa";
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

const displayImage = "https://as2.ftcdn.net/v2/jpg/04/75/12/25/1000_F_475122535_WQkfB8bbLLu7pTanatEAIDt4ppIYgRb8.jpg";

function Raqis() {
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
    router.push('/login');
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
        if (rakiReviews.message === "No reviews found for this raki") {
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
        return <FaStar key={i} color="#ffc107" />;
      } else if (i < rating) {
        return <FaStarHalfAlt key={i} color="#ffc107" />;
      } else {
        return <FaStar key={i} color="#e4e5e9" />;
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
      saveRedirectPath(`/Raqi/${data._id}`);
      return; 
    }
    router.push(`/Raqi/${data._id}/book`);
  };

  const handleShowMore = () => {
    setVisibleReviews((prev) => prev + 5);
  };

  const token = localStorage.getItem("fe-token");

  return (
    <div className="min-h-screen  lg:mx-[9%] text-black">
      <nav aria-label="Breadcrumb m-10" className="mb-6 animate-fade-in" style={{ animationDelay: '0.1s' }}>
        <ol className="flex items-center space-x-2 mx-5 mt-5 text-sm text-muted-foreground">
          <li>
            <Link href="/" className="hover:text-primary underline">
              Home
            </Link>
          </li>
          <li>/</li>
          <li>Raqi</li>
          <li>/</li>
          <li>{data.name}</li>
        </ol>
      </nav>
      {data.bannerImage ? (
        <img src={data.bannerImage} alt={data.name} className="w-full h-48 object-cover bg-gray-600 animate-fade-in" style={{ animationDelay: '0.2s' }} />
      ) : (
        <div className="w-full h-48 bg-gray-600 animate-fade-in lg:rounded-lg" style={{ animationDelay: '0.2s' }}></div>
      )}

      <div className="flex flex-col md:flex-row items-center mx-4 animate-fade-in" style={{ animationDelay: '0.3s' }}>
        <div className="flex flex-col p-2 bg-white rounded-xl -mt-16 animate-fade-in" style={{ animationDelay: '0.4s' }}>
          <img id="raqi-profile" src={data.image || displayImage} alt={data.name} className="h-48 w-48 object-cover rounded-lg animate-fade-in" style={{ animationDelay: '0.5s' }} />
          <div className="justify-center mt-4 hidden md:flex m-auto w-full animate-fade-in" style={{ animationDelay: '0.6s' }}>
            {token && (
              <button onClick={() => handleStartChat(data._id)} className="flex items-center justify-center text-center bg-RuqyaGreen hover:bg-teal-700 text-white w-full rounded-lg py-3 px-3">
                <MdOutlineMessage className="mr-3 " />
                Chat with Raqi
              </button>
            )}
          </div>
        </div>

        <div className="md:flex hidden flex-col items-start gap-2 p-4 group animate-fade-in" style={{ animationDelay: '0.7s' }}>
          {data.name && <h1 className="text-2xl font-semibold">{data.name}</h1>}
          {data.country && (
            <div className="flex items-center space-x-1">
              <p>{getCountryLabel(data.country)}</p>
              <ReactCountryFlag countryCode={data.country} svg className="w-6 h-6 mb-0.5" title={getCountryLabel(data.country)} />
            </div>
          )}
          {data.languages && (
            <div className="flex items-center space-x-2">
              {data.languages.map((lang, index) => (
                <span key={index} className="px-2 py-1 bg-yellow-300 rounded-lg text-sm">
                  {getLanguageLabel(lang)}
                </span>
              ))}
            </div>
          )}
          {data.yearOfExperience && <p>{data.yearOfExperience} Years of Experience</p>}
          {availability && (
            <div className="mt-4">
              <h3 className="text-lg font-semibold">Availability</h3>
              <ul>
                {availability.map((slot, index) => (
                  <li key={index}>{slot}</li>
                ))}
              </ul>
            </div>
          )}
        </div>

        <div className="flex-col items-center justify-center hidden md:flex ml-auto animate-fade-in" style={{ animationDelay: '0.8s' }}>
          <div className="flex flex-col items-center justify-center w-56 m-5 rounded-lg border border-RuqyaGreen p-4">
            <h3 className="mb-3">Want to have a Session ?</h3>
            <Button onClick={handleBookNow} bg={true} text="Book Now" className="w-full bg-RuqyaGreen text-white rounded-lg p-3" />
          </div>
        </div>
      </div>

      {/* Mobile view */}
      <div className="flex md:hidden flex-col items-start mx-4 space-y-1 gap-3 text-xl group mt-2 animate-fade-in" style={{ animationDelay: '0.9s' }}>
        {data.name && (
          <div className="text-4xl flex flex-row gap-3">
            <h1>{data.name}</h1>
            {data.status && <p className={`ml-auto w-auto m-auto px-3 p-1 rounded-2xl text-sm ${data.status === "Available" ? "bg-[#C1FFD1]" : "bg-red-400"}`}>{data.status}</p>}
          </div>
        )}
        {data.country && (
          <div className="flex items-center space-x-1">
            <p>{getCountryLabel(data.country)}</p>
            <ReactCountryFlag countryCode={data.country} svg className="w-6 h-6" title={getCountryLabel(data.country)} />
          </div>
        )}
        {data.languages && (
          <div className="flex items-center space-x-2">
            {data.languages.map((lang, index) => (
              <span key={index} className="px-2 py-1 bg-yellow-300 rounded-lg text-sm">
                {getLanguageLabel(lang)}
              </span>
            ))}
          </div>
        )}
        {data.yearOfExperience && <p>{data.yearOfExperience} Years of Experience</p>}
        {availability && (
          <div className="mt-4">
            <h3 className="text-lg font-semibold">Availability</h3>
            <ul>
              {availability.map((slot, index) => (
                <li key={index}>{slot}</li>
              ))}
            </ul>
          </div>
        )}
        <div className="flex flex-col items-center justify-center w-full gap-5 pt-3">
          {token && (
            <Button onClick={() => handleStartChat(data._id)} className="flex text-lg items-center bg-RuqyaGreen text-white w-full rounded-lg px-1 py-3">
              <MdOutlineMessage className="mr-3 text-3xl" /> Chat with Raqi
            </Button>
          )}
          <Button text="Book Now" link={"/Raqi/" + data._id + "/book"} className="flex text-lg items-center bg-RuqyaGreen text-white w-full rounded-lg px-2 py-3" />
        </div>
      </div>
      {data.description && (
        <div className="mx-4 md:mx-10 animate-fade-in" style={{ animationDelay: '1.0s' }}>
          <h3 className="font-bold my-5 text-2xl">About</h3>
          <p>
            {showFullAbout ? data.description : `${data.description.substring(0, maxAboutLength)}...`}
            {data.description.length > maxAboutLength && (
              <button onClick={() => setShowFullAbout(!showFullAbout)} className="text-blue-500">
                {showFullAbout ? " See Less" : " See More"}
              </button>
            )}
          </p>
        </div>
      )}

      <div className="mx-5 md:mx-7 mt-10 animate-fade-in" style={{ animationDelay: '1.1s' }}>
        <h3 className="font-bold text-2xl mb-5 text-left">Reviews</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 md:gap-4">
          {review && review.averageRating !== undefined && (
            <>
              <div className="flex justify-center items-center mr-4 mx-auto flex-col border-gray-300 w-full">
                <div className="w-full text-left">
                  <h2 className="text-lg font-bold mb-3">Average Rating</h2>
                  <div className="flex flex-row justify-start items-center gap-3">
                    <div className="text-4xl font-bold">{review.averageRating}</div>
                    <div className="flex text-yellow-500 text-2xl md:space-x-3">{renderStars(review.averageRating)}</div>
                  </div>
                  <div className="text-gray-600">Average rating on this year</div>
                </div>
              </div>
            </>
          )}
          {review && review.totalReviews !== undefined && (
            <>
              <div className="flex justify-center items-center flex-col ml-4 border-l pl-5  md:border-r border-gray-300">
                <div className="w-full text-left">
                  <h2 className="text-lg font-bold mb-3">Total Reviews</h2>
                  <div className="flex flex-row text-3xl font-bold">
                    {formatReviewsCount(review.totalReviews)}
                    <span className={`text-sm ml-3 rounded-lg flex m-auto py-0.5 px-2 items-center  ${review.totalReviews > 0 ? "bg-green-100" : "bg-red-100"}`}>
                      {review.totalReviews}%{review.totalReviews > 0 ? <MdOutlineTrendingUp className="text-green-500 ml-1" /> : <MdTrendingDown className="text-red-500 ml-1" />}
                    </span>
                  </div>
                  <div className="text-gray-600">growth in reviews on this year</div>
                </div>
              </div>
            </>
          )}
          {review && review.totalReviews !== undefined && (
            <>
              <div className="hidden md:flex flex-row font-bold items-center">
                <div className="flex flex-col gap-0 mr-3">
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
                <BarChart 
                  width={260} 
                  height={105} 
                  data={chartData} 
                  layout="vertical" 
                  className="mt-[3px]"
                  margin={{ left: 0, right: 40, top: 5, bottom: 5 }}
                >
                  <XAxis type="number" hide domain={[0, 'auto']} />
                  <YAxis type="category" dataKey="name" hide />
                  <CartesianGrid horizontal={false} vertical={false} />
                  <Bar 
                    dataKey="value" 
                    radius={[30, 30, 30, 30]} 
                    barSize={8}
                  >
                    <LabelList 
                      dataKey="real" 
                      position="right"
                      offset={5}
                      formatter={(value, entry) => `${value}`}
                      style={(entry) => ({
                        fill: entry.fill,
                        fontSize: '14px',
                        fontWeight: 'bold'
                      })}
                    />
                  </Bar>
                </BarChart>
              </div>
            </>
          )}
        </div>
      </div>
      <div className="mx-8 mt-10 animate-fade-in" style={{ animationDelay: '1.2s' }}>
        <div className="border-b w-full mb-5">
          <h1 className="font-bold text-xl mb-2">Customer Reviews</h1>
        </div>
        {review && review.reviews.length > 0 ? (
          <>
            <div className="space-y-4">
              {review.reviews.slice(0, visibleReviews).map((review, index) => (
                <ReviewCard key={index} review={review} colorIndex={index} />
              ))}
            </div>
            {visibleReviews < review.reviews.length && (
              <div className="flex justify-center mt-6">
                <button onClick={handleShowMore} className="px-6 py-2 bg-RuqyaGreen text-white rounded-lg hover:bg-teal-700 transition-colors">
                  Show More Reviews
                </button>
              </div>
            )}
          </>
        ) : (
          <div className="flex flex-col items-center justify-center py-10 bg-gray-50 rounded-lg">
            <div className="text-gray-500 text-lg mb-2">No reviews yet</div>
            <p className="text-gray-400">Be the first to review this Raqi</p>
          </div>
        )}
      </div>
      <Forth raqiData={raqiData} title="Similar Raqis" className="mx-5 md:mx-9 animate-fade-in" style={{ animationDelay: '1.3s' }} />
      <ChatWidgetWrapper className="animate-fade-in" style={{ animationDelay: '1.4s' }} />
      <PleaseLogin 
        isOpen={showLoginPopup}
        onClose={() => setShowLoginPopup(false)}
        onLogin={handleLogin}
      />
    </div>
  );
}

export default Raqis;
