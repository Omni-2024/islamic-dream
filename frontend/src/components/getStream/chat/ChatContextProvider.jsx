'use client'

import React, { createContext, useContext, useState, ReactNode } from 'react';


const ChatContext = createContext(undefined);

export const ChatProvider = ({ children }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [userId, setUserId] = useState(null);
    // const [otherUserData, setOtherUserData] = useState(null);


    const toggleChat = (newState) => {
        console.log("Chat toggled:", newState);
        setIsOpen(newState);
    };

    return (
        <ChatContext.Provider value={{
            isOpen,
            setIsOpen: toggleChat,
            userId,
            setUserId,
        }}>
            {children}
        </ChatContext.Provider>
    );
};

export const useChat = () => {
    const context = useContext(ChatContext);
    if (context === undefined) {
        throw new Error('useChat must be used within a ChatProvider');
    }
    return context;
};