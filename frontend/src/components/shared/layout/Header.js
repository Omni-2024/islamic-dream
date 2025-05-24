"use client";
import Link from "next/link";
import { useState, useEffect, useRef } from "react";
import { usePathname, useRouter } from "next/navigation";
import { ErrorMessage } from "@/components/shared/common/ErrorMessage";
import { auth } from "@/lib/firebase";
import { motion, AnimatePresence } from "framer-motion";
import { Edit, Bookmark, Logout } from 'iconsax-react';
import { getOwnProfile} from "@/lib/api";


const startCase = (str) => {
  if (!str) return ""
  return str
    .toLowerCase()
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ")
}

const Header = () => {
    const defaultValues = {
    name: "",
    email: "",
    gender: "",
    dob: new Date().toISOString().split('T')[0],
    country: "",
    language: "",
    mobile: ""
  };
  const [isOpen, setIsOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [mobileProfileDropdownOpen, setMobileProfileDropdownOpen] = useState(false);
  const [error, setError] = useState({ message: "", type: "" });
  const pathname = usePathname();
  const router = useRouter();
  const profileDropdownRef = useRef(null);
  const [scrolled, setScrolled] = useState(false);
  const [formData, setFormData] = useState(defaultValues);
  const [userData, setUserData] = useState(null);

  
  // Add these new states for mobile detection and scroll behavior
  const [prevScrollPos, setPrevScrollPos] = useState(0);
  const [visible, setVisible] = useState(true);
  const [isMobile, setIsMobile] = useState(false);

  const isActive = (path) => (pathname === path ? "text-RuqyaGreen" : "text-gray-700");
  const isCurrent = () => "bg-RuqyaGreen";

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
      const fetchUserData = async () => {
        try {
          const data = await getOwnProfile();
          if (!data) {
            throw new Error("No data returned from API");
          }
          setUserData(data);
          setFormData({
            name: startCase(data.name) || defaultValues.name,
            email: data.email || defaultValues.email,
            gender: data.gender || defaultValues.gender,
            dob: data.DOB || defaultValues.dob,
            country: data.country || defaultValues.country,
            language: data.language || defaultValues.language,
            mobile: data.mobile || defaultValues.mobile,
          });
        } catch (error) {
          console.error("Error fetching user data:", error);

          setUserData({
            ...defaultValues,
            DOB: defaultValues.dob
          });
          setFormData(defaultValues);
        }
      };
  
      fetchUserData();
    }, []);

  // Add this useEffect for mobile detection
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024); // 1024 is where lg breakpoint starts in Tailwind
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Modify the scroll effect to handle navbar visibility
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollPos = window.pageYOffset;
      
      // Set scrolled state for styling
      if (window.scrollY > 50) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
      
      // Handle visibility on mobile
      if (isMobile) {
        // Visible when scrolling up or at the top
        setVisible((prevScrollPos > currentScrollPos) || currentScrollPos < 10);
      } else {
        // Always visible on desktop
        setVisible(true);
      }
      
      setPrevScrollPos(currentScrollPos);
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [prevScrollPos, isMobile]);

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
    const InterpreterRegex = /^\/Interpreter\/[a-f0-9]{24}$/;
    if (!token) {
      if (pathname !== "/" && pathname !== "/BookInterpreters" && pathname !== "/SelfRuqyah" && pathname !== "/AboutUs" && pathname !== "/signup" && pathname !== "/login" && !InterpreterRegex.test(pathname)) {
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
    <header className={`w-full ${isMobile ? 'absolute' : 'fixed'} top-0 left-0 right-0 z-40`}>
      <nav className={`${isCurrent()} transition-all duration-300 w-full ${
        scrolled 
          ? "py-2 bg-RuqyaGreen/95 backdrop-blur-md shadow-lg" 
          : "py-6 bg-RuqyaGreen"
      }`}>
          <div className=" mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center md:mx-[6%] md:pl-1 md:pr-3 ">
            <div className="flex items-center z-50">
              <Link href="/" className="text-gray-700 w-40 hover:text-gray-900">
                <img src="/images/Logo-W.png" alt="Ruqya logo"
                  className={`transition-all duration-300 ${scrolled ? 'w-32' : 'w-40'}`}
                />
              </Link>
            </div>
            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center space-x-8 ">
            <div className="flex items-center space-x-6 ">
                <NavLink href="/" active={isActive("/")}>
                  Home
                </NavLink>
                <NavLink href="/BookInterpreters" active={isActive("/BookInterpreters")}>
                  Book Interpreters
                </NavLink>
                {/* <NavLink href="/SelfRuqyah" active={isActive("/SelfRuqyah")}>
                  Self-Ruqyah
                </NavLink> */}
                <NavLink href="/AboutUs" active={isActive("/AboutUs")}>
                  About Us
                </NavLink>
              </div>

              <div className="h-8 w-px bg-white/20"></div>

              
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
                  className="bg-RuqyaLightGreen text-white py-2 px-6 rounded-full font-medium hover:bg-white hover:text-header transition-all duration-200"
                >
                  {localStorage.getItem("fe-token") ? (
                    <span className="flex items-center">
                      My Profile
                      <svg className={`ml-2 w-4 h-4 transition-transform duration-200 ${profileDropdownOpen ? "rotate-180" : ""}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                      </svg>
                    </span>
                  ) : (
                    "Login"
                  )}
                </button>

                <AnimatePresence>
                  {profileDropdownOpen  && localStorage.getItem("fe-token") && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      transition={{ duration: 0.2 }}
                      className="absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-xl border border-gray-100 overflow-hidden z-50"
                    >
                      <div className="px-5 pt-5 pb-3 border-b border-gray-100">
                        <p className="text-sm text-gray-500">Signed in as</p>
                        <p className="font-medium text-header">{userData?.email || "User"} </p>
                      </div>
                      
                      <div className="py-2">
                        <Link 
                          href="/MyProfile" 
                          className="flex items-center px-5 py-3 text-gray-700 hover:bg-gray-50 transition-colors" 
                          onClick={handleLinkClick}
                        >
                          <Edit size={15}  color="#36454F" variant="Outline"  className="w-4 h-4 mr-3 text-gray-500" />
                          <span>My Profile</span>
                        </Link>
                        
                        <Link 
                          href="/MyBookings" 
                          className="flex items-center px-5 py-3 text-gray-700 hover:bg-gray-50 transition-colors" 
                          onClick={handleLinkClick}
                        >
                          <Bookmark size ={15} className="w-4 h-4 mr-3 text-gray-500" color="#36454F" />
                          <span>My Bookings</span>
                        </Link>
                      </div>
                      
                      <div className="py-2 border-t border-gray-100">
                        <button 
                          onClick={handleLogout} 
                          className="flex items-center w-full text-left px-5 py-3 text-red-600 hover:bg-red-50 transition-colors"
                        >
                          <Logout size={15}  color="currentColor" variant="Outline" className="w-4 h-4 mr-3" />
                          <span>Logout</span>
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>

            <div className="lg:hidden z-50">
              <button onClick={() => setIsOpen(!isOpen)} 
                className="relative w-10 h-10 flex items-center justify-center focus:outline-none"
                >
               <div className="w-6 flex flex-col items-end justify-center">
                  <span className={`block h-0.5 rounded-full bg-white transition-all duration-300 ease-out ${isOpen ? 'w-6 transform rotate-45 translate-y-1' : 'w-6 mb-1'}`}></span>
                  <span className={`block h-0.5 rounded-full bg-white transition-all duration-300 ease-out ${isOpen ? 'opacity-0 w-0' : 'w-4'}`}></span>
                  <span className={`block h-0.5 rounded-full bg-white transition-all duration-300 ease-out ${isOpen ? 'w-6 transform -rotate-45 -translate-y-1' : 'w-6 mt-1'}`}></span>
                </div>
              </button>
            </div>
          </div>
          {/* Mobile Menu */}
          <div 
          className={`fixed inset-0 bg-black/80 backdrop-blur-sm z-40 transition-opacity duration-300 lg:hidden ${
            isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
          }`} 
          onClick={() => setIsOpen(false)} />
          <div 
           className={`fixed inset-y-0 right-0 w-full max-w-sm bg-white shadow-2xl transform transition-transform duration-300 ease-in-out z-50 lg:hidden ${
            isOpen ? "translate-x-0" : "translate-x-full"
          }`}>
            <div className="flex flex-col h-full overflow-y-auto pt-6 pb-8">
              <div className="px-6 mb-8 flex justify-between items-center">
              <Link href="/" onClick={handleLinkClick}>
                  <img src="/images/Logo-B.png" alt="Ruqya logo" className="w-32"
                  />
                </Link>
                <button onClick={() => setIsOpen(false)} 
                className="p-2 text-gray-500 hover:text-gray-700 rounded-full hover:bg-gray-100 transition-all"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <div className="px-6 py-2">
              <MobileNavLink 
                href="/" 
                active={isActive("/")} 
                onClick={handleLinkClick}
              >
                Home
              </MobileNavLink>
              
              <MobileNavLink 
                href="/BookInterpreters"
                active={isActive("/BookInterpreters")}
                onClick={handleLinkClick}
              >
                Book Interpreters
              </MobileNavLink>
              
              {/*<MobileNavLink */}
              {/*  href="/SelfRuqyah" */}
              {/*  active={isActive("/SelfRuqyah")} */}
              {/*  onClick={handleLinkClick}*/}
              {/*>*/}
              {/*  Self-Ruqyah*/}
              {/*</MobileNavLink>*/}
              
              <MobileNavLink 
                href="/AboutUs" 
                active={isActive("/AboutUs")} 
                onClick={handleLinkClick}
              >
                About Us
              </MobileNavLink>
            </div>

                <div className="mt-4 pt-4 border-t border-gray-100 px-6">
                <button
                  onClick={() => {
                    const token = localStorage.getItem("fe-token");
                    if (!token) {
                      handleLoginClick();
                    } else {
                      setMobileProfileDropdownOpen(!mobileProfileDropdownOpen);
                    }
                  }}
                  className={`${isActive("/MyProfile")} flex items-center justify-between w-full py-3 px-2 text-header hover:bg-gray-50 rounded-md transition-all duration-200`}
                >
                  <span>
                    {localStorage.getItem("fe-token") ? (
                      <span className="flex justify-center items-center gap-2 flex-row w-full">
                        My Profile
                        <svg className={`w-5 h-5 transition-transform duration-200 ${mobileProfileDropdownOpen ? "rotate-180" : ""}`}  fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                        </svg>
                      </span>
                    ) : (
                      "Login"
                    )}
                  </span>
                </button>
                  <AnimatePresence>
                    {mobileProfileDropdownOpen && localStorage.getItem("fe-token") && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="overflow-hidden"
                      >
                        <div className="py-2 pl-11 space-y-1">
                          <Link 
                            href="/MyProfile" 
                            className="flex items-center py-3 text-gray-700 hover:text-header transition-colors" 
                            onClick={handleLinkClick}
                          >
                          <Edit size={15}  color="#36454F" variant="Outline"  className="w-4 h-4 mr-3 text-gray-500" />
                            <span>View Profile</span>
                          </Link>
                          
                          <Link 
                            href="/MyBookings" 
                            className="flex items-center py-3 text-gray-700 hover:text-header transition-colors" 
                            onClick={handleLinkClick}
                          >
                          <Bookmark size ={15} className="w-4 h-4 mr-3 text-gray-500" color="#36454F" />
                            <span>My Bookings</span>
                          </Link>
                          
                          <button 
                            onClick={handleLogout} 
                            className="flex items-center w-full text-left py-3 text-red-600"
                          >
                          <Logout size={15}  color="currentColor" variant="Outline" className="w-4 h-4 mr-3" />
                            <span>Logout</span>
                          </button>
                        </div>
                        <div className="px-5 pt-3 pb-2 border-t border-gray-100">
                          <p className="text-sm text-gray-500">Signed in as</p>
                          <p className="font-medium text-header">{userData?.email || "User"}</p>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>

              </div>
            </div>
          </div>
        </nav>
      </header>

    <div className={`h-20 ${scrolled ? 'h-16' : 'h-24'} transition-all duration-300`} />
  </>

  );
};

// Desktop Nav Link Component
const NavLink = ({ href, active, children }) => {
  return (
    <Link 
      href={href} 
      className={`relative px-3 py-2 text-white ${active} group transition-colors duration-200 hover:text-RuqyaLightGreen `}    >
      {children}
      <span className={`absolute left-0 right-0 bottom-0 h-0.5 bg-RuqyaLightGreen transform origin-left transition-transform duration-300  ${active.includes("font-medium") ? "scale-x-100" : "scale-x-0"} group-hover:scale-x-100`}></span>
    </Link>
  );
};

// Mobile Nav Link Component
const MobileNavLink = ({ href, active, onClick, children }) => {
  return (
    <Link 
      href={href} 
      className={`block py-4 px-2 mb-1 ${active} hover:text-header transition-colors duration-200 border-b border-gray-100 rounded-md hover:bg-gray-50`}
      onClick={onClick}
    >
      {children}
    </Link>
  );
};

export default Header;
