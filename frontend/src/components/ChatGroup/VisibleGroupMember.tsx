import ProfilePicAndStatus from "../Profile/ProfilePicAndStatus";
import CloseSvg from "../svg/CloseSvg";
import { useWindowSize } from "src/hooks/useWindowSize";
import { MIN_DUAL_WIDTH } from "../../views/LiveChat/LiveChat";
import { useContext } from "react";
import { UserContext } from "src/providers/UserProvider";

interface VisibleGroupMemberProps {
    creatorID: string,
    profilePicURL: string,
    username: string,
    action: () => Promise<void>
}

function VisibleGroupMember({ creatorID, profilePicURL, username, action }: VisibleGroupMemberProps) {
    const userContext = useContext(UserContext);
    const windowSize = useWindowSize();

    return (
        <div className="w-fit h-fit relative ml-[-12px] outline outline-[3px] outline-main-white rounded-full">
            <ProfilePicAndStatus
                profilePicURL={profilePicURL}
                size={windowSize >= MIN_DUAL_WIDTH ? 47 : 40}
                username={username}
            />
            {username !== userContext.userData.username && userContext.userData.userID === creatorID &&
            <button className="bg-error-text text-main-white rounded-full w-[18px] h-[18px] border-2 border-main-white
            absolute top-[30px] left-[0px] flex items-center justify-center cursor-pointer"
            onClick={action}>
                <CloseSvg 
                    size={12}
                    colour="#fdfdfd" 
                />
            </button>}
        </div>
    )
}

export default VisibleGroupMember;