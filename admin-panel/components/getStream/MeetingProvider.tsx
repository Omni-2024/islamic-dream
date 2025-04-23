"use client";

import { createContext, useContext, useEffect, useRef, useState } from "react";
import { StreamVideoClient } from "@stream-io/video-react-sdk";
import { useRouter } from "next/navigation";
import { getStreamToken, verifyMeetingAccess } from "@/lib/api";
import { useAuth } from "@/contexts/AuthContexts";

interface MeetingContextType {
  client: StreamVideoClient | null;
  call: any | null;
  error: string | null;
}

const MeetingContext = createContext<MeetingContextType>({
  client: null,
  call: null,
  error: null,
});

export const useMeeting = () => useContext(MeetingContext);

export const MeetingProvider: React.FC<{
  children: React.ReactNode;
  userId: string;
  callId: string;
}> = ({ children, userId, callId }) => {
  const { user: currentUser } = useAuth();
  const [token, setToken] = useState<string | null>(null);
  const [client, setClient] = useState<StreamVideoClient | null>(null);
  const [call, setCall] = useState<any | null>(null);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const hasLeft = useRef(false);

  useEffect(() => {
    const initializeMeeting = async () => {
      try {
        const { role } = await verifyMeetingAccess(callId, userId);
        console.log("ROle",role)
        const streamToken = await getStreamToken(userId, role);
        setToken(streamToken);
      } catch (error) {
        setError("Unauthorized access");
        // router.push('/');
      }
    };

    if (userId && callId) {
      initializeMeeting();
    }
  }, [userId, callId]);

  useEffect(() => {
    if (!token) return;

    const clientInstance = new StreamVideoClient({
      apiKey: process.env.NEXT_PUBLIC_STREAM_API_KEY!,
      user: { id: userId, name: currentUser?.name },
      token,
    });

    const callInstance: any = clientInstance.call("default", callId);
    setClient(clientInstance);
    setCall(callInstance);

    const joinCall = async () => {
      try {
        console.log("Joining call with callId:", callId);
        await callInstance.join({ create: false });
        console.log("Successfully joined the call");
      } catch (error) {
        console.error("Failed to join meeting:", error);
        setError("Failed to join meeting");
        router.push("/");
      }
    };

    joinCall();

    callInstance.on("leave", () => {
      if (!hasLeft.current) {
        hasLeft.current = true;
        router.push("/");
      }
    });

    return () => {
      if (!hasLeft.current) {
        hasLeft.current = true;
        callInstance?.leave();
      }
      clientInstance?.disconnectUser();
    };
  }, [token, userId, callId]);

  return (
    <MeetingContext.Provider value={{ client, call, error }}>
      {children}
    </MeetingContext.Provider>
  );
};
