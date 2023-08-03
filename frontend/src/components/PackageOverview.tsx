import { IPackage } from "../models/IPackage";
import { FoundUsers } from "../types/FoundUsers";
import KeyPair from "./KeyPair";
import ProfilePicAndStatus from "./ProfilePicAndStatus";
import { capitalizeWord } from "../utils/capitalizeWord";

interface PackageOverviewProps {
    curPkg: IPackage,
    seller: FoundUsers[number],
    workType: string,
    styles?: string
}

function PackageOverview({ curPkg, seller, workType, styles }: PackageOverviewProps) {
    const defaultStyles = `w-full bg-light-bg-gray rounded-[8px] p-3`;

    return (
        <div className={`${defaultStyles} ${styles}`}>
            <div className="mb-2 flex items-center gap-3 relative">
                <ProfilePicAndStatus
                    profilePicURL={seller.profilePicURL}
                    username={seller.username}
                    size={42}
                />
                <p className="text-[15px]">
                    {seller.username}
                </p>
            </div>
            <KeyPair
                itemKey="Package type"
                itemValue={capitalizeWord(curPkg.type)}
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
                itemValue={`${curPkg.revisions}`}
                textSize={15}
            />
        </div>
    )
}

export default PackageOverview;