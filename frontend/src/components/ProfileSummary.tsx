import UserIcon from "../assets/user.png";
import StarGrayIcon from "../assets/star-gray.png";
import ProfileSummaryItem from "./ProfileSummaryItem";

interface ProfileSummaryProps {
    memberDate: Date,
    styles?: string
}

function ProfileSummary({ memberDate, styles }: ProfileSummaryProps) {
    const defaultStyles = `flex flex-col gap-2`;

    return (
        <div className={`${defaultStyles} ${styles}`}>
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