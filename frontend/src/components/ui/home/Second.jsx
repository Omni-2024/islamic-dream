import { useEffect, useState, useRef } from "react";
import Image from "next/image";
import flower from "@/assets/svg/green-flower.svg";
import Link from "next/link";

function Second() {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef(null);
  
  useEffect(() => {
    const options = {
      threshold: 0.2,
      rootMargin: '0px 0px -100px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
      const [entry] = entries;
      if (entry.isIntersecting) {
        setIsVisible(true);
        observer.unobserve(entry.target);
      }
    }, options);
    
    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }
    
    return () => {
      if (sectionRef.current) {
        observer.unobserve(sectionRef.current);
      }
    };
  }, []);
  
  return (
    <section 
      id="second" 
      ref={sectionRef}
      className="relative py-16 md:py-10 px-4 md:px-6 overflow-hidden bg-gradient-to-b from-white to-RuqyaLightPurple/20 mb-20"
    >
      {/* Decorative elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        {/* Soft decorative circles */}
        <div className="absolute -top-24 -left-24 w-72 h-72 rounded-full bg-RuqyaLightPurple opacity-30 blur-xl"></div>
        <div className="absolute -bottom-32 -right-32 w-96 h-96 rounded-full bg-RuqyaLightPurple opacity-30 blur-xl"></div>
        
        {/* Decorative dots pattern */}
        <div className="hidden md:block absolute top-12 right-12 w-48 h-48 opacity-20">
        <div className="grid grid-cols-6 gap-3">
          {[...Array(36)].map((_, i) => (
            <div key={i} className="w-2 h-2 rounded-full bg-RuqyaGreen"></div>
          ))}
        </div>
      </div>

        {/* Small floating flowers (replaced with stars) */}
      <div className="absolute bottom-24 left-12 w-6 h-6 opacity-40">
        <div className="w-full h-full text-RuqyaGreen animate-pulse">
          <svg viewBox="0 0 24 24" fill="currentColor" className="w-full h-full">
            <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" />
          </svg>
        </div>
      </div>
      <div className="absolute top-1/3 right-24 w-4 h-4 opacity-30">
        <div className="w-full h-full text-RuqyaGreen animate-pulse" style={{ animationDelay: '1s' }}>
          <svg viewBox="0 0 24 24" fill="currentColor" className="w-full h-full">
            <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" />
          </svg>
        </div>
      </div>

      </div>

      <div className="container mx-auto max-w-5xl relative">
        <div className="flex flex-col items-center">
          {/* Title with decorative elements */}
          <div className={`mt-5 hidden md:flex items-center justify-center mb-6 transition-all duration-700 ${isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}`}>
          <div className="h-px w-12 bg-RuqyaGreen"></div>
          <span className="mx-4 text-RuqyaGreen font-medium px-4 py-2 rounded-full bg-gradient-to-r from-RuqyaGreen/10 to-RuqyaLightPurple/20 text-sm tracking-wide">
            About Islamic Dreams
          </span>
          <div className="h-px w-12 bg-RuqyaGreen"></div>
        </div>

          
          {/* Main heading */}
          <h2 className={`text-3xl md:text-4xl lg:text-5xl font-bold text-center leading-tight mb-10 transition-all duration-700 delay-100 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            Key <span className="text-RuqyaGreen relative">
              Benefits
              <svg 
                className="hidden md:block absolute -bottom-2 left-0 w-full h-2 text-RuqyaGreen/30" 
                viewBox="0 0 100 12" 
                preserveAspectRatio="none"
              >
                <path d="M0,10 C30,4 70,4 100,10 L100,12 L0,12 Z" fill="currentColor" />
              </svg>

            </span> 
            {/* practice */}
            {/* <br className="hidden md:block" /> */}
            {/* involving sacred recitations */}
          </h2>
          
          {/* Content cards in grid layout */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full mb-16">
            {/* Main content card */}
            <div className={`md:col-span-2 bg-white p-8 rounded-2xl shadow-lg relative transition-all duration-700 delay-200 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
              {/* <div className="absolute -top-4 -left-4 w-12 h-12 rounded-full bg-RuqyaGreen/10 flex items-center justify-center">
                <Image src={flower} alt="flower icon" width={24} height={24} />
              </div> */}
              
              <div className="flex flex-col space-y-6">
                {/* <p className="text-lg md:text-xl text-gray-700 leading-relaxed">
                  Our platform connects you with expert Raqis who provide authentic 
                  spiritual healing sessions based on traditional practices.
                </p> */}
                
                <p className="text-lg md:text-xl text-gray-700 leading-relaxed">
                  We offer comprehensive self-guided resources to support 
                  your spiritual journey toward peace and well-being.
                </p>
                
                <div className="flex flex-wrap gap-4 pt-4">
                  <div className="flex items-center px-4 py-2 bg-RuqyaLightPurple/30 rounded-full">
                    <svg className="w-5 h-5 text-RuqyaGreen mr-2" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span>Trusted Islamic Dream Interpretation</span>
                  </div>
                  <div className="flex items-center px-4 py-2 bg-RuqyaLightPurple/30 rounded-full">
                    <svg className="w-5 h-5 text-RuqyaGreen mr-2" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span>1-on-1 Online Consultation</span>
                  </div>
                  <div className="flex items-center px-4 py-2 bg-RuqyaLightPurple/30 rounded-full">
                    <svg className="w-5 h-5 text-RuqyaGreen mr-2" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span>Book in Minutes – Get Clarity Today</span>
                  </div>
                  <div className="flex items-center px-4 py-2 bg-RuqyaLightPurple/30 rounded-full">
                    <svg className="w-5 h-5 text-RuqyaGreen mr-2" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span>Based on the Teachings of the Qur’an & Sunnah</span>
                  </div>
                </div>
              </div>
              
              {/* <div className="absolute -bottom-4 -right-4 w-12 h-12 rounded-full bg-RuqyaGreen/10 flex items-center justify-center">
                <Image src={flower} alt="flower icon" width={24} height={24} />
              </div> */}
            </div>
            
            {/* Pricing card */}
            <div className={`bg-gradient-to-br from-white via-RuqyaGreen/10 to-RuqyaLightPurple/40 p-8 rounded-2xl shadow-lg transition-all duration-700 delay-300 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
              <div className="absolute -top-3 right-8 w-6 h-6">
                <svg viewBox="0 0 24 24" fill="none" className="w-full h-full text-RuqyaGreen">
                  <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" fill="currentColor" opacity="0.3" />
                </svg>
              </div>
              
              <div className="text-center">
                <h4 className="text-RuqyaGray text-lg font-medium mb-5">Starting from</h4>
                <div className="relative inline-block">
                  <h3 className="text-RuqyaGreen text-5xl font-bold mb-1">£50</h3>
                  <span className="absolute -top-2 -right-6 text-sm font-medium text-RuqyaGreen/70">.00</span>
                </div>
                <p className="text-RuqyaGray text-lg">per booking session</p>
                
                <div className="mt-8 pt-6 border-t border-RuqyaGreen/20">
                  <ul className="space-y-4">
                    <li className="flex items-center">
                      <div className="w-6 h-6 rounded-full bg-RuqyaGreen/20 flex items-center justify-center mr-3">
                        <svg className="w-4 h-4 text-RuqyaGreen" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      </div>
                      <span className="text-gray-700">Personalized sessions</span>
                    </li>
                    <li className="flex items-center">
                      <div className="w-6 h-6 rounded-full bg-RuqyaGreen/20 flex items-center justify-center mr-3">
                        <svg className="w-4 h-4 text-RuqyaGreen" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      </div>
                      <span className="text-gray-700">Certified Raqis</span>
                    </li>
                    <li className="flex items-center">
                      <div className="w-6 h-6 rounded-full bg-RuqyaGreen/20 flex items-center justify-center mr-3">
                        <svg className="w-4 h-4 text-RuqyaGreen" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      </div>
                      <span className="text-gray-700">Follow-up support</span>
                    </li>
                  </ul>
                </div>
                
                <Link 
                  href="/BookRaqis"
                  className="mt-8 w-full py-3 rounded-xl bg-gradient-to-r from-RuqyaGreen to-RuqyaLightGreen text-white font-medium transition-transform duration-300 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-RuqyaGreen focus:ring-opacity-50 text-center block"
                >
                  Book Now
                </Link>
              </div>
            </div>
          </div>
          
          {/* Testimonial */}
          <div className={`w-full max-w-2xl bg-white p-6 md:p-8 rounded-2xl shadow-lg relative transition-all duration-700 delay-400 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            <svg className="absolute top-4 left-4 w-8 h-8 text-RuqyaGreen/30" viewBox="0 0 24 24" fill="currentColor">
              <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
            </svg>
            
            <div className="text-center px-8 pt-4">
              <p className="text-gray-700 italic mb-6">
                "Ruqyah sessions have transformed my life. I feel more at peace and connected to my spiritual path than ever before."
              </p>
              <div className="flex items-center justify-center">
                <div className="w-10 h-10 rounded-full bg-RuqyaLightPurple flex items-center justify-center">
                  <span className="text-RuqyaGreen font-medium">SA</span>
                </div>
                <div className="ml-3 text-left">
                  <p className="font-medium text-gray-800">Sarah A.</p>
                  <p className="text-sm text-gray-500">London, UK</p>
                </div>
              </div>
            </div>
            
            <svg className="absolute bottom-4 right-4 w-8 h-8 text-RuqyaGreen/30 rotate-180" viewBox="0 0 24 24" fill="currentColor">
              <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
            </svg>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Second;