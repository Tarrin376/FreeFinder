import { GroupPreview } from "../types/GroupPreview";
import ProfilePicAndStatus from "./ProfilePicAndStatus";
import { useContext, useEffect, useCallback, useState } from "react";
import { UserContext } from "../providers/UserProvider";
import Typing from "./Typing";
import { useUsersTyping } from "../hooks/useUsersTyping";
import { IMessage } from "../models/IMessage";
import { getTime } from "../utils/getTime";
import MessageSent from "./MessageSent";
import Tags from "./Tags";
import axios from "axios";
import { IUser } from "src/models/IUser";
import Count from "./Count";

interface GroupPreviewMessageProps {
    group: GroupPreview,
    selectedGroup: GroupPreview | undefined,
    action: (group: GroupPreview) => void
}

function GroupPreviewMessage({ group, selectedGroup, action }: GroupPreviewMessageProps) {
    const userContext = useContext(UserContext);
    const [lastMessage, setLastMessage] = useState<IMessage>(group.lastMessage);

    const [unreadMessages, setUnreadMessages] = useState<number>(group.members.find((member) => {
        return member.user.username === userContext.userData.username
    })!.unreadMessages);

    const usersTyping = useUsersTyping(group.groupID);
    const isOwnMessage = lastMessage && lastMessage.from.username === userContext.userData.username;

    const clearUnreadMessages = useCallback(async (): Promise<void> => {
        try {
            const resp = await axios.delete<{ userData: IUser, message: string }>
            (`/api/users/${userContext.userData.username}/message-groups/${group.groupID}/unreadMessages`);

            userContext.setUserData(resp.data.userData);
            setUnreadMessages(0);
        }
        catch (_: any) {
            // Ignore failure to clear unread messages and try again when the user re-enters the group chat.
        }
    }, [userContext, group.groupID]);

    const showNewMessages = useCallback(async (message: IMessage, id: string): Promise<void> => {
        if (id !== group.groupID) {
            return;
        }

        setLastMessage(message);
        if (selectedGroup?.groupID !== group.groupID) {
            setUnreadMessages((cur) => cur + 1);
            return;
        } 
        
        await clearUnreadMessages();
    }, [group.groupID, selectedGroup?.groupID, clearUnreadMessages]);

    useEffect(() => {
        userContext.socket?.on("receive-message", showNewMessages);

        return () => {
            userContext.socket?.off("receive-message", showNewMessages);
        }
    }, [userContext.socket, showNewMessages]);

    useEffect(() => {
        (async () => {
            if (selectedGroup?.groupID === group.groupID && unreadMessages > 0) {
                await clearUnreadMessages();
            }
        })();
    }, [selectedGroup, group.groupID, clearUnreadMessages, unreadMessages]);

    return (
        <div className={`w-full flex items-center justify-between p-2 ${group.groupID === selectedGroup?.groupID ? 
        "bg-hover-light-gray" : "hover:bg-hover-light-gray"} rounded-[6px] cursor-pointer transition-all ease-out duration-100 
        overflow-hidden flex-shrink-0`} onClick={() => action(group)}>
            <div className="flex items-center gap-3 overflow-hidden w-full">
                <ProfilePicAndStatus
                    profilePicURL=""
                    size={45}
                    username={group.groupName}
                />
                <div className="overflow-hidden flex-grow">
                    <div className="flex justify-between items-center gap-2">
                        <span className="text-ellipsis whitespace-nowrap overflow-hidden text-[15px]">
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
                                    messageText={`${isOwnMessage ? "You" : 
                                    lastMessage.from.username}: ${lastMessage.messageText !== "" ? lastMessage.messageText : 
                                    `<Attached ${lastMessage.files.length} ${lastMessage.files.length === 1 ? "file" : 
                                    "files"}>`}`}
                                    groupMembers={group.members}
                                    textStyles="text-sm text-side-text-gray"
                                    styles="text-ellipsis whitespace-nowrap overflow-hidden"
                                />}
                            </div>
                        </div>}
                        {unreadMessages > 0 ? <Count value={unreadMessages} /> : 
                        lastMessage && lastMessage.from.username === userContext.userData.username &&
                        <MessageSent sendingMessage={false} />}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default GroupPreviewMessage;