import { IMessage } from "../models/IMessage";
import { useContext } from "react";
import { UserContext } from "../providers/UserContext";
import ProfilePicAndStatus from "./ProfilePicAndStatus";
import { getTime } from "../utils/getTime";
import MessageSent from "./MessageSent";

interface MessageProps {
    message: IMessage,
    isLastMessage: boolean,
    sendingMessage: boolean
}

function Message({ message, isLastMessage, sendingMessage }: MessageProps) {
    const userContext = useContext(UserContext);
    const isOwnMessage = message.from.username === userContext.userData.username;

    return (
        <div className={`flex gap-3 items-start w-full ${isOwnMessage ? "flex-row-reverse" : ""}`}>
            <ProfilePicAndStatus
                profilePicURL={message.from.profilePicURL}
                size={42}
                username={message.from.username}
                statusStyles="before:hidden flex-shrink-0"
            />
            <div className={`flex flex-col gap-[5px] ${isOwnMessage ? "items-end" : "items-start"}`}>
                <div className={`flex items-center gap-2 ${isOwnMessage ? "flex-row-reverse" : ""}`}>
                    <p className="text-[15px]">{isOwnMessage ? "You" : message.from.username}</p>
                    <p className="text-sm text-side-text-gray">{getTime(message.createdAt)}</p>
                </div>
                <div className="flex gap-2 items-end">
                    {isOwnMessage && <MessageSent sendingMessage={sendingMessage && isLastMessage} />}
                    <p className={`rounded-[13px] p-2 px-4 w-fit ${isOwnMessage ? "rounded-tr-none bg-main-blue text-main-white self-end" : 
                    "bg-[#eeeff3] rounded-tl-none"}`}>
                        {message.messageText}
                    </p>
                </div>
            </div>
        </div>
    )
}

export default Message;