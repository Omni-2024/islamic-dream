"use client";

import {useEffect, useState} from "react";
import {Tabs, TabsContent, TabsList, TabsTrigger} from "@/components/ui/tabs";
import {IMeeting, SessionList} from "@/components/SessionList";
import {getMeetings, getMeetingsByRakiId, getRakis, getUsers, MeetingStatus} from "@/lib/api";
import {toast} from "@/components/ui/use-toast";
import {useAuth, UserDto} from "@/contexts/AuthContexts";
import withAuth from "@/hoc/withAuth";
import {motion} from "framer-motion";

const SessionsPage=()=> {
    const [activeTab, setActiveTab] = useState("all");
    const [meetings, setMeetings] = useState<IMeeting[]>([]);
    const [rakis, setRakis] = useState<UserDto[]>([]);
    const [users, setUsers] = useState<UserDto[]>([]);
    const [loading, setLoading] = useState(true);
    const { user :currentUser} = useAuth()


    useEffect(() => {
        const fetchData = async () => {
            try {
                const [meetingData, rakiData, userData] = await Promise.all([
                    currentUser?.role ==="super-admin"?getMeetings():getMeetingsByRakiId(),
                    getRakis(),
                    getUsers(),
                ]);
                setMeetings(meetingData);
                setRakis(rakiData || []);
                setUsers(userData || []);
            } catch (error) {
                console.error("Error fetching data:", error);
                toast({
                    title: "Error",
                    description: "Failed to fetch data. Please try again.",
                    variant: "destructive",
                });
            } finally {
                setLoading(false);
            }
        };

        if (currentUser) fetchData();

    }, [currentUser]);

    const currentDate = new Date();

    const rakiMap = rakis.reduce((acc, raki) => {
        if (raki._id) acc[raki._id] = raki.name || "Unknown Raki";
        return acc;
    }, {} as Record<string, string>);

    const userMap = users.reduce((acc, user) => {
        if (user._id) acc[user._id] = user.name || "Unknown User";
        return acc;
    }, {} as Record<string, string>);

    const enhancedSessions = meetings.map((session) => ({
        ...session,
        rakiName: rakiMap[session.rakiId] || "Unknown Raki",
        userName: userMap[session.userId] || "Unknown User",
    }));

    const sortedSessions = enhancedSessions.sort(
        (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
    );

    const filteredSessions = sortedSessions.filter((session) => {
        const sessionDate = new Date(session.date);
        const isCancelled =session.status === MeetingStatus.CANCELLED
        if (activeTab === "cancelled") return  isCancelled;
        if (activeTab === "completed") return (!isCancelled && sessionDate < currentDate);
        if (activeTab === "upcoming") return (!isCancelled && sessionDate >= currentDate);
        return true;
    });

    if (loading) return  (
        <div className="w-full h-full  flex flex-col items-center justify-center">
            <motion.div
                animate={{ rotate: 360 }}
                transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                className="rounded-full h-16 w-16 border-t-4 border-b-4 border-[#0C8281]"
            />
        </div>
    );

    return (
        <div className="container mx-auto py-10">
            <h1 className="text-3xl font-bold mb-6">Sessions</h1>
            <Tabs defaultValue="all" onValueChange={setActiveTab}>
                <TabsList className="grid w-full grid-cols-4 mb-6 bg-gray-100 p-1 rounded-lg">
                    <TabsTrigger value="all" className="data-[state=active]:bg-primary-700 data-[state=active]:text-white data-[state=active]:font-bold">
                        All Sessions
                    </TabsTrigger>
                    <TabsTrigger value="completed" className="data-[state=active]:bg-primary-700 data-[state=active]:text-white data-[state=active]:font-bold">
                        Completed Sessions
                    </TabsTrigger>
                    <TabsTrigger value="upcoming" className="data-[state=active]:bg-primary-700 data-[state=active]:text-white data-[state=active]:font-bold">
                        Upcoming Sessions
                    </TabsTrigger>
                    <TabsTrigger value="cancelled" className="data-[state=active]:bg-primary-700 data-[state=active]:text-white data-[state=active]:font-bold">
                        Cancelled Sessions
                    </TabsTrigger>
                </TabsList>

                <TabsContent value="all">
                    <SessionList sessions={filteredSessions} />
                </TabsContent>
                <TabsContent value="completed">
                    <SessionList sessions={filteredSessions} />
                </TabsContent>
                <TabsContent value="upcoming">
                    <SessionList sessions={filteredSessions} />
                </TabsContent>
                <TabsContent value="cancelled">
                    <SessionList sessions={filteredSessions} />
                </TabsContent>
            </Tabs>
        </div>
    );
}

export default withAuth(SessionsPage, ["admin", "super-admin"]);

