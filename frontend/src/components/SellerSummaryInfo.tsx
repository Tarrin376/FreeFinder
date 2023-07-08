import LocationIcon from "../assets/location.png";
import UserIcon from "../assets/user.png";
import StarGrayIcon from "../assets/star-gray.png";

interface SellerSummaryInfoProps {
    styles?: string,
    country: string,
    memberDate: Date,
    rating: number
}

function SellerSummaryInfo({ styles, country, memberDate, rating }: SellerSummaryInfoProps) {
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
                <p className="text-side-text-gray">Seller rating</p>
                <p className="ml-auto">{rating}</p>
            </div>
        </div>
    )
}

export default SellerSummaryInfo;