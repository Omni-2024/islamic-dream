import { useEffect, useState } from 'react';
import { getRakis, getUsers, getRevenueData, getTodaySessions } from '@/lib/api';
import { useAuth } from '@/contexts/AuthContexts';
import { formatDateTimeWithOffset } from '@/lib/utils';
import { toast } from '@/components/ui/use-toast';

interface Session {
    meetingId: string;
    topic: string;
    date: Date;
    rakiId: string;
    userId: string;
    notificationSend: boolean;
    status:MeetingStatus
}

export enum MeetingStatus {
    SCHEDULED = 'scheduled',
    RESCHEDULED = 'rescheduled',
    CANCELLED = 'cancelled',
    PENDING='pending'
}

export  interface IRevenueData {
    totalMeetings: number;
    completedMeetings: number;
    cancelledMeetings: number;
    revenue: number;
    averageMeetingsPerDay: number;
}


export const useDashboardData = () => {
    const { user: currentUser } = useAuth();
    const [isSuperAdmin, setIsSuperAdmin] = useState<boolean>(false);
    const [revenueData, setRevenueData] = useState({
        totalMeetings: 0,
        completedMeetings: 0,
        cancelledMeetings: 0,
        revenue: 0,
        averageMeetingsPerDay: 0,
    });

    const [dateFilter, setDateFilter] = useState<{ type: string; start?: Date; end?: Date }>({ type: 'all' });
    const [todaySessions, setTodaySessions] = useState<Session[]>([]);
    const [userData, setUserData] = useState([]);
    const [rakiData, setRakiData] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (currentUser) {
            setIsSuperAdmin(currentUser.role === 'super-admin');
        }
    }, [currentUser]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [fetchedRakiData, fetchedUserData] = await Promise.all([getRakis(), getUsers()]);
                setRakiData(fetchedRakiData);
                setUserData(fetchedUserData);
            } catch (error) {
                toast({ title: "Error", description: `Failed to fetch data. ${error}`, variant: "destructive" });
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    useEffect(() => {
        const fetchSessions = async () => {

            try {
                setLoading(true)
                if (isSuperAdmin) {
                    const revenue = await getRevenueData({
                        filterType: dateFilter.type,
                        startDate: formatDateTimeWithOffset(dateFilter.start),
                        endDate: formatDateTimeWithOffset(dateFilter.end),
                    });
                    setRevenueData(revenue);
                }
                const sessions = await getTodaySessions();
                setTodaySessions(Array.isArray(sessions) ? sessions : []);
            } catch (error) {
                console.error("Failed to fetch dashboard data:", error);
            }
             finally {
                setLoading(false);
            }

        };
        fetchSessions();
    }, [currentUser, dateFilter,isSuperAdmin]);



    return { isSuperAdmin, revenueData, todaySessions, dateFilter, setDateFilter, userData, rakiData, loading };
};
