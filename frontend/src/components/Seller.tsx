import ProfilePicAndStatus from "./ProfilePicAndStatus";
import HighlightedSubstring from "./HighlightedSubstring";
import { sellerLevelTextStyles } from "../utils/sellerLevelTextStyles";


interface SellerProps {
    navigateToProfile: () => void,
    profilePicURL: string,
    status: string,
    username: string,
    searchQuery: string,
    sellerLevel: string,
    summary: string,
    country: string,
    imgStyles?: string,
    statusStyles?: string
}

function Seller(props: SellerProps) {
    return (
        <div className="flex items-center gap-3 cursor-pointer hover:bg-[#f7f7f7] p-2 rounded-[6px]
        transition-all ease-out duration-100" onClick={props.navigateToProfile}>
            <div className="relative">
                <ProfilePicAndStatus
                    profilePicURL={props.profilePicURL}
                    profileStatus={props.status}
                    statusStyles={props.statusStyles}
                    imgStyles={props.imgStyles}
                />
            </div>
            <div className="flex-grow overflow-hidden">
                <div className="flex items-center gap-2">
                    <HighlightedSubstring
                        word={props.username}
                        substring={props.searchQuery}
                        foundAt={props.username.toLowerCase().indexOf(props.searchQuery.toLowerCase())}
                        styles="hover:!px-0"
                    />
                    <p className="text-[14px] seller-level"
                    style={sellerLevelTextStyles[props.sellerLevel]}>
                        {props.sellerLevel}
                    </p>
                </div>
                <p className="text-[14px] text-side-text-gray 
                whitespace-nowrap text-ellipsis overflow-hidden mt-[2px]">
                    {props.summary}
                </p>
                <p className="text-[14px] text-side-text-gray">
                    {props.country}
                </p>
            </div>
        </div>
    )
}

export default Seller;