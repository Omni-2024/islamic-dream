'use client';
import React from 'react';
import {
  Book1,
  Book,
  Profile2User,
  Heart,
  Star1,
  ShieldSecurity,
  ArrowRight2,
  User,
  WaveSquare,
  MagicStar,
  Home,
  ArrowRight3,
  Component,
} from 'iconsax-react';

import Link from "next/link";

const AboutUs = () => {
  return (
    <div className="md:mx-[6%] px-3 py-5 md:pl-1 md:pr-3 min-h-screen bg-white relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 mb-20">
        {/* Responsive Breadcrumb */}
        <nav aria-label="Breadcrumb" className="mb-4 sm:mb-6 flex items-center text-xs sm:text-sm text-gray-600">
          <Link href="/" className="flex items-center hover:text-RuqyaGreen transition-colors">
            <Home color="#6B7280" className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
            <span>Home</span>
          </Link>
          <ArrowRight2  color="#6B7280" className="w-3 h-3 sm:w-4 sm:h-4 mx-1 sm:mx-2" />
          <span className="font-medium text-RuqyaGray">About Us</span>
        </nav>

        {/* Responsive Header */}
        <header className="mb-6 sm:mb-10">
          <div className="flex items-center mb-3 sm:mb-4 ">
            <Star1 color='currentColor' className="w-6 h-6 sm:w-8 sm:h-8 text-RuqyaLightGreen mr-2 sm:mr-3" />
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-semibold  text-RuqyaGreen">About Islamic Dreams</h1>
          </div>
          <p className="text-sm sm:text-base text-gray-600">
            Founded on Islamic principles and traditional healing practices,  Islamic Dreams serves as a center for spiritual wellness and authentic religious guidance.
          </p>
        </header>

        {/* Main content */}
        <div className="max-w-6xl mx-auto relative">       
          {/* Our Story - Responsive Grid */}
          <div className="group bg-white rounded-xl sm:rounded-3xl shadow-lg overflow-hidden border border-gray-100 mb-8 sm:mb-12 hover:shadow-xl transition-all duration-500">
            {/* <div className="grid grid-cols-1 md:grid-cols-3"> */}
              {/* <div className="hidden md:flex bg-gradient-to-br from-RuqyaLightPurple/40 to-white items-center justify-center py-8 md:py-0">
                <div className="w-16 h-16 sm:w-24 sm:h-24 rounded-full bg-white shadow-lg flex items-center justify-center text-RuqyaGreen">
                  <Waves size={40} className="hidden sm:block" />
                </div>
              </div> */}

              <div className="md:col-span-2 p-4 sm:p-8 md:pl-6 lg:pl-8">
                <h3 className="text-xl sm:text-2xl text-RuqyaGreen mb-3 sm:mb-4 relative inline-block">
                  Our Mission
                  <div className="h-1 w-12 sm:w-16 bg-gradient-to-r from-RuqyaLightGreen to-RuqyaDarkGreen rounded-full mt-1 sm:mt-2"></div>
                </h3>
                
                <div className="space-y-3 sm:space-y-4 text-sm sm:text-base text-gray-600">
                  <p className='font-bold text-lg'> Authentic Dream Interpretation - At Your Fingertips              
                  </p>    
                  <p>
                    IslamicDreamsOnline.com was created with one mission: to make authentic Islamic dream interpretation accessible to everyone.
                  </p>               
                </div>
              </div>
            {/* </div> */}
          </div>
          
          {/* Our Mission */}
          <div className="rounded-xl sm:rounded-3xl shadow-lg overflow-hidden border border-gray-100">
            <div className="grid grid-cols-1 md:grid-cols-5">
              <div className="md:col-span-3 p-4 sm:p-6 md:p-8">
                <h3 className="text-xl sm:text-2xl text-RuqyaGreen mb-4 sm:mb-6 relative inline-block">
                  Who we are
                  <div className="h-1 w-12 sm:w-16 bg-gradient-to-r from-RuqyaLightGreen to-RuqyaDarkGreen rounded-full mt-1 sm:mt-2"></div>
                </h3>
                
                <div className="space-y-4 sm:space-y-6">
                <div className="flex items-start space-x-3 sm:space-x-4 group p-3 sm:p-4 rounded-xl transition-all duration-300">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-white shadow-md flex items-center justify-center flex-shrink-0 text-RuqyaGreen sm:group-hover:bg-RuqyaGreen sm:group-hover:text-white transition-all duration-300">
                    <Heart 
                      size={22} 
                      color="currentColor" 
                      variant="Outline" 
                      className="transition-all duration-300" 
                    />
                  </div>
                  <div>
                    <h4 className="text-base sm:text-lg font-bold text-RuqyaDarkGreen">Authentic Healing</h4>
                    <p className="text-sm sm:text-base text-gray-600">
                      At IslamicDreamsOnline.com, we connect you with qualified Muabbirs – dream interpreters grounded in Islamic scholarship. Whether you've had a vivid dream, a recurring vision, or a symbol that puzzles you, our interpreters help uncover the spiritual meaning in light of the Qur'an, Hadith, and classical Islamic texts like those of Ibn Sirin.                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-3 sm:space-x-4 group p-3 sm:p-4 rounded-xl transition-all duration-300">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-white shadow-md flex items-center justify-center flex-shrink-0 text-RuqyaGreen sm:group-hover:bg-RuqyaGreen sm:group-hover:text-white transition-all duration-300">
                    <Star1 
                      size={22} 
                      color="currentColor" 
                      variant="Outline" 
                      className="transition-all duration-300" 
                    />
                  </div>
                  <div>
                    <h4 className="text-base sm:text-lg font-bold text-RuqyaDarkGreen">Rooted in Islamic Tradition</h4>
                    <p className="text-sm sm:text-base text-gray-600">
                      Inspired by the deep spiritual tradition of dream interpretation in Islam, our platform bridges the gap between dreamers and knowledgeable Muabbirs — interpreters rooted in the Qur'an, Hadith, and classical Islamic understanding.
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-3 sm:space-x-4 group p-3 sm:p-4 rounded-xl  transition-all duration-300">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-white shadow-md flex items-center justify-center flex-shrink-0 text-RuqyaGreen sm:group-hover:bg-RuqyaGreen sm:group-hover:text-white transition-all duration-300">
                    <ShieldSecurity 
                      size={22} 
                      color="currentColor" 
                      variant="Outline" 
                      className="transition-all duration-300" 
                    />
                  </div>
                  <div>
                    <h4 className="text-base sm:text-lg font-bold text-RuqyaDarkGreen">A Meaningful Approach to Dreams</h4>
                    <p className="text-sm sm:text-base text-gray-600">
                      We believe that dreams are not just random images — they may carry signs, wisdom, and direction from Allah (SWT). Our aim is to help Muslims approach dreams with reverence, understanding, and balance.
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-3 sm:space-x-4 group p-3 sm:p-4 rounded-xl transition-all duration-300">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-white shadow-md flex items-center justify-center flex-shrink-0 text-RuqyaGreen sm:group-hover:bg-RuqyaGreen sm:group-hover:text-white transition-all duration-300">
                    <Component 
                      size={22} 
                      color="currentColor" 
                      variant="Outline" 
                      className="transition-all duration-300" 
                    />
                  </div>
                  <div>
                    <h4 className="text-base sm:text-lg font-bold text-RuqyaLightGreen">Support You Can Trust</h4>
                    <p className="text-sm sm:text-base text-gray-600">
                      Whether you're seeking clarity, reassurance, or simply want to understand your dreams better, we're here to support you — respectfully and authentically.
                    </p>
                  </div>
                </div>


                </div>
              </div>
            <div className="hidden md:col-span-2 md:flex bg-gradient-to-br from-RuqyaLightGreen/20 to-bg-RuqyaGreen/10 p-6 sm:p-8 items-center justify-center relative">
                <div className="absolute top-0 right-0 w-20 h-24 sm:w-20 sm:h-32 bg-RuqyaLightGreen/20 rounded-bl-full"></div>
                <div className="absolute bottom-0 left-0 w-20 h-24 sm:w-32 sm:h-32 bg-RuqyaGreen/10 rounded-tr-full"></div>
                <div className="w-20 h-24 sm:w-32 sm:h-32 rounded-full bg-white shadow-lg flex items-center justify-center text-RuqyaGreen z-10">
                  <MagicStar size={36} color="currentColor" variant="Outline"  className="sm:hidden" />
                  <MagicStar size={48} color="currentColor" variant="Outline"  className="hidden sm:block" />
                </div>
              </div>

            </div>
          </div>

          {/* What We Offer - Responsive Section */}
          <div className="mt-12 sm:mt-16 mb-12 sm:mb-20">
            <div className="text-left mb-6 sm:mb-8">
              <div className="inline-flex items-center flex-wrap">
                <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-RuqyaLightGreen/50 flex items-center justify-center flex-shrink-0 text-RuqyaGreen">
                  <Star1 size={12} className="sm:hidden"  color="currentColor" variant="Outline"  />
                  <Star1 size={14} className="hidden sm:block"  color="currentColor" variant="Outline"  />
                </div>
                <div className="hidden sm:block h-px w-12 bg-RuqyaLightGreen/50 mx-3"></div>
                <h2 className="text-xl sm:text-2xl text-RuqyaGray mx-2 sm:mx-0">What We Offer</h2>
                <div className="hidden sm:block h-px w-12 bg-RuqyaLightGreen/50 mx-3"></div>
                <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-RuqyaLightGreen/50 flex items-center justify-center flex-shrink-0 text-RuqyaGreen">
                  <Star1 size={12} className="sm:hidden"  color="currentColor" variant="Outline"  />
                  <Star1 size={14} className="hidden sm:block"  color="currentColor" variant="Outline"  />
                </div>
              </div>
            </div>
            
            {/* Responsive Grid - Stacks on mobile */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
              {/* Card 1 */}
              <div className="relative group">
                <div className="absolute inset-0 bg-RuqyaGreen/10 rounded-2xl sm:rounded-3xl transform rotate-3 sm:group-hover:rotate-6 transition-all duration-500"></div>
                <div className="bg-white rounded-2xl sm:rounded-3xl shadow-lg overflow-hidden h-full border border-gray-100 relative z-10 transform sm:group-hover:-translate-y-2 transition-all duration-500">
                  <div className="h-1 sm:h-2 bg-gradient-to-r from-RuqyaGreen to-RuqyaLightGreen w-full"></div>
                  <div className="p-5 sm:p-8 text-center">
                    <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-xl sm:rounded-2xl bg-RuqyaLightGreen/50  flex items-center justify-center mx-auto mb-4 sm:mb-6 text-RuqyaGreen rotate-45 sm:group-hover:rotate-0 transition-all duration-500">
                      <div className="rotate-[-45deg] sm:group-hover:rotate-0 transition-all duration-500">
                        <Book1 size={24} className="sm:hidden"  color="currentColor" variant="Outline"  />
                        <Book1 size={32} className="hidden sm:block" color="currentColor" variant="Outline" />
                      </div>
                    </div>
                    
                    <h4 className="text-lg sm:text-xl font-semibold text-RuqyaGray mb-3 sm:mb-4">Book a 10-Minute Appointment</h4>
                    
                    <p className="text-sm sm:text-base text-gray-500">
                      Choose a time that suits you and reserve your session.
                    </p>
                  </div>
                </div>
              </div>
              
              {/* Card 2 */}
              <div className="relative group">
                <div className="absolute inset-0 bg-RuqyaGreen/10 rounded-2xl sm:rounded-3xl transform rotate-3 sm:group-hover:rotate-6 transition-all duration-500"></div>
                <div className="bg-white rounded-2xl sm:rounded-3xl shadow-lg overflow-hidden h-full border border-gray-100 relative z-10 transform sm:group-hover:-translate-y-2 transition-all duration-500">
                  <div className="h-1 sm:h-2 bg-gradient-to-r from-RuqyaGreen to-RuqyaLightGreen w-full"></div>
                  <div className="p-5 sm:p-8 text-center">
                    <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-xl sm:rounded-2xl bg-RuqyaLightGreen/50  flex items-center justify-center mx-auto mb-4 sm:mb-6 text-RuqyaGreen rotate-45 sm:group-hover:rotate-0 transition-all duration-500">
                      <div className="rotate-[-45deg] sm:group-hover:rotate-0 transition-all duration-500">
                        <Book size={24} className="sm:hidden" color="currentColor" variant="Outline"/>
                        <Book size={32} className="hidden sm:block" color="currentColor" variant="Outline" />
                      </div>
                    </div>
                    
                    <h4 className="text-lg sm:text-xl font-semibold text-RuqyaGray mb-3 sm:mb-4">Talk to a Muabbir</h4>
                    
                    <p className="text-sm sm:text-base text-gray-500">
                      Get one-on-one personalized dream interpretation via secure online chat or call.
                    </p>
                  </div>
                </div>
              </div>
              
              {/* Card 3 */}
              <div className="relative group sm:col-span-2 lg:col-span-1">
              <div className="absolute inset-0 bg-RuqyaGreen/10 rounded-2xl sm:rounded-3xl transform rotate-3 sm:group-hover:rotate-6 transition-all duration-500"></div>
              <div className="bg-white rounded-2xl sm:rounded-3xl shadow-lg overflow-hidden h-full border border-gray-100 relative z-10 transform sm:group-hover:-translate-y-2 transition-all duration-500">
                <div className="h-1 sm:h-2 bg-gradient-to-r from-RuqyaGreen to-RuqyaLightGreen w-full"></div>
                <div className="p-5 sm:p-8 text-center">
                  <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-xl sm:rounded-2xl bg-RuqyaLightGreen/50  flex items-center justify-center mx-auto mb-4 sm:mb-6 text-RuqyaGreen rotate-45 sm:group-hover:rotate-0 transition-all duration-500">
                    <div className="rotate-[-45deg] sm:group-hover:rotate-0 transition-all duration-500">
                      <Profile2User size={24} className="sm:hidden" color="currentColor" variant="Outline" />
                      <Profile2User size={32} className="hidden sm:block" color="currentColor" variant="Outline" />
                      </div>
                    </div>       
                    <h4 className="text-lg sm:text-xl font-semibold text-RuqyaGray mb-3 sm:mb-4">Receive Clarity & Guidance</h4>                 
                    <p className="text-sm sm:text-base text-gray-500">
                      Understand what your dream could signify — with authentic Islamic insight.
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <p className='mt-6 text-sm sm:text-xl text-center text-gray-600'>Our service is designed to be simple, respectful, and spiritually uplifting.</p>

          </div>

          {/* Our Philosophy - Responsive Section */}
          <div className="mt-12 sm:mt-16 mb-12 sm:mb-20">
            <div className="text-left mb-6 sm:mb-8">
              <div className="inline-flex items-center flex-wrap">
                <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-RuqyaLightGreen/50 flex items-center justify-center flex-shrink-0 text-RuqyaGreen">
                  <Star1 size={12} className="sm:hidden" color="currentColor" variant="Outline" />
                  <Star1 size={14} className="hidden sm:block" color="currentColor" variant="Outline" />
                </div>
                <div className="hidden sm:block h-px w-12 bg-RuqyaLightGreen/50 mx-3"></div>
                <h2 className="text-xl sm:text-2xl text-RuqyaGray mx-2 sm:mx-0">Our Philosophy</h2>
                <div className="hidden sm:block h-px w-12 bg-RuqyaLightGreen/50 mx-3"></div>
                <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-RuqyaLightGreen/50 flex items-center justify-center flex-shrink-0 text-RuqyaGreen">
                  <Star1 size={12} className="sm:hidden" color="currentColor" variant="Outline" />
                  <Star1 size={14} className="hidden sm:block" color="currentColor" variant="Outline"/>
                </div>
              </div>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-0">
              {/* Our Approach Card - Responsive */}
              <div className="bg-white rounded-t-2xl sm:rounded-t-3xl lg:rounded-l-3xl lg:rounded-tr-none shadow-lg overflow-hidden border border-gray-100 p-5 sm:p-8 relative z-10">
                <div className="absolute top-0 left-0 w-24 h-24 sm:w-32 sm:h-32 bg-RuqyaGreen/10 rounded-br-full"></div>
                
                <div className="relative z-10">
                  <h3 className="text-xl sm:text-2xl text-RuqyaGray mb-4 sm:mb-6 flex items-center">                  
                   Our Approach
                  </h3>
                  
                  <div className="space-y-3 sm:space-y-4 text-sm sm:text-base text-gray-600">
                    <p>
                      We combine the art of Prophetic Ruqyah with modern insights to create a healing experience that is both authentic and relevant. Our approach is always grounded in Islamic teachings and aimed at fostering a deep connection with the Divine.
                    </p>
                    <p>
                      We ensure that all practices are conducted in a respectful, confidential, and supportive environment.
                    </p>
                  </div>
                </div>
              </div>

              {/* Our Commitment Card - Responsive */}
              <div className=" rounded-b-2xl sm:rounded-b-3xl lg:rounded-r-3xl lg:rounded-bl-none shadow-lg overflow-hidden border border-gray-100 p-5 sm:p-8 relative">
                <div className="absolute bottom-0 right-0 w-24 h-24 sm:w-32 sm:h-32 bg-RuqyaLightGreen/40 rounded-tl-full"></div>
                
                <div className="relative z-10">
                  <h3 className="text-xl sm:text-2xl text-RuqyaGray mb-4 sm:mb-6 flex items-center">
                    Our Commitment
                  </h3>
                  
                  <div className="space-y-3 sm:space-y-4 text-sm sm:text-base text-gray-600">
                    <p className="mb-3 sm:mb-4">
                      At Prophetic Ruqyah, your well-being is our priority. We are committed to:
                    </p>
                    
                    <ul className="space-y-3 sm:space-y-4">
                      <li className="flex items-center">
                        <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-white shadow-sm flex items-center justify-center flex-shrink-0 mr-3 sm:mr-4 text-RuqyaGreen">
                          <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-RuqyaGreen"></div>
                        </div>
                        <span>Upholding the highest ethical standards in all our practices.</span>
                      </li>
                      <li className="flex items-center">
                        <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-white shadow-sm flex items-center justify-center flex-shrink-0 mr-3 sm:mr-4 text-RuqyaGreen">
                          <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-RuqyaGreen"></div>
                        </div>
                        <span>Providing continuous support and guidance throughout your spiritual journey.</span>
                      </li>
                      <li className="flex items-center">
                        <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-white shadow-sm flex items-center justify-center flex-shrink-0 mr-3 sm:mr-4 text-RuqyaGreen">
                          <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-RuqyaGreen"></div>
                        </div>
                        <span>Being a reliable source of wisdom, healing, and hope in an ever-changing world.</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Call to Action - Responsive */}
          <div className="mb-8 sm:mb-20">
            <div className="flex flex-col sm:flex-row items-center px-4 sm:px-0">
              <div className="mb-4 sm:mb-0 sm:mr-6">
                <div className="w-16 h-16 sm:w-24 sm:h-24 rounded-full bg-white shadow-xl flex items-center justify-center  text-RuqyaLightGreen">
                  <Heart size={24} className="sm:hidden " color="currentColor" variant="Outline" />
                  <Heart size={32} className="hidden sm:block" color="currentColor" variant="Outline" />
                </div>
              </div>
              
              <div className="text-center sm:text-left">
                <h3 className="text-xl sm:text-2xl font-semibold text-RuqyaGray mb-2 sm:mb-4">
                  Join us on a journey towards spiritual renewal, inner peace, and a deeper connection with your faith.
                </h3>
                <p className="text-sm sm:text-base text-gray-600">
                  Take the first step towards holistic healing and spiritual growth with our compassionate team.
                </p>
              </div>           
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutUs;