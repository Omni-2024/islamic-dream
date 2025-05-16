"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { Input } from "@/components/ui/input/input";
import Button from "@/components/ui/buttons/DefaultButton";
import { FaFacebook, FaTwitter, FaInstagram, FaArrowRight } from "react-icons/fa";
import { ErrorMessage } from "@/components/shared/common/ErrorMessage";
import { Facebook, Instagram, ArrowRight, Location, Call, Sms  } from 'iconsax-react';


function Footer() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    // Check login status client-side only
    setIsLoggedIn(!!localStorage.getItem("fe-token"));
  }, []);

  const handleSubscribe = () => {
    if (!email) {
      setError("Please enter your email address");
      return;
    }
    
    if (!/^\S+@\S+\.\S+$/.test(email)) {
      setError("Please enter a valid email address");
      return;
    }
    
    setError("Subscribers email temporarily unavailable");
    setEmail("");
  };

  const currentYear = new Date().getFullYear();

  return (
    <footer className="relative w-full">
      {/* Wave SVG */}
      <div className="w-full overflow-hidden">
        <svg 
          xmlns="http://www.w3.org/2000/svg" 
          viewBox="0 0 1440 120" 
          className="w-full h-auto"
          preserveAspectRatio="none"
        >
          <path 
            fill="#E6E6FA" 
            fillOpacity="1" 
            d="M0,32L60,53.3C120,75,240,117,360,117.3C480,117,600,75,720,69.3C840,64,960,96,1080,106.7C1200,117,1320,107,1380,101.3L1440,96L1440,320L1380,320C1320,320,1200,320,1080,320C960,320,840,320,720,320C600,320,480,320,360,320C240,320,120,320,60,320L0,320Z"
          ></path>
        </svg>
      </div>

      <div className="bg-RuqyaLightPurple pt-12 pb-0">
        <div className="max-w-6xl mx-auto px-4">
          {/* Main Footer Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-8 mb-8">
            {/* Brand Column */}
            <div className="col-span-1">
              <div className="flex items-center mb-4">
                <svg width="40" height="40" viewBox="0 0 40 40" className="mr-2">
                  <rect width="40" height="40" rx="4" fill="#2DB573" />
                  <path d="M10 20 L30 20 M20 10 L20 30" stroke="white" strokeWidth="3" />
                </svg>
                <h2 className="text-2xl font-bold text-RuqyaGray">Prophetic Ruqyah</h2>
              </div>
              <p className="text-RuqyaGray mb-6">
                Reviving the prophetic traditions of healing through authentic Ruqyah practices and spiritual wellness.
              </p>
              <div className="flex space-x-4">
                <Link href="https://facebook.com" target="_blank" aria-label="Facebook">
                  <div className="bg-white rounded-full p-2 hover:bg-RuqyaGreen transition-colors">
                    <Facebook color="currentColor" variant="Outline" size={20} className="text-RuqyaGray" />
                  </div>
                </Link>
                <Link href="https://twitter.com" target="_blank" aria-label="Twitter">
                  <div className="bg-white rounded-full p-2 hover:bg-RuqyaGreen  transition-colors">
                    <FaTwitter color="currentColor" variant="Outline" size={20} className="text-RuqyaGray" />
                  </div>
                </Link>
                <Link href="https://instagram.com" target="_blank" aria-label="Instagram">
                  <div className="bg-white rounded-full p-2 hover:bg-RuqyaGreen transition-colors">
                    <Instagram color="currentColor" variant="Outline" size={20} className="text-RuqyaGray" />
                  </div>
                </Link>
              </div>
            </div>

            {/* Quick Links Column */}
            <div className="col-span-1">
              <h3 className="text-RuqyaGray font-semibold text-lg mb-5 pb-2 border-b-2 border-RuqyaGreen inline-block">
                Quick Links
              </h3>
              <nav className="flex flex-col space-y-3">
                <Link href="/" className="text-RuqyaGray hover:text-RuqyaGreen transition-colors flex items-center">
                  <span className="text-RuqyaGreen mr-2">→</span>
                  Home
                </Link>
                <Link href="/BookRaqis" className="text-RuqyaGray hover:text-RuqyaGreen transition-colors flex items-center">
                  <span className="text-RuqyaGreen mr-2">→</span>
                  Book Raqis
                </Link>
                <Link href="/SelfRuqyah" className="text-RuqyaGray hover:text-RuqyaGreen transition-colors flex items-center">
                  <span className="text-RuqyaGreen mr-2">→</span>
                  Self-Ruqyah
                </Link>
                <Link href="/AboutUs" className="text-RuqyaGray hover:text-RuqyaGreen transition-colors flex items-center">
                  <span className="text-RuqyaGreen mr-2">→</span>
                  About Us
                </Link>
                <Link href={isLoggedIn ? "/MyProfile" : "/login"} className="text-RuqyaGray hover:text-RuqyaGreen transition-colors flex items-center">
                  <span className="text-RuqyaGreen mr-2">→</span>
                  {isLoggedIn ? "My Profile" : "Login"}
                </Link>
              </nav>
            </div>

            {/* Contact Us Column */}
            <div className="col-span-1">
              <h3 className="text-RuqyaGray font-semibold text-lg mb-5 pb-2 border-b-2 border-RuqyaGreen inline-block">
                Contact Us
              </h3>
             <div className="space-y-4">
              <div className="flex items-start">
                <div className="text-RuqyaGreen mr-2 mt-1">
                  <Location size={25} color="currentColor" variant="Outline"/>
                </div>
                <span className="text-RuqyaGray">123 Healing Street, Wellness City, Islamic Center</span>
              </div>

                <div className="flex items-center">
                  <div className="text-RuqyaGreen mr-2">
                    <Call size={25} color="currentColor" variant="Outline" />
                  </div>
                  <span className="text-RuqyaGray">071 - 3833341</span>
                </div>

                <div className="flex items-center">
                  <div className="text-RuqyaGreen mr-2">
                    <Sms size={25} color="currentColor" variant="Outline" />
                  </div>
                  <span className="text-RuqyaGray">contact@propheticruqyah.com</span>
                </div>
              </div>

            </div>

            {/* Newsletter Column */}
            <div className="col-span-1">
              <h3 className="text-RuqyaGray font-semibold text-lg mb-5 pb-2 border-b-2 border-RuqyaGreen inline-block">
                Newsletter
              </h3>
              <p className="text-RuqyaGray mb-4">
                Subscribe to receive the latest news about health and healing practices from our experts.
              </p>
              <div className="flex">
                <Input
                  type="email"
                  placeholder="Your email address"
                  className="rounded-l-lg rounded-r-none border-r-0 focus:ring-0 bg-white"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    setError("");
                  }}
                />
                <button 
                  onClick={handleSubscribe}
                  className="bg-RuqyaGreen text-white px-4 rounded-r-lg hover:bg-opacity-90 transition-colors"
                  aria-label="Subscribe"
                >
                  <ArrowRight color="#fff" variant="Outline" size={25} />
                </button>
              </div>
              {error && <ErrorMessage message={error} />}
            </div>
          </div>
        </div>

        {/* Copyright Bar */}
        <div className="bg-RuqyaGray py-4 mt-8">
          <div className="max-w-6xl mx-auto px-4 flex flex-col md:flex-row justify-between items-center">
            <p className="text-white text-sm">&copy; {currentYear} Prophetic Ruqyah. All rights reserved.</p>
            <div className="flex space-x-6 mt-2 md:mt-0">
              <Link href="/privacy-policy" className="text-white hover:text-RuqyaGreen text-sm transition-colors">
                Privacy Policy
              </Link>
              <Link href="/terms-of-service" className="text-white hover:text-RuqyaGreen text-sm transition-colors">
                Terms of Service
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;