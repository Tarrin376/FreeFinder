import { useEffect, useState } from "react";
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
import SellerSummaryInfo from "../../components/SellerSummaryInfo";
import Options from "../../components/Options";

function SellerProfileView() {
    const [sellerDetails, setSellerDetails] = useState<SellerProfile>();
    const [errorMessage, setErrorMessage] = useState<string>("");
    const location = useLocation();

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
                    <div className="bg-main-white border border-light-border-gray shadow-info-component rounded-[12px] p-6">
                        <div className="flex justify-between mb-5">
                            <div className="flex items-center gap-5 transition-all ease-out duration-100">
                                <div className="relative">
                                    <ProfilePicAndStatus
                                        profilePicURL={sellerDetails.user.profilePicURL}
                                        profileStatus={sellerDetails.user.status}
                                        statusStyles="before:left-[53px] before:top-[54px] before:w-[21px] before:h-[21px]"
                                        imgStyles="w-[75px] h-[75px]"
                                    />
                                </div>
                                <div>
                                    <div className="flex items-center gap-2">
                                        <p>{sellerDetails.user.username}</p>
                                        <p className="text-[14px] seller-level"
                                        style={sellerLevelTextStyles[sellerDetails.sellerLevel.name]}>
                                            {sellerDetails.sellerLevel.name}
                                        </p>
                                    </div>
                                    <p className="text-[15px] text-side-text-gray mt-[2px]">
                                        {sellerDetails.summary}
                                    </p>
                                    <p className="text-[15px] text-side-text-gray">
                                        {sellerDetails.user.country}
                                    </p>
                                </div>
                            </div>
                            <div>
                                <svg
                                    viewBox="0 0 32 32" 
                                    xmlns="http://www.w3.org/2000/svg" 
                                    className="block fill-[#00000086] h-[27px] w-[27px] stroke-white stroke-2 cursor-pointer" 
                                    aria-hidden="true" 
                                    role="presentation" 
                                    focusable="false">
                                    <path d="m16 28c7-4.733 14-10 14-17 0-1.792-.683-3.583-2.05-4.95-1.367-1.366-3.158-2.05-4.95-2.05-1.791 0-3.583.684-4.949 2.05l-2.051 2.051-2.05-2.051c-1.367-1.366-3.158-2.05-4.95-2.05-1.791 0-3.583.684-4.949 2.05-1.367 1.367-2.051 3.158-2.051 4.95 0 7 7 12.267 14 17z">
                                    </path>
                                </svg>
                            </div>
                        </div>
                        <p className="text-side-text-gray">{sellerDetails.description}</p>
                        <div className="mt-5 flex items-center justify-between">
                            <SellerSummaryInfo
                                styles="w-[400px] bg-[#f5f5f5] p-3 rounded-[8px]"
                                country={sellerDetails.user.country}
                                memberDate={sellerDetails.user.memberDate}
                                rating={sellerDetails.rating}
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
                            styles="mt-2"
                            bgColour="bg-highlight"
                        />
                        {sellerDetails.skills.length > 0 &&
                        <>
                             <p className="mt-3">
                                {`${sellerDetails.user.username}${sellerDetails.user.username[sellerDetails.user.username.length - 1] === 's' 
                                ? "'" : "'s"} skills`}
                            </p>
                            <Options
                                options={sellerDetails.skills} 
                                styles="mt-3"
                                bgColour="bg-very-light-purple"
                                textColour="text-purple"
                            />
                        </>}
                    </div>
                </div>
                {sellerDetails.posts.length > 0 &&
                <>
                    <h2 className="text-[20px] mb-5">
                        {`${sellerDetails.user.username}${sellerDetails.user.username[sellerDetails.user.username.length - 1] === 's' ? 
                        "'" : "'s"} available services`}
                    </h2>
                    <div className="overflow-x-scroll whitespace-nowrap pb-5">
                        {sellerDetails.posts.map((post: IPost, index: number) => {
                            return (
                                <Post
                                    postInfo={post}
                                    username={sellerDetails.user.username}
                                    styles={`inline-block ${index > 0 ? "ml-5" : ""}`}
                                    key={index}
                                />
                            )
                        })}
                    </div>
                </>}
            </PageWrapper>
        </div>
    )
}

export default SellerProfileView;