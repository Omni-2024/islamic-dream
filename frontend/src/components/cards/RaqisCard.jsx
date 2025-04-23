"use client";

import Link from "next/link";
import Button from "@/components/ui/buttons/DefaultButton";
import { FaStar, FaGlobe } from "react-icons/fa";
import ReactCountryFlag from "react-country-flag";
import { languages, countries } from "@/lib/constance";
import {getCountryLabel, getLanagueLable } from "@/lib/utils"

export default function RaqisCard({ raqi }) {
  if (!raqi) {
    return null;
  }

  function formatRating(rating) {
    return rating.toFixed(1);
  }

  function getLanguageLabel(code) {
    if (!code) return "Unknown"
    const language = languages.find((lang) => lang.value === code.toLowerCase());
    return language ? language.label : code;
  }

  function getCountryLabel(code) {
    if (!code) return "Unknown"
    const country = countries.find((c) => c.value === code.toLowerCase());
    return country ? country.label : code;
  }

  const { name, country: CountryCode, languages: Languages, yearOfExperience: Experience, _id: id, averageRating } = raqi;
  const displayImage = "https://as2.ftcdn.net/v2/jpg/04/75/12/25/1000_F_475122535_WQkfB8bbLLu7pTanatEAIDt4ppIYgRb8.jpg";
  const countryLabel = getCountryLabel(CountryCode);

  return (
    <div className="relative flex flex-col items-center space-y-4 p-4 group text-[16px]">
      <div className="relative">
        <svg
          id="flower"
          width="100"
          height="100"
          viewBox="0 0 150 150"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="absolute z-0 transition-transform duration-500 group-hover:rotate-180"
          style={{
            top: "-65px",
            right: "-35px",
            borderRadius: "11px 0px 0px 0px",
            opacity: "1",
            transform: "rotate(0deg)",
            width: "150px",
            height: "150px",
          }}
        >
          <path d="M92.0429 52.0116C98.0192 46.0127 108.248 48.733 110.455 56.9081L125.193 111.497C127.4 119.672 119.929 127.171 111.746 124.995L57.1017 110.463C48.9183 108.287 46.1595 98.0681 52.1359 92.0691L92.0429 52.0116Z" fill="#FFDF7E" />
          <path d="M125.79 72.1849C133.973 74.3611 136.732 84.58 130.756 90.5789L90.8486 130.636C84.8722 136.635 74.643 133.915 72.436 125.74L57.6986 71.1508C55.4916 62.9756 62.962 55.477 71.1454 57.6532L125.79 72.1849Z" fill="#FFDF7E" />
        </svg>
        <span className="absolute flex flex-col items-center text-black justify-center font-semibold z-10" style={{ top: "5px", right: "15px" }}>
          <FaStar className="mb-1" />
          <p>{averageRating ? formatRating(averageRating) : "0.0"}</p>
        </span>
        <svg width="292" height="328" viewBox="0 0 292 328" fill="none" xmlns="http://www.w3.org/2000/svg" className="relative z-10">
          <defs>
            <clipPath id="clip-circle">
              <circle cx="146" cy="64" r="50" />
            </clipPath>
          </defs>
          <mask id="path-1-inside-1_283_3862" fill="white">
            <path fillRule="evenodd" clipRule="evenodd" d="M240 25.808C240 20.4088 240 17.7093 239.482 15.4778C237.757 8.04601 231.954 2.24303 224.522 0.517957C222.291 0 219.591 0 214.192 0H32C20.799 0 15.1984 0 10.9202 2.17987C7.15695 4.09734 4.09734 7.15695 2.17987 10.9202C0 15.1984 0 20.799 0 32V296C0 307.201 0 312.802 2.17987 317.08C4.09734 320.843 7.15695 323.903 10.9202 325.82C15.1984 328 20.799 328 32 328H260C271.201 328 276.802 328 281.08 325.82C284.843 323.903 287.903 320.843 289.82 317.08C292 312.802 292 307.201 292 296V77.6161C292 72.0379 292 69.2489 291.447 66.9471C289.692 59.6342 283.982 53.9243 276.669 52.1687C274.367 51.6161 271.546 51.6161 265.904 51.6161C260.441 51.6161 257.709 51.6161 255.478 51.0981C248.046 49.373 242.243 43.57 240.518 36.1382C240 33.9068 240 31.2072 240 25.808Z" />
          </mask>
          <path fillRule="evenodd" clipRule="evenodd" d="M240 25.808C240 20.4088 240 17.7093 239.482 15.4778C237.757 8.04601 231.954 2.24303 224.522 0.517957C222.291 0 219.591 0 214.192 0H32C20.799 0 15.1984 0 10.9202 2.17987C7.15695 4.09734 4.09734 7.15695 2.17987 10.9202C0 15.1984 0 20.799 0 32V296C0 307.201 0 312.802 2.17987 317.08C4.09734 320.843 7.15695 323.903 10.9202 325.82C15.1984 328 20.799 328 32 328H260C271.201 328 276.802 328 281.08 325.82C284.843 323.903 287.903 320.843 289.82 317.08C292 312.802 292 307.201 292 296V77.6161C292 72.0379 292 69.2489 291.447 66.9471C289.692 59.6342 283.982 53.9243 276.669 52.1687C274.367 51.6161 271.546 51.6161 265.904 51.6161C260.441 51.6161 257.709 51.6161 255.478 51.0981C248.046 49.373 242.243 43.57 240.518 36.1382C240 33.9068 240 31.2072 240 25.808Z" fill="white" />
          <image href={displayImage} x="96" y="14" height="100" width="100" clipPath="url(#clip-circle)" preserveAspectRatio="xMidYMid slice" />
          <path
            d="M10.9202 2.17987L11.3742 3.07088L10.9202 2.17987ZM2.17987 10.9202L3.07088 11.3742L2.17987 10.9202ZM2.17987 317.08L3.07088 316.626H3.07088L2.17987 317.08ZM10.9202 325.82L10.4662 326.711H10.4662L10.9202 325.82ZM281.08 325.82L281.534 326.711L281.08 325.82ZM289.82 317.08L290.711 317.534L289.82 317.08ZM255.478 51.0981L255.704 50.124L255.478 51.0981ZM240.518 36.1382L241.492 35.9121L240.518 36.1382ZM291.447 66.9471L290.475 67.1806L291.447 66.9471ZM276.669 52.1687L276.902 51.1963L276.669 52.1687ZM239.482 15.4778L238.508 15.7039L239.482 15.4778ZM32 1H214.192V-1H32V1ZM11.3742 3.07088C13.3488 2.06474 15.6723 1.53659 18.9455 1.26916C22.2303 1.00078 26.383 1 32 1V-1C26.416 -1 22.1678 -1.00078 18.7826 -0.724195C15.3857 -0.446659 12.7698 0.115128 10.4662 1.28886L11.3742 3.07088ZM3.07088 11.3742C4.89247 7.7991 7.7991 4.89247 11.3742 3.07088L10.4662 1.28886C6.5148 3.3022 3.3022 6.5148 1.28886 10.4662L3.07088 11.3742ZM1 32C1 26.383 1.00078 22.2303 1.26916 18.9455C1.53659 15.6723 2.06474 13.3488 3.07088 11.3742L1.28886 10.4662C0.115128 12.7698 -0.446659 15.3857 -0.724195 18.7826C-1.00078 22.1678 -1 26.416 -1 32H1ZM1 296V32H-1V296H1ZM3.07088 316.626C2.06474 314.651 1.53659 312.328 1.26916 309.055C1.00078 305.77 1 301.617 1 296H-1C-1 301.584 -1.00078 305.832 -0.724195 309.217C-0.446659 312.614 0.115128 315.23 1.28886 317.534L3.07088 316.626ZM11.3742 324.929C7.7991 323.108 4.89247 320.201 3.07088 316.626L1.28886 317.534C3.3022 321.485 6.5148 324.698 10.4662 326.711L11.3742 324.929ZM32 327C26.383 327 22.2303 326.999 18.9455 326.731C15.6723 326.463 13.3488 325.935 11.3742 324.929L10.4662 326.711C12.7698 327.885 15.3857 328.447 18.7826 328.724C22.1678 329.001 26.416 329 32 329V327ZM260 327H32V329H260V327ZM280.626 324.929C278.651 325.935 276.328 326.463 273.055 326.731C269.77 326.999 265.617 327 260 327V329C265.584 329 269.832 329.001 273.217 328.724C276.614 328.447 279.23 327.885 281.534 326.711L280.626 324.929ZM288.929 316.626C287.108 320.201 284.201 323.108 280.626 324.929L281.534 326.711C285.485 324.698 288.698 321.485 290.711 317.534L288.929 316.626ZM291 296C291 301.617 290.999 305.77 290.731 309.055C290.463 312.328 289.935 314.651 288.929 316.626L290.711 317.534C291.885 315.23 292.447 312.614 292.724 309.217C293.001 305.832 293 301.584 293 296H291ZM291 77.6161V296H293V77.6161H291ZM265.904 50.6161C260.384 50.6161 257.796 50.6095 255.704 50.124L255.252 52.0722C257.623 52.6226 260.497 52.6161 265.904 52.6161V50.6161ZM239 25.808C239 31.1513 238.993 33.9932 239.544 36.3643L241.492 35.9121C241.007 33.8204 241 31.2631 241 25.808H239ZM255.704 50.124C248.644 48.4852 243.131 42.9723 241.492 35.9121L239.544 36.3643C241.355 44.1677 247.448 50.2609 255.252 52.0722L255.704 50.124ZM293 77.6161C293 72.0957 293.007 69.1595 292.42 66.7137L290.475 67.1806C290.993 69.3382 291 71.9802 291 77.6161H293ZM265.904 52.6161C271.605 52.6161 274.278 52.6231 276.435 53.141L276.902 51.1963C274.456 50.609 271.487 50.6161 265.904 50.6161V52.6161ZM292.42 66.7137C290.576 59.0351 284.581 53.0398 276.902 51.1963L276.435 53.141C283.383 54.8089 288.807 60.2333 290.475 67.1806L292.42 66.7137ZM214.192 1C219.647 1 222.204 1.00653 224.296 1.49206L224.748 -0.456145C222.377 -1.00653 219.535 -1 214.192 -1V1ZM241 25.808C241 20.4647 241.007 17.6228 240.456 15.2517L238.508 15.7039C238.993 17.7957 239 20.353 239 25.808H241ZM224.296 1.49206C231.356 3.13088 236.869 8.64371 238.508 15.7039L240.456 15.2517C238.645 7.44831 232.552 1.35518 224.748 -0.456145L224.296 1.49206Z"
            fill="#36454F"
            fillOpacity="0.5"
            mask="url(#path-1-inside-1_283_3862)"
          />
          <foreignObject x="0" y="0" width="292" height="328" className="pt-0.5">
            <div className="flex flex-col items-center space-y-3 pt-[100px] md:pt-[100px] mt-6 m-5">
              <h2 className="text-xl">{name}</h2>
              <div className="w-full space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Country</span>
                  <div className="flex items-center gap-1">
                    <div className="flex-1 max-w-[120px] overflow-hidden">
                      {countryLabel.length > 15 ? (
                        <div className="languages-scroll animate">
                          <div className="flex">
                            <span className="mx-1 rounded-full text-sm whitespace-nowrap">
                              {countryLabel}
                            </span>
                          </div>
                          <div className="flex">
                            <span className="mx-1 rounded-full text-sm whitespace-nowrap">
                              {countryLabel}
                            </span>
                          </div>
                        </div>
                      ) : (
                        <span className="mx-1  rounded-full text-sm whitespace-nowrap">
                          {countryLabel}
                        </span>
                      )}
                    </div>
                    {CountryCode ? <ReactCountryFlag countryCode={CountryCode} svg className="mr-2" /> : <FaGlobe className="mr-2 text-RuqyaGreen" />}
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Languages</span>
                  <div className="flex-1 max-w-[155px] overflow-hidden">
                    {Languages && Languages.length > 0 ? (
                      Languages.length > 2 ? (
                        <div className="languages-scroll animate">
                          <div className="flex">
                            {Languages.map((lang, index) => (
                              <span key={index} className="px-4 py-1 mx-1 bg-[#F4D6AA99] rounded-full text-sm whitespace-nowrap">
                                {getLanguageLabel(lang)}
                              </span>
                            ))}
                          </div>
                          <div className="flex">
                            {Languages.map((lang, index) => (
                              <span key={`clone-${index}`} className="px-4 py-1 mx-1 bg-[#F4D6AA99] rounded-full text-sm whitespace-nowrap">
                                {getLanguageLabel(lang)}
                              </span>
                            ))}
                          </div>
                        </div>
                      ) : (
                        <div className="flex justify-end gap-2">
                          {Languages.map((lang, index) => (
                            <span key={index} className="px-4 py-1 bg-[#F4D6AA99] rounded-full text-sm whitespace-nowrap">
                              {getLanguageLabel(lang)}
                            </span>
                          ))}
                        </div>
                      )
                    ) : (
                      <div className="flex justify-end">
                        <span className="px-4 py-1 bg-[#F4D6AA99] rounded-full text-sm whitespace-nowrap">English</span>
                      </div>
                    )}
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Experience</span>
                  <span>{Experience ? Experience + " Year" + (Experience > 1 ? "s" : "") : "Not Available"}</span>
                </div>
              </div>
              <Link href={id ? "/Raqi/" + id : "#"} className="w-full bg-RuqyaGreen py-3 text-white text-center rounded-xl hover:bg-teal-700 transition-colors">
                Book Now
              </Link>
            </div>
          </foreignObject>
        </svg>
      </div>
    </div>
  );
}
