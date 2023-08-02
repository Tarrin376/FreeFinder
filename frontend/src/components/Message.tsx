import { IMessage } from "../models/IMessage";
import { useContext, useState } from "react";
import { UserContext } from "../providers/UserContext";
import ProfilePicAndStatus from "./ProfilePicAndStatus";
import { getTime } from "../utils/getTime";
import MessageSent from "./MessageSent";
import { GroupPreview } from "../types/GroupPreview";
import Tags from "./Tags";
import { IMessageFile } from "../models/IMessageFile";
import ErrorPopUp from "./ErrorPopUp";
import { AnimatePresence } from "framer-motion";
import MessageFile from "./MessageFile";

interface MessageProps {
    message: IMessage,
    isLastMessage: boolean,
    sendingMessage: boolean,
    groupMembers: GroupPreview["members"],
}

function Message({ message, isLastMessage, sendingMessage, groupMembers }: MessageProps) {
    const userContext = useContext(UserContext);
    const isOwnMessage = message.from.username === userContext.userData.username;
    const [errorMessage, setErrorMessage] = useState<string>("");
    
    return (
        <div className={`flex gap-3 items-start w-full ${isOwnMessage ? "flex-row-reverse" : ""}`}>
            <AnimatePresence>
                {errorMessage !== "" && 
                <ErrorPopUp 
                    errorMessage={errorMessage} 
                    setErrorMessage={setErrorMessage}
                />}
            </AnimatePresence>
            <div className="w-fit h-fit relative flex-shrink-0">
                <ProfilePicAndStatus
                    profilePicURL={message.from.profilePicURL}
                    profileStatus={message.from.status}
                    size={45}
                    username={message.from.username}
                    statusStyles={`before:top-[31px] before:w-[17px] before:h-[17px]
                    ${!isOwnMessage ? "before:left-[30px]" : ""}`}
                />
            </div>
            <div className={`flex flex-col gap-[5px] ${isOwnMessage ? "items-end" : "items-start"}`}>
                <div className={`flex items-center gap-2 ${isOwnMessage ? "flex-row-reverse" : ""}`}>
                    <p className="text-[15px]">{isOwnMessage ? "You" : message.from.username}</p>
                    <p className="text-sm text-side-text-gray">{getTime(message.createdAt)}</p>
                </div>
                <div className="flex gap-[5px] items-end">
                    {isOwnMessage && <MessageSent sendingMessage={sendingMessage && isLastMessage} />}
                    <div className={`rounded-[13px] p-2 px-4 w-fit ${isOwnMessage ? "rounded-tr-none bg-highlight self-end" : 
                    "bg-very-light-gray rounded-tl-none"}`}>
                        <Tags
                            isOwnMessage={isOwnMessage}
                            messageText={message.messageText}
                            groupMembers={groupMembers}
                            textStyles="text-[15px]"
                        />
                        {message.files.length > 0 &&
                        <div className="mt-2 pb-[5px] flex flex-col gap-2 overflow-hidden">
                            {message.files.map((file: IMessageFile, index: number) => {
                                return (
                                    <MessageFile 
                                        file={file}
                                        sending={sendingMessage && isLastMessage}
                                        key={index}
                                    />
                                )
                            })}
                        </div>}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Message;