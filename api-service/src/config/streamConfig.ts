import {StreamClient} from "@stream-io/node-sdk";
import {StreamChat} from "stream-chat";

const apiKeyVideo: string = process.env.STREAM_API_KEY_VIDEO || "";
const secretVideo: string = process.env.SECRET_KEY_VIDEO || "";

const apiKeyChat: string = process.env.STREAM_API_KEY_CHAT || "";
const secretChat: string = process.env.STREAM_API_SECRET_CHAT || "";



export const client = new StreamClient(apiKeyVideo, secretVideo);

export const serverClientChat = StreamChat.getInstance(apiKeyChat, secretChat);

