'use client';

import { useEffect, useState } from 'react';
import { CancelSessionDialog } from '@/components/CancelSessionDialog';
import { RescheduleSessionDialog } from '@/components/ResheduledSessionDialog';
import { DateRangeFilter } from '@/components/DateRangeFilter';
import { useChat } from '@/components/getStream/chat/ChatContextProvider';
import { ChatWidgetWrapper } from '@/components/getStream/chat/ChatWidgetWrapper';
import { toast } from '@/components/ui/use-toast';
import withAuth from '@/hoc/withAuth';
import { cancelSession, rescheduleSession } from '@/lib/api';
import SessionTable from "@/components/ui/dashboard/SessionTable";
import {useDashboardData} from "@/components/ui/dashboard/useDashboardData";
import {useAuth} from "@/contexts/AuthContexts";
import {DashboardStats} from "@/components/ui/dashboard/DashboardStats";
import {motion} from "framer-motion";
import {sendMeetingEmail} from "@/lib/emailService";

const AdminDashboard = () => {
    const { setUserId } = useChat();
    const { user :currentUser} = useAuth()

    const { isSuperAdmin, revenueData, todaySessions, setDateFilter, userData, rakiData,loading } = useDashboardData();

    const [cancelSessionId, setCancelSessionId] = useState<string | null>(null);
    const [rescheduleSessionId, setRescheduleSessionId] = useState<string | null>(null);
    const [sessionRakiId, setSessionRakiId] = useState<string | null>(null);

    useEffect(() => {
        if (currentUser) setUserId(currentUser._id);
    }, [currentUser]);

    const handleCancelSession = async (meetingId: string, reason: string) => {
        try {
            const results =await cancelSession(meetingId, reason);

            if (!results) throw new Error("Failed to reschedule session");

            const { user, raki, date,note } = results.meeting;

            if (!user || !raki) throw new Error("Invalid response from rescheduleSession");

            await sendMeetingEmail(
                user.email,
                raki.email,
                user.name,
                raki.name,
                date,
                `Unfortunately, your meeting has been canceled. Reason: ${note} A refund will be issued to ${user.name}.`,
                "Meeting Cancellation Notice"
            );
            toast({ title: "Success", description: "Session cancelled successfully!" });
            setCancelSessionId(null);
        } catch (error) {
            toast({ title: "Error", description: `Failed to cancel session ${error}`, variant: "destructive" });
        }
    };

    const getLocalFormattedDate = (date:Date) => {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        const hours = String(date.getHours()).padStart(2, '0');
        const minutes = String(date.getMinutes()).padStart(2, '0');
        const seconds = "00";

        return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
    };

    const handleRescheduleSession = async (meetingId: string, newDate: Date) => {
        try {
            // 2025-02-23 13:00:00
            const results = await rescheduleSession(meetingId,getLocalFormattedDate(newDate));

            if (!results) throw new Error("Failed to reschedule session");

            const { user, raki, date } = results.meeting;
            if (!user || !raki) throw new Error("Invalid response from rescheduleSession");

            await sendMeetingEmail(
                user.email,
                raki.email,
                user.name,
                raki.name,
                date,
                "Due to unforeseen circumstances, your upcoming meeting has been rescheduled. We appreciate your understanding and look forward to seeing you at the new time",
                "Meeting Rescheduled"
            );

            toast({ title: "Success", description: "Session rescheduled successfully!" });

            setRescheduleSessionId(null);
        } catch (error) {
            console.error("Error rescheduling session:", error);
            toast({
                title: "Error",
                description: `Failed to reschedule session: Please check availability with Raki`,
                variant: "destructive"
            });
        }
    };



    if (loading ){
        return (
            <div className="w-full h-full  flex flex-col items-center justify-center">
                <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                    className="rounded-full h-16 w-16 border-t-4 border-b-4 border-[#0C8281]"
                />
            </div>

        )
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold text-primary-700">{isSuperAdmin ? "Super " : ""} Admin Dashboard</h1>
                {isSuperAdmin && <DateRangeFilter onFilterChange={setDateFilter} />}
            </div>

            {isSuperAdmin && <DashboardStats revenueData={revenueData} />}

            <SessionTable sessions={todaySessions} userData={userData} rakiData={rakiData} setCancelSessionId={setCancelSessionId} setRescheduleSessionId={setRescheduleSessionId} isSuperAdmin={isSuperAdmin} setSessionRakiId={setSessionRakiId} />

            <CancelSessionDialog isOpen={!!cancelSessionId} onClose={() => setCancelSessionId(null)} onConfirm={(reason) => cancelSessionId && handleCancelSession(cancelSessionId, reason)} />
            <RescheduleSessionDialog isOpen={!!rescheduleSessionId} onClose={() => setRescheduleSessionId(null)} sessionRakiId={sessionRakiId} onConfirm={(newDate) => rescheduleSessionId && handleRescheduleSession(rescheduleSessionId, newDate)} />

            <ChatWidgetWrapper />
        </div>
    );
};

export default withAuth(AdminDashboard, ["admin", "super-admin"]);



