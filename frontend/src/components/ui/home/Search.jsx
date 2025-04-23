"use client";
import { Input } from "@/components/ui/input/input";
import { SearchNormal1, Translate } from "iconsax-react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import CustomSelect from "@/components/ui/input/select";
import { languages } from "@/lib/constance";
import Button from "@/components/ui/buttons/DefaultButton";

function Search() {
  const [searchQuery, setSearchQuery] = useState("");
  const [language, setLanguage] = useState(null);
  const router = useRouter();

  const handleSearch = () => {
    const params = new URLSearchParams();
    if (searchQuery) params.append("searchQuery", searchQuery);
    if (language) params.append("language", language.value);
    router.push(`/BookRaqis?${params.toString()}`);
  };

  const handleLanguageChange = (selectedOption) => {
    setLanguage(selectedOption);
    // console.log("Selected language:", selectedOption);
  };

  return (
    <div id="search" className="relative z-20 flex justify-center items-center flex-row md:flex-row px-3 py-3 -mt-7 md:-mt-8 w-auto mx-5 md:mx-auto md:w-2/3 m-auto bg-white rounded-2xl shadow-xl md:space-y-0 md:space-x-3  animate-fade-in" style={{ animationDelay: '0.1s' }}>
      <div className="flex items-center justify-center w-full md:w-3/5 h-full p-1 rounded-lg bg-white animate-fade-in" style={{ animationDelay: '0.2s' }}>
        <SearchNormal1 className="fa-thin mr-2 text-gray-500" size="27" color="#0D766E" />
        <Input type="text" placeholder="Find Raqi" className="block w-full lg:hidden" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
        <Input type="text" placeholder="Search for Raqis, Ruqyah, or Symptoms" className="hidden w-full lg:block" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
      </div>
      <hr className="rounded-lg bg-gray-400 opacity-50 h-8 w-px rotate-95 hidden md:block animate-fade-in" style={{ animationDelay: '0.3s' }} />
      <div className="md:flex items-center justify-center w-full hidden md:w-1/3 h-full p-1 rounded-lg bg-white animate-fade-in" style={{ animationDelay: '0.4s' }}>
        <Translate className="fa-thin mr-2 text-gray-500" size="27" color="#0D766E" />
        <CustomSelect options={languages} value={language} onChange={handleLanguageChange} name="language" placeholder="Language" />
      </div>
      <div className="flex items-center justify-center -mt-13 animate-fade-in" style={{ animationDelay: '0.5s' }}>
        <Button text="Search" bg={true} onClick={handleSearch} className="w-32 md:w-40 md:h-10 bg-RuqyaGreen text-white rounded-lg hover:bg-teal-600 transition duration-300 p-3" />
      </div>
    </div>
  );
}

export default Search;
