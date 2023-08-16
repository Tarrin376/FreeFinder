import ProfilePicAndStatus from "../../components/ProfilePicAndStatus";
import Options from "../../components/Options";
import { sellerLevelTextStyles } from "../../utils/sellerLevelTextStyles";
import ProfileSummary from "../../components/ProfileSummary";
import SaveSeller from "../../components/SaveSeller";
import { useNavigate } from "react-router-dom";
import { useContext } from "react";
import { UserContext } from "../../providers/UserProvider";
import { UserStatus } from "../../enums/UserStatus";

interface AboutSellerProps {
    description: string,
    profilePicURL: string,
    status: UserStatus,
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
    const userContext = useContext(UserContext);

    function navigateToProfile(): void {
        navigate(`/sellers/${props.sellerID}`);
    }

    return (
        <section className="border border-light-border-gray bg-transparent rounded-[12px] p-6 w-full">
            <div className="flex justify-between mb-4 gap-5">
                <div className="flex items-center gap-5 overflow-hidden">
                    <ProfilePicAndStatus 
                        profilePicURL={props.profilePicURL} 
                        imgStyles="cursor-pointer"
                        username={props.username}
                        action={navigateToProfile}
                        size={62}
                        profileStatus={props.status}
                        statusRight={true}
                    />
                    <div className="overflow-hidden">
                        <div className="flex items-center gap-2">
                            <p className="link" onClick={navigateToProfile}>{props.username}</p>
                            <p className="text-[14px] seller-level" style={sellerLevelTextStyles[props.sellerLevel]}>
                                {props.sellerLevel}
                            </p>
                        </div>
                        <p className="text-side-text-gray text-[15px] whitespace-nowrap text-ellipsis 
                        overflow-hidden mt-[2px]" title={props.summary}>
                            {props.summary}
                        </p>
                        <p className="text-side-text-gray text-[15px]">
                            {props.country}
                        </p>
                    </div>
                </div>
                {userContext.userData.username !== props.username &&
                <SaveSeller 
                    svgSize={24}
                    sellerID={props.sellerID}
                />}
            </div>
            {props.description !== "" && <p>{props.description}</p>}
            <ProfileSummary 
                styles="mt-4 mb-4"
                country={props.country}
                memberDate={props.memberDate}
            />
            <p>{`${props.username} speaks`}</p>
            <Options 
                options={props.languages} 
                wrapperStyles="mt-2"
                styles="bg-highlight"
                textColour="#4169f7"
            />
            {props.skills.length > 0 &&
            <>
                <p className="mt-3">{`${props.username}${props.username[props.username.length - 1] === 's' ? "'" : "'s"} skills`}</p>
                <Options 
                    options={props.skills} 
                    wrapperStyles="mt-2"
                    styles="bg-very-light-pink"
                    textColour="#b600f3"
                />
            </>}
            <button className="red-btn mt-6">
                Report seller
            </button>
        </section>
    );
}

export default AboutSeller;