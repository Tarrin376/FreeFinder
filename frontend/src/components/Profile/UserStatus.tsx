import { UserStatus } from "src/enums/UserStatus";
import { capitalizeWord } from "src/utils/capitalizeWord";
import { useUserStatus } from "src/hooks/useUserStatus";

interface UserStatusProps {
    profileStatus: UserStatus,
    username: string
}

function UserStatusText({ profileStatus, username }: UserStatusProps) {
    const status = useUserStatus(username, profileStatus);
    
    const textStatusColour = status === UserStatus.ONLINE ? 'text-green-500' : status === UserStatus.AWAY ? 
    'text-orange-400' : status === UserStatus.BUSY ? 'text-error-text' : 'text-side-text-gray';

    const borderStatusColour = status === UserStatus.ONLINE ? 'border-green-500' : status === UserStatus.AWAY ? 
    'border-orange-400' : status === UserStatus.BUSY ? 'border-error-text' : 'border-side-text-gray';

    return (
        <div>
            <p className={`text-sm ${textStatusColour} border rounded-[6px] px-2 ${borderStatusColour} w-fit`}>
                {capitalizeWord(status)}
            </p>
        </div>
    )
}

export default UserStatusText;