import LocationIcon from "../assets/location.png";
import UserIcon from "../assets/user.png";
import StarGrayIcon from "../assets/star-gray.png";
import ProfileSummaryItem from "./ProfileSummaryItem";

interface ProfileSummaryProps {
    country: string,
    memberDate: Date,
    styles?: string
}

function ProfileSummary({ country, memberDate, styles }: ProfileSummaryProps) {
    const defaultStyles = `flex flex-col gap-2`;

    return (
        <div className={`${defaultStyles} ${styles}`}>
            <ProfileSummaryItem
                image={LocationIcon}
                itemKey="Lives in"
                itemValue={country}
            />
            <ProfileSummaryItem
                image={UserIcon}
                itemKey="Member since"
                itemValue={new Date(memberDate).toLocaleDateString()}
            />
            <ProfileSummaryItem
                image={StarGrayIcon}
                itemKey="Clients served"
                itemValue={"6"}
            />
        </div>
    )
}

export default ProfileSummary;