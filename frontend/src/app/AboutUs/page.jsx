'use client';
import React from 'react';
import { Container, Typography, Box, Paper, Grid, Divider } from '@mui/material';
import Image from 'next/image';
import { BookOpenIcon, BookIcon, UsersIcon } from 'lucide-react';

const AboutUs = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 py-16 sm:px-6 lg:px-8">
      {/* Hero Section */}
      <div className="text-center mb-12 animate-fade-in" style={{ animationDelay: '0ms' }}>
        <h1 className="text-4xl font-extrabold text-gray-800 sm:text-5xl mb-4">
          About Us
        </h1>
        <h2 className="text-xl font-medium text-RuqyaGreen mb-6">
          Welcome to Prophetic Ruqyah
        </h2>
        <p className="text-lg max-w-3xl mx-auto text-gray-600">
          At Prophetic Ruqyah, we are dedicated to restoring spiritual balance and nurturing the heart, mind, and soul through authentic Islamic healing practices. Rooted in the timeless wisdom of the Prophetic traditions, our mission is to bring light, healing, and tranquility to those seeking solace in today's challenging world.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Our Story Section */}
        <div className="animate-fade-in h-full flex" style={{ animationDelay: '150ms' }}>
          <div className="bg-white p-8 rounded-xl shadow-md hover:shadow-lg transition-transform duration-300 hover:-translate-y-1 mb-8 flex-1 flex flex-col">
            <h3 className="text-2xl font-bold text-gray-800 mb-4 relative after:content-[''] after:absolute after:bottom-[-8px] after:left-0 after:w-[60px] after:h-[3px] after:bg-RuqyaGreen">Our Story</h3>
            <div className="flex-1 flex flex-col justify-between">
              <p className="text-gray-600 mb-4">
                Prophetic Ruqyah was founded with a deep commitment to the rich heritage of Islamic spiritual healing. Inspired by the teachings of the Prophet Muhammad (peace be upon him), our journey began with the aim of reviving the ancient art of Ruqyah—a practice that combines Quranic recitations, supplications, and spiritual guidance. <br /><br /><br />
                We believe that true healing comes from a strong connection with faith, sincere prayer, and the compassionate support of a community.
              </p>
            </div>
          </div>
        </div>

        {/* Our Mission Section */}
        <div className="animate-fade-in h-full flex" style={{ animationDelay: '300ms' }}>
          <div className="bg-white p-8 rounded-xl shadow-md hover:shadow-lg transition-transform duration-300 hover:-translate-y-1 mb-8 flex-1 flex flex-col">
            <h3 className="text-2xl font-bold text-gray-800 mb-4 relative after:content-[''] after:absolute after:bottom-[-8px] after:left-0 after:w-[60px] after:h-[3px] after:bg-RuqyaGreen">Our Mission</h3>
            <div className="flex flex-col gap-4 flex-1">
              <div>
                <h4 className="text-lg font-semibold text-gray-700">Authentic Healing</h4>
                <p className="text-gray-600">
                  We provide genuine Ruqyah sessions that adhere to the principles and practices taught by the Prophet (peace be upon him).
                </p>
              </div>
              
              <div>
                <h4 className="text-lg font-semibold text-gray-700">Spiritual Empowerment</h4>
                <p className="text-gray-600">
                  Our goal is to empower individuals with the knowledge and spiritual tools needed to overcome challenges, heal emotional wounds, and maintain inner peace.
                </p>
              </div>
              
              <div>
                <h4 className="text-lg font-semibold text-gray-700">Compassionate Guidance</h4>
                <p className="text-gray-600">
                  We offer a supportive environment where every person is respected and cared for, ensuring that your spiritual journey is nurtured with kindness and expertise.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* What We Offer Section */}
        <div className="col-span-1 md:col-span-2 animate-fade-in" style={{ animationDelay: '450ms' }}>
          <div className="bg-white p-8 rounded-xl shadow-md hover:shadow-lg transition-transform duration-300 hover:-translate-y-1 mb-8">
            <h3 className="text-2xl font-bold text-gray-800 mb-4 relative after:content-[''] after:absolute after:bottom-[-8px] after:left-0 after:w-[60px] after:h-[3px] after:bg-RuqyaGreen">What We Offer</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-green-50 p-6 rounded-lg text-center transition-all duration-300 hover:-translate-y-1 hover:shadow-md h-full flex flex-col">
                <div className="flex justify-center text-RuqyaGreen mb-4">
                  <BookOpenIcon size={48} />
                </div>
                <h4 className="text-lg font-semibold text-gray-800 mb-2">Personalized Ruqyah Sessions</h4>
                <p className="text-gray-600 flex-1">
                  Whether you are facing spiritual distress or seeking protection, our experienced spiritual healers tailor sessions to meet your unique needs.
                </p>
              </div>
              
              <div className="bg-blue-50 p-6 rounded-lg text-center transition-all duration-300 hover:-translate-y-1 hover:shadow-md h-full flex flex-col">
                <div className="flex justify-center text-RuqyaGreen mb-4">
                  <BookIcon size={48} />
                </div>
                <h4 className="text-lg font-semibold text-gray-800 mb-2">Educational Resources</h4>
                <p className="text-gray-600 flex-1">
                  Our website is a repository of articles, guides, and multimedia content that explore the science and spirituality of Ruqyah, helping you understand its profound benefits.
                </p>
              </div>
              
              <div className="bg-red-50 p-6 rounded-lg text-center transition-all duration-300 hover:-translate-y-1 hover:shadow-md h-full flex flex-col">
                <div className="flex justify-center text-RuqyaGreen mb-4">
                  <UsersIcon size={48} />
                </div>
                <h4 className="text-lg font-semibold text-gray-800 mb-2">Community Support</h4>
                <p className="text-gray-600 flex-1">
                  Connect with like-minded individuals and experts who share your path towards spiritual growth and healing.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Our Approach Section */}
        <div className="animate-fade-in h-full flex" style={{ animationDelay: '600ms' }}>
          <div className="bg-white p-8 rounded-xl shadow-md hover:shadow-lg transition-transform duration-300 hover:-translate-y-1 mb-8 flex-1 flex flex-col">
            <h3 className="text-2xl font-bold text-gray-800 mb-4 relative after:content-[''] after:absolute after:bottom-[-8px] after:left-0 after:w-[60px] after:h-[3px] after:bg-RuqyaGreen">Our Approach</h3>
            <div className="flex-1 flex flex-col justify-between">
              <p className="text-gray-600 mb-4">
                We combine the art of Prophetic Ruqyah with modern insights to create a healing experience that is both authentic and relevant. Our approach is always grounded in Islamic teachings and aimed at fostering a deep connection with the Divine.
              </p>
              <p className="text-gray-600">
                We ensure that all practices are conducted in a respectful, confidential, and supportive environment.
              </p>
            </div>
          </div>
        </div>

        {/* Our Commitment Section */}
        <div className="animate-fade-in h-full flex" style={{ animationDelay: '750ms' }}>
          <div className="bg-white p-8 rounded-xl shadow-md hover:shadow-lg transition-transform duration-300 hover:-translate-y-1 mb-8 flex-1 flex flex-col">
            <h3 className="text-2xl font-bold text-gray-800 mb-4 relative after:content-[''] after:absolute after:bottom-[-8px] after:left-0 after:w-[60px] after:h-[3px] after:bg-RuqyaGreen">Our Commitment</h3>
            <div className="flex-1 flex flex-col justify-between">
              <p className="text-gray-600 mb-4">
                At Prophetic Ruqyah, your well-being is our priority. We are committed to:
              </p>
              <div className="pl-4">
                <p className="flex items-center text-gray-600 mb-2">
                  <span className="text-RuqyaGreen mr-2 font-bold">•</span> 
                  Upholding the highest ethical standards in all our practices.
                </p>
                <p className="flex items-center text-gray-600 mb-2">
                  <span className="text-RuqyaGreen mr-2 font-bold">•</span> 
                  Providing continuous support and guidance throughout your spiritual journey.
                </p>
                <p className="flex items-center text-gray-600">
                  <span className="text-RuqyaGreen mr-2 font-bold">•</span> 
                  Being a reliable source of wisdom, healing, and hope in an ever-changing world.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Final CTA */}
      <div className="text-center mt-8 p-10 bg-green-50 rounded-xl animate-fade-in" style={{ animationDelay: '900ms' }}>
        <h3 className="text-xl font-semibold text-gray-800 mb-4">
          Join us on a journey towards spiritual renewal, inner peace, and a deeper connection with your faith.
        </h3>
      </div>
    </div>
  );
};

export default AboutUs;
