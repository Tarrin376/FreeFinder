import GroupPreviewMessage from "./GroupPreviewMessage";
import { GroupPreview } from "../types/GroupPreview";
import { memo } from "react";

interface AllGroupsProps {
    allGroups: GroupPreview[],
    pageRef: React.RefObject<HTMLDivElement>,
    group: GroupPreview | undefined,
    showChat: boolean,
    setGroup: React.Dispatch<React.SetStateAction<GroupPreview | undefined>>,
    setShowChat: React.Dispatch<React.SetStateAction<boolean>>,
    setGlobalUnreadMessages: React.Dispatch<React.SetStateAction<number>>
}

function AllGroups({ allGroups, pageRef, group, showChat, setGroup, setShowChat, setGlobalUnreadMessages }: AllGroupsProps) {
    function updateMessageGroup(nextGroup: GroupPreview) {
        setShowChat(true);
        setGroup(nextGroup);
    }

    return (
        <div className="overflow-y-scroll scrollbar-hide flex-grow w-full flex flex-col gap-3" ref={pageRef}>
            {allGroups.map((msgGroup: GroupPreview) => {
                return (
                    <GroupPreviewMessage 
                        group={msgGroup}
                        selectedGroup={group}
                        showChat={showChat}
                        action={updateMessageGroup}
                        setGlobalUnreadMessages={setGlobalUnreadMessages}
                        key={msgGroup.groupID}
                    />
                )
            })}
        </div>
    )
}

export default memo(AllGroups);