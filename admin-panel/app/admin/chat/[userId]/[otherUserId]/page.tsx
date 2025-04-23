'use client'

import { Chat, Channel, ChannelHeader, MessageList, MessageInput, Thread, Window } from "stream-chat-react";
import { useChatClient } from "@/components/getStream/chat/useChatClient";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { motion } from "framer-motion";
import withAuth from "@/hoc/withAuth";

const ChatApp=()=> {
    const params = useParams();
    const [data, setData] = useState<{ userId: string; otherUserId: string } | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    const { client, channel, allChannels, selectChannel, isAdmin } = useChatClient(
        data?.userId || '',
        data?.otherUserId || ''
    );

    useEffect(() => {
        const getData = async () => {
            try {
                const userId = params.userId as string;
                const otherUserId = params.otherUserId as string;

                setData({
                    userId,
                    otherUserId,
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
                <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                    className="rounded-full h-16 w-16 border-t-4 border-b-4 border-[#0C8281]"
                />
                <h3 className="text-xl text-primary-700 font-semibold animate-pulse mt-4">
                    Connecting to chat...
                </h3>
            </div>
        );
    }

    if (!client) return null;

    return (
        <div className="flex h-full">
            {isAdmin && (
                <div className="w-64 border-r border-gray-200 overflow-y-auto">
                    <div className="p-4">
                        <h2 className="text-lg font-semibold mb-4">All Channels</h2>
                        {allChannels.map((ch) => (
                            <button
                                key={ch.id}
                                onClick={() => selectChannel(ch)}
                                className={`w-full text-left p-2 rounded mb-2 ${
                                    channel?.id === ch.id ? 'bg-blue-100' : 'hover:bg-gray-100'
                                }`}
                            >
                                {ch.data?.name || `Chat ${ch.id}`}
                            </button>
                        ))}
                    </div>
                </div>
            )}

            <div className="flex-1">
                {channel ? (
                    <Chat client={client}>
                        <Channel channel={channel}>
                            <Window>
                                <ChannelHeader />
                                <MessageList />
                                <MessageInput />
                            </Window>
                            <Thread />
                        </Channel>
                    </Chat>
                ) : (
                    <div className="flex items-center justify-center h-full">
                        <p className="text-gray-500">
                            {isAdmin ? "Select a channel to start chatting" : "Loading chat..."}
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}

export default withAuth(ChatApp, ["admin"]);
