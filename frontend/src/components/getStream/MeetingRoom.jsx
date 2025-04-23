'use client';

import {
    StreamVideo,
    StreamCall,
    StreamTheme,
    SpeakerLayout,
    useCallStateHooks,
    NoiseCancellationProvider
} from '@stream-io/video-react-sdk';
import { useRouter } from 'next/navigation';
import { useMeeting } from './MeetingProvider';
import { Controls } from './Controls';
import "@stream-io/video-react-sdk/dist/css/styles.css";
import "react-tooltip/dist/react-tooltip.css";
import { NoiseCancellation } from "@stream-io/audio-filters-web";
import { useMemo } from "react";
import {motion} from "framer-motion";

export const MeetingRoom = () => {
    const { client, call, error } = useMeeting();
    const router = useRouter();
    const noiseCancellation = useMemo(() => new NoiseCancellation(), []);

    const ParticipantCount = () => {
        const { useParticipants } = useCallStateHooks();
        const participants = useParticipants();

        return (
            <div className="fixed top-4 right-4 z-50 px-4 py-2 bg-black/60  text-white rounded-lg font-medium flex items-center space-x-2">
                <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                    />
                </svg>
                <span>{participants.length}</span>
            </div>
        );
    };

    if (error) {
        return (
            <div
                className="min-h-screen  flex items-center justify-center p-4">
                <div className="absolute inset-0 overflow-hidden">
                    <div className="absolute inset-0 opacity-20">
                        {[...Array(6)].map((_, i) => (
                            <div
                                key={i}
                                className="absolute animate-pulse"
                                style={{
                                    top: `${Math.random() * 100}%`,
                                    left: `${Math.random() * 100}%`,
                                    width: `${Math.random() * 200 + 100}px`,
                                    height: `${Math.random() * 200 + 100}px`,
                                    background: 'radial-gradient(circle, rgba(12,130,129,0.3) 0%, transparent 70%)',
                                    animation: `pulse ${Math.random() * 2 + 2}s infinite`,
                                    animationDelay: `${Math.random() * 2}s`
                                }}
                            />
                        ))}
                    </div>
                </div>

                {/* Main error container */}
                <div className="relative max-w-xl w-full bg-gradient-to-br from-[#FF6961] via-[#0C8281] to-red-900 rounded-2xl ">
                    {/* Error icon with ripple effect */}
                    <div className="absolute -top-20 left-1/2 transform -translate-x-1/2">
                        <div className="relative">
                            <div className="animate-ping absolute inset-0 rounded-full opacity-20"/>
                            <div
                                className="animate-ping absolute inset-0 rounded-full bg-red-500 opacity-30 delay-150"/>
                            <div className="relative bg-white rounded-full p-4 shadow-xl">
                                <svg
                                    className="w-12 h-12 text-[#0C8281] animate-bounce"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                                    />
                                </svg>
                            </div>
                        </div>
                    </div>

                    {/* Error content */}
                    <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 shadow-2xl border border-[#0C8281]/20">
                        <div className="text-center space-y-6 mt-8">
                            {/* Glowing error title */}
                            <h2 className="text-4xl font-bold text-white animate-pulse">
                                {error || "Unable to Join"}
                            </h2>

                            {/* Animated separator */}
                            <div className="flex justify-center">
                                <div
                                    className="h-1 w-24 bg-gradient-to-r from-transparent via-[#0C8281] to-transparent animate-pulse"/>
                            </div>

                            <p className="text-gray-100 text-lg leading-relaxed">
                                We couldn't connect you to the meeting. This might be due to:
                            </p>

                            {/* Error reasons with icons */}
                            <div className="space-y-4 text-left text-gray-100">
                                <div className="flex items-center space-x-3">
                                    <svg className="w-5 h-5 text-red-400" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd"
                                              d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"/>
                                    </svg>
                                    <span>Invalid meeting credentials</span>
                                </div>
                                <div className="flex items-center space-x-3">
                                    <svg className="w-5 h-5 text-red-400" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd"
                                              d="M13.477 14.89A6 6 0 015.11 6.524l8.367 8.368zm1.414-1.414L6.524 5.11a6 6 0 018.367 8.367zM18 10a8 8 0 11-16 0 8 8 0 0116 0z"/>
                                    </svg>
                                    <span>Invalid user id</span>
                                </div>
                            </div>

                            <button
                                onClick={() => router.push('/')}
                                className="group relative px-8 py-4 bg-gradient-to-r from-[#FF6961] to-[#FF6961] text-white rounded-xl font-semibold shadow-xl
                       transition-all duration-300 ease-in-out hover:from-[#0b7473] hover:to-[#095857] hover:scale-105
                       focus:outline-none focus:ring-2 focus:ring-[#0C8281] focus:ring-offset-2 w-full mt-6"
                            >
              <span className="relative flex items-center justify-center gap-2">
                <svg
                    className="w-5 h-5 transform group-hover:-translate-x-1 transition-transform"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                >
                  <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M10 19l-7-7m0 0l7-7m-7 7h18"
                  />
                </svg>
                Return to Home
              </span>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    if (!client || !call) {
        return (
            <div className="flex items-center justify-center h-full">
                <motion.div
                    animate={{rotate: 360}}
                    transition={{repeat: Infinity, duration: 1, ease: "linear"}}
                    className="rounded-full h-16 w-16 border-t-4 border-b-4 border-[#0C8281]"
                />
            </div>
        );
    }

    return (
        <div className="flex flex-col items-center justify-center w-full h-full p-2 md:p-4">
            <StreamVideo client={client}>
                <StreamCall call={call}>
                    <StreamTheme>
                        <ParticipantCount />
                        <div className="w-full max-w-3xl m-auto">
                            <SpeakerLayout participantsBarPosition="bottom" />
                        </div>
                        <Controls onLeave={() => router.push('/')} />
                    </StreamTheme>
                </StreamCall>
            </StreamVideo>
        </div>
    );
};