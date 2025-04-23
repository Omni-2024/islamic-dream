'use client';

import { MeetingProvider } from "@/components/getStream/MeetingProvider";
import { MeetingRoom } from "@/components/getStream/MeetingRoom";
import { motion } from "framer-motion";
import { useParams } from 'next/navigation';
import { useState, useEffect } from 'react';

export default function MeetingPage() {
    const params = useParams();
    const [data, setData] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const getData = async () => {
            try {
                const name = params.name;
                const meetingId = params.meetingId;

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
            <div className="flex flex-col items-center justify-center h-full" style={{ backgroundImage: 'url(/svg/auth-bg.svg)', backgroundSize: 'cover' }}>
                <div className="flex items-center justify-center">
                    <motion.div
                        animate={{rotate: 360}}
                        transition={{repeat: Infinity, duration: 1, ease: "linear"}}
                        className="rounded-full h-16 w-16 border-t-4 border-b-4 border-[#0C8281] "
                    />
                </div>
                <div className="text-center">
                    <h3 className="text-xl text-primary-200 font-semibold animate-pulse  mt-4">
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
        <div className="w-full min-h-90vh flex items-center justify-center p-4 md:p-5" style={{ backgroundImage: 'url(/svg/auth-bg.svg)', backgroundSize: 'cover' }}>
            <div className="w-full max-w-4xl m-auto rounded-lg p-4 md:p-6">
                <MeetingProvider userId={data.name} callId={data.meetingId}>
                    <MeetingRoom />
                </MeetingProvider>
            </div>
        </div>
    );
}