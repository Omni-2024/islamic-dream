'use client';

import { MeetingProvider } from "@/components/getStream/MeetingProvider";
import { MeetingRoom } from "@/components/getStream/MeetingRoom";
import { motion } from "framer-motion";
import { useParams } from 'next/navigation';
import { useState, useEffect } from 'react';
import withAuth from "@/hoc/withAuth";

const MeetingPage=()=> {
    const params = useParams();
    const [data, setData] = useState<{ name: string; meetingId: string } | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const getData = async () => {
            try {
                const name = params.name as string;
                const meetingId = params.meetingId as string;

                setData({
                    name,
                    meetingId,
                });
            } catch (error) {
                console.error('Error fetching data:', error);
            } finally {
                setIsLoading(false);
            }
        };

        getData();
    }, [params]);

    if (isLoading) {
        return (
            <div className="flex flex-col items-center justify-center h-full">
                <div className="flex items-center justify-center">
                    <motion.div
                        animate={{rotate: 360}}
                        transition={{repeat: Infinity, duration: 1, ease: "linear"}}
                        className="rounded-full h-16 w-16 border-t-4 border-b-4 border-[#0C8281] "
                    />
                </div>
                <div className="text-center">
                    <h3 className="text-xl text-primary-700 font-semibold animate-pulse  mt-4">
                        Connecting to meeting...
                    </h3>
                </div>
            </div>
        );
    }

    if (!data) {
        return <div>Error loading meeting data</div>;
    }

    return (
        <MeetingProvider userId={data.name} callId={data.meetingId}>
            <MeetingRoom/>
        </MeetingProvider>

    );
}

export default withAuth(MeetingPage, ["admin"]);
