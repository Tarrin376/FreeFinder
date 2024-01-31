import { IMessage } from "../../models/IMessage";
import { useContext, useState, useRef } from "react";
import { UserContext } from "../../providers/UserProvider";
import ProfilePicAndStatus from "../Profile/ProfilePicAndStatus";
import { getTime } from "../../utils/getTime";
import MessageSent from "./MessageSent";
import { GroupPreview } from "../../types/GroupPreview";
import Tags from "../Tags";
import { IMessageFile } from "../../models/IMessageFile";
import ErrorPopUp from "../Error/ErrorPopUp";
import { AnimatePresence } from "framer-motion";
import MessageFile from "./MessageFile";
import OrderRequest from "../Order/OrderRequest";
import { FoundUsers } from "../../types/FoundUsers";
import DateOccurred from "../DateOccurred";
import { useWindowSize } from "src/hooks/useWindowSize";
import { MIN_DUAL_WIDTH } from "./MessagePreviews";

interface MessageProps {
    message: IMessage,
    isLastMessage: boolean,
    sendingMessage: boolean,
    groupMembers: GroupPreview["members"],
    seller: FoundUsers[number],
    workType: string,
    groupID: string,
    firstMessageOfDay?: boolean
}

function Message({ message, isLastMessage, sendingMessage, groupMembers, seller, workType, groupID, firstMessageOfDay }: MessageProps) {
    const date = useRef<string>(new Date(message.createdAt).toLocaleDateString());
    const [errorMessage, setErrorMessage] = useState<string>("");
    const userContext = useContext(UserContext);
    
    const isOwnMessage = message.from.username === userContext.userData.username;
    const windowSize = useWindowSize();
    
    return (
        <div className="w-full">
            {firstMessageOfDay && 
            <DateOccurred 
                date={date.current} 
                dateBgColour="#fdfdfd"
            />}
            <div className={`flex gap-3 w-full items-start ${isOwnMessage ? "flex-row-reverse" : ""}`}>
                <AnimatePresence>
                    {errorMessage !== "" && 
                    <ErrorPopUp 
                        errorMessage={errorMessage} 
                        setErrorMessage={setErrorMessage}
                    />}
                </AnimatePresence>
                {windowSize >= 515 &&
                <div className="w-fit h-fit relative flex-shrink-0">
                    <ProfilePicAndStatus
                        profilePicURL={message.from.profilePicURL}
                        profileStatus={message.from.status}
                        size={windowSize < MIN_DUAL_WIDTH ? 37 : 47}
                        username={message.from.username}
                        statusRight={!isOwnMessage}
                    />
                </div>}
                <div className={`flex flex-col gap-[5px] ${isOwnMessage ? "items-end" : "items-start"} ${message.orderRequest ? "flex-grow" : ""}`}>
                    <div className={`flex items-center gap-2 ${isOwnMessage ? "flex-row-reverse" : ""}`}>
                        {windowSize < 515 &&
                        <div className="flex-shrink-0">
                            <ProfilePicAndStatus
                                profilePicURL={message.from.profilePicURL}
                                profileStatus={message.from.status}
                                size={28}
                                username={message.from.username}
                                statusRight={!isOwnMessage}
                            />
                        </div>}
                        <div>
                            <p className="text-[15px] text-ellipsis whitespace-nowrap overflow-hidden">
                                {isOwnMessage ? "You" : message.from.username}
                            </p>
                        </div>
                        <p className="text-sm text-side-text-gray flex-shrink-0">
                            {getTime(message.createdAt)}
                        </p>
                    </div>
                    <div className={`flex gap-[5px] items-end ${isOwnMessage ? "justify-end" : "justify-start"} w-full`}>
                        {isOwnMessage && 
                        <MessageSent 
                            sendingMessage={sendingMessage && isLastMessage}
                            colour="#30ab4b"
                        />}
                        {message.orderRequest ?
                        <OrderRequest 
                            message={message} 
                            seller={seller}
                            workType={workType}
                            groupID={groupID}
                            key={message.messageID}
                        /> :
                        <div className={`${windowSize >= 515 ? "rounded-[13px]" : "!rounded-[13px]"} w-fit p-[6px] px-3 
                        ${isOwnMessage ? "rounded-tr-none bg-highlight self-end" : "bg-very-light-gray rounded-tl-none"}`}>
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
                        </div>}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Message;