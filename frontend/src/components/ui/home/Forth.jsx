"use client"

import { useState, useRef, useEffect } from "react"
import Link from "next/link"
import RaqisCard from "@/components/cards/RaqisCard"
import { ArrowRight } from "iconsax-react"
import ResponsiveGrid from "@/components/ui/layout/ResponsiveGrid"

function Forth(props) {
  const { raqiData = [], title } = props
  const [isVisible, setIsVisible] = useState(false)
  const sectionRef = useRef(null)

  useEffect(() => {
    const options = {
      threshold: 0.2,
      rootMargin: "0px 0px -100px 0px",
    }

    const observer = new IntersectionObserver((entries) => {
      const [entry] = entries
      if (entry.isIntersecting) {
        setIsVisible(true)
        observer.unobserve(entry.target)
      }
    }, options)

    if (sectionRef.current) {
      observer.observe(sectionRef.current)
    }

    return () => {
      if (sectionRef.current) {
        observer.unobserve(sectionRef.current)
      }
    }
  }, [])

  if (!raqiData) {
    return null
  }

  return (
    <section
      id="Forth"
      ref={sectionRef}
      className={`relative py-1 md:py-1 overflow-hidden bg-gradient-to-b from-white to-gray-50 ${props.className} mb-10`}
    >       
      {/* Same container padding/margins as 'First' */}
      <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">

        <div className="text-center mb-8">
          <h2
            className={`text-3xl text-RuqyaGreen md:text-4xl font-bold text-center leading-tight transition-all duration-700 delay-100 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}
          >
            {title || (
              <>
                Meet Our{" "}
                <span className="text-RuqyaLightGreen relative">
                  Interpreters
                </span>
              </>
            )}
          </h2>

          {raqiData.length > 3 && (
            <div
              className={`mt-4 transition-all duration-700 delay-200 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}
            >
              <Link
                href="/BookInterpreters"
                className="inline-flex items-center text-RuqyaLightGreen hover:text-RuqyaDarkGreen transition-all duration-200 hover:scale-105 group"
              >
                See all
                <ArrowRight
                  size={20}
                  className="inline mb-1 ml-1 transition-transform duration-200 group-hover:translate-x-1"
                  color="currentColor"
                  variant="Outline"
                />
              </Link>
            </div>
          )}
        </div>

        <div
          className={`transition-all duration-700 delay-300 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}
        >
          <ResponsiveGrid
            data={raqiData}
            breakpoints={{
              mobile: 1,
              ipad: 2,
              "ipad-landscape": 2,
              lg: 3,
              xl: 3,
              "2xl": 3,
              "3xl": 4,
              "4xl": 4,
              "5xl": 5,
            }}
            className="gap-6"
          >
            {(data, index) => (
              <div
                className={`transition-all duration-500 delay-${400 + index * 100} ${isVisible ? "opacity-100 translate-y-0 scale-100" : "opacity-0 translate-y-10 scale-95"}`}
              >
                <RaqisCard key={`Raqi${data.id}`} raqi={data} />
              </div>
            )}
          </ResponsiveGrid>
        </div>

        {/* Empty state with animation */}
        {raqiData.length === 0 && (
          <div
            className={`text-center py-12 bg-white/70 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-100 transition-all duration-700 delay-400 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}
          >
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-RuqyaLightGreen/10 flex items-center justify-center">
              <svg className="w-8 h-8 text-RuqyaLightGreen" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
                />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No Interpreters available</h3>
            <p className="text-gray-500 mb-4">Check back soon for our expert dream interpreters</p>
          </div>
        )}
      </div>
    </section>
  )
}

export default Forth
