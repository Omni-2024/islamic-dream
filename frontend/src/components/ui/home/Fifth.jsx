"use client"

import { useState, useRef, useEffect } from "react"
import { ChevronDown } from "lucide-react"
import { Moon, Book1, Clock, MessageQuestion, Shield, MoneyRecive, Copy, Crown } from "iconsax-react"

const Fifth = () => {
  const [openIndex, setOpenIndex] = useState(null)
  const [isVisible, setIsVisible] = useState(false)
  const sectionRef = useRef(null)
  const contentRefs = useRef([])

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

  const toggleFAQ = (index) => {
    setOpenIndex(openIndex === index ? null : index)
  }

  const faqData = [
    {
      question: "What types of dreams can be interpreted?",
      answer:
        "Only true dreams (ru'yā ṣāliḥa) that are believed to come from Allah are eligible for interpretation. Our experienced interpreters are trained to distinguish between true dreams, subconscious reflections, and satanic dreams, and will advise you accordingly.",
      icon: <Moon size="24" color="#1B184C" variant="Bold" />,
      bgColor: "bg-slate-100",
    },
    {
      question: "Are the interpretations based on the Qur'an and Sunnah?",
      answer:
        "Yes. Our interpretations are grounded primarily in the Qur'an and Sunnah, along with principles derived from classical scholars and interpreters of Ahl al-Sunnah wal-Jamā'ah.",
      icon: <Book1 size="24" color="#1B184C" variant="Bold" />,
      bgColor: "bg-slate-100",
    },
    {
      question: "How long will it take to receive my interpretation?",
      answer: "You can expect to receive a response within 48 hours, In shā' Allāh.",
      icon: <Clock size="24" color="#1B184C" variant="Bold" />,
      bgColor: "bg-slate-100",
    },
    {
      question: "Can I ask follow-up questions if I need more clarity?",
      answer:
        "Yes, you are welcome to ask one follow-up question for clarification if anything in your interpretation is unclear.",
      icon: <MessageQuestion size="24" color="#1B184C" variant="Bold" />,
      bgColor: "bg-slate-100",
    },
    {
      question: "Is my dream and personal information kept confidential?",
      answer:
        "Absolutely. All dream submissions are treated as private and confidential. We consider this an amanah (sacred trust), and your information will never be shared.",
      icon: <Shield size="24" color="#1B184C" variant="Bold" />,
      bgColor: "bg-slate-100",
    },
    {
      question: "Is there a refund policy?",
      answer:
        "No. Once your payment has been processed and your dream has been interpreted by one of our interpreters, no refunds can be issued.",
      icon: <MoneyRecive size="24" color="#1B184C" variant="Bold" />,
      bgColor: "bg-slate-100",
    },
    {
      question: "Can I send more than one dream?",
      answer: "It's £7.50 for each dream. You can send more than one dream if you make the payments for every dream",
      icon: <Copy size="24" color="#1B184C" variant="Bold" />,
      bgColor: "bg-slate-100",
    },
    {
      question: "What Aqeedah Do you follow?",
      answer:
        "We follow the Aqeedah of Ahl Sunnah wa Al-Jama, the understanding of the companions and those who followed them in belief, methodology and manners.",
      icon: <Crown size="24" color="#1B184C" variant="Bold" />,
      bgColor: "bg-slate-100",
    },
  ]

  return (
    <div
      id="Fifth"
      ref={sectionRef}
      className="relative py-10 md:py-4 px-4 md:px-6 overflow-hidden bg-gradient-to-b bg-white mb-20"
    >
      {/* Decorative elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        {/* Small floating elements */}
        <div className="absolute bottom-24 left-12 w-6 h-6 opacity-40">
          <div className="w-full h-full animate-pulse" style={{ color: "#C49666" }}>
            <svg viewBox="0 0 24 24" fill="currentColor" className="w-full h-full">
              <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" />
            </svg>
          </div>
        </div>
        <div className="absolute top-1/3 right-24 w-4 h-4 opacity-30">
          <div className="w-full h-full animate-pulse" style={{ color: "#C49666", animationDelay: "1s" }}>
            <svg viewBox="0 0 24 24" fill="currentColor" className="w-full h-full">
              <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" />
            </svg>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-3 bg-white mt-0">
        <h2
          className={`text-3xl font-bold text-center mb-8 transition-all duration-700 delay-100 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}
          style={{ color: "#1B184C" }}
        >
          Frequently Asked{" "}
          <span className="relative" style={{ color: "#C49666" }}>
            Questions
            <svg
              className="hidden md:block absolute -bottom-2 left-0 w-full h-2 opacity-30"
              viewBox="0 0 100 12"
              preserveAspectRatio="none"
              style={{ color: "#ad8153" }}
            >
              <path d="M0,10 C30,4 70,4 100,10 L100,12 L0,12 Z" fill="currentColor" />
            </svg>
          </span>
        </h2>

        <div className="space-y-4">
          {faqData.map((faq, index) => (
            <div
              key={index}
              className={`border border-gray-200 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-all duration-700 delay-${200 + index * 100} ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}
            >
              <button
                className="w-full px-6 py-4 text-left bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-inset transition-colors duration-200"
                style={{
                  "--tw-ring-color": "#C49666",
                }}
                onClick={() => toggleFAQ(index)}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div
                      className={`w-10 h-10 rounded-full ${faq.bgColor} flex items-center justify-center flex-shrink-0`}
                    >
                      {faq.icon}
                    </div>
                    <h3 className="text-lg pr-4" style={{ color: "#1B184C" }}>
                      {faq.question}
                    </h3>
                  </div>
                  <div className="flex-shrink-0">
                    <div
                      className={`transform transition-transform duration-300 ${openIndex === index ? "rotate-180" : "rotate-0"}`}
                    >
                      <ChevronDown className="w-5 h-5" style={{ color: "#C49666" }} />
                    </div>
                  </div>
                </div>
              </button>

              <div
                className={`faq-content transition-all duration-500 ease-in-out ${
                  openIndex === index ? "max-h-[500px] opacity-100" : "max-h-0 opacity-0"
                }`}
                style={{
                  overflow: "hidden",
                }}
              >
                <div
                  ref={(el) => (contentRefs.current[index] = el)}
                  className="px-6 py-4 bg-gray-50 border-t border-gray-200"
                >
                  <p className="leading-relaxed" style={{ color: "#36454F" }}>
                    {faq.answer}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default Fifth
