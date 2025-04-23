'use client'

import {useChat} from '@/components/getStream/chat/ChatContextProvider';
import FloatingChatWidget from '@/components/getStream/chat/ChatWidgetComponent';
import { useAuth } from '@/contexts/AuthContexts';
import {useEffect, useState} from 'react';
import {getOwnProfile} from "@/lib/api";

export const ChatWidgetWrapper = () => {
    const { userId, isOpen, setIsOpen } = useChat();
    const { user: currentUser } = useAuth();
    const [refetchedCurrentUser, setRefetchedCurrentUser] = useState(currentUser);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        console.log("ChatWidgetWrapper rendered with isOpen:", isOpen);
        console.log("Current user:", currentUser?._id);
        console.log("Other userId:", userId);

        // If user data is already available, use it immediately
        if (currentUser) {
            setRefetchedCurrentUser(currentUser);
            setIsLoading(false);
        }

        // Fetch user profile if needed
        const fetchUserProfile = async () => {
            try {
                if (!currentUser) {
                    console.log("Fetching user profile...");
                    const userData = await getOwnProfile();
                    console.log("Fetched user profile:", userData);
                    setRefetchedCurrentUser(userData);
                }
            } catch (error) {
                console.error("Error fetching user profile:", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchUserProfile();
    }, [currentUser, userId]);

    // Debug logs for chat state
    useEffect(() => {
        console.log("Chat isOpen state:", isOpen);
    }, [isOpen]);

    if (isLoading) {
        return null;
    }

    if (!refetchedCurrentUser) {
        console.log("No user data available");
        return null;
    }

    return (
        <FloatingChatWidget
            userId={refetchedCurrentUser._id}
            otherUserId={userId ?? ""}
            isOpen={isOpen}
            setIsOpen={setIsOpen}
        />
    );
};