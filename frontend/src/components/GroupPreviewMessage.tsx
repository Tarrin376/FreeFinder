import { GroupPreview } from "../types/GroupPreview";
import ProfilePicAndStatus from "./ProfilePicAndStatus";
import { useContext, useEffect, useCallback, useState } from "react";
import { UserContext } from "../providers/UserContext";
import Typing from "./Typing";
import { useUsersTyping } from "../hooks/useUsersTyping";
import { IMessage } from "../models/IMessage";
import { getTime } from "../utils/getTime";
import MessageSent from "./MessageSent";
import Tags from "./Tags";

interface GroupPreviewMessageProps {
    group: GroupPreview,
    setAllUnreadMessages: React.Dispatch<React.SetStateAction<number>>,
    selectedGroup: GroupPreview | undefined,
    action: (group: GroupPreview) => void
}

function GroupPreviewMessage({ group, setAllUnreadMessages, selectedGroup, action }: GroupPreviewMessageProps) {
    const userContext = useContext(UserContext);
    const [lastMessage, setLastMessage] = useState<IMessage>(group.lastMessage);
    const [unreadMessages, setUnreadMessages] = useState<number>(0);
    const usersTyping = useUsersTyping(group.groupID);
    const isOwnMessage = lastMessage && lastMessage.from.username === userContext.userData.username;

    const showNewMessages = useCallback((message: IMessage, id: string): void => {
        if (id === group.groupID) {
            setLastMessage(message);
            if (selectedGroup?.groupID !== group.groupID) {
                setUnreadMessages((cur) => cur + 1);
            }
        }
    }, [group.groupID, selectedGroup?.groupID]);

    function openGroupChat() {
        setAllUnreadMessages((cur) => cur - unreadMessages);
        setUnreadMessages(0);
        action(group);
    }

    useEffect(() => {
        userContext.socket?.on("receive-message", showNewMessages);

        return () => {
            userContext.socket?.off("receive-message", showNewMessages);
        }
    }, [userContext.socket, showNewMessages]);

    return (
        <div className={`w-full flex items-center justify-between p-2 ${group.groupID === selectedGroup?.groupID ? 
        "bg-[#f7f7f7]" : "hover:bg-[#f7f7f7]"} rounded-[6px] cursor-pointer transition-all ease-out duration-100 
        overflow-hidden flex-shrink-0`} onClick={openGroupChat}>
            <div className="flex items-center gap-3 overflow-hidden w-full">
                <ProfilePicAndStatus
                    profilePicURL=""
                    size={45}
                    username={group.groupName}
                    statusStyles="before:hidden"
                />
                <div className="overflow-hidden flex-grow">
                    <div className="flex justify-between items-center gap-2">
                        <span className="text-ellipsis whitespace-nowrap overflow-hidden text-[15px] font-bold">
                            {group.groupName}
                        </span>
                        {lastMessage && 
                        <span className="text-sm text-side-text-gray flex-shrink-0">
                            {getTime(lastMessage.createdAt)}
                        </span>}
                    </div>
                    <div className="flex items-center justify-between gap-[5px]">
                        {usersTyping.length > 0 ?
                        <div className="mt-[4px]">
                            <Typing 
                                usersTyping={usersTyping}
                                textStyles="!text-sm"
                                dotStyles="w-[4px] h-[4px]"
                            />
                        </div> : 
                        <div className="flex justify-between items-center overflow-hidden">
                            <div className="flex-grow overflow-hidden">
                                {!lastMessage ? 
                                <p className="text-sm text-ellipsis whitespace-nowrap overflow-hidden">
                                    Say hello to everyone!
                                </p> :
                                <Tags
                                    isOwnMessage={isOwnMessage}
                                    messageText={`${isOwnMessage ? "You" : lastMessage.from.username}: ${lastMessage.messageText}`}
                                    groupMembers={group.members}
                                    textStyles="text-sm"
                                    styles="text-ellipsis whitespace-nowrap overflow-hidden"
                                />}
                            </div>
                        </div>}
                        {unreadMessages > 0 ?
                        <div className="bg-error-text rounded-full px-2 py-[1px] flex items-center justify-center">
                            <span className="text-xs text-main-white">{unreadMessages}</span>
                        </div> : 
                        lastMessage && lastMessage.from.username === userContext.userData.username &&
                        <MessageSent sendingMessage={false} />}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default GroupPreviewMessage;