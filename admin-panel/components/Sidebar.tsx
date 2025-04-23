"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {Home, Users, Settings, DollarSign, Calendar, BookOpen,LogOut } from "lucide-react";
import { LogoutConfirmDialog } from './LogOutConfirmDialog'
import {usePathname} from "next/navigation";
import {useAuth} from "@/contexts/AuthContexts";


const menuItems = [
  { icon: Home, label: 'Dashboard', href: '/admin', roles: ["admin", "super-admin"] },
  { icon: BookOpen, label: 'Rakis', href: '/admin/rakis', roles: ["super-admin"] },
  { icon: Users, label: 'Users', href: '/admin/users', roles: ["admin", "super-admin"] },
  { icon: Calendar, label: 'Availability', href: '/admin/availability', roles: ["admin"] },
  { icon: Calendar, label: 'Sessions', href: '/admin/sessions', roles: ["admin", "super-admin"] },
  { icon: DollarSign, label: 'Payment', href: '/admin/payment', roles: ["admin", "super-admin"] },
  { icon: Settings, label: 'Settings', href: '/admin/settings', roles: ["admin", "super-admin"] },
];



export default function Sidebar({ collapsed }: { collapsed: boolean }) {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [isLogoutDialogOpen, setIsLogoutDialogOpen] = useState(false);
  const { user :currentUser} = useAuth()
  const pathname = usePathname();

  const handleLogoutClick = () => {
    setIsLogoutDialogOpen(true)
  }

  return (
      <>
        <motion.div
            className={`bg-primary-25 border-r border-dark-50 pt-4 pb-2 ${!collapsed ? "text-black h-full px-3" : "text-white"}`}
            initial={{width: collapsed ? 64 : 250}}
            animate={{width: collapsed ? 64 : 250}}
            transition={{duration: 0.3}}
        >
          <div className="mt-4 p0  w-150 h-12 flex items-center justify-center">
            <div className="bg-primary-700 w-12 h-12 flex items-center justify-center custom-box ">
              <motion.img
                  src="/images/logo2.png"
                  alt="Logo"
                  className="custom-logo "
                  animate={{rotate: collapsed ? 360 : 0}}
                  transition={{duration: 0.5}}/>
            </div>

          </div>

          <nav className="mt-8">
            <ul>
              {menuItems
                  .filter(item => item.roles.includes(currentUser?.role!!)) // Show only allowed items
                  .map((item, index) => (
                  <li key={item.label} className="mb-2">
                    <Link href={item.href}>
                      <motion.div
                          className={[
                            "flex items-center px-4 py-2 text-m font-semibold transition-colors duration-200",
                            !collapsed ? "rounded-xl" : "rounded-md text-black justify-center",
                            pathname === item.href ? "bg-primary-700 text-white" : "hover:bg-primary-100 hover:text-primary-500"
                          ].filter(Boolean).join(" ")}

                          onHoverStart={() => setHoveredIndex(index)}
                          onHoverEnd={() => setHoveredIndex(null)}
                      >
                        <item.icon className={`w-5 h-5 ${!collapsed ?"mr-3":""}`}/>
                        {!collapsed && <span>{item.label}</span>}
                        {collapsed && hoveredIndex === index && (
                            <motion.div
                                className="absolute left-16 bg-primary-700 text-white px-2 py-1 rounded z-50"
                                initial={{opacity: 0, x: -10}}
                                animate={{opacity: 1, x: 0}}
                                transition={{duration: 0.2}}
                            >
                              {item.label}
                            </motion.div>
                        )}
                      </motion.div>
                    </Link>
                  </li>
              ))}
            </ul>
          </nav>

          <div className={`absolute bottom-10 left-1 ${!collapsed ? "mx-3":""} `}>
            <button
                onClick={handleLogoutClick}
                className={`flex items-center w-full px-4 py-2 ${!collapsed ? "":"text-black"} text-l font-bold rounded-xl hover:bg-primary-1000 transition-colors duration-200`}
                onMouseEnter={() => setHoveredIndex(menuItems.length)}
                onMouseLeave={() => setHoveredIndex(null)}
            >
              <LogOut className="w-5 h-5 mr-3"/>
              {!collapsed && <span>Logout</span>}
              {collapsed && hoveredIndex === menuItems.length && (
                  <motion.div
                      className="absolute left-16 bg-red-600 text-white px-2 py-1 rounded custom-shadow"
                      initial={{opacity: 0, x: -10}}
                      animate={{opacity: 1, x: 0}}
                      transition={{duration: 0.2}}
                  >
                    Logout
                  </motion.div>
              )}
            </button>
          </div>
        </motion.div>
        <LogoutConfirmDialog
            isOpen={isLogoutDialogOpen}
            onClose={() => setIsLogoutDialogOpen(false)}/></>
  );
}
