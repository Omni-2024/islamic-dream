'use client'

import {useEffect} from "react";
import {useAuth} from "@/contexts/AuthContexts";
import {HambergerMenu, User} from 'iconsax-react';


export default function Header({
  onToggleSidebar,
}: {
  onToggleSidebar: () => void;
}) {
  const { user: currentUser } = useAuth();

  useEffect(() => {
    // const fetchUserProfile = async () => {
    //   try {
    //     const userData = await getUserProfile()
    //     setUser(userData)
    //   } catch (error) {
    //     console.error('Failed to fetch user profile:', error)
    //   }
    // }
    //
    // fetchUserProfile()
  }, [])

  return (
    <header className=" bg-white shadow-md px-6 border-b border-dark-50">
      <div className="container  mx-auto px-4 sm:px-6 lg:px-6 ">
        <div className="flex justify-between items-center py-4">
          <button
            onClick={onToggleSidebar}
            className="text-gray-500 hover:text-gray-600 focus:outline-none focus:text-gray-600"
          >
            <HambergerMenu size="32" color="#000000" variant="Broken"/>
          </button>
          <div className="flex items-center border border-dark-50 rounded-3xl px-3 py-2">
            <span className="text-gray-700 text-sm font-bold mr-3">{currentUser?.name}</span>
            <div className="w-10 h-10 rounded-full bg-primary-700 flex justify-center items-center">
              <User
                  size="26"
                  color="#FFFFFF"
                  variant="Bold"
              />
            </div>

          </div>
        </div>
      </div>
    </header>
  );
}
