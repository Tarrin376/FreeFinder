import { GroupPreview } from "../types/GroupPreview";
import ProfilePicAndStatus from "./ProfilePicAndStatus";

interface GroupPreviewMessageProps {
    group: GroupPreview,
    selectedGroup: GroupPreview | undefined,
    action: (group: GroupPreview) => void
}

function GroupPreviewMessage({ group, selectedGroup, action }: GroupPreviewMessageProps) {
    return (
        <div className={`w-full flex items-center justify-between mt-3 p-2 ${group === selectedGroup ? "bg-[#f7f7f7]" : "hover:bg-[#f7f7f7]"} 
        rounded-[6px] cursor-pointer transition-all ease-out duration-100`} onClick={() => action(group)}>
            <div className="flex items-center gap-3">
                <ProfilePicAndStatus
                    profilePicURL=""
                    size={50}
                    username={group.groupName}
                    statusStyles="before:hidden"
                />
                <div>
                    <div className="flex justify-between items-center">
                        <p>{group.groupName}</p>
                    </div>
                    <div className="flex justify-between items-center">
                        <p className="text-ellipsis whitespace-nowrap overflow-hidden flex-grow">
                            {!group.lastMessage ? 
                            <span className="text-sm text-side-text-gray">
                                Say hello and get collaborating!
                            </span> :
                            <>
                                <span className="text-sm text-main-blue">{`${group.lastMessage.from.username}: `}</span>
                                <span className="text-sm text-side-text-gray">{group.lastMessage.messageText}</span>
                            </>}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default GroupPreviewMessage;