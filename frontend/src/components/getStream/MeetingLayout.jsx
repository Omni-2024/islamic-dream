"use client";

import React from "react";
import {
    useCallStateHooks,
    CallingState,
    StreamTheme,
    SpeakerLayout,
} from "@stream-io/video-react-sdk";
import { RotateLoader } from "react-spinners";
import { useRouter } from "next/router";
import {Controls} from "@/components/getStream/Controls";


export const MeetingLayout = ({ navigate }) => {
    const { useCallCallingState, useParticipants } = useCallStateHooks();
    const participants = useParticipants();
    const participantCount = participants.length;
    const callingState = useCallCallingState();

    const handleLeaveCall = () => {
        navigate("/"); // Navigate using the passed in navigate function
    };

    if (callingState !== CallingState.JOINED) {
        return (
            <div className="loading-container">
                <RotateLoader color="#36d7b7" size={20} />
            </div>
        );
    }

    return (
        <StreamTheme>
            {/* Participants counter */}
            <div
                style={{
                    position: "absolute",
                    top: "10px",
                    right: "10px",
                    zIndex: 100,
                    padding: "5px 10px",
                    margin: "auto",
                    background: "rgba(0, 0, 0, 0.5)",
                    color: "white",
                    borderRadius: "4px",
                }}
            >
                Participants: {participantCount}
            </div>

            {/* Main video layout */}
            <SpeakerLayout participantsBarPosition="bottom" />

            {/* Call controls */}
            <Controls onLeave={handleLeaveCall} />
        </StreamTheme>
    );
};
