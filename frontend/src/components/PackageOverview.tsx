import { FoundUsers } from "../types/FoundUsers";
import KeyPair from "./KeyPair";
import ProfilePicAndStatus from "./ProfilePicAndStatus";
import { capitalizeWord } from "../utils/capitalizeWord";

interface PackageOverviewProps {
    type: string,
    revisions: string,
    seller: FoundUsers[number],
    workType: string,
    wrapperStyles?: string,
    children?: React.ReactNode,
    styles?: string
}

function PackageOverview({ type, revisions, seller, workType, wrapperStyles, children, styles }: PackageOverviewProps) {
    const defaultStyles = `w-full bg-light-bg-gray rounded-[8px] p-4`;

    return (
        <div className={`${defaultStyles} ${wrapperStyles}`}>
            <div className={`mb-2 flex items-center gap-3 relative ${styles}`}>
                <ProfilePicAndStatus
                    profilePicURL={seller.profilePicURL}
                    username={seller.username}
                    size={42}
                />
                <p className="text-[15px]">
                    {`${seller.username} (seller)`}
                </p>
            </div>
            <KeyPair
                itemKey="Package type"
                itemValue={capitalizeWord(type)}
                styles="mb-[2px]"
                textSize={15}
            />
            <KeyPair
                itemKey="Work type"
                itemValue={workType}
                styles="mb-[2px]"
                textSize={15}
            />
            <KeyPair
                itemKey="Number of revisions"
                itemValue={`${revisions}`}
                textSize={15}
            />
            {children}
        </div>
    )
}

export default PackageOverview;