import ProfilePicAndStatus from "../../components/ProfilePicAndStatus";
import Options from "../../components/Options";
import { sellerLevelTextStyles } from "../../utils/sellerLevelTextStyles";
import ProfileSummary from "../../components/ProfileSummary";
import SaveSeller from "../../components/SaveSeller";
import { useNavigate } from "react-router-dom";

interface AboutSellerProps {
    description: string,
    profilePicURL: string,
    status: string,
    username: string,
    sellerLevel: string,
    summary: string,
    country: string,
    memberDate: Date,
    rating: number,
    languages: string[],
    skills: string[],
    sellerID: string
}

function AboutSeller(props: AboutSellerProps) {
    const navigate = useNavigate();

    function navigateToProfile(): void {
        navigate(`/sellers/${props.username}`);
    }

    return (
        <section className="bg-main-white border border-light-border-gray shadow-info-component rounded-[12px] p-6 w-full">
            <div className="flex justify-between mb-4 gap-5">
                <div className="flex items-center gap-5 overflow-hidden">
                    <ProfilePicAndStatus 
                        profilePicURL={props.profilePicURL} 
                        profileStatus={props.status}
                        statusStyles="before:hidden"
                        imgStyles="w-[75px] h-[75px] cursor-pointer"
                        action={navigateToProfile}
                    />
                    <div className="overflow-hidden">
                        <div className="flex items-center gap-2">
                            <p className="link" onClick={navigateToProfile}>{props.username}</p>
                            <p className="text-[14px] seller-level" 
                            style={sellerLevelTextStyles[props.sellerLevel]}>
                                {props.sellerLevel}
                            </p>
                        </div>
                        <p className="text-side-text-gray text-[15px] whitespace-nowrap text-ellipsis 
                        overflow-hidden mt-[2px]">
                            {props.summary}
                        </p>
                        <p className="text-side-text-gray text-[15px]">
                            {props.country}
                        </p>
                    </div>
                </div>
                <SaveSeller 
                    svgSize={24}
                    sellerID={props.sellerID}
                />
            </div>
            {props.description !== "" && <p>{props.description}</p>}
            <ProfileSummary 
                styles="mt-4 mb-4"
                country={props.country}
                memberDate={props.memberDate}
                rating={props.rating}
            />
            <p>{`${props.username} speaks`}</p>
            <Options 
                options={props.languages} 
                styles="mt-2"
                bgColour="bg-highlight"
                textColour="text-main-blue"
            />
            {props.skills.length > 0 &&
            <>
                <p className="mt-3">{`${props.username}${props.username[props.username.length - 1] === 's' ? "'" : "'s"} skills`}</p>
                <Options 
                    options={props.skills} 
                    styles="mt-2"
                    bgColour="bg-very-light-pink"
                    textColour="text-pink"
                />
            </>}
            <button className="red-btn mt-6">
                Report seller
            </button>
        </section>
    );
}

export default AboutSeller;