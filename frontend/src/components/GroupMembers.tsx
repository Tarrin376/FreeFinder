import { GroupPreview } from "../types/GroupPreview";
import ProfilePicAndStatus from "./ProfilePicAndStatus";
import { useContext } from "react";
import { UserContext } from "../providers/UserContext";
import { motion } from "framer-motion";

interface GroupMembersProps {
    members: GroupPreview["members"],
    creatorID: string
}

function GroupMembers({ members, creatorID }: GroupMembersProps) {
    const userContext = useContext(UserContext);

    async function removeUser(username: string): Promise<void> {

    }

    return (
        <motion.div className="dropdown flex flex-col gap-3 max-w-[380px]"
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} 
        transition={{ duration: 0.1 }}>
            {members.map((member: GroupPreview["members"][number], index: number) => {
                return (
                    <div className="flex justify-between items-center gap-[8px]" key={index}>
                        <div className="flex items-center gap-3 overflow-hidden">
                            <ProfilePicAndStatus
                                profilePicURL={member.user.profilePicURL}
                                profileStatus={member.user.status}
                                statusStyles="before:hidden"
                                username={member.user.username}
                                size={41}
                            />
                            <p className="overflow-hidden text-ellipsis whitespace-nowrap">
                                {member.user.username}
                            </p>
                        </div>
                        {member.user.username !== userContext.userData.username && userContext.userData.userID === creatorID &&
                        <button className={`red-btn w-fit h-fit py-1 text-[15px]`}onClick={() => removeUser(member.user.username)}>
                            Remove
                        </button>}
                    </div>
                )
            })}
        </motion.div>
    )
}

export default GroupMembers;