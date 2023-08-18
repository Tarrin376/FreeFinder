import { useWindowSize } from "src/hooks/useWindowSize";

interface GroupMembersCountProps {
    action: () => void,
    numMembers: number,
    visibleMembers: number,
    size: number
    styles?: string
}

function GroupMembersCount({ action, numMembers, visibleMembers, size, styles }: GroupMembersCountProps) {
    const windowSize = useWindowSize();
    const defaultStyles = `rounded-full outline outline-[3px] outline-main-white bg-very-light-gray 
    flex items-center justify-center cursor-pointer`;

    return (
        <div className={`${defaultStyles} ${styles}`} onClick={action} style={{ width: `${size}px`, height: `${size}px` }}>
            <p className="text-[18px] text-side-text-gray">
                {`+${windowSize >= 575 ? numMembers - visibleMembers : numMembers}`}
            </p>
        </div>
    )
}

export default GroupMembersCount;