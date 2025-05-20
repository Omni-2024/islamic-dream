"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import RaqisCard from "@/components/cards/RaqisCard";
import {FaTimes } from "react-icons/fa";
import "rc-slider/assets/index.css";
import Slider from "rc-slider";
import Grid from "@/components/ui/layout/GridForBooking";
import RatingInput from "@/components/ui/input/rating";
import { useSearchParams, useRouter } from "next/navigation";
import { languages, countries } from "@/lib/constance";
import { getRakis, getRakisIdByDate } from "@/lib/api";
import LoadingSpinner from "@/components/shared/common/LoadingSpinner";
import { getLanguageLabel } from "@/lib/utils";
import { DateInput } from "@/components/ui/input/input";
import {
  Star1,
  ArrowRight2,
  Medal,
  Calendar,
  Home,
  Filter,
  ArrowRight3,
  Global,
  LanguageSquare,
  EmojiSad,
} from 'iconsax-react';

const displayImage = "https://www.shutterstock.com/image-vector/muslim-avatar-260nw-480512461.jpg";

// Main Page Component
export default function BookRaqis() {
  const [raqiData, setRaqiData] = useState([]);
  const [isLoading, setIsLoading] = useState(true); // State to manage loading
  const [filteredData, setFilteredData] = useState([]);
  const [userSelections, setUserSelections] = useState({
    experience: [0, 0],
    languages: [],
    availability: {
      date: null,
      time: null,
      duration: null,
    },
    countries: [],
  });
  const [rating, setRating] = useState(0);
  const [isFilterVisible, setIsFilterVisible] = useState(false);
  const [availableRakisIds, setAvailableRakisIds] = useState([]);
  const [showMoreLanguages, setShowMoreLanguages] = useState(false);
  const [showMoreCountries, setShowMoreCountries] = useState(false);

  useEffect(() => {
    async function fetchRakis() {
      const rakis = await getRakis();
      setRaqiData(rakis);
      setFilteredData(rakis); // Update filteredData after fetching
      setIsLoading(false); // Set loading to false after data is fetched

      const experienceRange = {
        min: rakis.length > 0 ? Math.min(...rakis.map((raqi) => raqi.yearOfExperience || 0)) : 0,
        max: rakis.length > 0 ? Math.max(...rakis.map((raqi) => raqi.yearOfExperience || 0)) : 0,
      };

      setUserSelections((prev) => ({
        ...prev,
        experience: [experienceRange.min, experienceRange.max],
      }));
    }

    fetchRakis();
  }, []);

  const handleExperienceChange = (values) => {
    setUserSelections((prev) => ({
      ...prev,
      experience: values,
    }));
  };

  const handleLanguageChange = (event, languageLabel) => {
    const languageCode = languages.find((l) => l.label === languageLabel)?.value || languageLabel;
    setUserSelections((prev) => ({
      ...prev,
      languages: event.target.checked ? [...prev.languages, languageCode] : prev.languages.filter((l) => l !== languageCode),
    }));
  };

  const searchParams = useSearchParams();
  const searchQuery = searchParams.get("searchQuery");
  const language = searchParams.get("language");
  const router = useRouter();

  const handleRemoveSearchQuery = () => {
    const params = new URLSearchParams(window.location.search);
    params.delete("searchQuery");
    router.push(`/BookRaqis?${params.toString()}`);
  };

  const handleRemoveLanguage = () => {
    const params = new URLSearchParams(window.location.search);
    params.delete("language");
    setUserSelections((prev) => ({
      ...prev,
      languages: [],
    }));
    router.push(`/BookRaqis?${params.toString()}`);
  };

  const availableLanguages = [
    "English",
    ...Array.from(
      new Set(
        raqiData
          .filter((raqi) => Array.isArray(raqi.languages) && raqi.languages.length > 0)
          .flatMap((raqi) => raqi.languages)
          .map((langCode) => {
            const langObj = languages.find((l) => l.value === langCode);
            return langObj ? langObj.label : langCode;
          })
      )
    ).filter((lang) => lang !== "English"),
    ...userSelections.languages.filter((lang) => !languages.some((l) => l.value === lang)),
    ...(language && !languages.some((l) => l.value === language) ? [language] : []),
  ]
    .filter((lang) => lang !== getLanguageLabel(language))
    .sort();

  const displayedLanguages = showMoreLanguages ? availableLanguages : availableLanguages.slice(0, 4);

  const availableCountries = [
    ...new Set(
      raqiData
        .map((raqi) => {
          const countryObj = countries.find((c) => c.value === raqi.country);
          return countryObj ? countryObj.label : null;
        })
        .filter((country) => country !== null) // Filter out null values
    ),
  ].sort();

  const displayedCountries = showMoreCountries ? availableCountries : availableCountries.slice(0, 4);

  const availableDurations = [...new Set(raqiData.map((raqi) => raqi.bookedDuration))].sort((a, b) => a - b);

  const handleCountryChange = (event, countryLabel) => {
    const countryCode = countries.find((c) => c.label === countryLabel)?.value;
    if (countryCode) {
      setUserSelections((prev) => ({
        ...prev,
        countries: event.target.checked ? [...prev.countries, countryCode] : prev.countries.filter((c) => c !== countryCode),
      }));
    }
  };

  const fetchAvailableRakis = async (date) => {
    try {
      const availableData = await getRakisIdByDate(date);
      if (!availableData.rakiIds || availableData.rakiIds.length === 0) {
        setFilteredData([]); // Clear filtered data if no IDs found
        setAvailableRakisIds([]);
      } else {
        setAvailableRakisIds(availableData.rakiIds);
      }
    } catch (error) {
      console.error('Error fetching available Rakis:', error);
      setAvailableRakisIds([]);
      setFilteredData([]); // Clear filtered data on error
    }
  };

  const handleDateChange = async (date) => {
  if (date) {
    // Format date in local timezone instead of using toISOString()
    const formattedDate = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
    
    setUserSelections((prev) => ({
      ...prev,
      availability: { ...prev.availability, date: formattedDate },
    }));
    await fetchAvailableRakis(formattedDate);
  } else {
    setUserSelections((prev) => ({
      ...prev,
      availability: { ...prev.availability, date: null },
    }));
    setAvailableRakisIds([]);
  }
};

  const handleDurationChange = (duration) => {
    setUserSelections((prev) => ({
      ...prev,
      availability: { ...prev.availability, duration: parseInt(duration) },
    }));
  };

  useEffect(() => {
    if (searchQuery || language) {
      setUserSelections((prev) => ({
        ...prev,
        languages: language ? [language] : prev.languages,
      }));
    }
  }, [searchQuery, language]);

  useEffect(() => {
    let result = raqiData;

    // If date is selected but no available rakis, show empty result
    if (userSelections.availability.date && availableRakisIds.length === 0) {
      setFilteredData([]);
      return;
    }

    if (searchQuery) {
      result = result.filter((raqi) => raqi.name.toLowerCase().includes(searchQuery.toLowerCase()));
    }

    if (userSelections.languages.length > 0) {
      result = result.filter((raqi) => Array.isArray(raqi.languages) && raqi.languages.length > 0 && userSelections.languages.every((lang) => raqi.languages.includes(lang)));
    }

    if (userSelections.countries.length > 0) {
      result = result.filter((raqi) => userSelections.countries.includes(raqi.country));
    }

    if (userSelections.experience[0] > 0 || userSelections.experience[1] < Math.max(...raqiData.map((raqi) => raqi.yearOfExperience || 0))) {
      result = result.filter((raqi) => raqi.yearOfExperience >= userSelections.experience[0] && raqi.yearOfExperience <= userSelections.experience[1]);
    }

    if (userSelections.availability.date && availableRakisIds.length > 0) {
      result = result.filter((raqi) => availableRakisIds.includes(raqi._id));
    }

    if (userSelections.availability.duration) {
      result = result.filter((raqi) => raqi.bookedDuration === userSelections.availability.duration);
    }

    if (rating > 0) {
      result = result.filter((raqi) => raqi.averageRating && raqi.averageRating >= rating);
    }

    setFilteredData(result);
  }, [userSelections, rating, searchQuery, raqiData, availableRakisIds]);

  const experienceLevels = raqiData
    .map((raqi) => raqi.yearOfExperience)
    .filter((exp) => exp !== undefined)
    .sort((a, b) => a - b);

  // if (raqiData) {
  //   return <LoadingSpinner />; 
  // }

  const renderAvailabilityFilter = () => (
    <div className="filter-section animate-fade-in" style={{ animationDelay: `2000ms` }}>
      <h2 className="text-lg font-semibold text-RuqyaGray mb-4 flex items-center gap-2">
        <Calendar size={20} color="currentColor" variant="Outline"/>
        Availability
      </h2>
      
      <div className="bg-gray-100 border border-gray-200 rounded-xl p-4">
        <div className="relative z-10">
          <div className="mb-3 text-RuqyaGray/80 text-sm font-medium">Select date for availability</div>
          <DateInput
            selected={userSelections.availability.date ? new Date(userSelections.availability.date) : null}
            onChange={handleDateChange}
            placeholderText="Select a date"
            min={new Date()}
            popperClassName="custom-popper"
            popperPlacement="top"
            className="w-full p-3 rounded-lg bg-white border border-gray-300 text-RuqyaGray placeholder-RuqyaGray/60 focus:ring-RuqyaGreen focus:border-RuqyaGreen"
            calendarClassName="raqi-calendar"
          />
          
          {userSelections.availability.date && (
            <div className="mt-2 text-sm text-RuqyaGreen font-medium">
              {availableRakisIds.length > 0 ? 
                `${availableRakisIds.length} Raqis available` : 
                "No Raqis available on this date"}
            </div>
          )}
        </div>
      </div>
    </div>
  );

  const clearAllFilters = () => {
    setUserSelections((prev) => ({
      ...prev,
      experience: [0, Math.max(...raqiData.map((raqi) => raqi.yearOfExperience || 0))],
      languages: [],
      availability: {
        date: null,
        time: null,
        duration: null,
      },
      countries: [],
    }));
    setRating(0);
    setAvailableRakisIds([]);
    router.push('/BookRaqis');
  };

return (
  <div className="mx-6 md:mx-6 lg:mx-[9%] py-8 min-h-screen mb-56">
    <nav aria-label="Breadcrumb" className="mb-6 flex items-center text-sm text-gray-600 mt-5">
          <Link href="/" className="flex items-center hover:text-RuqyaGreen transition-colors">
            <Home color="#6B7280" className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
            <span>Home</span>
          </Link>
          <ArrowRight2  color="#6B7280" className="w-3 h-3 sm:w-4 sm:h-4 mx-1 sm:mx-2" />
          <span className="font-medium text-RuqyaGray">Book Raqis</span>
        </nav>
    <div className="flex flex-col md:flex-row gap-6">
      {/* Filters Sidebar - REDESIGNED VERSION */}
      <aside
        className={`w-full md:w-64 lg:w-72 ${isFilterVisible ? "block" : "hidden"} md:block
        ${isFilterVisible ? "fixed md:relative inset-0 z-50" : "relative"}`}
      >
        {/* Dark overlay for mobile */}
        {isFilterVisible && <div className="fixed inset-0 md:hidden" onClick={() => setIsFilterVisible(false)} />}

        <div
          className="bg-white border border-gray-200 text-RuqyaGray h-full md:h-auto md:sticky md:top-6 
                    overflow-y-auto md:overflow-y-hidden pb-20 md:pb-6 rounded-none md:rounded-2xl shadow-lg"
        >
        <div>
          {/* Header with wave pattern */}
            <div className="relative mb-8">
              <div className="absolute inset-0 bg-RuqyaGreen rounded-b-[40px] h-28">
                <div className="absolute bottom-0 left-0 right-0">
                <svg viewBox="0 0 500 50" preserveAspectRatio="none" className="w-full h-12 text-white fill-current">
                  <path d="M0,50 L0,0 C150,20 350,20 500,0 L500,50 Z"></path>
                </svg>
                </div>
              </div>
              
              <div className="relative flex justify-between items-center p-6 pt-4">
                <h2 className="text-2xl font-semibold text-white">Find Your Raqi</h2>
                
                {/* Close button for mobile view */}
                <button className="md:hidden text-white p-2 rounded-full bg-white/20 hover:bg-white/30 transition-colors" 
                      onClick={() => setIsFilterVisible(false)}>
                  <FaTimes size={18} />
                </button>
              </div>
              
              {/* Clear All Filters Button */}
              {(searchQuery ||
                language ||
                userSelections.experience[0] > Math.min(...raqiData.map((raqi) => raqi.yearOfExperience || 0)) ||
                userSelections.experience[1] < Math.max(...raqiData.map((raqi) => raqi.yearOfExperience || 0)) ||
                userSelections.languages.length > 0 ||
                userSelections.countries.length > 0 ||
                userSelections.availability.date ||
                rating > 0) && (
                <div className="relative px-6">
                  <button
                    onClick={clearAllFilters}
                    className="text-white bg-RuqyaGray hover:bg-RuqyaGray/80 transition-all duration-300 
                            text-center w-full py-2 rounded-xl font-semibold flex items-center justify-center gap-2
                            shadow-lg transform hover:-translate-y-1 my-3"
                  >
                    <FaTimes size={14} />
                    Clear All Filters
                  </button>
                </div>
              )}
            </div>

            {/* Active Filters Display */}
            {(searchQuery || language) && (
              <div className="mb-6 px-6">
                <h3 className="text-sm font-semibold text-RuqyaGray/80 mb-3 uppercase tracking-wider">Active Filters</h3>
                <div className="flex flex-wrap gap-2">
                  {searchQuery && (
                    <div className="bg-RuqyaGreen/20 border border-RuqyaGreen/30 rounded-lg py-1 px-3 text-sm flex items-center gap-1">
                      <span className="text-RuqyaGray">Search: {searchQuery}</span>
                      <button onClick={handleRemoveSearchQuery} className="text-RuqyaGray/70 hover:text-RuqyaGray transition-colors ml-1">
                        <FaTimes size={12} />
                      </button>
                    </div>
                  )}
                  {language && (
                    <div className="bg-RuqyaGreen/20 border border-RuqyaGreen/30 rounded-lg py-1 px-3 text-sm flex items-center gap-1">
                      <span className="text-RuqyaGray">Lang: {getLanguageLabel(language)}</span>
                      <button onClick={handleRemoveLanguage} className="text-RuqyaGray/70 hover:text-RuqyaGray transition-colors ml-1">
                        <FaTimes size={12} />
                      </button>
                    </div>
                  )}
                </div>
              </div>
            )}

            <div className="px-6 space-y-6">
              {/* Experience Level Section - Modified */}
              <div className="filter-section animate-fade-in" style={{ animationDelay: `0ms` }}>
                <h2 className="text-lg font-semibold text-RuqyaGray mb-4 flex items-center gap-2">
                  <Medal size={20} color="currentColor" variant="Outline" />
                  Experience Level
                </h2>

                <div className="relative pt-2 pb-6">
                  {/* Slider with custom styling */}
                  <div className="px-2">
                    <Slider
                      range
                      min={Math.min(...raqiData.map((raqi) => raqi.yearOfExperience || 0))}
                      max={Math.max(...raqiData.map((raqi) => raqi.yearOfExperience || 0))}
                      value={userSelections.experience}
                      onChange={handleExperienceChange}
                      trackStyle={[{ backgroundColor: "#3ae391", height: 6, borderRadius: "6px" }]}
                      handleStyle={[
                        { borderColor: "#2DB573", height: 24, width: 24, marginLeft: -12, marginTop: -9, backgroundColor: "white", boxShadow: "0 0 0 5px rgba(45, 181, 115, 0.2)" },
                        { borderColor: "#2DB573", height: 24, width: 24, marginLeft: -12, marginTop: -9, backgroundColor: "white", boxShadow: "0 0 0 5px rgba(45, 181, 115, 0.2)" },
                      ]}
                      railStyle={{ backgroundColor: "rgba(54, 69, 79, 0.2)", height: 6, borderRadius: "6px" }}
                    />
                  </div>

                  <div className="flex justify-between text-sm text-RuqyaGray/80 mt-2">
                    <span className="font-medium">
                      Min: {userSelections.experience[0]} Yr
                    </span>
                    <span className="font-medium">
                      Max: {userSelections.experience[1]} Yr
                    </span>
                  </div>
                </div>
              </div>

              {/* Languages Filter - Bubble Tags */}
              <div className="filter-section animate-fade-in" style={{ animationDelay: `500ms` }}>
                <h2 className="text-lg font-semibold text-RuqyaGray mb-4 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <LanguageSquare size={20} color="currentColor" variant="Outline" />
                    Languages
                  </div>
                  {userSelections.languages.length > 0 && (
                    <div className="text-xs px-2 py-1 bg-RuqyaGreen text-white rounded-full font-medium">
                      {userSelections.languages.length}
                    </div>
                  )}
                </h2>
                
                <div className="flex flex-wrap gap-2">
                  {displayedLanguages.map((language, index) => {
                    const isSelected = userSelections.languages.includes(languages.find((l) => l.label === language)?.value);
                    return (
                      <button 
                        key={language} 
                        onClick={(e) => handleLanguageChange({target: {checked: !isSelected}}, language)}
                        className={`py-2 px-3 rounded-full text-sm font-medium transition-all duration-300 animate-fade-in border
                                  ${isSelected 
                                    ? "bg-RuqyaGreen text-white border-RuqyaGreen" 
                                    : "bg-gray-100 text-RuqyaGray border-gray-200 hover:bg-gray-200"}`}
                        style={{ animationDelay: `${(index % 4) * 200}ms` }}
                      >
                        {language}
                        {isSelected && (
                          <span className="ml-2 inline-flex items-center justify-center">
                            <FaTimes size={10} />
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>
                
                {availableLanguages.length > 4 && (
                  <button 
                    onClick={() => setShowMoreLanguages(!showMoreLanguages)} 
                    className="text-RuqyaGreen hover:text-RuqyaGreen/80 transition-colors text-sm font-medium mt-4 flex items-center gap-1"
                  >
                    {showMoreLanguages ? "Show Less" : "Show More"}
                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      {showMoreLanguages ? 
                        <path d="m18 15-6-6-6 6"/> : 
                        <path d="m6 9 6 6 6-6"/>
                      }
                    </svg>
                  </button>
                )}
              </div>

              {/* Countries Filter - Modified to use Bubble Tags like Languages */}
              <div className="filter-section animate-fade-in" style={{ animationDelay: `1000ms` }}>
                <h2 className="text-lg font-semibold text-RuqyaGray mb-4 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Global size={20} color="currentColor" variant="Outline" />
                    Countries
                  </div>
                  {userSelections.countries.length > 0 && (
                    <div className="text-xs px-2 py-1 bg-RuqyaGreen text-white rounded-full font-medium">
                      {userSelections.countries.length}
                    </div>
                  )}
                </h2>
                
                <div className="flex flex-wrap gap-2">
                  {displayedCountries.map((country, index) => {
                    const isSelected = userSelections.countries.includes(countries.find((c) => c.label === country)?.value);
                    return (
                      <button 
                        key={country} 
                        onClick={(e) => handleCountryChange({target: {checked: !isSelected}}, country)}
                        className={`py-2 px-3 rounded-full text-sm font-medium transition-all duration-300 animate-fade-in border
                                  ${isSelected 
                                    ? "bg-RuqyaGreen text-white border-RuqyaGreen" 
                                    : "bg-gray-100 text-RuqyaGray border-gray-200 hover:bg-gray-200"}`}
                        style={{ animationDelay: `${(index % 4) * 200}ms` }}
                      >
                        {country}
                        {isSelected && (
                          <span className="ml-2 inline-flex items-center justify-center">
                            <FaTimes size={10} />
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>
                
                {availableCountries.length > 4 && (
                  <button 
                    onClick={() => setShowMoreCountries(!showMoreCountries)} 
                    className="text-RuqyaGreen hover:text-RuqyaGreen/80 transition-colors text-sm font-medium mt-4 flex items-center gap-1"
                  >
                    {showMoreCountries ? "Show Less" : "Show More"}
                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      {showMoreCountries ? 
                        <path d="m18 15-6-6-6 6"/> : 
                        <path d="m6 9 6 6 6-6"/>
                      }
                    </svg>
                  </button>
                )}
              </div>

              {/* Rating Filter - Interactive Stars */}
              <div className="filter-section animate-fade-in" style={{ animationDelay: `1500ms` }}>
                <h2 className="text-lg font-semibold text-RuqyaGray mb-4 flex items-center gap-2">
                  <Star1 size={20} color="currentColor" variant="Outline" />
                  Rating
                </h2>
                
                <div className="bg-gray-100 border border-gray-200 rounded-xl p-4 flex items-center justify-between">
                  <RatingInput rating={rating} setRating={setRating} className="text-RuqyaGreen" />
                  
                  {rating > 0 && (
                    <div className="ml-2 bg-RuqyaGreen text-white px-3 py-1 rounded-lg text-sm font-medium">
                      {rating}+
                    </div>
                  )}
                </div>
              </div>

               {/* Availability Filter */}
             {renderAvailabilityFilter()}
              
            </div>
            
             {/* Debug section */}
              {/* <div className="filter-section bg-white rounded-md">
              <details>
                <summary className="cursor-pointer">Selected Filters</summary>
                <pre className="whitespace-pre-wrap text-xs mt-2 p-2 bg-gray-50">
                  {JSON.stringify(userSelections, null, 2)}
                </pre>
              </details>
            </div> */}
          </div>
        </div>
      </aside>

      {/* Practitioners Grid */}
      <main className="flex-1 lg:ml-6">
        {/* Filter button for mobile view */}
        <button 
          className="md:hidden text-white mb-4 fixed bottom-4 right-4 bg-RuqyaGreen p-4 rounded-full shadow-lg z-20 transition-transform hover:scale-110 border-2 border-green-900"
          onClick={() => setIsFilterVisible(true)}
        >

          <Filter size={24} color="currentColor" variant="Outline" />
        </button>
        
        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <LoadingSpinner />
          </div>
        ) : (
          <>            
            <Grid>
              {filteredData.map((practitioner, index) => (
                <RaqisCard key={`${practitioner._id}-${index}`} raqi={practitioner} className={"z-5"} />
              ))}
            </Grid>
            
            {filteredData.length === 0 && (
              <div className="text-center flex flex-col items-center py-16 bg-gray-100 rounded-xl border border-gray-200 shadow-sm">
                <EmojiSad size={48} color="#36454F" variant="Outline" />
                <p className="text-RuqyaGray font-medium mt-4">
                  {userSelections.availability.date && availableRakisIds.length === 0
                    ? "No practitioners available for the selected date"
                    : "No practitioners found matching your criteria"}
                </p>
                <button 
                  onClick={clearAllFilters} 
                  className="mt-4 text-white bg-RuqyaGreen hover:bg-RuqyaGreen/80 transition-all duration-300 py-2 px-4 rounded-full text-sm font-medium shadow-md"
                >
                  Reset Filters
                </button>
              </div>
            )}

          </>
        )}
      </main>
    </div>
  </div>
);
}
