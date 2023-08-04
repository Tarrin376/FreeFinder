import GroupPreviewMessage from "./GroupPreviewMessage";
import { GroupPreview } from "../types/GroupPreview";
import { memo } from "react";

interface AllGroupsProps {
    allGroups: GroupPreview[],
    pageRef: React.RefObject<HTMLDivElement>,
    group: GroupPreview | undefined,
    setGroup: React.Dispatch<React.SetStateAction<GroupPreview | undefined>>
}

function AllGroups({ allGroups, pageRef, group, setGroup }: AllGroupsProps) {
    function updateMessageGroup(nextGroup: GroupPreview) {
        setGroup(nextGroup);
    }

    return (
        <div className="overflow-y-scroll scrollbar-hide flex-grow w-full flex flex-col gap-3" ref={pageRef}>
            {allGroups.map((msgGroup: GroupPreview, index: number) => {
                return (
                    <GroupPreviewMessage 
                        group={msgGroup}
                        selectedGroup={group}
                        action={updateMessageGroup}
                        key={index}
                    />
                )
            })}
        </div>
    )
}

export default memo(AllGroups);