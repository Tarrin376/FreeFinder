import { UserStatus } from '../enums/UserStatus';
import { generateLetterAvatar } from '../utils/generateLetterAvatar';

interface ProfilePicAndStatusProps {
    profilePicURL: string, 
    size: number,
    username: string,
    profileStatus?: UserStatus,
    statusStyles?: string,
    imgStyles?: string,
    setErrorMessage?: React.Dispatch<React.SetStateAction<string>>,
    loading?: boolean,
    action?: () => void,
}

function ProfilePicAndStatus(props: ProfilePicAndStatusProps) {
    function handleAction(): void {
        if (props.action) {
            props.action();
        }
    }

    return (
        <div className={props.loading ? '' : `${props.profileStatus === UserStatus.ONLINE ? 'before:bg-green-500' : 
        props.profileStatus === 'AWAY' ? 'before:bg-orange-400' : 'before:bg-side-text-gray'} 
        before:w-[18px] before:h-[18px] before:absolute before:top-[33px] before:left-[0px] 
        before:border-[3px] before:border-main-white before:content[''] 
        before:rounded-full ${props.statusStyles}`}
        onClick={handleAction}>
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