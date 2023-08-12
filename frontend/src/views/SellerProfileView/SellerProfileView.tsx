import { useEffect, useState, useContext } from "react";
import { SellerProfile } from "../../types/SellerProfile";
import axios, { AxiosError } from "axios";
import { useLocation } from "react-router-dom";
import { getAPIErrorMessage } from "../../utils/getAPIErrorMessage";
import { useNavigateErrorPage } from "../../hooks/useNavigateErrorPage";
import PageWrapper from "../../wrappers/PageWrapper";
import ProfilePicAndStatus from "../../components/ProfilePicAndStatus";
import { sellerLevelTextStyles } from "../../utils/sellerLevelTextStyles";
import Post from "../../components/Post";
import { IPost } from "../../models/IPost";
import ProfileSummary from "../../components/ProfileSummary";
import Options from "../../components/Options";
import SaveSeller from "../../components/SaveSeller";
import { UserContext } from "../../providers/UserProvider";
import Reviews from "../../components/Reviews";
import { useUserStatus } from "src/hooks/useUserStatus";

function SellerProfileView() {
    const [sellerDetails, setSellerDetails] = useState<SellerProfile>();
    const [errorMessage, setErrorMessage] = useState<string>("");
    const userContext = useContext(UserContext);
    const location = useLocation();
    const status = useUserStatus(sellerDetails?.user.username, sellerDetails?.user.status);

    useNavigateErrorPage("Uh oh! Failed to retrieve seller...", errorMessage);

    useEffect(() => {
        (async () => {
            try {
                const response = await axios.get<{ sellerDetails: SellerProfile, message: string }>(`/api${location.pathname}`);
                setSellerDetails(response.data.sellerDetails);
            }
            catch (err: any) {
                const errorMessage = getAPIErrorMessage(err as AxiosError<{ message: string }>);
                setErrorMessage(errorMessage);
            }
        })();
    }, [location.pathname]);

    if (!sellerDetails) {
        return <p>loading</p>
    }

    return (
        <div className="overflow-y-scroll h-[calc(100vh-90px)]">
            <PageWrapper styles="p-[38px] pt-[58px]" locationStack={["Sellers", sellerDetails.user.username]}>
                <div className="mb-5 border-b border-b-light-border-gray pb-7">
                    <div className="bg-transparent">
                        <div className="flex justify-between gap-5 pb-7 mb-7 border-b border-light-border-gray">
                            <div className="flex items-center flex-grow gap-5 overflow-hidden">
                                <div className="relative">
                                    <ProfilePicAndStatus
                                        profilePicURL={sellerDetails.user.profilePicURL}
                                        username={sellerDetails.user.username}
                                        profileStatus={status}
                                        size={65}
                                        statusRight={true}
                                    />
                                </div>
                                <div className="overflow-hidden flex-grow">
                                    <div className="flex items-center gap-2">
                                        <p>{sellerDetails.user.username}</p>
                                        <p className="text-[14px] seller-level"
                                        style={sellerLevelTextStyles[sellerDetails.sellerLevel.name]}>
                                            {sellerDetails.sellerLevel.name}
                                        </p>
                                    </div>
                                    <p className="text-[15px] text-side-text-gray mt-[2px] 
                                    whitespace-nowrap text-ellipsis overflow-hidden">
                                        {sellerDetails.summary}
                                    </p>
                                    <p className="text-[15px] text-side-text-gray">
                                        {sellerDetails.user.country}
                                    </p>
                                </div>
                            </div>
                            {userContext.userData.username !== sellerDetails.user.username &&
                            <SaveSeller 
                                svgSize={27}
                                sellerID={sellerDetails.sellerID}
                            />}
                        </div>
                        <p>{sellerDetails.description}</p>
                        <div className="mt-5 flex items-end justify-between">
                            <ProfileSummary
                                styles="w-[400px] bg-[#f8f8f8] p-3 rounded-[8px]"
                                country={sellerDetails.user.country}
                                memberDate={sellerDetails.user.memberDate}
                            />
                            <div>
                                <button className="main-btn block !h-[42px] mb-3 w-[155px]">Contact seller</button>
                                <button className="red-btn w-[155px]">Report seller</button>
                            </div>
                        </div>
                    </div>
                    <div className="mt-7 pt-5 border-t border-t-light-border-gray">
                        <p>{`${sellerDetails.user.username} speaks`}</p>
                        <Options 
                            options={sellerDetails.languages} 
                            wrapperStyles="mt-2"
                            styles="bg-highlight"
                            textColour="#4E73F8"
                        />
                        {sellerDetails.skills.length > 0 &&
                        <>
                             <p className="mt-3">
                                {`${sellerDetails.user.username}${sellerDetails.user.username[sellerDetails.user.username.length - 1] === 's' 
                                ? "'" : "'s"} skills`}
                            </p>
                            <Options
                                options={sellerDetails.skills} 
                                wrapperStyles="mt-2"
                                styles="bg-very-light-pink"
                                textColour="#bf01ff"
                            />
                        </>}
                    </div>
                </div>
                {sellerDetails.posts.length > 0 &&
                <>
                    <h2 className="text-[18px] mb-5">
                        {`${sellerDetails.user.username}${sellerDetails.user.username[sellerDetails.user.username.length - 1] === 's' ? 
                        "'" : "'s"} available services`}
                    </h2>
                    <div className="overflow-x-scroll whitespace-nowrap pb-5">
                        {sellerDetails.posts.map((post: IPost, index: number) => {
                            return (
                                <div className={`w-[299px] inline-block ${index > 0 ? "ml-5" : ""}`} key={post.postID}>
                                    <Post
                                        postInfo={post}
                                        index={index}
                                    />
                                </div>
                            )
                        })}
                    </div>
                </>}
                <Reviews url={`/api${location.pathname}/reviews`} />
            </PageWrapper>
        </div>
    )
}

export default SellerProfileView;