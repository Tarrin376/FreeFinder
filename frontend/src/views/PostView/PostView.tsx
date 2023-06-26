import { useLocation } from "react-router-dom";
import { useEffect, useState } from 'react';
import { PostPage } from "../../types/PostPage";
import ProfilePicAndStatus from "../../components/ProfilePicAndStatus";
import StarIcon from '../../assets/star.png';
import { getTimePosted } from "../../utils/getTimePosted";
import AboutSeller from "./AboutSeller";
import PostViewSkeleton from '../../skeletons/PostViewSkeleton';
import Packages from "./Packages";
import axios, { AxiosError } from "axios";
import { getAPIErrorMessage } from "../../utils/getAPIErrorMessage";
import { IPostImage } from "../../models/IPostImage";

function PostView() {
    const [postData, setPostData] = useState<PostPage>();
    const [selectedImage, setSelectedImage] = useState<string>();
    const location = useLocation();

    const updateSelectedImage = (url: string) => {
        setSelectedImage(url);
    }
    
    useEffect(() => {
        (async (): Promise<void> => {
            try {
                const resp = await axios.get<{ post: PostPage, message: string }>(`/api${location.pathname}`);
                setTimeout(() => {
                    setPostData(resp.data.post);
                    setSelectedImage(resp.data.post.images.find((x) => x.isThumbnail === true)?.url);
                }, 1000);
            }
            catch (err: any) {
                const errorMessage = getAPIErrorMessage(err as AxiosError<{ message: string }>);
                console.log(errorMessage);
            }
        })();
    }, [location.pathname]);

    if (!postData || !selectedImage) {
        return (
            <PostViewSkeleton />
        );
    }

    return (
        <div className="flex justify-between gap-16">
            <div>
                <div>
                    <p className="text-main-blue mb-2">Website design</p>
                    <h1 className="text-3xl mb-4 max-w-[80%] break-all">{postData.title}</h1>
                    <div className="flex gap-3 items-center">
                        <div className="relative">
                            <ProfilePicAndStatus 
                                profilePicURL={postData.postedBy.user.profilePicURL} 
                                profileStatus={postData.postedBy.user.status}
                                statusStyles="before:left-[30px] cursor-pointer"
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
                    <div className="flex w-fit gap-12 mt-8">
                        <div className="w-[700px]">
                            <img 
                                src={selectedImage} 
                                className="bg-[#f5f6f8] w-full h-[500px] block rounded-[8px] object-contain 
                                border border-light-border-gray shadow-info-component" 
                                alt="placeholder" 
                            />
                            <div className="mt-5 w-full">
                                {postData.images.map((image: IPostImage, index: number) => {
                                    return (
                                        <img 
                                            src={image.url} 
                                            alt="" 
                                            className={`w-[112px] h-[80px] inline-block rounded-[8px] object-contain cursor-pointer
                                            bg-[#f5f6f8] border border-light-border-gray ${index > 0 ? "ml-3" : ""}
                                            ${selectedImage === image.url ? "border-side-text-gray" : ""}`}
                                            key={index}
                                            onClick={() => updateSelectedImage(image.url)}
                                        />
                                    )
                                })}
                            </div>
                        </div>
                        <Packages packages={postData.packages} />
                    </div>
                </div>
                <section className="mt-8 mb-8">
                    <h2 className="text-2xl mb-3">About this service</h2>
                    <p className="text-paragraph-text leading-7 break-all">
                        {postData.about}
                    </p>
                </section>
            </div>
            <AboutSeller postData={postData} />
        </div>
    );
}

export default PostView;