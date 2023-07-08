import ProfilePicAndStatus from "../../components/ProfilePicAndStatus";
import Options from "../../components/Options";
import { sellerLevelTextStyles } from "../../utils/sellerLevelTextStyles";
import SellerSummaryInfo from "../../components/SellerSummaryInfo";

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
    skills: string[]
}

function AboutSeller(props: AboutSellerProps) {
    return (
        <section className="bg-main-white border border-light-border-gray shadow-info-component rounded-[12px] p-6 w-full">
            <div className="mb-4 flex gap-5">
                <ProfilePicAndStatus 
                    profilePicURL={props.profilePicURL} 
                    profileStatus={props.status}
                    statusStyles='before:hidden'
                    imgStyles="w-[75px] h-[75px]"
                />
                <div className="flex-grow flex justify-between">
                    <div>
                        <div className="flex items-center gap-2">
                            <p>{props.username}</p>
                            <p className="text-[14px] seller-level" 
                            style={sellerLevelTextStyles[props.sellerLevel]}>
                                {props.sellerLevel}
                            </p>
                        </div>
                        <p className="text-side-text-gray text-[15px] mt-[2px]">
                            {props.summary}
                        </p>
                        <p className="text-side-text-gray text-[15px]">
                            {props.country}
                        </p>
                    </div>
                    <svg
                        viewBox="0 0 32 32" 
                        xmlns="http://www.w3.org/2000/svg" 
                        className="block fill-[#00000086] h-[24px] w-[24px] stroke-white stroke-2 cursor-pointer" 
                        aria-hidden="true" 
                        role="presentation" 
                        focusable="false">
                        <path d="m16 28c7-4.733 14-10 14-17 0-1.792-.683-3.583-2.05-4.95-1.367-1.366-3.158-2.05-4.95-2.05-1.791 0-3.583.684-4.949 2.05l-2.051 2.051-2.05-2.051c-1.367-1.366-3.158-2.05-4.95-2.05-1.791 0-3.583.684-4.949 2.05-1.367 1.367-2.051 3.158-2.051 4.95 0 7 7 12.267 14 17z">
                        </path>
                    </svg>
                </div>
            </div>
            {props.description !== "" && <p>{props.description}</p>}
            <SellerSummaryInfo 
                styles="mt-4 mb-4"
                country={props.country}
                memberDate={props.memberDate}
                rating={props.rating}
            />
            <p>{`${props.username} speaks`}</p>
            <Options 
                options={props.languages} 
                styles="mt-2 mb-3"
                bgColour="bg-highlight"
            />
            <p>{`${props.username}${props.username[props.username.length - 1] === 's' ? "'" : "'s"} skills`}</p>
            <Options 
                options={props.skills} 
                styles="mt-2"
                bgColour="bg-very-light-purple"
                textColour="text-purple"
            />
            <button className="red-btn mt-6">
                Report seller
            </button>
        </section>
    );
}

export default AboutSeller;