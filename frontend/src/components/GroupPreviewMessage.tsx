import { GroupPreview } from "../types/GroupPreview";
import ProfilePicAndStatus from "./ProfilePicAndStatus";
import { useContext } from "react";
import { UserContext } from "../providers/UserContext";
import Typing from "./Typing";

interface GroupPreviewMessageProps {
    group: GroupPreview,
    usersTyping: { [key: string]: string[] },
    selectedGroup: GroupPreview | undefined,
    action: (group: GroupPreview) => void
}

function GroupPreviewMessage({ group, usersTyping, selectedGroup, action }: GroupPreviewMessageProps) {
    const userContext = useContext(UserContext);
    const isOwnMessage = group.lastMessage && group.lastMessage.from.username === userContext.userData.username;

    return (
        <div className={`w-full flex items-center justify-between p-2 ${group.groupID === selectedGroup?.groupID ? 
        "bg-[#f7f7f7]" : "hover:bg-[#f7f7f7]"} rounded-[6px] cursor-pointer transition-all ease-out duration-100 
        overflow-hidden`} onClick={() => action(group)}>
            <div className="flex items-center gap-3 overflow-hidden">
                <ProfilePicAndStatus
                    profilePicURL=""
                    size={50}
                    username={group.groupName}
                    statusStyles="before:hidden"
                />
                <div className="overflow-hidden">
                    <div className="flex justify-between items-center">
                        <p>{group.groupName}</p>
                    </div>
                    {usersTyping[group.groupID] ?
                    <Typing 
                        usersTyping={usersTyping[group.groupID]}
                        textStyles="!text-sm"
                        dotStyles="w-[4px] h-[4px]"
                    /> : 
                    <div className="flex justify-between items-center overflow-hidden">
                        <p className="text-ellipsis whitespace-nowrap overflow-hidden flex-grow text-sm text-side-text-gray">
                            {!group.lastMessage ? "Say hello and get collaborating!" : 
                            `${isOwnMessage ? "You" : group.lastMessage.from.username}: ${group.lastMessage.messageText}`}
                        </p>
                    </div>}
                </div>
            </div>
        </div>
    )
}

export default GroupPreviewMessage;