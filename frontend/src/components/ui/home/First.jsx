import { useEffect, useState } from "react";
import Link from "next/link";

export default function First() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Set initial visibility
    setIsVisible(true);
    
    // Handle scroll animations
    const handleScroll = () => {
      const elements = document.querySelectorAll('.scroll-animate');
      elements.forEach(el => {
        const rect = el.getBoundingClientRect();
        if (rect.top < window.innerHeight * 0.75) {
          el.classList.add('is-visible');
        }
      });
    };

    window.addEventListener("scroll", handleScroll);
    handleScroll(); // Initial check
    
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);


return (
  <section id="hero" className="relative w-full bg-white overflow-hidden py-8 md:py-12">
    {/* Background decorative element */}
    <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
      <div className="absolute -bottom-32 -right-32 w-64 md:w-96 h-64 md:h-96 rounded-full bg-RuqyaGreen/10  opacity-50"></div>
    </div>

    {/* Main Content Container - Using exact same container as in Header */}
    <div className="relative md:mx-[6%] px-4 sm:px-6 lg:px-8">
      {/* Change to grid with fixed gap instead of flex with justify-between */}
      <div className="grid grid-cols-1 md:grid-cols-2 md:gap-8 items-center">
        
        {/* Image Container - Simplified animation */}
        <div className="w-full mb-8 md:mb-0">
          <div className="relative">
            <div className="relative rounded-2xl overflow-hidden shadow-xl">
              <img 
                src="https://img.freepik.com/premium-photo/muslims-should-pray-five-times-day_1025556-9330.jpg?w=360"
                // src="https://img.freepik.com/free-photo/ramadan-celebration-digital-art_23-2151358079.jpg?semt=ais_hybrid&w=740" 
                alt="Spiritual healing meditation" 
                className="w-full h-64 sm:h-80 md:h-96 object-cover object-center transition-transform duration-700 hover:scale-105" 
              />
              
              {/* Overlay gradient */}
              <div className="absolute inset-0 bg-gradient-to-t from-gray-900/30 to-transparent"></div>
            </div>
          </div>
        </div>

        {/* Text Content - Simplified animation */}
        <div className="w-full  mt-4">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-medium">
            <span className="text-RuqyaDarkGreen block">Discover the Meaning Behind Your Dreams</span>
            {/* <span className="text-gray-800 text-3xl">The Islamic Way</span> */}
          </h1>
          
          <p className="text-gray-600 text-lg max-w-xl">
            Accurate, spiritually grounded dream interpretations by experienced interpreters in Arabic, English, Urdu, French, and Spanish.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center gap-4 pt-2">
            <Link 
              href="/BookInterpreters"
              className="px-6 py-3 bg-RuqyaLightGreen text-white rounded-xl font-bold shadow-lg hover:bg-RuqyaDarkGreen transition-all duration-300 text-center w-full sm:w-auto flex items-center justify-center space-x-2"
            >
              <span>Book a Session</span>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </Link>
            
            {/* <Link 
              href="/SelfRuqyah" 
              className="px-6 py-3 border border-green-500 text-gray-800 bg-white rounded-xl font-medium hover:bg-green-50 transition-all duration-300 text-center w-full sm:w-auto"
            >
              Learn Ruqyah
            </Link> */}
          </div>
          
          {/* Trust indicators - Hidden on very small screens */}
          <div className="pt-6">
            {/* <p className="text-sm text-gray-500 mb-3">Trusted by spiritual seekers worldwide</p> */}
          </div>
        </div>
      </div>
    </div>
    
  </section>
)
}