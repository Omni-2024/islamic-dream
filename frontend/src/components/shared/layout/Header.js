"use client";
import Link from "next/link";
import { useState, useEffect, useRef } from "react";
import { usePathname, useRouter } from "next/navigation";
import { FaEdit } from "react-icons/fa";
import { PiBookBookmarkLight } from "react-icons/pi";
import { FaBookBookmark } from "react-icons/fa6";
import { LuLogOut } from "react-icons/lu";
import { ErrorMessage } from "@/components/shared/common/ErrorMessage";
import { auth } from "@/lib/firebase";

const Header = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [mobileProfileDropdownOpen, setMobileProfileDropdownOpen] = useState(false);
  const [error, setError] = useState({ message: "", type: "" });
  const pathname = usePathname();
  const router = useRouter();
  const profileDropdownRef = useRef(null);

  const isActive = (path) => (pathname === path ? "text-RuqyaGreen" : "text-gray-700");
  const isCurrent = (path) => (pathname === path ? " bg-RuqyaLightPurple" : "bg-white");

  const handleLinkClick = () => {
    setTimeout(() => {
      setIsOpen(false);
      setMobileProfileDropdownOpen(false);
      setProfileDropdownOpen(false);
    }, 500);
  };

  const handleLogout = () => {
    localStorage.removeItem("fe-token");
    auth.signOut()
    .then(() => {
      console.log("User signed out successfully");
      // Redirect to the login page or home page
      router.push("/login");
    })
    .catch((error) => {
      console.error("Error signing out:", error);
    });
  };

  const handleLoginClick = () => {
    localStorage.setItem("redirectPath", pathname);
    router.push("/login");
  };

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
  }, [isOpen]);

  useEffect(() => {
    function handleClickOutside(event) {
      if (profileDropdownRef.current && !profileDropdownRef.current.contains(event.target)) {
        setProfileDropdownOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    const token = localStorage.getItem("fe-token");
    const raqiRegex = /^\/Raqi\/[a-f0-9]{24}$/;
    if (!token) {
      if (pathname !== "/" && pathname !== "/BookRaqis" && pathname !== "/SelfRuqyah" && pathname !== "/AboutUs" && pathname !== "/signup" && pathname !== "/login" && !raqiRegex.test(pathname)) {
        router.push("/login");
      }
    } else {
      try {
        // Decode the token (it's the part between the first and second dots)
        const tokenParts = token.split('.');
        const decodedToken = JSON.parse(atob(tokenParts[1]));
        
        // Check if token is expired
        const currentTime = Math.floor(Date.now() / 1000); // Convert to seconds
        if (decodedToken.exp < currentTime) {
          setError({ message: "Session expired. Please login again", type: "error" });
          localStorage.removeItem("fe-token");
          setTimeout(() => {
            router.push("/login");
          }, 3000);
        }
      } catch (error) {
        console.error("Error decoding token:", error);
        localStorage.removeItem("fe-token");
        router.push("/login");
      }
    }
  }, [pathname, router]);

  return (
    <>
      {error.message && (
        <div className="fixed top-0 left-0 right-0 z-50 animate-slideDown">
          <ErrorMessage message={error.message} type={error.type} />
        </div>
      )}
      <header>
        <nav className={`${isCurrent("/")} lg:px-[7%] lg:py-12 py-4 shadow-md font-normal color-header`}>
          <div className="flex justify-between items-center mx-8 md:mx-8">
            <div className="text-xl min-w-32">
              <Link href="/" className="text-gray-700 w-40 hover:text-gray-900">
                <img src="/images/logo.png" alt="Ruqya logo" width="150" height="100" />
              </Link>
            </div>
            <div className="hidden md:flex flex-grow justify-center items-center mx-5">
              <img src="/nav-flower.svg" alt="Navigation Center" width="33" className="-mr-4" />
              <img src="/nav-line.svg" alt="Navigation Center" width="16000" />
            </div>
            <div className="hidden md:flex space-x-8 gap-5">
              <Link href="/" className={`${isActive("/")} hover:text-gray-900 text-center`}>
                Home
              </Link>
              <Link href="/BookRaqis" className={`${isActive("/BookRaqis")} w-24 text-center hover:text-gray-900`}>
                Book Raqis
              </Link>
              <Link href="/SelfRuqyah" className={`${isActive("/SelfRuqyah")} w-24 text-center hover:text-gray-900`}>
                Self-Ruqyah
              </Link>
              <Link href="/AboutUs" className={`${isActive("/AboutUs")} w-24 text-center hover:text-gray-900`}>
                About Us
              </Link>
              <div className="relative" ref={profileDropdownRef}>
                <button
                  onClick={() => {
                    const token = localStorage.getItem("fe-token");
                    if (!token) {
                      handleLoginClick();
                    } else {
                      setProfileDropdownOpen(!profileDropdownOpen);
                    }
                  }}
                  className={`${isActive("/MyProfile")} w-24 hover:text-gray-900 flex items-center md:w-32`}
                >
                  {localStorage.getItem("fe-token") ? (
                    <span className="flex justify-center items-center">
                      My Profile
                      <svg className={`w-4 h-4 ml-1 mb-1 transform transition-transform duration-200 ${profileDropdownOpen ? "rotate-180" : ""}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                      </svg>
                    </span>
                  ) : (
                    "Login"
                  )}
                </button>
                {profileDropdownOpen && localStorage.getItem("fe-token") && (
                  <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-md shadow-lg z-50 transition-all duration-300 ease-in-out transform opacity-0 translate-y-4" style={{ opacity: profileDropdownOpen ? 1 : 0, transform: profileDropdownOpen ? 'translateY(0)' : 'translateY(16px)' }}>
                    <Link href="/MyProfile" className="px-4 py-2 text-gray-700 hover:bg-gray-100 flex items-center" onClick={handleLinkClick}>
                      <FaEdit className="w-4 h-4 mr-2" />
                      My Profile
                    </Link>
                    <Link href="/MyBookings" className=" px-4 py-2 text-gray-700 hover:bg-gray-100 flex items-center" onClick={handleLinkClick}>
                      <FaBookBookmark className="w-5 -ml-1 h-4 mr-2" />
                      My Bookings
                    </Link>
                    <Link href="/login" className="px-4 py-2 text-gray-700 hover:bg-gray-100 flex items-center" onClick={handleLogout}>
                      <LuLogOut className="w-4 h-4 mr-2" />
                      Logout
                    </Link>
                  </div>
                )}
              </div>
            </div>
            <div className="md:hidden sm:block z-50">
              <button onClick={() => setIsOpen(!isOpen)} className="text-gray-700 focus:outline-none w-8 h-8 relative" aria-label={isOpen ? "Close menu" : "Open menu"}>
                <span className={`absolute w-6 h-0.5 bg-current transform transition-all duration-300 ease-in-out ${isOpen ? "rotate-45 translate-y-0" : "-translate-y-2"}`} />
                <span className={`absolute w-6 h-0.5 bg-current transform transition-all duration-300 ease-in-out ${isOpen ? "opacity-0" : "opacity-100"}`} />
                <span className={`absolute w-6 h-0.5 bg-current transform transition-all duration-300 ease-in-out ${isOpen ? "-rotate-45 translate-y-0" : "translate-y-2"}`} />
              </button>
            </div>
          </div>
          {/* Mobile Menu */}
          <div className={`md:hidden fixed inset-0 bg-black transition-opacity duration-300 ease-in-out ${isOpen ? "opacity-50 z-40" : "opacity-0 pointer-events-none"}`} onClick={() => setIsOpen(false)} />
          <div className={`md:hidden fixed right-0 top-0 h-full w-[80%] max-w-[320px] bg-white z-50 shadow-xl transform transition-all duration-300 ease-in-out ${isOpen ? "translate-x-0" : "translate-x-full"}`}>
            <div className="flex flex-col h-full overflow-y-auto">
              <div className="p-4 border-b border-gray-200 relative">
                <button onClick={() => setIsOpen(false)} className="absolute right-4 top-4 p-2 hover:bg-gray-100 rounded-full transition-all duration-200 transform hover:rotate-90" aria-label="Close menu">
                  <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
                <Link href="/" onClick={handleLinkClick}>
                  <img src="/images/logo.png" alt="Ruqya logo" width="120" className="mx-auto transform transition-transform duration-300 hover:scale-105" />
                </Link>
              </div>
              <div className="flex flex-col p-4 space-y-3">
                <Link href="/" className={`${isActive("/")} px-4 py-3 rounded-lg hover:bg-gray-100 transition-colors duration-200`} onClick={handleLinkClick}>
                  Home
                </Link>
                <Link href="/BookRaqis" className={`${isActive("/BookRaqis")} px-4 py-3 rounded-lg hover:bg-gray-100 transition-colors duration-200`} onClick={handleLinkClick}>
                  Book Raqis
                </Link>
                <Link href="/SelfRuqyah" className={`${isActive("/SelfRuqyah")} px-4 py-3 rounded-lg hover:bg-gray-100 transition-colors duration-200`} onClick={handleLinkClick}>
                  Self-Ruqyah
                </Link>
                <Link href="/AboutUs" className={`${isActive("/AboutUs")} px-4 py-3 rounded-lg hover:bg-gray-100 transition-colors duration-200`} onClick={handleLinkClick}>
                  About Us
                </Link>

                <div className="border-t border-gray-200 pt-3">
                  <button
                    onClick={() => {
                      const token = localStorage.getItem("fe-token");
                      if (!token) {
                        handleLoginClick();
                      } else {
                        setMobileProfileDropdownOpen(!mobileProfileDropdownOpen);
                      }
    
                    }}
                    className={`${isActive("/MyProfile")} w-full px-4 py-3 rounded-lg flex flex-row items-center  ${mobileProfileDropdownOpen ? "bg-RuqyaGreen text-white" : "hover:bg-gray-100"} transition-colors duration-200`}
                  >
                    <span>
                      {localStorage.getItem("fe-token") ? (
                        <span className="flex justify-center items-center gap-2 flex-row w-full">
                          My Profile
                          <svg className={`w-4 h-4 transform transition-transform duration-200 ${mobileProfileDropdownOpen ? "rotate-180" : ""}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                          </svg>
                        </span>
                      ) : (
                        "Login"
                      )}
                    </span>
                  </button>

                  {mobileProfileDropdownOpen && localStorage.getItem("fe-token") && (
                    <div className="mt-2 bg-gray-50 rounded-lg">
                      <Link href="/MyProfile" className="px-6 py-3 text-gray-700 hover:bg-gray-100 flex items-center rounded-t-lg" onClick={handleLinkClick}>
                        <FaEdit className="w-4 h-4 mr-3" />
                        View Profile
                      </Link>
                      <Link href="/MyBookings" className="px-6 py-3 text-gray-700 hover:bg-gray-100 flex items-center" onClick={handleLinkClick}>
                        <FaBookBookmark className="w-4 h-4 mr-3" />
                        My Bookings
                      </Link>
                      <Link href="/login" className="px-6 py-3 text-gray-700 hover:bg-gray-100 flex items-center rounded-b-lg" onClick={handleLogout}>
                        <LuLogOut className="w-4 h-4 mr-3" />
                        Logout
                      </Link>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </nav>
      </header>
    </>
  );
};

export default Header;
