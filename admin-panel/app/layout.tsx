import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster"
import {AuthProvider} from "@/contexts/AuthContexts";
import {ChatProvider} from "@/components/getStream/chat/ChatContextProvider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Admin - Islamic Dreams",
  description: 'Islamic Dreams is a web application dedicated to making authentic Islamic dream interpretation accessible to everyone.',
  icons: {
    icon: [
        { url: '/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
        { url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' }
    ],
    apple: [
        { url: '/apple-touch-icon.png' }
    ]
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        suppressHydrationWarning
      >
      {/*<SessionProvider>{children}</SessionProvider>*/}
      <AuthProvider>
          <ChatProvider >
          {children}
          <Toaster />
          </ChatProvider>
      </AuthProvider>
      </body>
    </html>
  );
}
