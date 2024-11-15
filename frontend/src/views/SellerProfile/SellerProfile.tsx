import { useEffect, useState, useContext } from "react";
import { SellerProfileDetails } from "../../types/SellerProfileDetails";
import axios, { AxiosError } from "axios";
import { useLocation } from "react-router-dom";
import { getAPIErrorMessage } from "../../utils/getAPIErrorMessage";
import { useNavigateErrorPage } from "../../hooks/useNavigateErrorPage";
import PageWrapper from "../../wrappers/PageWrapper";
import ProfilePicAndStatus from "../../components/Profile/ProfilePicAndStatus";
import { sellerLevelTextStyles } from "../../utils/sellerLevelTextStyles";
import PostCard from "../../components/Post/PostCard";
import { IPost } from "../../models/IPost";
import ProfileSummary from "../../components/Profile/ProfileSummary";
import Options from "../../components/common/Options";
import SaveSeller from "../../components/Seller/SaveSeller";
import { UserContext } from "../../providers/UserProvider";
import Reviews from "../../components/Review/Reviews";
import { useWindowSize } from "../../hooks/useWindowSize";
import SellerExperience from "../../components/Seller/SellerExperience";
import UserStatusText from "../../components/Profile/UserStatus";
import { AnimatePresence } from "framer-motion";
import ReportSeller from "../../components/Seller/ReportSeller";

function SellerProfile() {
    const [sellerDetails, setSellerDetails] = useState<SellerProfileDetails>();
    const [reportSellerPopUp, setReportSellerPopUp] = useState<boolean>(false);
    const [errorMessage, setErrorMessage] = useState<string>("");

    const userContext = useContext(UserContext);
    const windowSize = useWindowSize();
    const location = useLocation();

    const nextLevelXP = sellerDetails?.sellerLevel.nextLevel?.xpRequired ?? sellerDetails?.sellerXP ?? 0;
    const nextLevel = sellerDetails?.sellerLevel.nextLevel?.name ?? "";

    useNavigateErrorPage("Failed to retrieve this seller...", errorMessage);

    useEffect(() => {
        (async () => {
            try {
                const response = await axios.get<{ sellerDetails: SellerProfileDetails, message: string }>(`/api${location.pathname}`);
                setSellerDetails(response.data.sellerDetails);
            }
            catch (err: any) {
                const errorMessage = getAPIErrorMessage(err as AxiosError<{ message: string }>);
                setErrorMessage(errorMessage);
            }
        })();
    }, [location.pathname]);

    function openReportSellerPopUp(): void {
        setReportSellerPopUp(true);
    }

    if (sellerDetails == null) {
        return <></>
    }

    return (
        <div className="overflow-y-scroll h-[calc(100vh-90px)]">
            <AnimatePresence>
                {reportSellerPopUp &&
                <ReportSeller
                    setReportSellerPopUp={setReportSellerPopUp}
                    username={sellerDetails.user.username}
                    sellerID={sellerDetails.sellerID}
                />}
            </AnimatePresence>
            <PageWrapper styles="p-[38px] pt-[58px]" locationStack={["Sellers", sellerDetails.user.username]}>
                <div className="mb-5 border-b border-b-light-border-gray pb-7">
                    <div className="bg-transparent">
                        <div className="flex items-center flex-wrap justify-between gap-5 pb-7 mb-7 border-b border-light-border-gray">
                            <div className="flex items-center flex-grow gap-4 overflow-hidden">
                                <div className="relative">
                                    <ProfilePicAndStatus
                                        profilePicURL={sellerDetails.user.profilePicURL}
                                        username={sellerDetails.user.username}
                                        profileStatus={sellerDetails?.user.status}
                                        size={windowSize >= 400 ? 65 : 55}
                                        statusRight={true}
                                    />
                                </div>
                                <div className="overflow-hidden flex-grow">
                                    <div className="flex items-center gap-2">
                                        <p className="link" title={sellerDetails.user.username}>
                                            {sellerDetails.user.username}
                                        </p>
                                        <UserStatusText 
                                            profileStatus={sellerDetails.user.status}
                                            username={sellerDetails.user.username}
                                        />
                                        <p className="text-sm seller-level" style={sellerLevelTextStyles[sellerDetails.sellerLevel.name]}>
                                            {sellerDetails.sellerLevel.name}
                                        </p>
                                    </div>
                                    <p className="text-[15px] text-side-text-gray mt-[2px] whitespace-nowrap text-ellipsis overflow-hidden"
                                    title={sellerDetails.summary}>
                                        {sellerDetails.summary}
                                    </p>
                                    <p className="text-[15px] text-side-text-gray">
                                        {sellerDetails.user.country}
                                    </p>
                                </div>
                            </div>
                            <SellerExperience
                                level={sellerDetails.sellerLevel.name}
                                nextLevel={nextLevel}
                                sellerXP={sellerDetails.sellerXP}
                                nextLevelXP={nextLevelXP}
                                styles="min-w-[275px] flex-grow"
                            />
                        </div>
                        <p>{sellerDetails.description}</p>
                        <div className={`mt-5 flex gap-5 relative ${windowSize < 670 ? "flex-col" : "items-center justify-between"}`}>
                            <ProfileSummary
                                memberDate={sellerDetails.user.memberDate}
                                ordersFilled={sellerDetails._count.orders}
                                styles={`${windowSize < 670 ? "flex-grow" : "w-[400px]"} bg-[#f8f8f8] p-3 rounded-[8px]`}
                            />
                            <div className="flex flex-col justify-between">
                                {userContext.userData.username !== sellerDetails.user.username &&
                                <SaveSeller 
                                    svgSize={27}
                                    sellerID={sellerDetails.sellerID}
                                    styles="w-full flex justify-end mb-3"
                                />}
                                <button className="red-btn w-[145px]" onClick={openReportSellerPopUp}>
                                    Report seller
                                </button>
                            </div>
                        </div>
                    </div>
                    <div className="mt-7 pt-5 border-t border-t-light-border-gray">
                        <p>Seller speaks</p>
                        <Options 
                            options={sellerDetails.languages} 
                            wrapperStyles="mt-2"
                            styles="bg-highlight"
                            textColour="#4169f7"
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
                                textColour="#b600f3"
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
                                    <PostCard
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

export default SellerProfile;