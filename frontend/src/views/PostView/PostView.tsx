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
import BackIcon from "../../assets/back.png";
import NextIcon from "../../assets/next.png";
import { useNavigateErrorPage } from "../../hooks/useNavigateErrorPage";
import PageWrapper from "../../wrappers/PageWrapper";

function PostView() {
    const [postData, setPostData] = useState<PostPage>();
    const [selectedImage, setSelectedImage] = useState<number>(0);
    const [errorMessage, setErrorMessage] = useState<string>("");
    const location = useLocation();

    const updateSelectedImage = (index: number) => {
        setSelectedImage(index);
    }

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
        <PageWrapper>
            <p className="text-main-blue mb-2 mt-12">Website design</p>
            <h1 className="text-3xl mb-4 max-w-[80%] break-all">{postData.title}</h1>
            <div className="flex gap-3 items-center">
                <div className="relative">
                    <ProfilePicAndStatus 
                        profilePicURL={postData.postedBy.user.profilePicURL} 
                        profileStatus={postData.postedBy.user.status}
                        statusStyles="before:left-[32px] before:top-[34px] cursor-pointer"
                        imgStyles="w-[50px] h-[50px]"
                    />
                </div>
                <div>
                    <div className="flex items-center gap-[7px]">
                        <p className="nav-item">{postData.postedBy.user.username}</p>
                        <img src={StarIcon} className="w-[15px] h-[15px]" alt="star" />
                        <p className="text-[15px]">{postData.postedBy.rating}</p>
                        <p className="text-[15px] text-side-text-gray">({postData.postedBy.numReviews} reviews)</p>
                    </div>
                    <p className="text-side-text-gray text-[15px]">
                        {getTimePosted(postData.createdAt)}
                    </p>
                </div>
            </div>
            <div className="flex gap-20 mt-8">
                <div className="flex-grow">
                    <div className="bg-main-white w-full h-[550px] rounded-[8px] bg-contain bg-no-repeat bg-center 
                    border border-light-border-gray shadow-info-component flex items-center justify-between p-4" 
                    style={{ backgroundImage: `url(${postData.images[selectedImage].url})` }}>
                        <button className="carousel-btn" onClick={() => updateSelectedImage(selectedImage === 0 ? postData.images.length - 1 : selectedImage - 1)}>
                            <img src={BackIcon} alt="" className="w-[30px] h-[30px]"></img>
                        </button>
                        <button className="carousel-btn" onClick={() => updateSelectedImage((selectedImage + 1) % postData.images.length)}>
                            <img src={NextIcon} alt="" className="w-[30px] h-[30px]"></img>
                        </button>
                    </div>
                    <div className="mt-5 w-full whitespace-nowrap overflow-x-scroll pb-5">
                        {postData.images.map((image: IPostImage, index: number) => {
                            return (
                                <img 
                                    src={image.url} 
                                    alt="" 
                                    className={`w-[112px] h-[80px] inline-block rounded-[8px] object-contain cursor-pointer
                                    bg-[#f5f6f8] border border-light-border-gray ${index > 0 ? "ml-3" : ""}
                                    ${selectedImage === index ? "border-side-text-gray" : ""}`}
                                    key={index}
                                    onClick={() => updateSelectedImage(index)}
                                />
                            )
                        })}
                    </div>
                    <section className="mt-8 mb-10 w-full">
                        <h2 className="text-2xl mb-3">About this service</h2>
                        <p className="text-paragraph-text leading-7 break-all">
                            {postData.about}
                        </p>
                    </section>
                    <AboutSeller postData={postData} />
                </div>
                <Packages packages={postData.packages} />
            </div>
        </PageWrapper>
    );
}

export default PostView;