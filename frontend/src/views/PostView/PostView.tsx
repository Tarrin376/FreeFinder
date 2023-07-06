import { useLocation } from "react-router-dom";
import { useEffect, useState } from 'react';
import { PostPage } from "../../types/PostPage";
import ProfilePicAndStatus from "../../components/ProfilePicAndStatus";
import StarIcon from '../../assets/star.png';
import { getTimePosted } from "../../utils/getTimePosted";
import AboutSeller from "./AboutSeller";
import Packages from "./Packages";
import axios, { AxiosError } from "axios";
import { getAPIErrorMessage } from "../../utils/getAPIErrorMessage";
import { IPostImage } from "../../models/IPostImage";
import { useNavigateErrorPage } from "../../hooks/useNavigateErrorPage";
import PageWrapper from "../../wrappers/PageWrapper";
import Carousel from "../../components/Carousel";

function PostView() {
    const [postData, setPostData] = useState<PostPage>();
    const [selectedImage, setSelectedImage] = useState<number>(0);
    const [errorMessage, setErrorMessage] = useState<string>("");
    const location = useLocation();
    
    useNavigateErrorPage("Something isn't quite right...", errorMessage);
    
    useEffect(() => {
        (async (): Promise<void> => {
            try {
                const resp = await axios.get<{ post: PostPage, message: string }>(`/api${location.pathname}`);
                setPostData(resp.data.post);
            }
            catch (err: any) {
                const errorMessage = getAPIErrorMessage(err as AxiosError<{ message: string }>);
                setErrorMessage(errorMessage);
            }
        })();
    }, [location.pathname]);

    if (!postData) {
        return (
            <p>loading</p>
        );
    }

    return (
        <div className="overflow-y-scroll h-[calc(100vh-90px)]">
            <PageWrapper>
                <div className="flex gap-20">
                    <div className="flex-grow">
                        <p className="text-main-blue mb-2 mt-12">Website design</p>
                        <h1 className="text-3xl mb-4">{postData.title}</h1>
                        <div className="flex gap-3 items-center mb-6">
                            <div className="relative">
                                <ProfilePicAndStatus 
                                    profilePicURL={postData.postedBy.user.profilePicURL} 
                                    profileStatus={postData.postedBy.user.status}
                                    statusStyles="before:left-[33px] before:top-[34px] cursor-pointer"
                                    imgStyles="w-[50px] h-[50px]"
                                />
                            </div>
                            <div>
                                <div className="flex items-center gap-[7px]">
                                    <p className="nav-item hover:font-normal">{postData.postedBy.user.username}</p>
                                    <img src={StarIcon} className="w-[18px] h-[18px]" alt="star" />
                                    <p className="text-[15px]">{postData.postedBy.rating}</p>
                                    <p className="text-[15px] text-side-text-gray">({postData.postedBy.numReviews} reviews)</p>
                                </div>
                                <p className="text-side-text-gray text-[15px]">
                                    {getTimePosted(postData.createdAt)}
                                </p>
                            </div>
                        </div>
                        <Carousel
                            selectedImage={selectedImage}
                            setSelectedImage={setSelectedImage}
                            images={postData.images}
                            btnSize={50}
                            wrapperStyles="bg-very-light-gray w-full rounded-[12px] border border-very-light-gray 
                            shadow-info-component flex items-center justify-between p-4"
                            imageStyles="object-contain object-center h-[550px] w-full"
                        />
                        <div className="mt-5 w-full whitespace-nowrap overflow-x-scroll pb-5">
                            {postData.images.map((image: IPostImage, index: number) => {
                                return (
                                    <img 
                                        src={image.url} 
                                        alt="" 
                                        className={`w-[112px] h-[80px] inline-block rounded-[8px] object-contain cursor-pointer
                                        bg-[#f5f6f8] border border-very-light-gray ${index > 0 ? "ml-3" : ""}
                                        ${selectedImage === index ? "border-light-border-gray" : ""}`}
                                        key={index}
                                        onClick={() => setSelectedImage(index)}
                                    />
                                )
                            })}
                        </div>
                        <section className="mt-8 mb-10 w-full">
                            <h2 className="text-2xl mb-3">About this service</h2>
                            <p className="leading-7">
                                {postData.about}
                            </p>
                        </section>
                        <AboutSeller postData={postData} />
                    </div>
                    <div>
                        <Packages packages={postData.packages} />
                        <button className="main-btn mt-[26px] shadow-pop-up">
                            {`See Seller Reviews (${postData.postedBy.numReviews})`}
                        </button>
                    </div>
                </div>
            </PageWrapper>
        </div>
    );
}

export default PostView;