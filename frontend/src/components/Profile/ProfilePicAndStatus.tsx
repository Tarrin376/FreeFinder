import { useUserStatus } from 'src/hooks/useUserStatus';
import { UserStatus } from '../../enums/UserStatus';
import { generateLetterAvatar } from '../../utils/generateLetterAvatar';

interface ProfilePicAndStatusProps {
    profilePicURL: string, 
    size: number,
    username: string,
    profileStatus?: UserStatus,
    imgStyles?: string,
    setErrorMessage?: React.Dispatch<React.SetStateAction<string>>,
    loading?: boolean,
    action?: () => void,
    statusRight?: boolean
}

function ProfilePicAndStatus(props: ProfilePicAndStatusProps) {
    const status = useUserStatus(props.username, props.profileStatus);
    
    const statusColour = status === UserStatus.ONLINE ? 'bg-green-500' : status === UserStatus.AWAY ? 
    'bg-orange-400' : status === UserStatus.BUSY ? 'bg-error-text' : 'bg-side-text-gray';

    const defaultStatusStyles = `absolute rounded-full bg-light-green 
    border-2 border-main-white ${statusColour}`;

    function handleAction(): void {
        if (props.action) {
            props.action();
        }
    }

    return (
        <div className="w-fit h-fit relative" onClick={handleAction}>
            {props.profileStatus &&
            <div className={defaultStatusStyles}
            style={{ 
                top: `${Math.floor(props.size * 0.71)}px`, 
                left: props.statusRight ? `${Math.floor(props.size * 0.71)}px` : `0px`,
                width: `${Math.floor(props.size * 0.32)}px`,
                height: `${Math.floor(props.size * 0.32)}px`
            }}>
            </div>}
            {props.loading ? 
            <div className={`rounded-full loading ${props.imgStyles}`} 
            style={{ width: `${props.size}px`, height: `${props.size}px` }}>
            </div> : 
            props.profilePicURL === "" ? 
            <div className={`flex items-center justify-center cursor-pointer rounded-full ${props.imgStyles}`} style={{ 
                backgroundColor: generateLetterAvatar(props.username),
                width: `${props.size}px`, 
                height: `${props.size}px` 
            }}>
                <p className="text-main-white" style={{ fontSize: `${props.size * 0.50}px` }}>
                    {props.username[0].toUpperCase()}
                </p>
            </div> :
            <img 
                src={props.profilePicURL} alt="" 
                className={`rounded-full cursor-pointer object-cover border 
                border-light-gray bg-very-light-gray ${props.imgStyles}`}
                style={{ width: `${props.size}px`, height: `${props.size}px` }}
            />}
        </div>
    );
}

export default ProfilePicAndStatus;