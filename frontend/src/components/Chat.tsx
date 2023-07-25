import ProfilePicAndStatus from "./ProfilePicAndStatus";
import ActionsIcon from "../assets/actions.png";
import ChatBox from "./ChatBox";
import { GroupPreview } from "../types/GroupPreview";
import GroupMembers from "./GroupMembers";
import { useState } from "react";
import { AnimatePresence } from "framer-motion";

interface ChatProps {
    group: GroupPreview
}

const visibleMembers = 3;

function Chat({ group }: ChatProps) {
    const [toggleGroupMembers, setToggleGroupMembers] = useState<boolean>(false);

    return (
        <div className="flex flex-col flex-grow">
            <div className="border-b border-light-border-gray bg-transparent pl-6 pb-6 w-full flex items-center justify-between flex-shrink-0">
                <div className="flex items-center gap-4">
                    <ProfilePicAndStatus
                        profilePicURL=""
                        size={50}
                        username={group.groupName}
                        statusStyles="before:hidden"
                    />
                    <div>
                        <div className="flex items-center gap-3">
                            <p className="text-[20px]">{group.groupName}</p>
                            <button className="change">Change</button>
                        </div>
                    </div>
                </div>
                <div className="flex items-center gap-5">
                    <div className="inline-flex relative" onMouseLeave={() => setToggleGroupMembers(false)}>
                        {group.members.slice(0, visibleMembers).map((member, index) => {
                            return (
                                <ProfilePicAndStatus
                                    profilePicURL={member.user.profilePicURL}
                                    size={45}
                                    username={member.user.username}
                                    statusStyles="ml-[-12px] before:hidden"
                                    imgStyles="outline outline-[3px] outline-main-white"
                                    key={index}
                                />
                            )
                        })}
                        {group.members.length > visibleMembers &&
                        <div className="w-[45px] h-[45px] rounded-full outline outline-[3px] outline-main-white 
                        bg-very-light-gray flex items-center justify-center ml-[-13px] cursor-pointer" 
                        onMouseEnter={() => setToggleGroupMembers(true)}>
                            <p className="text-[18px] text-side-text-gray">
                                {`+${group.members.length - visibleMembers}`}
                            </p>
                        </div>}
                        <AnimatePresence>
                            {toggleGroupMembers &&
                            <GroupMembers 
                                members={group.members} 
                                creatorID={group.creatorID}
                            />}
                        </AnimatePresence>
                    </div>
                    <img src={ActionsIcon} className="w-[27px] h-[27px]" alt="" />
                </div>
            </div>
            <ChatBox groupID={group.groupID} />
        </div>
    )
}

export default Chat;