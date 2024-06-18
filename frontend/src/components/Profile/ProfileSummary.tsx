import UserIcon from "../../assets/user.png";
import StarGrayIcon from "../../assets/star-gray.png";
import ProfileSummaryItem from "./ProfileSummaryItem";

interface ProfileSummaryProps {
    memberDate: Date,
    ordersFilled: number,
    styles?: string
}

function ProfileSummary({ memberDate, ordersFilled, styles }: ProfileSummaryProps) {
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
                itemKey="Orders filled"
                itemValue={ordersFilled.toString()}
            />
        </div>
    )
}

export default ProfileSummary;