"use client";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import Header from "@/components/shared/layout/Header";
import Footer from "@/components/shared/layout/Footer";
import Loading from "@/components/shared/common/LoadingSpinner";
import { ChatProvider } from "@/components/getStream/chat/ChatContextProvider";
import { AuthProvider } from "@/contexts/AuthContexts";

export default function LayoutClient({ children }) {
  const pathname = usePathname();
  const [showFooter, setShowFooter] = useState(true);
  const [showHeader, setShowHeader] = useState(true);
  const [loading, setLoading] = useState(true);
  const [menuLoading, setMenuLoading] = useState(true);
  const meetingRegex = /^\/Meeting\/\d+\/[a-zA-Z0-9]+$/;

  
  
  useEffect(() => {
    if (pathname === "/login" || pathname === "/signup" || pathname === "/meeting" || pathname === "/ForgotPassword" || meetingRegex.test(pathname)) {
      setShowFooter(false);
    } else {
      setShowFooter(true);
    }
  }, [pathname]);

  useEffect(() => {
    if (pathname === "/Meeting" || pathname === "/login"  || pathname === "/signup" || pathname === "/ForgotPassword"  || meetingRegex.test(pathname)) {
      setShowHeader(false);
    } else {
      setShowHeader(true);
    }
  }, [pathname]);

  useEffect(() => {
    setTimeout(() => {
      setMenuLoading(false);
    }, 2000);
    setMenuLoading(true);
  }, [pathname]);

  useEffect(() => {
    setLoading(false);
  }, []);
  
  if (loading) {
    return (
      <div className="bg-background text-foreground text-RuqyaGray min-h-screen">
        <Loading className="min-h-screen" />
      </div>
    );
  }

  return (
    <div className={`${pathname === "/Meeting" || meetingRegex.test(pathname) ? "max-h-[80vh]" : "bg-background"} text-foreground text-RuqyaGray text-[16px]`}>
      {showHeader && <Header />}
      <AuthProvider>
        <ChatProvider>{children}</ChatProvider>
      </AuthProvider>
      {showFooter && <Footer />}
    </div>
  );
}
