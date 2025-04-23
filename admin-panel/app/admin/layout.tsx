"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import Sidebar from "@/components/Sidebar";
import Header from "@/components/Header";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
    const pathname = usePathname();

    // ✅ Check if the current path matches the meeting page pattern
    const isMeetingPage = /^\/admin\/meeting\/[^/]+\/[^/]+$/.test(pathname);

    return (
        <div className="flex h-screen bg-gray-100">
            {!isMeetingPage && <Sidebar collapsed={sidebarCollapsed} />}
            <div className="flex-1 flex flex-col overflow-hidden">
                {!isMeetingPage && (
                    <Header onToggleSidebar={() => setSidebarCollapsed(!sidebarCollapsed)} />
                )}
                <main className="flex-1 overflow-x-hidden overflow-y-auto bg-primary-25 p-6">
                    {children}
                </main>
            </div>
        </div>
    );
}
