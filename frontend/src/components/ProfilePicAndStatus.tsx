import { UserStatus } from '../enums/UserStatus';
import { generateLetterAvatar } from '../utils/generateLetterAvatar';

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
    const statusColour = props.profileStatus === UserStatus.ONLINE ? 'bg-green-500' : 
    props.profileStatus === 'AWAY' ? 'bg-orange-400' : 'bg-side-text-gray';

    const defaultStatusStyles = `w-[16px] h-[16px] absolute rounded-full b
    g-light-green border-2 border-main-white ${statusColour}`;

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
                top: `${props.size * 0.70}px`, 
                left: props.statusRight ? `${props.size * 0.70}px` : `0px` 
            }}>
            </div>}
            {props.loading ? 
            <div className={`rounded-full loading ${props.imgStyles}`} 
            style={{ width: `${props.size}px`, height: `${props.size}px` }}>
            </div> : 
            props.profilePicURL === "" ? 
            <div className={`flex items-center justify-center rounded-full ${props.imgStyles}`} style={{ 
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
                className={`rounded-full object-cover ${props.imgStyles} border border-light-gray`}
                style={{ width: `${props.size}px`, height: `${props.size}px` }}
            />}
        </div>
    );
}

export default ProfilePicAndStatus;