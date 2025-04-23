"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import RaqisCard from "@/components/cards/RaqisCard";
import { FaFilter, FaRegCalendarAlt, FaTimes } from "react-icons/fa";
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

const displayImage = "https://as2.ftcdn.net/v2/jpg/04/75/12/25/1000_F_475122535_WQkfB8bbLLu7pTanatEAIDt4ppIYgRb8.jpg";

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
      const formattedDate = date.toISOString().split('T')[0];
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
    <div className="filter-section pb-6 animate-fade-in" style={{ animationDelay: `2000ms` }}>
      <h2 className="text-lg font-semibold mb-4">Availability</h2>
      <div className="space-y-4 bg-white/50 p-4 rounded-lg font-sans">
        <div className="relative z-50"> {/* Adjusted z-index */}
          <label className="text-sm text-gray-600 block mb-1">Date</label>
          <DateInput
            selected={userSelections.availability.date ? new Date(userSelections.availability.date) : null}
            onChange={handleDateChange}
            placeholderText="Select a date"
            min={new Date()}
            popperClassName="custom-popper" // Ensure the popper has a higher z-index
            popperPlacement="top" // Ensure the popper is always displayed on top
          />
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
      <nav aria-label="Breadcrumb" className="mb-6">
        <ol className="flex items-center space-x-2 text-sm text-muted-foreground">
          <li>
            <Link href="/" className="hover:text-primary underline">
              Home
            </Link>
          </li>
          <li>/</li>
          <li>Book Raqis</li>
        </ol>
      </nav>
      <div className="flex flex-col md:flex-row gap-1">
        {/* Filters Sidebar */}
        <aside
          className={`w-full md:w-72 xl:w-80 md:space-y-6 h-screen ${isFilterVisible ? "block" : "hidden"} md:block fixed md:relative z-50 md:h-auto top-0 left-0 right-0 bottom-0 
        ${isFilterVisible ? "-mx-6 md:mx-0 -mt-8 md:mt-0" : ""}`}
        >
          {/* Dark overlay for mobile */}
          {isFilterVisible && <div className="fixed inset-0 bg-black bg-opacity-50 md:hidden" onClick={() => setIsFilterVisible(false)} />}

          <div
            className="bg-RuqyaLightPurple p-4 rounded-none md:rounded-lg border border-gray-300 
                        fixed md:relative w-full md:w-auto h-full md:h-auto 
                        overflow-y-auto md:overflow-visible pb-20 md:pb-4 top-0 left-0 right-0 bottom-0"
          >
            <div className="pt-10 md:pt-0">
              {/* Close button for mobile view */}
              <button className="md:hidden absolute top-4 right-4 text-primary z-50" onClick={() => setIsFilterVisible(false)}>
                <FaTimes size={24} />
              </button>

              {(searchQuery || language || userSelections.experience[0] > 0 || userSelections.languages.length > 0 || userSelections.countries.length > 0 || userSelections.availability.date || rating > 0) && (
                <div className="mb-4 p-2 bg-white rounded-md flex items-center justify-between">
                  <button onClick={clearAllFilters} className="text-red-500 text-center w-full">
                    Clear All
                  </button>
                </div>
              )}

              {/* Search Query Display */}
              {searchQuery && (
                <div className="mb-4 p-2 bg-white rounded-md flex items-center justify-between">
                  <span>User search: {searchQuery}</span>
                  <button onClick={handleRemoveSearchQuery} className="text-red-500">
                    <FaTimes />
                  </button>
                </div>
              )}

              {/* Language Display */}
              {language && (
                <div className="mb-4 p-2 bg-white rounded-md flex items-center justify-between">
                  <span>Language: {getLanguageLabel(language)}</span>
                  <button onClick={handleRemoveLanguage} className="text-red-500">
                    <FaTimes />
                  </button>
                </div>
              )}

              {/* Updated Experience Level Section */}
              <div className="filter-section border-b border-gray-200 pb-6 animate-fade-in" style={{ animationDelay: `0ms` }}>
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-lg font-semibold">Experience Level</h2>
                  <span className="text-sm text-gray-600 ">
                    {userSelections.experience[0]} - {userSelections.experience[1]} Year{userSelections.experience[1] !== 1 ? "s" : ""}
                  </span>
                </div>

                <div className="space-y-4 ml-5">
                  <Slider
                    range
                    min={Math.min(...raqiData.map((raqi) => raqi.yearOfExperience || 0))}
                    max={Math.max(...raqiData.map((raqi) => raqi.yearOfExperience || 0))}
                    value={userSelections.experience}
                    onChange={handleExperienceChange}
                    trackStyle={[{ backgroundColor: "green", height: 2 }]}
                    handleStyle={[
                      { borderColor: "green", height: 20, width: 20, marginLeft: -9, marginTop: -9 },
                      { borderColor: "green", height: 20, width: 20, marginLeft: -9, marginTop: -9 },
                    ]}
                    railStyle={{ backgroundColor: "gray", height: 2 }}
                  />

                  <div className="flex justify-between text-sm text-gray-600">
                    <span>
                      {Math.min(...raqiData.map((raqi) => raqi.yearOfExperience || 0))} Year{Math.min(...raqiData.map((raqi) => raqi.yearOfExperience || 0)) !== 1 ? "s" : ""}
                    </span>
                    <div className="flex ">
                      {experienceLevels.map((level) => (
                        <div key={level} className={`h-1 w-1 rounded-full ${level <= userSelections.experience[1] ? "bg-primary" : "bg-gray-300"}`} title={`${level} year${level !== 1 ? "s" : ""}`} />
                      ))}
                    </div>
                    <span>
                      {Math.max(...raqiData.map((raqi) => raqi.yearOfExperience || 0))} Year{Math.max(...raqiData.map((raqi) => raqi.yearOfExperience || 0)) !== 1 ? "s" : ""}
                    </span>
                  </div>
                </div>
              </div>

              {/* Languages Filter Section */}
              <div className="filter-section border-b border-gray-200 pb-6 animate-fade-in" style={{ animationDelay: `500ms` }}>
                <h2 className="text-lg  mb-4 flex items-center">
                  <span className="flex-1 font-semibold">Languages</span>
                  <div className="text-xs text-gray-500">{userSelections.languages.length} selected</div>
                </h2>
                <div className="space-y-1">
                  {displayedLanguages.map((language, index) => (
                    <div key={language} className="flex items-center space-x-1 hover:bg-white/50 p-2 rounded-md animate-fade-in" style={{ animationDelay: `${(index % 4) * 500}ms` }}>
                      <input type="checkbox" id={`language-${language}`} checked={userSelections.languages.includes(languages.find((l) => l.label === language)?.value)} onChange={(e) => handleLanguageChange(e, language)} className="w-5 h-5 rounded text-primary border-none focus:ring-primary cursor-pointer" style={{ borderColor: "RuqyaLightPurple" }} />
                      <label htmlFor={`language-${language}`} className="text-sm flex-1 pl-2 cursor-pointer">
                        {language}
                      </label>
                    </div>
                  ))}
                  {availableLanguages.length > 4 && (
                    <button onClick={() => setShowMoreLanguages(!showMoreLanguages)} className="text-primary no-underline text-md ml-2 mt-4" style={{ animationDelay: `2000ms` }}>
                      {showMoreLanguages ? "Show Less" : "Show More ..."}
                    </button>
                  )}
                </div>
              </div>

              {/* Countries Filter */}
              <div className="filter-section border-b border-gray-200 pb-6 animate-fade-in" style={{ animationDelay: `1000ms` }}>
                <h2 className="text-lg  mb-4 flex items-center">
                  <span className="flex-1 font-semibold">Countries</span>
                  <div className="text-xs text-gray-500">{userSelections.countries.length} selected</div>
                </h2>
                <div className="space-y-1">
                  {displayedCountries.map((country, index) => (
                    <div key={country} className="flex items-center space-x-1 hover:bg-white/50 p-2 rounded-md animate-fade-in" style={{ animationDelay: `${(index % 4) * 500}ms` }}>
                      <input type="checkbox" id={`country-${country}`} checked={userSelections.countries.includes(countries.find((c) => c.label === country)?.value)} onChange={(e) => handleCountryChange(e, country)} className="w-5 h-5 rounded text-primary border-none focus:ring-primary cursor-pointer" style={{ borderColor: "RuqyaLightPurple" }} />
                      <label htmlFor={`country-${country}`} className="text-sm pl-2 flex-1 cursor-pointer">
                        {country}
                      </label>
                    </div>
                  ))}
                  {availableCountries.length > 4 && (
                    <button onClick={() => setShowMoreCountries(!showMoreCountries)} className="text-primary no-underline text-md ml-2 mt-4" style={{ animationDelay: `2000ms` }}>
                      {showMoreCountries ? "Show Less..." : "Show More"}
                    </button>
                  )}
                </div>
              </div>

              <div className="flex flex-col justify-start items-start m-auto filter-section pb-6 animate-fade-in" style={{ animationDelay: `1500ms` }}>
                <div className="flex justify-between items-center text-lg mb-4 w-full">
                  <span className="flex-1 font-semibold">Rating</span>
                  <div className="text-xs text-gray-500 ml-auto">
                    {rating == 5 ? "Minimun" : "Minimun"} {rating} stars{" "}
                  </div>
                </div>
                <RatingInput rating={rating} setRating={setRating} className={"z-0"} />
              </div>

              {/* Availability Filter */}
              {renderAvailabilityFilter()}

              {/* Rating Filter */}
              

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
          <button className="md:hidden text-primary mb-4 fixed bottom-4 right-4 bg-white p-2 rounded-full shadow-lg shadow-gray-500/50 border-2 border-[#0C8281] z-20" onClick={() => setIsFilterVisible(true)}>
            {isFilterVisible ? <FaTimes size={24} /> : <FaFilter size={24} />}
          </button>
          <Grid>
            {filteredData.map((practitioner, index) => (
              <RaqisCard key={`${practitioner._id}-${index}`} raqi={practitioner} className={"z-5"} />
            ))}
          </Grid>
          {filteredData.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              {userSelections.availability.date && availableRakisIds.length === 0
                ? "No practitioners available for the selected date"
                : "No practitioners found matching your criteria"}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
