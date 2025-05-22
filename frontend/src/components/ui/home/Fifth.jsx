import React, { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';

const Fifth = () => {
  const [openIndex, setOpenIndex] = useState(null);

  const toggleFAQ = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  const faqData = [
    {
      question: "What types of dreams can be interpreted?",
      answer: "Only true dreams (ru'yā ṣāliḥa) that are believed to come from Allah are eligible for interpretation. Our experienced interpreters are trained to distinguish between true dreams, subconscious reflections, and satanic dreams, and will advise you accordingly."
    },
    {
      question: "Are the interpretations based on the Qur'an and Sunnah?",
      answer: "Yes. Our interpretations are grounded primarily in the Qur'an and Sunnah, along with principles derived from classical scholars and interpreters of Ahl al-Sunnah wal-Jamā'ah."
    },
    {
      question: "How long will it take to receive my interpretation?",
      answer: "You can expect to receive a response within 48 hours, In shā' Allāh."
    },
    {
      question: "Can I ask follow-up questions if I need more clarity?",
      answer: "Yes, you are welcome to ask one follow-up question for clarification if anything in your interpretation is unclear."
    },
    {
      question: "Is my dream and personal information kept confidential?",
      answer: "Absolutely. All dream submissions are treated as private and confidential. We consider this an amanah (sacred trust), and your information will never be shared."
    }
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 py-3 bg-white mt-0">
      <h2 className="text-3xl md:text-3xl  text-center text-RuqyaGreen mb-12">
        Frequently Asked Questions
      </h2>
      
      <div className="space-y-4">
        {faqData.map((faq, index) => (
          <div 
            key={index}
            className="border border-gray-200 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-200"
          >
            <button
              className="w-full px-6 py-4 text-left bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-RuqyaLightGreen focus:ring-inset transition-colors duration-200"
              onClick={() => toggleFAQ(index)}
            >
              <div className="flex items-center justify-between">
                <h3 className="text-lg text-RuqyaGreen pr-4">
                  {faq.question}
                </h3>
                <div className="flex-shrink-0">
                  {openIndex === index ? (
                    <ChevronUp className="w-5 h-5 text-RuqyaLightGreen" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-RuqyaLightGreen" />
                  )}
                </div>
              </div>
            </button>
            
            {openIndex === index && (
              <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
                <p className="text-gray-700  leading-relaxed">
                  {faq.answer}
                </p>
              </div>
            )}
          </div>
        ))}
      </div>
      
    </div>
  );
};

export default Fifth;