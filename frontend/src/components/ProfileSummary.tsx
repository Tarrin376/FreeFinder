import LocationIcon from "../assets/location.png";
import UserIcon from "../assets/user.png";
import StarGrayIcon from "../assets/star-gray.png";

interface ProfileSummaryProps {
    styles?: string,
    country: string,
    memberDate: Date,
}

function ProfileSummary({ styles, country, memberDate }: ProfileSummaryProps) {
    return (
        <div className={styles}>
            <div className="flex gap-2 items-center">
                <img src={LocationIcon} width="20px" height="20px" alt="location" />
                <p className="text-side-text-gray">Lives in</p>
                <p className="ml-auto">{country}</p>
            </div>
            <div className="flex gap-2 items-center mt-2">
                <img src={UserIcon} width="20px" height="20px" alt="location" />
                <p className="text-side-text-gray">Member since</p>
                <p className="ml-auto">{new Date(memberDate).toLocaleDateString()}</p>
            </div>
            <div className="flex gap-2 items-center mt-2">
                <img src={StarGrayIcon} width="20px" height="20px" alt="location" />
                <p className="text-side-text-gray">Clients served</p>
                <p className="ml-auto">6</p>
            </div>
        </div>
    )
}

export default ProfileSummary;