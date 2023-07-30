import { IMessage } from "../models/IMessage";
import { useContext } from "react";
import { UserContext } from "../providers/UserContext";
import ProfilePicAndStatus from "./ProfilePicAndStatus";
import { getTime } from "../utils/getTime";
import MessageSent from "./MessageSent";
import { GroupPreview } from "../types/GroupPreview";
import Tags from "./Tags";
import File from "./File";
import { IMessageFile } from "../models/IMessageFile";
import LoadingSvg from "./LoadingSvg";

interface MessageProps {
    message: IMessage,
    isLastMessage: boolean,
    sendingMessage: boolean,
    groupMembers: GroupPreview["members"]
}

function Message({ message, isLastMessage, sendingMessage, groupMembers }: MessageProps) {
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
                <div className="flex gap-[5px] items-end">
                    {isOwnMessage && <MessageSent sendingMessage={sendingMessage && isLastMessage} />}
                    <p className={`rounded-[13px] p-2 px-4 w-fit ${isOwnMessage ? "rounded-tr-none bg-highlight self-end" : 
                    "bg-[#eeeff3] rounded-tl-none"}`}>
                        <Tags
                            isOwnMessage={isOwnMessage}
                            messageText={message.messageText}
                            groupMembers={groupMembers}
                        />
                        <div className="mt-1 pb-[5px] flex flex-col gap-2">
                            {message.files.map((file: IMessageFile) => {
                                return (
                                    <File fileType={file.fileType} fileName={file.name}>
                                        {!sendingMessage ?
                                        <a href={file.url} download={file.name}>
                                            <button className="main-btn w-fit !h-[30px] text-sm rounded-[6px]">
                                                Download
                                            </button>
                                        </a> : 
                                        <LoadingSvg 
                                            size={14} 
                                            colour="#4E73F8" 
                                        />}
                                    </File>
                                )
                            })}
                        </div>
                    </p>
                </div>
            </div>
        </div>
    )
}

export default Message;