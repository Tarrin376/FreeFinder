import { GroupPreview } from "../types/GroupPreview";
import ProfilePicAndStatus from "./ProfilePicAndStatus";
import { useContext } from "react";
import { UserContext } from "../providers/UserProvider";
import { motion } from "framer-motion";
import Button from "./Button";
import CreatorIcon from "../assets/creator.png";

interface GroupMembersProps {
    groupMembers: GroupPreview["members"],
    creatorID: string,
    removeUser: (userID: string) => Promise<string | undefined>,
    setErrorMessage: React.Dispatch<React.SetStateAction<string>>,
}

function GroupMembers({ groupMembers, creatorID, removeUser, setErrorMessage }: GroupMembersProps) {
    const userContext = useContext(UserContext);

    return (
        <motion.div className="dropdown flex flex-col gap-3 w-[350px] z-20 max-h-[350px] overflow-y-scroll pr-[8px]"
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.1 }}>
            {groupMembers.map((member: GroupPreview["members"][number], index: number) => {
                return (
                    <div className="flex justify-between items-center gap-[8px]" key={index}>
                        <div className="flex items-center gap-3 overflow-hidden">
                            <ProfilePicAndStatus
                                profilePicURL={member.user.profilePicURL}
                                username={member.user.username}
                                size={41}
                            />
                            <p className="overflow-hidden text-ellipsis whitespace-nowrap text-[15px]" title={member.user.username}>
                                {member.user.username}
                            </p>
                            {member.user.userID === creatorID && 
                            <img 
                                src={CreatorIcon} 
                                className="w-[16px] h-[16px]" 
                                alt="" 
                            />}
                        </div>
                        {member.user.username !== userContext.userData.username && userContext.userData.userID === creatorID &&
                        <Button
                            action={() => removeUser(member.user.userID)}
                            defaultText="Remove"
                            loadingText="Removing"
                            styles="red-btn w-fit h-[30px] rounded-[6px]"
                            textStyles="text-[15px] text-error-text"
                            setErrorMessage={setErrorMessage}
                            loadingSvgSize={20}
                            loadingSvgColour="#F43C3C"
                        />}
                    </div>
                )
            })}
        </motion.div>
    )
}

export default GroupMembers;